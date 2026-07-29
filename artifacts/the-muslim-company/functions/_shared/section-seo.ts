// Shared SEO metadata + HTMLRewriter helper for the "section routes"
// (/our-story, /foundation, /sectors, /governance, /constitution,
// /our-people, /environment, /humanitarian, /technology).
//
// These routes render the same Home component (client-side) but each
// needs its own <title>/<meta description>/OG/Twitter tags for crawlers
// and social-share previews that don't execute JavaScript. This file
// rewrites ONLY those tags on the already-built index.html — everything
// else (JSON-LD schema, other meta tags, scripts, styles) stays exactly
// as-is.
//
// Values below are kept IDENTICAL to the SECTION_SEO map in
// src/pages/home.tsx so client-side (React Helmet) and server-side
// (this file) always agree — do not edit one without the other.

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
      "The constitutional framework that protects The Muslim Company's mission — permanent safeguards against corruption, hostile takeover, and ethical drift.",
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

/**
 * Fetches the static SPA shell for the given request, then rewrites just
 * the SEO-relevant tags to match the section's own title/description.
 * Falls back to the original response untouched if the path isn't in
 * SECTION_SEO (should never happen given how this is wired up).
 */
export async function serveSectionSEO(context: any, routePath: string): Promise<Response> {
  const { request, env } = context;
  const res = await env.ASSETS.fetch(request);

  const meta = SECTION_SEO[routePath];
  if (!meta) return res;

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
}
