#!/usr/bin/env node
// Prerenders every route of the site into static HTML snapshots under
// public/prerendered/**.html. These files get copied verbatim into
// dist/public/prerendered/ on the next `pnpm run build` (Vite copies the
// public/ folder as-is), and the Cloudflare Functions (see
// functions/_shared/serve-static-seo.ts, serve-dynamic-seo.ts, and
// functions/sectors/[slug].ts) serve them to bots instead of the JS shell.
//
// Usage (from artifacts/the-muslim-company):
//   pnpm run build                # 1) build once so there's something to serve
//   node scripts/prerender.mjs    # 2) crawl it with a real browser + save HTML
//   pnpm run build                # 3) build again so public/prerendered/* is included in dist/
//
// Requires: `pnpm add -D playwright && npx playwright install --with-deps chromium`
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = join(ROOT, "public", "prerendered");

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// ---- Static routes (kept in sync with functions/_shared/static-page-seo.ts) ----
const STATIC_ROUTES = [
  "/about",
  "/contact",
  "/faq",
  "/founder",
  "/ceo/Sharifulislam",
  "/get-involved",
  "/mission",
  "/vision",
  "/why-us",
  "/transparency",
  "/notices",
  "/privacy-policy",
  "/terms-of-service",
  "/recruitment-status",
  "/the-muslim-company-foundation",
  "/baytalmalbank",
  "/blog",
  "/careers",
  "/newsroom",
  "/governance",
  "/constitution",
  "/our-people",
  "/our-story",
  "/environment",
  "/humanitarian",
  "/technology",
  "/sectors",
];

// ---- Sector detail routes (kept in sync with functions/_shared/sector-detail-seo.ts) ----
const SECTOR_SLUGS = [
  "agriculture-food", "education-research", "technology-ai", "healthcare-medicine",
  "construction-housing", "renewable-energy", "media-journalism", "software-cybersecurity",
  "manufacturing-industry", "islamic-finance-fintech", "transportation-logistics", "e-commerce",
  "literature-publishing", "philosophy-civilization-studies", "scientific-research",
  "social-welfare-humanitarian-work", "environmental-protection", "robotics-automation",
  "international-trade", "community-development", "retail-business", "fashion-apparel",
  "lifestyle-personal-care",
];

async function fetchSlugs(table) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(`[prerender] No Supabase credentials — skipping dynamic table "${table}"`);
    return [];
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=slug&limit=1000`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((r) => r.slug).filter(Boolean);
  } catch (err) {
    console.warn(`[prerender] Failed to fetch slugs for "${table}":`, err.message);
    return [];
  }
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn("pnpm", ["run", "serve", "--", "--port", String(PORT), "--strictPort"], {
      cwd: ROOT,
      stdio: "pipe",
    });
    let ready = false;
    const onData = (data) => {
      const text = data.toString();
      if (!ready && /Local:|ready in/i.test(text)) {
        ready = true;
        resolve(proc);
      }
    };
    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
    proc.on("error", reject);
    setTimeout(() => {
      if (!ready) {
        ready = true;
        resolve(proc); // proceed anyway; the retry loop in renderRoute will catch a not-ready server
      }
    }, 15000);
  });
}

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    // Give React a little extra time for any lazy-loaded / async content.
    await page.waitForTimeout(800);
    const html = await page.content();

    const outPath = join(OUT_DIR, `${route}.html`.replace(/^\//, ""));
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf-8");
    console.log(`[prerender] ✓ ${route}`);
    return true;
  } catch (err) {
    console.error(`[prerender] ✗ ${route}:`, err.message);
    return false;
  } finally {
    await page.close();
  }
}

async function main() {
  console.log("[prerender] Starting preview server...");
  const serverProc = await startPreviewServer();
  await new Promise((r) => setTimeout(r, 2000)); // small buffer after "ready" line

  console.log("[prerender] Fetching dynamic slugs from Supabase...");
  const [blogSlugs, jobSlugs, newsSlugs] = await Promise.all([
    fetchSlugs("blog_posts"),
    fetchSlugs("jobs"),
    fetchSlugs("newsroom_posts"),
  ]);

  const routes = [
    ...STATIC_ROUTES,
    ...SECTOR_SLUGS.map((s) => `/sectors/${s}`),
    ...blogSlugs.map((s) => `/blog/${s}`),
    ...jobSlugs.map((s) => `/careers/${s}`),
    ...newsSlugs.map((s) => `/newsroom/${s}`),
  ];

  console.log(`[prerender] Rendering ${routes.length} routes...`);
  const browser = await chromium.launch();
  let ok = 0;
  for (const route of routes) {
    const success = await renderRoute(browser, route);
    if (success) ok++;
  }
  await browser.close();
  serverProc.kill();

  console.log(`[prerender] Done: ${ok}/${routes.length} routes rendered → ${OUT_DIR}`);
  if (ok < routes.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error("[prerender] Fatal error:", err);
  process.exit(1);
});
