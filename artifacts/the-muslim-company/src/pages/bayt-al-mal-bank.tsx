import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ArrowUpRight, ShieldCheck, Globe2, Scale, Landmark, Leaf, HeartHandshake } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "name": "Breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
    { "@type": "ListItem", "position": 2, "name": "The Bayt Al-Mal Bank", "item": "https://www.themuslim.company/BaytAlMalBank" }
  ]
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.themuslim.company/#organization",
  "name": "The Muslim Company",
  "legalName": "The Muslim Company LTD",
  "url": "https://www.themuslim.company",
  "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 },
  "foundingDate": "2025-01-09",
  "numberOfEmployees": { "@type": "QuantitativeValue", "value": 10 },
  "address": { "@type": "PostalAddress", "streetAddress": "Niketon Bazaar", "addressLocality": "Dhaka", "postalCode": "1212", "addressCountry": "BD" },
  "sameAs": ["https://www.facebook.com/TheMuslimCompany", "https://www.instagram.com/officialTheMuslimCompany", "https://www.youtube.com/@TheMuslimCompany", "https://www.linkedin.com/company/themuslimcompany", "https://x.com/officialtmchq"]
};

const BANK_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BankOrCreditUnion",
  "name": "The Bayt Al-Mal Bank",
  "legalName": "The Bayt Al-Mal Bank",
  "url": "https://www.themuslim.company/BaytAlMalBank",
  "description": "The Bayt Al-Mal Bank is a Shariah-compliant ethical bank in development under The Muslim Company — committed to interest-free finance, wealth justice, and civilizational economic development.",
  "parentOrganization": {
    "@type": "Organization",
    "name": "The Muslim Company",
    "url": "https://www.themuslim.company"
  },
  "founder": {
    "@type": "Person",
    "name": "Shariful Islam",
    "url": "https://www.themuslim.company/ceo/Sharifulislam"
  },
  "employee": {
    "@type": "OrganizationRole",
    "roleName": "Founder & Chief Executive Officer",
    "member": {
      "@type": "Person",
      "name": "Shariful Islam",
      "url": "https://www.themuslim.company/ceo/Sharifulislam"
    }
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Niketon Bazaar",
    "addressLocality": "Dhaka",
    "postalCode": "1212",
    "addressCountry": "BD"
  },
  "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 },
  "sameAs": ["https://www.themuslim.company/BaytAlMalBank", "https://tbmb.themuslimcompany.studio/"]
};

const PILLARS = [
  { icon: <ShieldCheck className="w-6 h-6 text-secondary" />, title: "Shariah Compliance", desc: "Every product, service, and transaction strictly adheres to Islamic financial law — eliminating riba (interest), gharar (excessive uncertainty), and all prohibited instruments." },
  { icon: <Scale className="w-6 h-6 text-secondary" />, title: "Wealth Justice", desc: "Inspired by the Prophetic model of Bayt al-Mal, wealth is treated as an amanah (trust) — distributed equitably, invested ethically, and directed toward societal benefit." },
  { icon: <Globe2 className="w-6 h-6 text-secondary" />, title: "Global Reach", desc: "Operating across borders with a vision to serve Muslim communities, ethical entrepreneurs, and mission-driven institutions worldwide through Shariah-compliant financial solutions." },
  { icon: <Landmark className="w-6 h-6 text-secondary" />, title: "Institutional Integrity", desc: "Built on a foundation of transparency, accountability, and strong corporate governance — aligned with both Islamic ethical standards and international regulatory frameworks." },
  { icon: <Leaf className="w-6 h-6 text-secondary" />, title: "Sustainable Finance", desc: "Prioritizing investments in renewable energy, ethical manufacturing, humanitarian development, and socially responsible enterprises that generate long-term positive impact." },
  { icon: <HeartHandshake className="w-6 h-6 text-secondary" />, title: "Community Development", desc: "Supporting zakat distribution, waqf management, microfinance for underserved communities, and charitable endowments that strengthen Muslim societies worldwide." },
];

const SERVICES = [
  { title: "Personal Banking", items: ["Shariah-Compliant Current & Savings Accounts", "Murabahah Home & Asset Finance", "Ethical Debit & Prepaid Cards", "Zakat Calculation & Distribution Services"] },
  { title: "Business Banking", items: ["Musharakah & Mudarabah Business Finance", "Trade Finance & Letters of Credit", "Corporate Accounts & Cash Management", "Halal Investment Advisory"] },
  { title: "Investment Services", items: ["Sukuk (Islamic Bonds) Issuance & Investment", "Shariah-Compliant Equity Portfolios", "Real Estate & Infrastructure Funds", "Ethical ESG Investment Products"] },
  { title: "Social Finance", items: ["Waqf (Endowment) Management", "Qard al-Hasan (Benevolent Loans)", "Zakat & Sadaqah Fund Management", "Microfinance for Entrepreneurs"] },
];

export default function BaytAlMalBankPage() {
  useEffect(() => {
    document.title = "The Bayt Al-Mal Bank — The Muslim Company";

    const _can = document.querySelector('link[rel="canonical"]');
    const _url = "https://www.themuslim.company/BaytAlMalBank";
    if (_can) { _can.setAttribute('href', _url); } else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = _url; document.head.appendChild(_cl); }

    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "The Bayt Al-Mal Bank is a Shariah-compliant ethical bank in development under The Muslim Company — committed to interest-free finance, wealth justice, and civilizational economic development.");

    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "The Bayt Al-Mal Bank — The Muslim Company");

    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "A Shariah-compliant ethical bank under The Muslim Company — built on Islamic principles of wealth justice, interest-free finance, and civilizational economic development.");

    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', _url);

    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [PERSON_SCHEMA, ORG_SCHEMA, BANK_SCHEMA, FAQ_SCHEMA].forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-page-schema', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });

    return () => { document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove()); };
  }, []);

  return (
    <SiteLayout>
      <Helmet>
        <title>The Bayt Al-Mal Bank — The Muslim Company</title>
        <meta name="description" content="The Bayt Al-Mal Bank is a Shariah-compliant ethical bank in development under The Muslim Company — committed to interest-free finance, wealth justice, and civilizational economic development." />
        <link rel="canonical" href="https://www.themuslim.company/BaytAlMalBank" />
        <meta property="og:title" content="The Bayt Al-Mal Bank — The Muslim Company" />
        <meta property="og:description" content="A Shariah-compliant ethical bank under The Muslim Company — built on Islamic principles of wealth justice, interest-free finance, and civilizational economic development." />
        <meta property="og:url" content="https://www.themuslim.company/BaytAlMalBank" />
        <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Bayt Al-Mal Bank — The Muslim Company" />
        <meta name="twitter:description" content="A Shariah-compliant ethical bank under The Muslim Company." />
        <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="The Bayt Al-Mal Bank, TBMB, Islamic Bank, Shariah Bank, Halal Banking, Islamic Finance, The Muslim Company, Shariah Compliant Bank, Bangladesh Islamic Bank, Ethical Banking" />
      </Helmet>

      <div className="bg-background min-h-screen">

        {/* Hero */}
        <section className="bg-primary py-28 px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
              <motion.p variants={fadeIn} className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-3">
                A Division of The Muslim Company
              </motion.p>
              <motion.div variants={fadeIn} className="inline-block border border-secondary/40 px-4 py-1.5 mb-6">
                <span className="font-sans text-[10px] tracking-widest uppercase text-secondary">In Development — Launching Soon</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="font-serif text-5xl md:text-7xl text-primary-foreground mb-4">
                The Bayt Al-Mal Bank
              </motion.h1>
              <motion.p variants={fadeIn} className="font-sans text-sm tracking-widest uppercase text-primary-foreground/50 mb-6">
                بيت المال — House of Wealth
              </motion.p>
              <motion.p variants={fadeIn} className="font-sans text-base text-primary-foreground/65 max-w-2xl mx-auto leading-relaxed mb-10">
                A Shariah-compliant ethical banking institution currently in development — designed to serve individuals, businesses, and institutions worldwide through both online and offline channels. Built on the Prophetic model of wealth stewardship, committed to interest-free finance, wealth justice, and long-term civilizational economic development for all.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground hover:border-secondary hover:text-secondary font-sans text-xs font-bold uppercase tracking-widest h-12 px-8 transition-colors">
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* What is Bayt Al-Mal */}
        <section className="py-20 px-6 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Historical Foundation</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">What is Bayt Al-Mal?</h2>
              <p className="font-sans text-sm text-primary/65 leading-relaxed max-w-3xl mx-auto mb-6">
                <em>Bayt al-Mal</em> (بيت المال) — "House of Wealth" or "House of Money" — is an institution rooted in the earliest foundations of Islamic civilization. Established during the era of the Rightly-Guided Caliphs, it served as the public treasury of the Islamic state: collecting revenues, distributing zakat, funding public welfare, and managing the financial affairs of the Muslim community with justice and accountability.
              </p>
              <p className="font-sans text-sm text-primary/65 leading-relaxed max-w-3xl mx-auto">
                Inspired by this noble legacy, <strong className="text-primary/85">The Bayt Al-Mal Bank</strong> seeks to revive the spirit of Prophetic economic justice — transforming banking from a tool of exploitation into an instrument of human dignity, societal welfare, and civilizational advancement.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Development Status */}
        <section className="py-16 px-6 border-b border-primary/10">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Our Journey</p>
              <h2 className="font-serif text-2xl md:text-3xl text-primary mb-5">Currently in Development</h2>
              <p className="font-sans text-sm text-primary/60 leading-relaxed max-w-2xl mx-auto mb-8">
                The Bayt Al-Mal Bank is being carefully built from the ground up — establishing regulatory compliance, Shariah governance frameworks, and core banking infrastructure before launch. We are committed to building a trustworthy, fully compliant institution rather than rushing to market.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                <div className="p-4 border border-primary/10">
                  <p className="font-serif text-lg text-secondary mb-1">Phase 1</p>
                  <p className="font-sans text-xs text-primary/55">Shariah Framework & Governance Structure</p>
                </div>
                <div className="p-4 border border-primary/10">
                  <p className="font-serif text-lg text-secondary mb-1">Phase 2</p>
                  <p className="font-sans text-xs text-primary/55">Regulatory Licensing & Compliance</p>
                </div>
                <div className="p-4 border border-primary/10">
                  <p className="font-serif text-lg text-secondary mb-1">Phase 3</p>
                  <p className="font-sans text-xs text-primary/55">Public Launch & Onboarding</p>
                </div>
              </div>
              <div className="inline-block border border-secondary/40 px-6 py-3">
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/70 mb-1">Expected First Launch</p>
                <p className="font-serif text-2xl text-primary">2031</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-14">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-3">Our Foundation</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Core Pillars</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PILLARS.map((p, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 bg-card border border-primary/10">
                  <div className="mb-4">{p.icon}</div>
                  <h3 className="font-serif text-lg text-primary mb-3">{p.title}</h3>
                  <p className="font-sans text-sm text-primary/60 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 px-6 bg-card">
          <div className="container mx-auto max-w-6xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-14">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-3">What We Offer</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Banking Services</h2>
              <p className="font-sans text-sm text-primary/55 mt-4 max-w-2xl mx-auto">
                A comprehensive suite of Shariah-compliant financial products and services designed for individuals, businesses, and institutions.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((s, i) => (
                <motion.div key={i} variants={fadeIn} className="p-7 bg-background border border-primary/10">
                  <h3 className="font-serif text-xl text-primary mb-5">{s.title}</h3>
                  <ul className="space-y-3">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span className="font-sans text-sm text-primary/65">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="py-20 px-6 bg-card">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-14">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-3">Powered By</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">A Connected Financial Ecosystem</h2>
              <p className="font-sans text-sm text-primary/55 mt-4 max-w-2xl mx-auto">
                The Bayt Al-Mal Bank operates as part of an integrated financial ecosystem within The Muslim Company, built to serve customers globally — online and offline.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={fadeIn} className="p-7 bg-background border border-primary/10">
                <h3 className="font-serif text-xl text-primary mb-3">DinarX</h3>
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/70 mb-3">Fintech App</p>
                <p className="font-sans text-sm text-primary/60 leading-relaxed">
                  The official fintech application of The Bayt Al-Mal Bank — providing mobile-first access to Shariah-compliant banking, savings, financing, and investment products for customers worldwide.
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-7 bg-background border border-primary/10">
                <h3 className="font-serif text-xl text-primary mb-3">Dirham Payment Gateway</h3>
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/70 mb-3">Payment Infrastructure</p>
                <p className="font-sans text-sm text-primary/60 leading-relaxed">
                  A Shariah-compliant payment gateway enabling seamless, interest-free transactions for businesses and individuals — supporting both online and offline commerce globally.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quote */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="border-l-4 border-secondary pl-6 py-2">
              <p className="font-serif text-xl italic text-primary/80 leading-relaxed">
                "Wealth belongs to Allah. We are only trustees. The Bayt Al-Mal Bank is our commitment to fulfill that trust — building financial systems that serve humanity, uphold justice, and reflect the highest values of Islamic civilization."
              </p>
              <p className="mt-4 font-sans text-xs tracking-widest uppercase text-secondary/60">— Shariful Islam, CEO — The Muslim Company</p>
            </motion.div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-3">The Difference</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Conventional Banking vs. The Bayt Al-Mal Bank</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="overflow-x-auto">
              <table className="w-full border border-primary/10 text-left">
                <thead>
                  <tr className="border-b border-primary/10 bg-card">
                    <th className="p-4 font-sans text-xs uppercase tracking-widest text-primary/50">Aspect</th>
                    <th className="p-4 font-sans text-xs uppercase tracking-widest text-primary/50">Conventional Bank</th>
                    <th className="p-4 font-sans text-xs uppercase tracking-widest text-secondary">The Bayt Al-Mal Bank</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Interest (Riba)", "Charges and pays interest", "Strictly interest-free (Shariah-compliant contracts)"],
                    ["Profit Motive", "Profit-maximization focused", "Purpose-driven — profit as a means, not the end"],
                    ["Risk Sharing", "Risk transferred to borrower", "Risk shared between bank and customer (Musharakah/Mudarabah)"],
                    ["Wealth Distribution", "No structured social obligation", "Built-in zakat, waqf, and qard al-hasan mechanisms"],
                    ["Governance", "Regulatory compliance only", "Shariah Advisory Board + regulatory compliance"],
                    ["Access", "Often urban / branch-limited", "Online and offline, designed for global access"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-primary/10">
                      <td className="p-4 font-sans text-sm text-primary/70 font-medium">{row[0]}</td>
                      <td className="p-4 font-sans text-sm text-primary/50">{row[1]}</td>
                      <td className="p-4 font-sans text-sm text-primary/80">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-20 px-6 bg-card">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-14">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-3">Built For Everyone</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Who We Serve</h2>
              <p className="font-sans text-sm text-primary/55 mt-4 max-w-2xl mx-auto">
                The Bayt Al-Mal Bank is designed to serve every segment of society — locally and globally, online and offline.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Individuals", desc: "Personal banking, savings, and home/asset financing for everyday life." },
                { title: "Small & Medium Enterprises", desc: "Working capital, trade finance, and growth financing for entrepreneurs." },
                { title: "Corporations", desc: "Corporate accounts, cash management, and large-scale ethical financing." },
                { title: "Institutions & Nonprofits", desc: "Waqf management, zakat distribution, and institutional treasury services." },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 bg-background border border-primary/10 text-center">
                  <h3 className="font-serif text-lg text-primary mb-3">{item.title}</h3>
                  <p className="font-sans text-sm text-primary/55 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Different */}
        <section className="py-20 px-6 bg-primary">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-3">Our Difference</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground">Why The Bayt Al-Mal Bank?</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Zero Riba", desc: "Absolutely no interest-based products. Every transaction is structured on Shariah-approved contracts." },
                { title: "Purpose-Driven", desc: "Profit is a means, not the end. Every product serves a higher purpose — societal welfare and civilizational growth." },
                { title: "Prophetic Model", desc: "Guided by the Quran, the Sunnah, and the wisdom of classical Islamic economic scholarship." },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 border border-primary-foreground/20 text-center">
                  <h3 className="font-serif text-xl text-secondary mb-3">{item.title}</h3>
                  <p className="font-sans text-sm text-primary-foreground/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Backed By */}
        <section className="py-20 px-6 bg-card">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Trust & Credibility</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">Backed by The Muslim Company</h2>
              <p className="font-sans text-sm text-primary/60 leading-relaxed max-w-2xl mx-auto mb-8">
                The Bayt Al-Mal Bank is not a standalone venture — it is built on the foundation of The Muslim Company, a diversified global conglomerate already active across technology, education, healthcare, humanitarian development, and ethical commerce. This institutional backing provides the financial discipline, governance structure, and long-term commitment necessary to build a bank rooted in trust.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 border border-primary/30 text-primary hover:border-secondary hover:text-secondary font-sans text-xs font-bold uppercase tracking-widest h-12 px-8 transition-colors">
                Explore The Muslim Company
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Shariah Advisory Board */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Governance</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">Shariah Advisory Board</h2>
              <p className="font-sans text-sm text-primary/60 leading-relaxed max-w-2xl mx-auto">
                Shariah Advisory Board — to be announced. The Bayt Al-Mal Bank is committed to assembling a board of respected scholars rooted in mainstream Sunni Islamic jurisprudence, ensuring full Shariah compliance across all products and services before public launch.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6 bg-card">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-3">Common Questions</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">Frequently Asked Questions</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-6">
              {[
                { q: "Is The Bayt Al-Mal Bank open for customers yet?", a: "Not yet. The Bayt Al-Mal Bank is currently in development, building its Shariah governance framework and pursuing regulatory licensing before public launch." },
                { q: "When will The Bayt Al-Mal Bank launch?", a: "The Bayt Al-Mal Bank is targeting its first public launch in 2031, following the completion of its Shariah governance framework and regulatory licensing process." },
                { q: "Who is behind The Bayt Al-Mal Bank?", a: "The Bayt Al-Mal Bank is founded and led by Shariful Islam, Founder & CEO, as a division of The Muslim Company." },
                { q: "How is this different from a conventional bank?", a: "Unlike conventional banks, The Bayt Al-Mal Bank operates entirely free of riba (interest), using Shariah-compliant contracts such as Murabahah, Musharakah, and Mudarabah for all financial products." },
                { q: "How can I stay updated on the launch?", a: "You can reach out via our Contact page to express interest and receive updates as The Bayt Al-Mal Bank progresses toward launch." },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="border-b border-primary/10 pb-6">
                  <h3 className="font-serif text-lg text-primary mb-2">{item.q}</h3>
                  <p className="font-sans text-sm text-primary/60 leading-relaxed">{item.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Get Involved</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">Be Part of the Movement</h2>
              <p className="font-sans text-sm text-primary/60 leading-relaxed mb-8 max-w-xl mx-auto">
                The Bayt Al-Mal Bank is more than a financial institution — it is a movement to restore justice, dignity, and purpose to the global financial system through the timeless principles of Islam. Reach out to stay informed as we progress toward launch.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/get-involved" className="inline-flex items-center gap-2 border border-primary/30 text-primary hover:border-secondary hover:text-secondary font-sans text-xs font-bold uppercase tracking-widest h-12 px-8 transition-colors">
                  Get Involved
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Back Link */}
        <div className="py-8 px-6 border-t border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <Link href="/" className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-primary/40 hover:text-secondary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to The Muslim Company
            </Link>
          </div>
        </div>

      </div>
    </SiteLayout>
  );
}
