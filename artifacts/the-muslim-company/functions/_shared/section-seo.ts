// Shared SEO metadata + HTMLRewriter helper for the "section routes"
export const SECTION_SEO: Record<string, { title: string; description: string }> = {
  "/our-story": {
    title: "Our Story — The Muslim Company",
    description:
      "The story of how The Muslim Company began — from Shariful Islam's vision for an ethical, faith-driven enterprise to its founding in Dhaka, Bangladesh in 2025.",
  },
  "/foundation": {
    title: "Islamic Foundation — The Muslim Company",
    description:
      "The Islamic foundation behind The Muslim Company — how the Quran, authentic Hadith, and the Prophetic Model guide every operation, free from riba and corruption.",
  },
  "/sectors": {
    title: "Areas of Work & Sectors — The Muslim Company",
    description:
      "The Muslim Company's halal business sectors — Manufacturing, Retail, Fashion & Apparel, Electronics, Technology, and Humanitarian Development, among 20+ others.",
  },
  "/governance": {
    title: "Governance Structure — The Muslim Company",
    description:
      "How The Muslim Company is governed — a Supreme Shariah Board, Amanah-based leadership, and Shura consultation overseeing every major decision.",
  },
  "/constitution": {
    title: "Constitutional Framework — The Muslim Company",
    description:
      "A permanent constitutional framework protects The Muslim Company's mission — permanent safeguards against corruption, hostile takeover, and ethical drift.",
  },
  "/our-people": {
    title: "Our People — The Muslim Company",
    description:
      "How The Muslim Company treats its people — fair wages, dignified workplaces, extended maternity leave, and long-term welfare programs for every employee.",
  },
  "/environment": {
    title: "Environmental Stewardship — The Muslim Company",
    description:
      "The Muslim Company's environmental commitments — renewable energy, wildlife protection, reforestation, and ecological restoration across every operation.",
  },
  "/humanitarian": {
    title: "Humanitarian Development — The Muslim Company",
    description:
      "The Muslim Company's humanitarian work — 10% of monthly profit funds disaster relief, orphan and widow support, education, and healthcare worldwide.",
  },
  "/technology": {
    title: "Technology & AI Ethics — The Muslim Company",
    description:
      "The Muslim Company's approach to technology and AI ethics — rejecting harmful AI, addiction-based systems, privacy abuse, and mass misinformation.",
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
