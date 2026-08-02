// Central per-route SEO data for every STATIC page on the site.
// Any path in this map gets its <title>/description/og/twitter tags
// rewritten server-side (in functions/_middleware.ts) before the response
// reaches crawlers like facebookexternalhit, Twitterbot, LinkedInBot, etc.
//
// Descriptions here are intentionally detailed (not capped to the old
// ~155-char search-snippet limit) so search engines, AI/LLM crawlers, and
// humans reading a link preview all get a genuinely useful, specific
// summary of what's actually on the page — not just a short teaser.
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
      "The Muslim Company is a faith-driven global conglomerate founded by Shariful Islam in January 2025, headquartered in Dhaka, Bangladesh. Learn our story, our guiding principles of Amanah (trust), Ilm (knowledge), and Rahmah (mercy), and how we operate across 20+ Shariah-compliant sectors — from technology and healthcare to agriculture and Islamic finance — under independent Shariah Board oversight.",
  },
  "/contact": {
    title: "Contact — The Muslim Company",
    description:
      "Get in touch with The Muslim Company for general inquiries, business partnerships, media and press questions, career opportunities, or research collaboration. Find our Dhaka, Bangladesh office address, department-specific email contacts, and a direct contact form to reach the right team quickly.",
    image: "https://www.themuslim.company/og-contact.png",
  },
  "/faq": {
    title: "Frequently Asked Questions — The Muslim Company",
    description:
      "Frequently asked questions about The Muslim Company answered in detail — what the company does, who leads it, how our Shariah Board approves new products, how to apply for jobs and check your application status, how our humanitarian Foundation is funded, and how to reach us for business, careers, or media inquiries.",
  },
  "/founder": {
    title: "Founder & CEO — Shariful Islam — The Muslim Company",
    description:
      "Shariful Islam is the Founder, Chairman, Managing Director, and CEO of The Muslim Company. A Bangladeshi electrical engineer, entrepreneur, and peace activist born in Jamalpur, Bangladesh, he founded the company in January 2025 to build an ethical, Shariah-compliant global conglomerate rooted in Islamic principles and long-term civilizational impact.",
  },
  "/ceo/Sharifulislam": {
    title: "Shariful Islam – CEO of The Muslim Company",
    description:
      "Shariful Islam serves as Chief Executive Officer of The Muslim Company, a diversified global conglomerate operating across 20+ sectors. Learn about his background as a Bangladeshi engineer and ethical entrepreneur, his role leading the company's Shariah-compliant operations, and his vision for innovation, ethical leadership, and long-term value creation.",
  },
  "/get-involved": {
    title: "Get Involved — The Muslim Company",
    description:
      "Ways to get involved with The Muslim Company — volunteer with our humanitarian Foundation, apply for an internship, contribute as a researcher or subject-matter expert, or join our advisory network. Discover how individuals and organizations can partner with a faith-driven enterprise building ethical civilization.",
  },
  "/mission": {
    title: "Our Mission | The Muslim Company",
    description:
      "The Muslim Company's mission is to build a civilization-driven global enterprise inspired by the Quran, authentic Sunnah, and the Prophetic model of business — empowering humanity through ethical commerce, knowledge, innovation, and justice across every sector we operate in.",
  },
  "/vision": {
    title: "Our Vision | The Muslim Company",
    description:
      "The Muslim Company's long-term vision extends beyond commerce: establishing universities, research centers, hospitals, and ethical AI institutions, and pursuing civilization-scale humanitarian and scientific development guided by Islamic principles of faith, knowledge, and justice.",
  },
  "/why-us": {
    title: "Why The Muslim Company — A Different Kind of Enterprise",
    description:
      "What makes The Muslim Company different from conventional business: completely riba-free (interest-free) finance, an independent Supreme Shariah Board with real authority over every product and decision, structural charitable giving built into our profit model, and a constitutional framework that permanently protects our ethical mission.",
  },
  "/transparency": {
    title: "Transparency & Accountability — The Muslim Company",
    description:
      "The Muslim Company's public transparency reports — how zakat and sadaqah are calculated and distributed, humanitarian and environmental impact from our Foundation's work, detailed spending breakdowns, and independent Shariah Board oversight of our finances, published openly for anyone to review.",
    image: "https://www.themuslim.company/og-transparency.png",
  },
  "/notices": {
    title: "Notices & Events — The Muslim Company",
    description:
      "Official notices, public announcements, and upcoming events from The Muslim Company — governance updates, community programs, recruitment announcements, and organizational news, kept current so stakeholders always have accurate information.",
    image: "https://www.themuslim.company/og-notices.png",
  },
  "/privacy-policy": {
    title: "Privacy Policy — The Muslim Company",
    description:
      "The Muslim Company's Privacy Policy explains what personal information we collect, how we use and protect it, your rights over your data, and how our practices align with both international data protection standards and Islamic ethical principles around trust and privacy.",
    image: "https://www.themuslim.company/og-privacy.jpg",
  },
  "/terms-of-service": {
    title: "Terms of Service — The Muslim Company",
    description:
      "The Terms of Service governing use of The Muslim Company's websites, platforms, and digital services — including user obligations, acceptable use, intellectual property, and the legal agreement between you and the company.",
    image: "https://www.themuslim.company/og-terms.jpg",
  },
  "/recruitment-status": {
    title: "Recruitment Status — The Muslim Company",
    description:
      "Check the real-time status of your job application at The Muslim Company using the recruitment reference number you received when you applied — no account or login required, just enter your reference number to see where your application stands.",
  },
  "/the-muslim-company-foundation": {
    title: "The Muslim Company Foundation — Humanitarian & Environmental Arm",
    description:
      "The Muslim Company Foundation is the company's dedicated humanitarian and environmental arm, funded by zakat, sadaqah, and 10% of monthly net profit. It provides relief, education, healthcare, orphan care, and animal welfare support across Bangladesh, Pakistan, Nigeria, Ghana, Gambia, and other countries.",
  },
  "/baytalmalbank": {
    title: "The Bayt Al-Mal Bank — The Muslim Company",
    description:
      "The Bayt Al-Mal Bank is The Muslim Company's Islamic banking arm — an international, Shariah-compliant financial institution offering interest-free (riba-free) banking, savings, and financing products, along with its fintech app DinarX and the Dirham Payment Gateway, built on the principles of ethical, wealth-just Islamic finance.",
  },
  "/blog": {
    title: "Blog & Insights — The Muslim Company",
    description:
      "Read articles and insights from The Muslim Company on ethical business practices, Islamic finance, faith-driven entrepreneurship, technology, and civilization-building — perspectives from a Shariah-compliant global conglomerate operating across 20+ sectors.",
  },
  "/careers": {
    title: "Careers & Jobs — The Muslim Company",
    description:
      "Explore open job opportunities at The Muslim Company, a faith-driven global conglomerate operating across 20+ sectors including technology, healthcare, finance, and manufacturing. Learn about employee benefits, our hiring process, and how to apply for a role building long-term ethical and civilizational impact.",
  },
  "/newsroom": {
    title: "Newsroom & Press — The Muslim Company",
    description:
      "Press releases, official announcements, and media coverage of The Muslim Company, a faith-driven global conglomerate headquartered in Dhaka, Bangladesh. Journalists and media professionals can find company news and press contact information here.",
  },
  "/leadership": {
    title: "Board of Directors, Investors & Partners | The Muslim Company",
    description:
      "Meet the Board of Directors, investors, and strategic partners of The Muslim Company — the leadership team and outside collaborators guiding our faith-driven global conglomerate across 20+ sectors.",
  },
  "/shariah-board": {
    title: "Our Shariah Board — Scholars Guiding The Muslim Company",
    description:
      "The Independent Supreme Shariah Board of The Muslim Company — the body being established to review and approve every product, service, operation, and financial decision across all 20+ sectors, ensuring complete Shariah compliance grounded in Quran, Sunnah, and Maqasid al-Shariah.",
    ogDescription:
      "Meet the Supreme Shariah Board of The Muslim Company — the Islamic scholars who review and approve every product, service, operation, and financial decision across all 20+ sectors, ensuring complete Shariah compliance from end to end.",
  },
};
