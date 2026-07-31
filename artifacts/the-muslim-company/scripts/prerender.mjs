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
  "/shariah-board",
  "/governance",
  "/constitution",
  "/our-people",
  "/our-story",
  "/foundation",
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

// Poll the actual port with real HTTP requests instead of grepping stdout —
// grepping for "Local:"/"ready in" text was unreliable and let the script
// "proceed anyway" via a 15s fallback even when the server never came up.
// That caused every route to fail with ERR_CONNECTION_REFUSED and the job
// to hang for hours.
async function waitForServer(url, { timeoutMs = 30000, intervalMs = 300 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok || res.status < 500) return true;
    } catch {
      // connection refused / not up yet — keep polling
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}

function startPreviewServer() {
  const proc = spawn("pnpm", ["run", "serve"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: "pipe",
    // `pnpm run serve` is itself a wrapper that spawns the real server
    // (vite preview) as a *grandchild* process. Killing just `proc` only
    // ever signals the pnpm wrapper — the grandchild holding port 4173
    // keeps running and keeps its stdio pipes open, which leaves a
    // dangling handle in the event loop and hangs the whole job even
    // after prerendering has finished. `detached: true` puts the wrapper
    // in its own process group so we can kill the *entire* group (wrapper
    // + real server) with one signal — see killPreviewServer() below.
    detached: true,
  });
  let output = "";
  proc.stdout.on("data", (d) => (output += d.toString()));
  proc.stderr.on("data", (d) => (output += d.toString()));
  proc.on("error", (err) => {
    console.error("[prerender] Failed to spawn preview server:", err.message);
  });
  proc.getOutput = () => output;
  return proc;
}

function killPreviewServer(proc) {
  try {
    // Negative pid = signal the whole process group (wrapper + its children).
    process.kill(-proc.pid, "SIGTERM");
  } catch {
    // Fallback in case the group is already gone or detached isn't supported.
    try {
      proc.kill("SIGTERM");
    } catch {
      // already dead — nothing to do
    }
  }
}

async function renderRoute(browser, route) {
  // Explicitly force a bot-recognizable UA. isCrawlerUA() (src/lib/isCrawler.ts)
  // matches /headlesschrome/i among other patterns, but newer Chrome/Playwright
  // headless modes don't reliably include "HeadlessChrome" in the default UA
  // string anymore — so we set it explicitly rather than depending on that.
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/125.0.0.0 Safari/537.36 (TMC-Prerender-Bot)",
  });
  try {
    // "load" instead of "networkidle": some routes (e.g. /recruitment-status)
    // keep a connection open (polling / live status checks) that never goes
    // idle, which made networkidle time out at 30s and fail the route.
    // "load" plus the extra waitForTimeout below is enough for hydration
    // and lazy-loaded content.
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "load", timeout: 30000 });
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
  const serverProc = startPreviewServer();

  const up = await waitForServer(BASE_URL, { timeoutMs: 30000 });
  if (!up) {
    console.error("[prerender] Preview server never became reachable at " + BASE_URL);
    console.error("[prerender] Server output so far:\n" + serverProc.getOutput());
    killPreviewServer(serverProc);
    process.exit(1);
  }
  console.log("[prerender] Preview server is up.");

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
  killPreviewServer(serverProc);

  console.log(`[prerender] Done: ${ok}/${routes.length} routes rendered → ${OUT_DIR}`);
  // Force-exit instead of letting the event loop drain naturally: any
  // lingering handle (e.g. a socket the killed server didn't release fast
  // enough) would otherwise keep the process — and the GitHub Actions job —
  // alive for hours.
  process.exit(ok < routes.length ? 1 : 0);
}

main().catch((err) => {
  console.error("[prerender] Fatal error:", err);
  process.exit(1);
});
