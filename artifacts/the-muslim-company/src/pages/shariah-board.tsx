import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ScrollText, ShieldCheck, Scale, Users, GraduationCap, ArrowUpRight, Gavel, BookOpen
} from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { isCrawlerUA } from "@/lib/isCrawler";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const SCHOLARS = [
  "Dr. Zakir Naik",
  "Dr. Fariq Naik",
  "Engineer Ali Mirza",
  "Dr. Bilal Philips",
  "Sheikh Yusuf Estes",
  "Dr. Muhammad Salah",
  "Sheikh Assim Al-Hakeem",
  "Mufti Hassam Usmani",
  "Mufti Muhammad Naveed",
];

const PRINCIPLES = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Independent of Management", desc: "The Board is designed to sit outside the company's management chain, so no executive, investor, or department can pressure a ruling or bypass a rejection." },
  { icon: <Scale className="w-5 h-5" />, title: "Binding, Not Advisory", desc: "Once formally seated, the Board's decisions are binding — a rejected product, contract, or financial structure cannot be pushed through by management override." },
  { icon: <Gavel className="w-5 h-5" />, title: "Standing Veto Power", desc: "Approval is never permanent by default. If new evidence later shows harm, the Board can revisit, suspend, or withdraw an earlier approval at any time." },
  { icon: <ScrollText className="w-5 h-5" />, title: "Constitutionally Protected", desc: "The Board's authority is written into the company's permanent constitutional framework, so it cannot be quietly removed or weakened by a future leadership change." },
];

export default function ShariahBoardPage() {
  const [isBot] = useState(isCrawlerUA);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    document.title = "Our Shariah Board — Scholars Guiding The Muslim Company";

    const shortDesc = "The Supreme Shariah Board of The Muslim Company — scholars ensuring full Shariah compliance across every product, service, operation & finance.";
    const longDesc = "Meet the Supreme Shariah Board of The Muslim Company — the Islamic scholars who review and approve every product, service, operation, and financial decision across all 20+ sectors, ensuring complete Shariah compliance from end to end.";

    const upsertMeta = (selector: string, attr: string, value: string, make: () => HTMLElement) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
      else document.head.appendChild(make());
    };

    upsertMeta('meta[name="description"]', 'content', shortDesc, () => { const m = document.createElement('meta'); m.name = 'description'; m.content = shortDesc; return m; });
    upsertMeta('meta[property="og:title"]', 'content', "Our Shariah Board — Scholars Guiding The Muslim Company", () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:title'); m.setAttribute('content', "Our Shariah Board — Scholars Guiding The Muslim Company"); return m; });
    upsertMeta('meta[property="og:description"]', 'content', longDesc, () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:description'); m.setAttribute('content', longDesc); return m; });
    upsertMeta('meta[property="og:url"]', 'content', 'https://www.themuslim.company/shariah-board', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:url'); m.setAttribute('content', 'https://www.themuslim.company/shariah-board'); return m; });
    upsertMeta('meta[name="twitter:title"]', 'content', "Our Shariah Board — Scholars Guiding The Muslim Company", () => { const m = document.createElement('meta'); m.setAttribute('name', 'twitter:title'); m.setAttribute('content', "Our Shariah Board — Scholars Guiding The Muslim Company"); return m; });
    upsertMeta('meta[name="twitter:description"]', 'content', longDesc, () => { const m = document.createElement('meta'); m.setAttribute('name', 'twitter:description'); m.setAttribute('content', longDesc); return m; });
    upsertMeta('meta[name="robots"]', 'content', 'index, follow', () => { const m = document.createElement('meta'); m.name = 'robots'; m.content = 'index, follow'; return m; });

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.themuslim.company/shariah-board');
    else { const l = document.createElement('link'); l.rel = 'canonical'; l.setAttribute('href', 'https://www.themuslim.company/shariah-board'); document.head.appendChild(l); }

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "Governance", "item": "https://www.themuslim.company/governance" },
          { "@type": "ListItem", "position": 3, "name": "Our Shariah Board", "item": "https://www.themuslim.company/shariah-board" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Supreme Shariah Board — The Muslim Company",
        "description": longDesc,
        "url": "https://www.themuslim.company/shariah-board",
        "parentOrganization": { "@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company" }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is The Muslim Company's Shariah Board independent from company management?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Board is designed to operate independently of company management, with binding authority to approve, reject, or later withdraw approval for any product, service, or financial structure that does not meet Shariah requirements." }
          },
          {
            "@type": "Question",
            "name": "Who is on The Muslim Company's Shariah Board?",
            "acceptedAnswer": { "@type": "Answer", "text": "The Muslim Company has held discussions with respected Islamic scholars it hopes to formally welcome to the Supreme Shariah Board as the conglomerate grows. Formal appointments and individual roles will be announced on this page once confirmed." }
          },
          {
            "@type": "Question",
            "name": "What authority does the Shariah Board have over company decisions?",
            "acceptedAnswer": { "@type": "Answer", "text": "Once formally constituted, the Board will have binding authority to review, approve, or reject any product, contract, or financial structure across all of the company's 20+ sectors — and to revisit an earlier approval if new evidence later shows harm." }
          }
        ]
      }
    ];
    schemas.forEach(schema => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-page-schema", "true");
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });

    return () => { document.querySelectorAll("script[data-page-schema]").forEach(el => el.remove()); };
  }, []);

  return (
    <SiteLayout>
      <div className="w-full bg-background text-foreground">

        {/* ── HERO ── */}
        <section className="bg-primary pt-32 pb-24 px-6 lg:px-12">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <div className="flex items-center gap-2 mb-4">
                <ScrollText className="w-5 h-5 text-secondary" />
                <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary">Our Shariah Board</p>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-6 leading-tight max-w-3xl">
                An Independent Supreme Shariah Board
              </h1>
              <p className="font-sans text-base text-primary-foreground/60 max-w-2xl leading-relaxed mb-8">
                The Muslim Company is in the process of establishing its Independent Supreme Shariah Board — a board designed to operate independently of company management, ensuring every product, service, and financial decision remains fully Shariah-compliant. We have reached out to and held discussions with respected Islamic scholars whom we hope to formally welcome to this board as our conglomerate grows.
              </p>
              <div className="border-l-4 border-secondary pl-6 py-1">
                <p className="font-serif text-lg italic text-primary-foreground/80 leading-relaxed">
                  "Are those who know equal to those who do not know? Only they will remember who are people of understanding."
                </p>
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mt-3">— Quran 39:9</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WHY INDEPENDENT ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <h2 className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Why Independence Matters</h2>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-8 max-w-3xl leading-tight">
                A board that can say no to its own company is the only kind worth trusting.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="font-sans text-sm text-primary/70 leading-relaxed">
                  Many companies attach religious scholars to their brand without giving them any real authority to reject a product or halt a launch. The Muslim Company is structuring its Shariah Board the opposite way: as a check on the company itself, not a seal of approval issued on request.
                </p>
                <p className="font-sans text-sm text-primary/70 leading-relaxed">
                  That means the Board — once formally seated — answers to Quran, Sunnah, and the Maqasid al-Shariah first, and to company convenience never. Its findings apply across every subsidiary, from Fertile Crescent Agro to The Bayt Al-Mal Bank, with no sector exempted from review.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PRINCIPLES ── */}
        <section className="py-20 px-6 lg:px-12 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <h2 className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">How the Board Will Operate</h2>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-10 max-w-3xl leading-tight">
                Four commitments that define this Board once it is formally seated.
              </p>
            </motion.div>
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRINCIPLES.map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 border border-primary/10 bg-background">
                  <div className="text-secondary mb-4">{item.icon}</div>
                  <h3 className="font-serif text-lg text-primary mb-2">{item.title}</h3>
                  <p className="font-sans text-xs text-primary/65 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── SCHOLARS IN DISCUSSION ── */}
        <section className="py-20 px-6 lg:px-12 bg-primary border-b border-primary-foreground/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <h2 className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Scholars We Are In Discussion With</h2>
              <p className="font-serif text-2xl text-primary-foreground mb-4 max-w-2xl">
                We have reached out to the following scholars and hope to formally welcome them to the Board.
              </p>
              <p className="font-sans text-sm text-primary-foreground/55 max-w-2xl mb-10">
                Formal appointments, individual roles, and confirmed credentials will be announced on this page once each is finalized.
              </p>
            </motion.div>
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCHOLARS.map((name, i) => (
                <motion.div key={i} variants={fadeIn} className="p-5 flex items-center gap-3 border border-primary-foreground/15 bg-primary-foreground/5">
                  <GraduationCap className="w-5 h-5 text-secondary shrink-0" />
                  <div>
                    <p className="font-serif text-base text-primary-foreground">{name}</p>
                    <p className="font-sans text-[11px] tracking-wide uppercase text-primary-foreground/45">In discussion — appointment pending</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── RELATED GOVERNANCE PAGES (internal linking, not duplicate content) ── */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <h2 className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Read More</h2>
              <p className="font-serif text-2xl text-primary mb-10 max-w-2xl">
                See how this Board fits into the company's wider governance and constitution.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/governance" className="p-6 border border-primary/10 bg-card hover:border-secondary/40 transition-colors group">
                  <Scale className="w-5 h-5 text-secondary mb-3" />
                  <h3 className="font-serif text-base text-primary mb-2 flex items-center gap-1">Governance Structure <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                  <p className="font-sans text-xs text-primary/60 leading-relaxed">Amanah-based leadership, Shura consultation, and the full governance model this Board operates within.</p>
                </a>
                <a href="/constitution" className="p-6 border border-primary/10 bg-card hover:border-secondary/40 transition-colors group">
                  <ScrollText className="w-5 h-5 text-secondary mb-3" />
                  <h3 className="font-serif text-base text-primary mb-2 flex items-center gap-1">Constitutional Framework <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                  <p className="font-sans text-xs text-primary/60 leading-relaxed">How the Board's intervention powers are permanently written into the company's constitution.</p>
                </a>
                <a href="/foundation" className="p-6 border border-primary/10 bg-card hover:border-secondary/40 transition-colors group">
                  <BookOpen className="w-5 h-5 text-secondary mb-3" />
                  <h3 className="font-serif text-base text-primary mb-2 flex items-center gap-1">Islamic Foundation <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                  <p className="font-sans text-xs text-primary/60 leading-relaxed">The Quranic and Prophetic basis for every ruling this Board will make.</p>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}
