// Same proven pattern as _shared/section-seo.ts (already working in
// production for /governance, /technology, /our-story, etc.) — applied to
// every remaining static page. Each route file calls serveStaticSEO(context,
// "/path") directly instead of routing through a global middleware, so there
// is no dependency on Pages middleware behavior.
//
// Bots (search engines, social crawlers, AI/LLM crawlers) get the FULL
// prerendered HTML for the page (built by scripts/prerender.mjs and shipped
// as a static asset under /prerendered/*.html) — no JavaScript required.
// Everyone else still gets the normal SPA shell with corrected meta tags.
import { STATIC_PAGE_SEO } from "./static-page-seo";
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

export async function serveStaticSEO(context: any, routePath: string): Promise<Response> {
  const { request, env } = context;

  if (isBotRequest(request)) {
    const prerendered = await tryServePrerendered(env, routePath);
    if (prerendered) return prerendered;
  }

  const res = await env.ASSETS.fetch(request);

  const meta = STATIC_PAGE_SEO[routePath];
  if (!meta) return res;

  try {
    const canonicalUrl = `${BASE}${routePath}`;
    const socialDescription = meta.ogDescription || meta.description;

    const rewriter = new HTMLRewriter()
      .on("title", new SetInnerContent(meta.title))
      .on('meta[name="description"]', new SetAttribute("content", meta.description))
      .on('meta[property="og:title"]', new SetAttribute("content", meta.title))
      .on('meta[property="og:description"]', new SetAttribute("content", socialDescription))
      .on('meta[property="og:url"]', new SetAttribute("content", canonicalUrl))
      .on('meta[name="twitter:title"]', new SetAttribute("content", meta.title))
      .on('meta[name="twitter:description"]', new SetAttribute("content", socialDescription))
      .on('link[rel="canonical"]', new SetAttribute("href", canonicalUrl));

    if (meta.image) {
      rewriter
        .on('meta[property="og:image"]', new SetAttribute("content", meta.image))
        .on('meta[name="twitter:image"]', new SetAttribute("content", meta.image));
    }

    return rewriter.transform(res);
  } catch (err) {
    // If anything goes wrong with the rewrite, fail safe: serve the
    // original page instead of crashing the whole route.
    return res;
  }
}

export async function tryServePrerendered(env: any, routePath: string): Promise<Response | null> {
  try {
    const prerenderedUrl = `${BASE}/prerendered${routePath}.html`;
    const res = await env.ASSETS.fetch(new Request(prerenderedUrl));
    if (!res.ok) return null;
    return new Response(res.body, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch {
    return null;
  }
}
