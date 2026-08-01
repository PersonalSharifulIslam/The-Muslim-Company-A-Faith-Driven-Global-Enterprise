import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ShieldCheck, HandHeart, Users, ScrollText, Scale } from "lucide-react";
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

const COMPARISON = [
  {
    category: "Financial Foundation",
    conventional: "Built on interest-bearing debt and loans",
    us: "Completely riba (interest) free, Shariah-compliant financing only",
  },
  {
    category: "Profit Purpose",
    conventional: "Profit maximized for shareholders alone",
    us: "10% of monthly net profit directed to humanitarian and environmental work",
  },
  {
    category: "Ethical Oversight",
    conventional: "Typically no religious or values-based review body",
    us: "Supreme Shariah Board reviews all major business decisions",
  },
  {
    category: "Leadership Model",
    conventional: "Top-down control, limited accountability structure",
    us: "Amanah-based leadership with Shura (consultative) governance",
  },
  {
    category: "Long-Term Protection",
    conventional: "Mission can shift with new ownership or leadership",
    us: "Constitutional framework permanently protects founding mission",
  },
  {
    category: "Charity & Zakat",
    conventional: "Optional CSR, rarely structural or mandatory",
    us: "Zakat and sadaqah built into the financial model, not optional",
  },
  {
    category: "Worker Welfare",
    conventional: "Compliance-minimum labor standards",
    us: "Fair wages, extended maternity leave, pension and family welfare programs",
  },
  {
    category: "Transparency",
    conventional: "Financial disclosure often limited to legal minimums",
    us: "Public transparency reports covering finances, zakat, and governance",
  },
];

const PRINCIPLES = [
  { icon: <ScrollText className="w-5 h-5" />, title: "Rooted in Revelation", desc: "Every policy is checked against the Quran, authentic Sunnah, and the Prophetic model — not just modern business trends." },
  { icon: <Scale className="w-5 h-5" />, title: "Justice Over Profit", desc: "Growth is pursued, but never at the cost of fairness to workers, partners, customers, or the environment." },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Accountability by Design", desc: "A Supreme Shariah Board and constitutional framework — not just a mission statement — enforce ethical conduct." },
  { icon: <HandHeart className="w-5 h-5" />, title: "Built-In Generosity", desc: "Charity isn't a marketing add-on. It's a structural percentage of every month's profit, before anything else is distributed." },
  { icon: <Users className="w-5 h-5" />, title: "People Before Extraction", desc: "Employees, customers, and communities are treated as trusts (amanah) to be honored, not resources to be maximized." },
];

export default function WhyUsPage() {
  const [isBot] = useState(isCrawlerUA);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Why The Muslim Company — A Different Kind of Enterprise";

    const desc = "Why The Muslim Company is different: riba-free finance, independent Shariah Board oversight, structural charity, and a constitution protecting its ethical mission.";

    const upsertMeta = (selector: string, attr: string, value: string, make: () => HTMLElement) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
      else document.head.appendChild(make());
    };

    upsertMeta('meta[name="description"]', 'content', desc, () => { const m = document.createElement('meta'); m.name = 'description'; m.content = desc; return m; });
    upsertMeta('meta[property="og:title"]', 'content', "Why The Muslim Company", () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:title'); m.setAttribute('content', "Why The Muslim Company"); return m; });
    upsertMeta('meta[property="og:description"]', 'content', desc, () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:description'); m.setAttribute('content', desc); return m; });
    upsertMeta('meta[property="og:url"]', 'content', 'https://www.themuslim.company/why-us', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:url'); m.setAttribute('content', 'https://www.themuslim.company/why-us'); return m; });
    upsertMeta('meta[name="twitter:title"]', 'content', "Why The Muslim Company", () => { const m = document.createElement('meta'); m.setAttribute('name', 'twitter:title'); m.setAttribute('content', "Why The Muslim Company"); return m; });
    upsertMeta('meta[name="twitter:description"]', 'content', desc, () => { const m = document.createElement('meta'); m.setAttribute('name', 'twitter:description'); m.setAttribute('content', desc); return m; });
    upsertMeta('meta[name="robots"]', 'content', 'index, follow', () => { const m = document.createElement('meta'); m.name = 'robots'; m.content = 'index, follow'; return m; });

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.themuslim.company/why-us');
    else { const l = document.createElement('link'); l.rel = 'canonical'; l.setAttribute('href', 'https://www.themuslim.company/why-us'); document.head.appendChild(l); }

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "Why The Muslim Company", "item": "https://www.themuslim.company/why-us" }
      ]
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-page-schema", "true");
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);

    return () => { document.querySelectorAll("script[data-page-schema]").forEach(el => el.remove()); };
  }, []);

  return (
    <SiteLayout>
      <div className="w-full bg-background text-foreground">

        {/* ── HERO ── */}
        <section className="bg-primary pt-32 pb-24 px-6 lg:px-12">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Why The Muslim Company</p>
              <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-6 leading-tight max-w-3xl">
                A Different Kind of Enterprise, By Design
              </h1>
              <p className="font-sans text-base text-primary-foreground/75 max-w-2xl leading-relaxed">
                We are not a conventional company with a charity page bolted on. Every structural decision — from financing to leadership to profit distribution — is built from the ground up on Islamic ethical principles.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn} className="mb-10">
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">The Difference</p>
              <p className="font-serif text-2xl md:text-3xl text-primary max-w-2xl leading-tight">
                Not every business claiming "ethics" builds it into the structure. Here's what's actually different.
              </p>
            </motion.div>

            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={stagger} className="space-y-3">
              <div className="hidden md:grid grid-cols-[1fr_1.3fr_1.3fr] gap-4 px-5 pb-2">
                <p className="font-sans text-[11px] tracking-widest uppercase text-primary/40 font-bold">Area</p>
                <p className="font-sans text-[11px] tracking-widest uppercase text-primary/40 font-bold">Conventional Business</p>
                <p className="font-sans text-[11px] tracking-widest uppercase text-secondary font-bold">The Muslim Company</p>
              </div>
              {COMPARISON.map((row, i) => (
                <motion.div key={i} variants={fadeIn} className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr_1.3fr] gap-3 md:gap-4 p-5 border border-primary/10 bg-card">
                  <p className="font-serif text-base text-primary md:pt-0.5">{row.category}</p>
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-primary/30 flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-primary/60 leading-relaxed">{row.conventional}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <p className="font-sans text-sm text-primary/80 leading-relaxed">{row.us}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <p className="font-sans text-xs text-primary/40 mt-6 max-w-2xl leading-relaxed">
              "Conventional business" here refers to typical for-profit enterprise norms in general — not any specific company. Full detail on our governance and finances is available in our <a href="/governance" className="text-secondary hover:underline">Governance</a> and <a href="/transparency" className="text-secondary hover:underline">Transparency Reports</a>.
            </p>
          </div>
        </section>

        {/* ── PRINCIPLES ── */}
        <section className="py-20 px-6 lg:px-12 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">What Actually Drives This</p>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-10 max-w-3xl leading-tight">
                Five principles behind every decision we make.
              </p>
            </motion.div>
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRINCIPLES.map((p, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 border border-primary/10 bg-background">
                  <div className="text-secondary mb-4">{p.icon}</div>
                  <h3 className="font-serif text-lg text-primary mb-2">{p.title}</h3>
                  <p className="font-sans text-xs text-primary/60 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className="py-24 px-6 lg:px-12 bg-primary">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <p className="font-serif text-2xl md:text-3xl text-primary-foreground italic leading-relaxed mb-6">
                "The best of people are those most beneficial to people."
              </p>
              <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mb-10">— Prophetic tradition</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/mission" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-primary font-sans text-xs uppercase tracking-widest font-bold hover:bg-secondary/90 transition-colors">
                  Explore Our Mission
                </a>
                <a href="/careers" className="inline-flex items-center gap-2 px-6 py-3 border border-primary-foreground/25 text-primary-foreground font-sans text-xs uppercase tracking-widest hover:border-secondary/50 transition-colors">
                  Join Our Team
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}
