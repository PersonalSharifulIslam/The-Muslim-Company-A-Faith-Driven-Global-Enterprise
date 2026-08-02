// Shared SEO metadata + HTMLRewriter helper for the "section routes"
import { isBotRequest } from "./bot-detect";
import { tryServePrerendered } from "./serve-static-seo";

export const SECTION_SEO: Record<string, { title: string; description: string }> = {
  "/our-story": {
    title: "Our Story — The Muslim Company",
    description:
      "The story of how The Muslim Company began — from Shariful Islam's observation of ethical drift in modern business to his vision for a Prophetic Model enterprise, founded in Dhaka, Bangladesh in January 2025 and built to grow into a civilization-scale, faith-driven global conglomerate.",
  },
  "/foundation": {
    title: "Islamic Foundation — The Muslim Company",
    description:
      "The Islamic foundation behind The Muslim Company — how the Quran, authentic Hadith, Ijma, and Qiyas guide every business decision, and how the company structures itself to remain completely free from riba (interest), bribery, and exploitative practices at every level of operation.",
  },
  "/sectors": {
    title: "Areas of Work & Sectors — The Muslim Company",
    description:
      "The Muslim Company operates across 20+ Shariah-compliant business sectors — including Agriculture & Food, Technology & AI, Healthcare, Renewable Energy, Manufacturing, Islamic Finance & FinTech, Media, Education, and Humanitarian & Social Welfare — each governed by the same ethical and religious standards.",
  },
  "/governance": {
    title: "Governance Structure — The Muslim Company",
    description:
      "How The Muslim Company is governed — an Independent Supreme Shariah Board with real authority, Amanah-based (trust-centered) leadership, and Shura (consultative) decision-making overseeing every major product, investment, and partnership before it moves forward.",
  },
  "/constitution": {
    title: "Constitutional Framework — The Muslim Company",
    description:
      "The permanent constitutional framework that protects The Muslim Company's ethical mission — structural safeguards against corruption, hostile takeover, and mission drift, ensuring every future leader remains bound by the same Islamic principles the company was founded on.",
  },
  "/our-people": {
    title: "Our People — The Muslim Company",
    description:
      "How The Muslim Company treats its people — fair wages, dignified workplaces with separate facilities for women, extended maternity leave of 1 to 1.5 years, long-term pension qualification, and family welfare programs built into how the company operates.",
  },
  "/environment": {
    title: "Environmental Stewardship — The Muslim Company",
    description:
      "The Muslim Company's environmental commitments as stewards of Allah's creation — investment in renewable energy, protection of wildlife and animals, reforestation and tree planting, and ecological restoration woven into operations across every sector.",
  },
  "/humanitarian": {
    title: "Humanitarian Development — The Muslim Company",
    description:
      "The Muslim Company's humanitarian development work — 10% of monthly net profit funds disaster relief, orphan and widow support, education access, and healthcare programs for vulnerable communities in Bangladesh and beyond, alongside full annual zakat distribution.",
  },
  "/technology": {
    title: "Technology & AI Ethics — The Muslim Company",
    description:
      "The Muslim Company's ethical framework for technology and artificial intelligence — a firm rejection of harmful AI applications, addiction-engineered systems, privacy-abusive data practices, and mass misinformation tools, in favor of technology that genuinely serves humanity.",
  },
};

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

export async function serveSectionSEO(context: any, routePath: string): Promise<Response> {
  const { request, env } = context;

  if (isBotRequest(request)) {
    const prerendered = await tryServePrerendered(env, routePath);
    if (prerendered) return prerendered;
  }

  const res = await env.ASSETS.fetch(request);

  const meta = SECTION_SEO[routePath];
  if (!meta) return res;

  try {
    const canonicalUrl = `https://www.themuslim.company${routePath}`;

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
    // If anything goes wrong with the rewrite, fail safe: serve the
    // original page instead of crashing the whole route.
    return res;
  }
}
