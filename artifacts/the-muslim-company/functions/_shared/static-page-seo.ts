// Central per-route SEO data for every STATIC page on the site.
// Any path in this map gets its <title>/description/og/twitter tags
// rewritten server-side (in functions/_middleware.ts) before the response
// reaches crawlers like facebookexternalhit, Twitterbot, LinkedInBot, etc.
//
// Keep title/description here in sync with the corresponding page
// component's client-side document.title / meta updates in src/pages/*.tsx.
// image is optional — omit to keep the default /opengraph.jpg.

export const STATIC_PAGE_SEO: Record<
  string,
  { title: string; description: string; ogDescription?: string; image?: string }
> = {
  "/about": {
    title: "About Us — The Muslim Company | Faith-Driven Global Conglomerate",
    description:
      "About The Muslim Company — A Prophetic Model Business Group founded by Shariful Islam, operating across 20+ halal sectors guided by Amanah, Ilm & Rahmah.",
  },
  "/contact": {
    title: "Contact — The Muslim Company",
    description:
      "Get in touch with The Muslim Company — for general inquiries, partnerships, media, careers, research, or customer support.",
    image: "https://www.themuslim.company/og-contact.png",
  },
  "/faq": {
    title: "Frequently Asked Questions — The Muslim Company",
    description:
      "Answers to common questions about The Muslim Company — our business, sectors, Shariah governance, careers, and humanitarian Foundation work.",
  },
  "/founder": {
    title: "Founder & CEO — Shariful Islam — The Muslim Company",
    description:
      "Shariful Islam is the Founder of The Muslim Company — a global conglomerate built on ethical leadership and long-term civilizational impact. Dhaka, Bangladesh.",
  },
  "/ceo/Sharifulislam": {
    title: "Shariful Islam – CEO of The Muslim Company",
    description:
      "Shariful Islam serves as CEO of The Muslim Company — a global conglomerate committed to innovation, long-term value creation, and ethical leadership.",
  },
  "/get-involved": {
    title: "Get Involved — The Muslim Company",
    description:
      "Volunteer, intern, research, mentor, or advise. Join a faith-driven global enterprise building ethical civilization.",
  },
  "/mission": {
    title: "Our Mission | The Muslim Company",
    description:
      "The Muslim Company's mission: building a civilization-driven global conglomerate inspired by ethical leadership — empowering humanity through innovation.",
  },
  "/vision": {
    title: "Our Vision | The Muslim Company",
    description:
      "The Muslim Company's long-term vision: building universities, research centers, hospitals, and ethical institutions guided by faith, knowledge, and justice.",
  },
  "/why-us": {
    title: "Why The Muslim Company — A Different Kind of Enterprise",
    description:
      "How The Muslim Company differs from conventional business: riba-free finance, Shariah Board oversight, structural charity, and a constitutional framework protecting its ethical mission permanently.",
  },
  "/transparency": {
    title: "Transparency & Accountability — The Muslim Company",
    description:
      "Full transparency in charity, zakat, humanitarian impact, governance, and ethical finance.",
    image: "https://www.themuslim.company/og-transparency.png",
  },
  "/notices": {
    title: "Notices & Events — The Muslim Company",
    description:
      "Official notices, announcements, and upcoming events from The Muslim Company.",
    image: "https://www.themuslim.company/og-notices.png",
  },
  "/privacy-policy": {
    title: "Privacy Policy — The Muslim Company",
    description:
      "Privacy Policy of The Muslim Company — how we collect, use, and protect your personal information in accordance with Islamic ethics and international standards.",
    image: "https://www.themuslim.company/og-privacy.jpg",
  },
  "/terms-of-service": {
    title: "Terms of Service — The Muslim Company",
    description:
      "Terms of Service of The Muslim Company — the rules, obligations, and agreements governing use of our platforms and services.",
    image: "https://www.themuslim.company/og-terms.jpg",
  },
  "/recruitment-status": {
    title: "Recruitment Status — The Muslim Company",
    description:
      "Track your job application status at The Muslim Company using your reference number.",
  },
  "/the-muslim-company-foundation": {
    title: "The Muslim Company Foundation — Humanitarian & Environmental Arm",
    description:
      "The Muslim Company Foundation is the humanitarian and environmental arm of The Muslim Company — funded by zakat, sadaqah, and 10% of monthly net profit, serving all of Allah's creation across every country we operate in.",
  },
  "/baytalmalbank": {
    title: "The Bayt Al-Mal Bank — The Muslim Company",
    description:
      "The Bayt Al-Mal Bank — an international Shariah-compliant financial institution under The Muslim Company, offering ethical, interest-free banking worldwide.",
  },
  "/blog": {
    title: "Blog & Insights — The Muslim Company",
    description:
      "Articles and insights from The Muslim Company on ethical business, Islamic finance, technology, and civilization-building.",
  },
  "/careers": {
    title: "Careers & Jobs — The Muslim Company",
    description:
      "Explore open roles at The Muslim Company — join a faith-driven global conglomerate building long-term civilizational impact.",
  },
  "/newsroom": {
    title: "Newsroom & Press — The Muslim Company",
    description:
      "Press releases and official announcements from The Muslim Company, a faith-driven global conglomerate headquartered in Dhaka, Bangladesh.",
  },
  "/shariah-board": {
    title: "Our Shariah Board — Scholars Guiding The Muslim Company",
    description:
      "The Supreme Shariah Board of The Muslim Company — scholars ensuring full Shariah compliance across every product, service, operation & finance.",
    ogDescription:
      "Meet the Supreme Shariah Board of The Muslim Company — the Islamic scholars who review and approve every product, service, operation, and financial decision across all 20+ sectors, ensuring complete Shariah compliance from end to end.",
  },
};
