// Same proven pattern as _shared/section-seo.ts (already working in
// production for /governance, /technology, /our-story, etc.) — applied to
// every remaining static page. Each route file calls serveStaticSEO(context,
// "/path") directly instead of routing through a global middleware, so there
// is no dependency on Pages middleware behavior.
import { STATIC_PAGE_SEO } from "./static-page-seo";

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
  const res = await env.ASSETS.fetch(request);

  const meta = STATIC_PAGE_SEO[routePath];
  if (!meta) return res;

  try {
    const canonicalUrl = `${BASE}${routePath}`;

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
  } catch (err) {
    // If anything goes wrong with the rewrite, fail safe: serve the
    // original page instead of crashing the whole route.
    return res;
  }
}
