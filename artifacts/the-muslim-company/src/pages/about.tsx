import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { BookOpen, ShieldCheck, Scale, Users, Building2, Target, Compass, Award, HeartHandshake, Trophy, Mail, Briefcase, HelpCircle, Landmark } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { isCrawlerUA } from "@/lib/isCrawler";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function Bullets({ items, light }: { items: string[]; light?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-3 font-sans text-sm ${light ? "text-primary-foreground/70" : "text-primary/70"}`}>
          <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const SECTORS = [
  "Agriculture & Food", "Education & Research", "Technology & AI", "Healthcare & Medicine",
  "Construction & Housing", "Renewable Energy", "Media & Journalism", "Software & Cybersecurity",
  "Manufacturing & Industry", "Islamic Finance & FinTech", "Transportation & Logistics", "E-commerce",
  "Literature & Publishing", "Philosophy & Civilization Studies", "Scientific Research",
  "Social Welfare & Humanitarian Work", "Environmental Protection", "Robotics & Automation",
  "International Trade", "Community Development", "Retail Business", "Fashion & Apparel",
  "Lifestyle & Personal Care",
];

const VALUES = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Amanah — Trust & Integrity", desc: "Prophet Muhammad ﷺ was known before his prophethood as Al-Amin — 'the trustworthy' — for his honesty in trade. Every decision, contract, and partnership at The Muslim Company is held to that same standard of trust." },
  { icon: <Scale className="w-5 h-5" />, title: "Adl — Justice & Fair Dealing", desc: "Fair pricing, honest weights and measures, and equitable treatment of employees, customers, and suppliers — following the Prophetic model of trade free from deception or exploitation." },
  { icon: <BookOpen className="w-5 h-5" />, title: "Ilm — Knowledge & Excellence", desc: "We invest in research, education, and continuous learning, believing that knowledge and ethics must always advance together." },
  { icon: <HeartHandshake className="w-5 h-5" />, title: "Rahmah — Mercy & Service", desc: "Compassion toward employees, customers, and the wider world guides how we build products, treat people, and give back." },
];

const MILESTONES = [
  { year: "Jan 2025", title: "Founded in Dhaka, Bangladesh", desc: "The Muslim Company was established by Shariful Islam as a faith-driven global conglomerate, headquartered in Dhaka." },
  { year: "2025", title: "Financial ecosystem launched", desc: "The Bayt Al-Mal Bank established, along with DinarX (its fintech app) and Dirham Payment Gateway — a Shariah-compliant, interest-free financial ecosystem." },
  { year: "2025–Present", title: "Expansion across 20+ sectors", desc: "Operations grew across Technology, AI, Manufacturing, Renewable Energy, Healthcare, Education, Media, and Humanitarian Development." },
];

const SUBBRANDS = [
  { name: "The Bayt Al-Mal Bank", tag: "Shariah-Compliant Banking", desc: "The Muslim Company's Islamic banking arm — offering interest-free (riba-free) banking, savings, and financing products.", href: "/baytalmalbank" },
  { name: "DinarX", tag: "Fintech App", desc: "The official fintech application of The Bayt Al-Mal Bank — mobile-first access to Shariah-compliant banking, savings, financing, and investment.", href: "/baytalmalbank" },
  { name: "Dirham Payment Gateway", tag: "Payment Infrastructure", desc: "A Shariah-compliant payment gateway enabling interest-free transactions for businesses and individuals, online and offline.", href: "/baytalmalbank" },
];

const FAQS = [
  { q: "What is The Muslim Company?", a: "The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by Shariful Islam. It operates across 20+ sectors — including Technology, AI, Manufacturing, Renewable Energy, Healthcare, Education, Media, and Humanitarian Development — under a fully Shariah-compliant, halal, and riba-free framework." },
  { q: "Who founded The Muslim Company, and who leads it today?", a: "The Muslim Company was founded by Shariful Islam, who serves as its Founder, Chairman, Managing Director, and CEO." },
  { q: "Is The Muslim Company Shariah-compliant?", a: "Yes. Every entity under the group is overseen by a Supreme Shariah Board and reviewed against the Maqasid al-Shariah (higher objectives of Islamic law). Operations are completely free from riba (interest), bribery, and exploitation." },
  { q: "What sectors does The Muslim Company operate in?", a: "The company works across 20+ beneficial and halal sectors, including Technology & AI, Healthcare, Renewable Energy, Manufacturing, Education, Islamic Finance & FinTech, Media, and Humanitarian & Social Welfare." },
  { q: "Does The Muslim Company give back to the community?", a: "Yes. The company commits 10% of monthly net profit to Fi Sabilillah — for Allah's path — in addition to fully distributing annual zakat, supporting mosques, madrasas, education scholarships, healthcare, and orphan care." },
  { q: "Where is The Muslim Company headquartered?", a: "The Muslim Company is headquartered in Niketon Bazaar, Dhaka-1212, Bangladesh." },
];

export default function AboutPage() {
  const [isBot] = useState(isCrawlerUA);
  useEffect(() => {
    document.title = "About Us — The Muslim Company | Faith-Driven Global Conglomerate";

    document.querySelectorAll('script[data-org-schema]').forEach(el => el.remove());
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.themuslim.company/#organization",
      "name": "The Muslim Company",
      "legalName": "The Muslim Company LTD",
      "url": "https://www.themuslim.company",
      "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 },
      "foundingDate": "2025-01-09",
      "disambiguatingDescription": "The Muslim Company is a faith-driven global conglomerate founded by Shariful Islam in Dhaka, Bangladesh in January 2025. It is not affiliated with, owned by, or related to other similarly-named organizations such as The Muslim Journal or Productive Muslim — any resemblance is in name only.",
      "founder": { "@type": "Person", "name": "Shariful Islam", "url": "https://www.themuslim.company/founder" },
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": 10 },
      "address": { "@type": "PostalAddress", "streetAddress": "Niketon Bazaar", "addressLocality": "Dhaka", "postalCode": "1212", "addressCountry": "BD" },
      "sameAs": ["https://www.facebook.com/TheMuslimCompany", "https://www.instagram.com/officialTheMuslimCompany", "https://www.youtube.com/@TheMuslimCompany", "https://www.linkedin.com/company/themuslimcompany", "https://x.com/officialtmchq", "https://www.crunchbase.com/organization/the-muslim-company"]
    };
    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.setAttribute("data-org-schema", "true");
    orgScript.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgScript);

    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }

    const desc = "About The Muslim Company — a faith-driven global conglomerate founded by Shariful Islam in Dhaka, Bangladesh, operating across 20+ sectors including Technology, AI, Renewable Energy, Healthcare, and Humanitarian Development, governed by Amanah, Ilm, and Rahmah.";
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', desc);
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "About Us | The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', desc);
    const _twt_fix = document.querySelector('meta[name="twitter:title"]');
    if (_twt_fix) _twt_fix.setAttribute('content', "About Us | The Muslim Company");
    const _twd_fix = document.querySelector('meta[name="twitter:description"]');
    if (_twd_fix) _twd_fix.setAttribute('content', desc);
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) { _ogi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _il = document.createElement('meta'); _il.setAttribute('property', 'og:image'); _il.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_il); }
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) { _twi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _tl = document.createElement('meta'); _tl.setAttribute('name', 'twitter:image'); _tl.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_tl); }
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/about");

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" }, { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://www.themuslim.company/about" }] },
      { "@context": "https://schema.org", "@type": "AboutPage", "name": "About Us — The Muslim Company", "description": desc, "url": "https://www.themuslim.company/about", "publisher": { "@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company" }, "mainEntity": { "@id": "https://www.themuslim.company/#organization" } },
      {
        "@context": "https://schema.org", "@type": "Person",
        "@id": "https://www.themuslim.company/ceo/Sharifulislam#person",
        "name": "Shariful Islam", "givenName": "Shariful", "familyName": "Islam",
        "alternateName": "Shariful Islam Naik",
        "jobTitle": "Founder, Chairman, Managing Director & CEO",
        "description": "Shariful Islam is a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur. He is the Founder, Chairman, Managing Director, and CEO of The Muslim Company — a faith-driven global enterprise built on Islamic principles and prophetic values. He is also a Peace Ambassador for the Global Peace Chain (Bangladesh).",
        "url": "https://www.themuslim.company/founder",
        "worksFor": { "@type": "Organization", "@id": "https://www.themuslim.company/#organization", "name": "The Muslim Company" },
        "award": "Global Peace Ambassador 2025-2026, Global Peace Chain",
      },
      {
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      },
    ].forEach(schema => {
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
        <title>About - The Muslim Company - A Prophetic Model Business Group</title>
        <meta name="description" content="About The Muslim Company — A Prophetic Model Business Group founded by Shariful Islam, operating across 20+ halal sectors guided by Amanah, Ilm & Rahmah." />
        <link rel="canonical" href="https://www.themuslim.company/about" />
        <meta property="og:title" content="About - The Muslim Company - A Prophetic Model Business Group" />
        <meta property="og:url" content="https://www.themuslim.company/about" />
      </Helmet>

      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-primary py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial={isBot ? "visible" : "hidden"} animate="visible" variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-4">About Us</p>
              <h1 className="font-serif text-5xl md:text-6xl text-primary-foreground mb-6">The Muslim Company</h1>
              <p className="font-serif text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                A faith-driven global conglomerate building an ethical, Shariah-compliant business ecosystem across 20+ sectors — founded on Amanah, Ilm, and Rahmah.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="bg-card border-b border-primary/10 py-10 px-6">
          <div className="container mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["Jan 2025", "Founded"],
              ["20+", "Global Sectors"],
              ["Dhaka, BD", "Headquarters"],
              ["10%", "Monthly Profit — Fi Sabilillah"],
            ].map(([val, label], i) => (
              <div key={i} className="text-center">
                <p className="font-serif text-2xl md:text-3xl text-primary font-bold">{val}</p>
                <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Overview */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl space-y-16">

            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-serif text-3xl text-primary mb-5">Who We Are</h2>
                <p className="font-sans text-sm text-primary/70 leading-relaxed mb-4">
                  The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by <a href="/founder" className="text-secondary hover:underline font-medium">Shariful Islam</a>. The company operates across 20+ sectors — including Technology, Artificial Intelligence, Manufacturing, Renewable Energy, Healthcare, Education, Media, and Humanitarian Development — with a growing presence across Bangladesh, India, Pakistan, the United Arab Emirates, Nigeria, Ghana, and the wider African continent, united under a single ethical framework rooted in the Quran, authentic Sunnah, and the Prophetic model.
                </p>
                <p className="font-sans text-sm text-primary/70 leading-relaxed mb-4">
                  This is what sets The Muslim Company apart from a conventional conglomerate: profit is treated as a means, not the end. Every entity under the group — from <a href="/baytalmalbank" className="text-secondary hover:underline">The Bayt Al Mal Bank</a> (targeting public launch in 2031) to The Muslim Souq and The Muslim Company Foundation — is governed by the same Shariah-compliant standards and overseen by a Supreme Shariah Board, built on transparency, halal economics, knowledge, research, technology, and humanitarian responsibility rather than market domination alone.
                </p>
                <p className="font-sans text-sm text-primary/70 leading-relaxed mb-4">
                  The Supreme Shariah Board is composed of qualified Islamic scholars alongside senior business and technical advisors, and reviews every major product, investment, and partnership before launch, with continuing authority to pause or reverse a decision if new evidence of harm emerges. This oversight is modeled on the trade practices of Prophet Muhammad ﷺ, who was known even before his prophethood as Al-Amin — "the trustworthy" — for his honesty, fair dealing, and refusal to deceive in business.
                </p>
                <p className="font-sans text-sm text-primary/70 leading-relaxed">
                  Led by Founder, Chairman, Managing Director, and CEO <a href="/ceo/Sharifulislam" className="text-secondary hover:underline font-medium">Shariful Islam</a>, the company commits 10% of monthly net profit to Fi Sabilillah — for Allah's path — in addition to annual zakat, reflecting its belief that ethical wealth carries barakah only when it serves people beyond shareholders.
                </p>
              </div>
              <div className="bg-card border border-primary/10 p-6 space-y-5 h-fit">
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">Founded</p>
                  <p className="font-serif text-lg text-primary">January 2025</p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">Headquarters</p>
                  <p className="font-serif text-lg text-primary">Dhaka, Bangladesh</p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">Founder, Chairman & CEO</p>
                  <p className="font-serif text-lg text-primary"><a href="/founder" className="hover:text-secondary transition-colors">Shariful Islam</a></p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">Sectors</p>
                  <p className="font-serif text-lg text-primary">20+ industries</p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">Governance</p>
                  <p className="font-serif text-lg text-primary">Supreme Shariah Board</p>
                </div>
              </div>
            </motion.div>

            {/* Core Values */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <h2 className="font-serif text-3xl text-primary mb-8 text-center">Our Guiding Principles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {VALUES.map((v, i) => (
                  <div key={i} className="p-6 bg-card border border-primary/10">
                    <div className="text-secondary mb-3">{v.icon}</div>
                    <h3 className="font-serif text-lg text-primary mb-2">{v.title}</h3>
                    <p className="font-sans text-xs text-primary/65 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mission & Vision */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-primary text-primary-foreground">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-secondary" />
                  <h3 className="font-serif text-xl">Our Mission</h3>
                </div>
                <p className="font-sans text-sm text-primary-foreground/70 leading-relaxed mb-4">
                  To build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, justice, sustainability, and social development.
                </p>
                <a href="/mission" className="font-sans text-xs uppercase tracking-widest text-secondary hover:underline">Read our full mission →</a>
              </div>
              <div className="p-8 bg-card border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <Compass className="w-5 h-5 text-secondary" />
                  <h3 className="font-serif text-xl text-primary">Our Vision</h3>
                </div>
                <p className="font-sans text-sm text-primary/70 leading-relaxed mb-4">
                  To help revive the legacy of Muslim civilization — restoring the historical excellence of the Muslim world in science, technology, economics, education, and ethical governance for the benefit of all humanity.
                </p>
                <a href="/vision" className="font-sans text-xs uppercase tracking-widest text-secondary hover:underline">Read our full vision →</a>
              </div>
            </motion.div>

            {/* Sectors */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <div className="flex items-center gap-2 mb-6 justify-center">
                <Building2 className="w-5 h-5 text-secondary" />
                <h2 className="font-serif text-3xl text-primary text-center">Sectors We Operate In</h2>
              </div>
              <p className="font-sans text-sm text-primary/60 text-center max-w-2xl mx-auto mb-8">
                The Muslim Company works across 20+ beneficial and halal sectors, building an integrated ethical economy from agriculture to advanced technology.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                {SECTORS.map((s, i) => (
                  <span key={i} className="font-sans text-xs tracking-wide bg-card border border-primary/10 text-primary/60 px-3 py-1.5">
                    {s}
                  </span>
                ))}
              </div>
              <div className="text-center mt-6">
                <a href="/sectors" className="font-sans text-xs uppercase tracking-widest text-secondary hover:underline">Explore all sectors →</a>
              </div>
            </motion.div>

            {/* Governance & Compliance */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2 mb-6">
                <Scale className="w-5 h-5 text-secondary" />
                <h2 className="font-serif text-2xl">Governance & Compliance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Bullets light items={[
                  "Supreme Shariah Board oversight on all major decisions",
                  "Amanah-based leadership and Shura (consultative) framework",
                  "Completely free from riba (interest), bribery, and exploitation",
                  "Guided by Maqasid al-Shariah — the higher objectives of Islamic law",
                ]} />
                <Bullets light items={[
                  "10% of monthly net profit directed to Fi Sabilillah — for Allah's path",
                  "Annual zakat calculated and fully distributed",
                  "Constitutional framework binding all future leadership to the founding mission",
                  "Full transparency reporting published for public accountability",
                ]} />
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <a href="/governance" className="font-sans text-xs uppercase tracking-widest text-secondary hover:underline">Governance details →</a>
                <a href="/transparency" className="font-sans text-xs uppercase tracking-widest text-secondary hover:underline">Transparency reports →</a>
                <a href="/constitution" className="font-sans text-xs uppercase tracking-widest text-secondary hover:underline">Read the constitution →</a>
              </div>
              <div className="mt-8 pt-6 border-t border-primary-foreground/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-serif text-lg mb-2">Council of Ethical Scholars, Scientists & Experts</h3>
                  <p className="font-sans text-xs text-primary-foreground/55 leading-relaxed">A permanent interdisciplinary council of Islamic scholars, scientists, engineers, economists, AI researchers, doctors, and humanitarian experts — guided by Quran, Hadith, and verified science.</p>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-2">Shura — Consultation Framework</h3>
                  <p className="font-sans text-xs text-primary-foreground/55 leading-relaxed">Inspired by the Islamic principle of Shura, major decisions involve expert consultation councils, strategic advisory committees, and ethical review sessions before implementation.</p>
                </div>
              </div>
            </motion.div>

            {/* Financial Ecosystem / Sub-brands */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <div className="flex items-center gap-2 mb-3 justify-center">
                <Landmark className="w-5 h-5 text-secondary" />
                <h2 className="font-serif text-3xl text-primary text-center">Our Financial Ecosystem</h2>
              </div>
              <p className="font-sans text-sm text-primary/60 text-center max-w-2xl mx-auto mb-8">
                A connected, Shariah-compliant financial ecosystem built to serve customers globally — online and offline.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {SUBBRANDS.map((b, i) => (
                  <a key={i} href={b.href} className="p-6 bg-card border border-primary/10 hover:border-secondary/40 transition-colors block">
                    <h3 className="font-serif text-lg text-primary mb-1">{b.name}</h3>
                    <p className="font-sans text-xs tracking-widest uppercase text-secondary/70 mb-3">{b.tag}</p>
                    <p className="font-sans text-xs text-primary/65 leading-relaxed">{b.desc}</p>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Recognition */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10 text-center">
              <Trophy className="w-6 h-6 text-secondary mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-primary mb-3">Recognition</h2>
              <p className="font-sans text-sm text-primary/60 max-w-2xl mx-auto">
                Founder & CEO Shariful Islam has been recognized as a <span className="text-secondary font-medium">Global Peace Ambassador (2025–2026)</span> by the Global Peace Chain, in recognition of his ethical leadership and civilization-focused vision.
              </p>
            </motion.div>

            {/* Social Responsibility */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2 mb-4">
                <HeartHandshake className="w-5 h-5 text-secondary" />
                <h2 className="font-serif text-2xl">Social Responsibility</h2>
              </div>
              <p className="font-sans text-sm text-primary-foreground/70 leading-relaxed mb-6 max-w-3xl">
                Businesses that maintain honesty, justice, and charity receive barakah and long-term stability. The Muslim Company directs 10% of monthly net profit to Fi Sabilillah — for Allah's path — alongside full annual zakat distribution, toward:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Mosques & Madrasas", "Education Scholarships", "Healthcare Support", "Orphan Care"].map((item, i) => (
                  <div key={i} className="px-4 py-3 border border-secondary/30 text-center">
                    <p className="font-sans text-xs tracking-wide text-secondary/80">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Milestones */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <div className="flex items-center gap-2 mb-8 justify-center">
                <Award className="w-5 h-5 text-secondary" />
                <h2 className="font-serif text-3xl text-primary text-center">Our Journey</h2>
              </div>
              <div className="space-y-6 max-w-3xl mx-auto">
                {MILESTONES.map((m, i) => (
                  <div key={i} className="flex gap-6 p-5 bg-card border border-primary/10">
                    <div className="font-serif text-sm text-secondary font-bold whitespace-nowrap w-28 flex-shrink-0">{m.year}</div>
                    <div>
                      <h4 className="font-serif text-base text-primary mb-1">{m.title}</h4>
                      <p className="font-sans text-xs text-primary/65 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* A Note on Our Scale and Vision */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-primary text-primary-foreground">
              <h2 className="font-serif text-2xl mb-5">A Note on Our Scale and Vision</h2>
              <p className="font-sans text-sm text-primary-foreground/70 leading-relaxed mb-4">
                The Muslim Company is currently in an early stage of growth. Our presence across 20+ sectors today
                operates at a small scale, as we build our own brand identity and operational foundation in each area
                we enter.
              </p>
              <p className="font-sans text-sm text-primary-foreground/70 leading-relaxed mb-4">
                This website describes a great deal about who we are and where we intend to go — and we say so
                candidly: our vision is highly ambitious, and not everything described here is achievable or
                available today. Much of what you read reflects our roadmap for the future, not exclusively our
                current day-to-day scale of operations.
              </p>
              <p className="font-sans text-sm text-primary-foreground/70 leading-relaxed mb-2">
                Our Founder, Shariful Islam, has always believed in thinking big — because when the intention
                (niyyah) behind an ambition is sincere and made purely for the sake of Allah (ikhlas), He makes the
                path easier, and the reward for a good intention begins the moment it is made, even before the work
                is complete.
              </p>

              <div className="border-l-4 border-secondary pl-5 py-1 my-6">
                <p className="font-serif text-lg italic leading-relaxed text-primary-foreground/90">
                  "Actions are judged by their intentions."
                </p>
                <p className="mt-2 font-sans text-xs tracking-widest uppercase text-secondary/70">— Prophet Muhammad ﷺ, Sahih al-Bukhari 1</p>
              </div>
              <div className="border-l-4 border-secondary pl-5 py-1 my-6">
                <p className="font-serif text-lg italic leading-relaxed text-primary-foreground/90">
                  "And whoever fears Allah, He will make for him a way out."
                </p>
                <p className="mt-2 font-sans text-xs tracking-widest uppercase text-secondary/70">— Surah At-Talaq 65:2</p>
              </div>
              <div className="border-l-4 border-secondary pl-5 py-1 my-6">
                <p className="font-serif text-lg italic leading-relaxed text-primary-foreground/90">
                  "Indeed, with hardship comes ease."
                </p>
                <p className="mt-2 font-sans text-xs tracking-widest uppercase text-secondary/70">— Surah Ash-Sharh 94:6</p>
              </div>

              <p className="font-sans text-sm text-primary-foreground/70 leading-relaxed">
                It is this belief — that a sincere intention made for Allah's sake invites His help — that allows us
                to state our ambitions boldly and work toward them patiently, one stage at a time. We believe in
                stating our direction and intent clearly and publicly, and holding ourselves accountable to it over
                time, rather than waiting until every ambition is fully realized to speak about it. We will continue
                to update this website, and our Transparency Reports, as each part of this vision becomes reality.
              </p>
            </motion.div>

            {/* Leadership CTA */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10 text-center">
              <Users className="w-6 h-6 text-secondary mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-primary mb-3">Meet Our Leadership</h2>
              <p className="font-sans text-sm text-primary/60 max-w-2xl mx-auto mb-6">
                Learn more about the founder's journey, and the vision guiding The Muslim Company as Chairman, Managing Director, and CEO.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/founder" className="bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-10 px-6 flex items-center hover:bg-secondary/90 transition-colors">
                  Founder's Story
                </a>
                <a href="/ceo/Sharifulislam" className="border border-primary/20 text-primary font-sans text-xs font-bold uppercase tracking-widest h-10 px-6 flex items-center hover:border-secondary transition-colors">
                  CEO Profile
                </a>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <div className="flex items-center gap-2 mb-8 justify-center">
                <HelpCircle className="w-5 h-5 text-secondary" />
                <h2 className="font-serif text-3xl text-primary text-center">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4 max-w-3xl mx-auto">
                {FAQS.map((f, i) => (
                  <div key={i} className="p-5 bg-card border border-primary/10">
                    <h3 className="font-serif text-base text-primary mb-2">{f.q}</h3>
                    <p className="font-sans text-sm text-primary/60 leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* A Note on Humility */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <div className="max-w-3xl mx-auto p-8 bg-card border border-primary/10 text-center">
                <p className="font-sans text-sm text-primary/70 leading-relaxed">
                  The Muslim Company does not claim perfection. The company will correct mistakes when discovered, accept truth when it becomes clear, protect ethics and justice, benefit humanity, and keep accountability and humility. The journey continues through tawakkul upon Allah, sincerity, halal effort, Prophetic ethics, and continuous striving for goodness. <span className="font-serif italic text-secondary">InshaAllah, as far as Allah allows.</span>
                </p>
              </div>
            </motion.div>

            {/* Careers & Contact CTA */}
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-primary text-primary-foreground text-center">
                <Briefcase className="w-6 h-6 text-secondary mx-auto mb-4" />
                <h3 className="font-serif text-xl mb-2">Join Our Team</h3>
                <p className="font-sans text-sm text-primary-foreground/65 mb-5">Build a career with purpose across 20+ ethical, halal industries.</p>
                <a href="/careers" className="inline-flex items-center bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-10 px-6 hover:bg-secondary/90 transition-colors">
                  View Careers
                </a>
              </div>
              <div className="p-8 bg-card border border-primary/10 text-center">
                <Landmark className="w-6 h-6 text-secondary mx-auto mb-4" />
                <h3 className="font-serif text-xl text-primary mb-2">Partner or Invest</h3>
                <p className="font-sans text-sm text-primary/60 mb-5">Explore Shariah-compliant partnership and investment opportunities.</p>
                <a href="/get-involved" className="inline-flex items-center border border-primary/20 text-primary font-sans text-xs font-bold uppercase tracking-widest h-10 px-6 hover:border-secondary transition-colors">
                  Get Involved
                </a>
              </div>
              <div className="p-8 bg-card border border-primary/10 text-center">
                <Mail className="w-6 h-6 text-secondary mx-auto mb-4" />
                <h3 className="font-serif text-xl text-primary mb-2">Get in Touch</h3>
                <p className="font-sans text-sm text-primary/60 mb-5">Niketon Bazaar, Dhaka-1212, Bangladesh · help@themuslim.company</p>
                <a href="/contact" className="inline-flex items-center border border-primary/20 text-primary font-sans text-xs font-bold uppercase tracking-widest h-10 px-6 hover:border-secondary transition-colors">
                  Contact Us
                </a>
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
