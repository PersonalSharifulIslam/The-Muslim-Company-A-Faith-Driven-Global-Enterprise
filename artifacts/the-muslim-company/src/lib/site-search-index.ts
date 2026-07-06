export interface SearchablePage {
  title: string;
  href: string;
  category: string;
  keywords?: string;
}

export const SITE_SEARCH_INDEX: SearchablePage[] = [
  { title: "Home", href: "/", category: "Company" },
  { title: "About", href: "/about", category: "Company", keywords: "overview company profile" },
  { title: "Mission", href: "/mission", category: "Company" },
  { title: "Vision", href: "/vision", category: "Company" },
  { title: "Our Story", href: "/our-story", category: "Company", keywords: "history founding" },
  { title: "Founder", href: "/founder", category: "Company", keywords: "shariful islam" },
  { title: "CEO — Shariful Islam", href: "/ceo/Sharifulislam", category: "Company", keywords: "chief executive officer" },
  { title: "Governance", href: "/governance", category: "Governance", keywords: "shariah board shura" },
  { title: "Constitution", href: "/constitution", category: "Governance", keywords: "framework legal" },
  { title: "Sectors", href: "/sectors", category: "Business", keywords: "industries verticals" },
  { title: "The Bayt Al-Mal Bank", href: "/baytalmalbank", category: "Business", keywords: "banking finance dinarx dirham" },
  { title: "The Muslim Company Foundation", href: "/the-muslim-company-foundation", category: "Business", keywords: "charity zakat humanitarian environment" },
  { title: "Careers", href: "/careers", category: "Connect", keywords: "jobs vacancies hiring recruitment" },
  { title: "Application Status", href: "/recruitment-status", category: "Connect", keywords: "recruitment status check reference track" },
  { title: "Get Involved", href: "/get-involved", category: "Connect", keywords: "volunteer partner support" },
  { title: "Contact", href: "/contact", category: "Connect", keywords: "email phone address" },
  { title: "FAQ", href: "/faq", category: "Connect", keywords: "questions help" },
  { title: "Newsroom & PR", href: "/newsroom", category: "Newsroom & Public", keywords: "press release news media" },
  { title: "Notice & Event", href: "/notices", category: "Newsroom & Public", keywords: "announcement event" },
  { title: "Blog", href: "/blog", category: "Newsroom & Public", keywords: "articles posts" },
  { title: "Transparency Reports", href: "/transparency", category: "Newsroom & Public", keywords: "financial reports zakat charity" },
  { title: "Privacy Policy", href: "/privacy-policy", category: "Legal" },
  { title: "Terms of Service", href: "/terms-of-service", category: "Legal" },
];
