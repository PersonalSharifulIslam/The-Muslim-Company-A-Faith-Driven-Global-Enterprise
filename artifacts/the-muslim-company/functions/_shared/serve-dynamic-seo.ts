// Server-side SEO for DB-driven detail pages: /blog/:slug, /newsroom/:slug,
// /careers/:slug. Each route file calls serveDynamicSEO(context, table, slug,
// ...) directly (same proven HTMLRewriter approach as section-seo.ts) so
// crawlers that don't run JavaScript see the real post/job title instead of
// the home page's default meta tags.
//
// Bots additionally get the FULL prerendered HTML (built by
// scripts/prerender.mjs) when a snapshot exists for that slug.
import { isBotRequest } from "./bot-detect";

const BASE = "https://www.themuslim.company";

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

function rewrite(res: Response, title: string, description: string, canonicalUrl: string): Response {
  return new HTMLRewriter()
    .on("title", new SetInnerContent(title))
    .on('meta[name="description"]', new SetAttribute("content", description))
    .on('meta[property="og:title"]', new SetAttribute("content", title))
    .on('meta[property="og:description"]', new SetAttribute("content", description))
    .on('meta[property="og:url"]', new SetAttribute("content", canonicalUrl))
    .on('meta[name="twitter:title"]', new SetAttribute("content", title))
    .on('meta[name="twitter:description"]', new SetAttribute("content", description))
    .on('link[rel="canonical"]', new SetAttribute("href", canonicalUrl))
    .transform(res);
}

export async function serveDynamicSEO(
  context: any,
  table: "blog_posts" | "newsroom_posts" | "jobs",
  slug: string,
  pathPrefix: "/blog" | "/newsroom" | "/careers",
  titleSuffix: string,
): Promise<Response> {
  const { request, env } = context;

  if (isBotRequest(request) && slug) {
    try {
      const prerenderedUrl = `${BASE}/prerendered${pathPrefix}/${slug}.html`;
      const preRes = await env.ASSETS.fetch(new Request(prerenderedUrl));
      if (preRes.ok) {
        return new Response(preRes.body, {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    } catch {
      // fall through to normal handling below
    }
  }

  const res = await env.ASSETS.fetch(request);

  const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY || !slug) return res;

  const select = table === "jobs" ? "title,description,department" : "title,excerpt";

  try {
    const dbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?slug=eq.${encodeURIComponent(slug)}&select=${select}&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    if (!dbRes.ok) return res;
    const rows = (await dbRes.json()) as any[];
    const row = rows?.[0];
    if (!row?.title) return res;

    const canonicalUrl = `${BASE}${pathPrefix}/${slug}`;

    if (table === "jobs") {
      const title = `${row.title} — Careers at The Muslim Company`;
      const description = row.description
        ? String(row.description).slice(0, 300)
        : `${row.title} — ${row.department || "The Muslim Company"}. Apply now at The Muslim Company.`;
      return rewrite(res, title, description, canonicalUrl);
    }

    const title = `${row.title} — ${titleSuffix}`;
    const description = row.excerpt || row.title;
    return rewrite(res, title, description, canonicalUrl);
  } catch {
    // Fail safe: never break the page over a meta-tag rewrite.
    return res;
  }
}
