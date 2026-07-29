// Runs in front of EVERY route on the site (Cloudflare Pages Functions
// middleware). Whatever the individual route file does (plain
// env.ASSETS.fetch, a redirect, etc.), this middleware inspects the final
// HTML response and — if the path matches something we have SEO data for —
// rewrites <title>, meta description, og:*, and twitter:* tags server-side.
//
// This is what crawlers that DON'T execute JavaScript (facebookexternalhit,
// Twitterbot, LinkedInBot, Slackbot, and to a good extent Googlebot's first
// pass) actually see. Client-side document.title / meta updates in the React
// pages only affect what a real browser sees after JS runs — they never fix
// link-preview cards.
import { STATIC_PAGE_SEO } from "./_shared/static-page-seo";
import { SECTOR_DETAIL_SEO } from "./_shared/sector-detail-seo";

const BASE = "https://www.themuslim.company";

type Meta = { title: string; description: string; image?: string };

class SetInnerContent {
  constructor(private text: string) {}
  element(el: any) {
    el.setInnerContent(this.text);
  }
}

class SetAttribute {
  constructor(private attr: string, private value: string) {}
  element(el: any) {
    el.setAttribute(this.attr, this.value);
  }
}

function rewriteMeta(res: Response, meta: Meta, canonicalUrl: string): Response {
  const rewriter = new HTMLRewriter()
    .on("title", new SetInnerContent(meta.title))
    .on('meta[name="description"]', new SetAttribute("content", meta.description))
    .on('meta[property="og:title"]', new SetAttribute("content", meta.title))
    .on('meta[property="og:description"]', new SetAttribute("content", meta.description))
    .on('meta[property="og:url"]', new SetAttribute("content", canonicalUrl))
    .on('meta[name="twitter:title"]', new SetAttribute("content", meta.title))
    .on('meta[name="twitter:description"]', new SetAttribute("content", meta.description))
    .on('link[rel="canonical"]', new SetAttribute("href", canonicalUrl));

  if (meta.image) {
    rewriter
      .on('meta[property="og:image"]', new SetAttribute("content", meta.image))
      .on('meta[name="twitter:image"]', new SetAttribute("content", meta.image));
  }

  return rewriter.transform(res);
}

// Fetch a single row's title/excerpt (or description) from Supabase for the
// dynamic detail routes (/blog/:slug, /newsroom/:slug, /careers/:slug).
async function fetchDynamicMeta(
  env: any,
  table: "blog_posts" | "newsroom_posts" | "jobs",
  slug: string,
  titleSuffix: string,
): Promise<Meta | null> {
  const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;

  const select = table === "jobs" ? "title,description,department" : "title,excerpt";

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}&select=${select}&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as any[];
    const row = rows?.[0];
    if (!row?.title) return null;

    if (table === "jobs") {
      return {
        title: `${row.title} — Careers at The Muslim Company`,
        description: row.description
          ? String(row.description).slice(0, 300)
          : `${row.title} — ${row.department || "The Muslim Company"}. Apply now at The Muslim Company.`,
      };
    }

    return {
      title: `${row.title} — ${titleSuffix}`,
      description: row.excerpt || row.title,
    };
  } catch {
    return null;
  }
}

export async function onRequest(context: any) {
  const { request, env, next } = context;
  const res: Response = await next();

  if (request.method !== "GET") return res;

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return res;

  const url = new URL(request.url);
  const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");

  let meta: Meta | null | undefined = STATIC_PAGE_SEO[path];

  if (!meta) {
    const sectorMatch = path.match(/^\/sectors\/([^/]+)$/);
    if (sectorMatch) meta = SECTOR_DETAIL_SEO[sectorMatch[1]];
  }

  if (!meta) {
    const blogMatch = path.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) meta = await fetchDynamicMeta(env, "blog_posts", blogMatch[1], "The Muslim Company Blog");
  }

  if (!meta) {
    const newsMatch = path.match(/^\/newsroom\/([^/]+)$/);
    if (newsMatch) meta = await fetchDynamicMeta(env, "newsroom_posts", newsMatch[1], "The Muslim Company Newsroom");
  }

  if (!meta) {
    const jobMatch = path.match(/^\/careers\/([^/]+)$/);
    if (jobMatch) meta = await fetchDynamicMeta(env, "jobs", jobMatch[1], "");
  }

  if (!meta) return res;

  try {
    return rewriteMeta(res, meta, `${BASE}${path}`);
  } catch {
    // Fail safe: never break the page over a meta-tag rewrite.
    return res;
  }
}
