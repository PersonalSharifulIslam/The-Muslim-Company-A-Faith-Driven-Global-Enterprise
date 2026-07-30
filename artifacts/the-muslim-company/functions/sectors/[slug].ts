import { SECTOR_DETAIL_SEO } from "../_shared/sector-detail-seo";

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

import { SECTOR_DETAIL_SEO } from "../_shared/sector-detail-seo";
import { isBotRequest } from "../_shared/bot-detect";
import { tryServePrerendered } from "../_shared/serve-static-seo";

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

export async function onRequestGet(context: any) {
  const { request, env, params } = context;
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  if (isBotRequest(request) && slug) {
    const prerendered = await tryServePrerendered(env, `/sectors/${slug}`);
    if (prerendered) return prerendered;
  }

  const res = await env.ASSETS.fetch(request);

  const meta = slug ? SECTOR_DETAIL_SEO[slug] : undefined;
  if (!meta) return res;

  try {
    const canonicalUrl = `https://www.themuslim.company/sectors/${slug}`;

    return new HTMLRewriter()
      .on("title", new SetInnerContent(meta.title))
      .on('meta[name="description"]', new SetAttribute("content", meta.description))
      .on('meta[property="og:title"]', new SetAttribute("content", meta.title))
      .on('meta[property="og:description"]', new SetAttribute("content", meta.description))
      .on('meta[property="og:url"]', new SetAttribute("content", canonicalUrl))
      .on('meta[name="twitter:title"]', new SetAttribute("content", meta.title))
      .on('meta[name="twitter:description"]', new SetAttribute("content", meta.description))
      .on('link[rel="canonical"]', new SetAttribute("href", canonicalUrl))
      .transform(res);
  } catch (err) {
    // Fail safe: serve the original page instead of crashing the route.
    return res;
  }
}
