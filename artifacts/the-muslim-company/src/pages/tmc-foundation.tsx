import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  HandHeart, Heart, TreePine, Globe2, Users, Droplets,
  GraduationCap, Stethoscope, ShieldCheck, Mail, ArrowUpRight
} from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const PILLARS = [
  { icon: <HandHeart className="w-5 h-5" />, title: "Humanitarian Relief", desc: "Emergency disaster response, refugee assistance, and food security programs for the most vulnerable communities." },
  { icon: <Users className="w-5 h-5" />, title: "Orphan & Widow Care", desc: "Sponsorship, housing support, and long-term welfare programs for orphans and widows across our operating regions." },
  { icon: <Stethoscope className="w-5 h-5" />, title: "Healthcare Access", desc: "Medical camps, essential treatment support, and health education for underserved populations." },
  { icon: <GraduationCap className="w-5 h-5" />, title: "Education & Scholarships", desc: "Scholarships, school supplies, and literacy programs to break cycles of poverty through knowledge." },
  { icon: <TreePine className="w-5 h-5" />, title: "Environmental Stewardship", desc: "Reforestation, renewable energy adoption, and wildlife protection — honoring the earth as a trust from Allah." },
  { icon: <Droplets className="w-5 h-5" />, title: "Clean Water & Sanitation", desc: "Wells, water purification, and sanitation infrastructure for communities without reliable access." },
];

const IMPACT_AREAS = [
  "Disaster relief response within 72 hours of qualifying emergencies",
  "Orphan sponsorship covering education, healthcare, and housing",
  "Community water wells in underserved rural areas",
  "Reforestation and ecological restoration projects",
  "Medical camps providing free consultations and essential medicine",
  "Scholarship funding for students unable to afford education",
];

export default function TMCFoundationPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    document.title = "The Muslim Company Foundation — Humanitarian & Environmental Arm";

    const desc = "The Muslim Company Foundation is the humanitarian and environmental arm of The Muslim Company — funded by zakat, sadaqah, and 10% of monthly net profit, serving humanity and protecting creation across every country we operate in.";

    const upsertMeta = (selector: string, attr: string, value: string, make: () => HTMLElement) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
      else document.head.appendChild(make());
    };

    upsertMeta('meta[name="description"]', 'content', desc, () => { const m = document.createElement('meta'); m.name = 'description'; m.content = desc; return m; });
    upsertMeta('meta[property="og:title"]', 'content', "The Muslim Company Foundation", () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:title'); m.setAttribute('content', "The Muslim Company Foundation"); return m; });
    upsertMeta('meta[property="og:description"]', 'content', desc, () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:description'); m.setAttribute('content', desc); return m; });
    upsertMeta('meta[property="og:url"]', 'content', 'https://www.themuslim.company/the-muslim-company-foundation', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:url'); m.setAttribute('content', 'https://www.themuslim.company/the-muslim-company-foundation'); return m; });
    upsertMeta('meta[name="twitter:title"]', 'content', "The Muslim Company Foundation", () => { const m = document.createElement('meta'); m.setAttribute('name', 'twitter:title'); m.setAttribute('content', "The Muslim Company Foundation"); return m; });
    upsertMeta('meta[name="twitter:description"]', 'content', desc, () => { const m = document.createElement('meta'); m.setAttribute('name', 'twitter:description'); m.setAttribute('content', desc); return m; });
    upsertMeta('meta[name="robots"]', 'content', 'index, follow', () => { const m = document.createElement('meta'); m.name = 'robots'; m.content = 'index, follow'; return m; });

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://www.themuslim.company/the-muslim-company-foundation');
    else { const l = document.createElement('link'); l.rel = 'canonical'; l.setAttribute('href', 'https://www.themuslim.company/the-muslim-company-foundation'); document.head.appendChild(l); }

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "The Muslim Company Foundation", "item": "https://www.themuslim.company/the-muslim-company-foundation" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "The Muslim Company Foundation",
        "description": desc,
        "url": "https://www.themuslim.company/the-muslim-company-foundation",
        "parentOrganization": { "@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company" },
        "areaServed": ["Bangladesh", "India", "Pakistan", "United Arab Emirates", "Nigeria", "Ghana", "Gambia"],
        "logo": "https://www.themuslim.company/favicon.png"
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <div className="flex items-center gap-2 mb-4">
                <HandHeart className="w-5 h-5 text-secondary" />
                <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary">The Muslim Company Foundation</p>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-6 leading-tight max-w-3xl">
                Serving Humanity, Protecting Creation — For the Sake of Allah
              </h1>
              <p className="font-sans text-base text-primary-foreground/60 max-w-2xl leading-relaxed mb-8">
                The Muslim Company Foundation is the dedicated humanitarian and environmental arm of The Muslim Company — channeling zakat, sadaqah, waqf, and 10% of monthly net profit directly into relief, education, healthcare, orphan care, and environmental restoration across every country we operate in.
              </p>
              <div className="border-l-4 border-secondary pl-6 py-1">
                <p className="font-serif text-lg italic text-primary-foreground/80 leading-relaxed">
                  "And they give food, in spite of love for it, to the needy, the orphan, and the captive."
                </p>
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mt-3">— Quran 76:8</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Our Purpose</p>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-8 max-w-3xl leading-tight">
                One institution, two missions: build ethical enterprise, and serve those in need.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="font-sans text-sm text-primary/70 leading-relaxed">
                  Every sector of The Muslim Company — from technology to manufacturing to finance — exists not only to operate ethically, but to fund a permanent channel of good. The Foundation is that channel: an interdisciplinary effort spanning humanitarian relief, orphan and widow care, healthcare access, education, and environmental restoration.
                </p>
                <p className="font-sans text-sm text-primary/70 leading-relaxed">
                  The Prophet ﷺ said: <span className="italic">"The best of people are those most beneficial to people."</span> Guided by this model, the Foundation operates with full accountability under the company's Supreme Shariah Board and publishes its activity through The Muslim Company's transparency reporting.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PILLARS ── */}
        <section className="py-20 px-6 lg:px-12 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Areas of Work</p>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-10 max-w-3xl leading-tight">
                Six pillars through which the Foundation serves humanity and creation.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PILLARS.map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 border border-primary/10 bg-background">
                  <div className="text-secondary mb-4">{item.icon}</div>
                  <h3 className="font-serif text-lg text-primary mb-2">{item.title}</h3>
                  <p className="font-sans text-xs text-primary/65 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FUNDING MODEL ── */}
        <section className="py-20 px-6 lg:px-12 bg-primary border-b border-primary-foreground/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">How It Is Funded</p>
              <p className="font-serif text-2xl text-primary-foreground mb-10 max-w-2xl">
                Giving is not optional — it is structurally built into the company's financial model.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { value: "10%", label: "of net profit every month", sub: "Directed to the Foundation before any executive bonus or dividend distribution." },
                  { value: "Zakat", label: "calculated annually", sub: "Full zakat on all eligible company assets, distributed by a qualified Shariah scholar." },
                  { value: "Waqf", label: "& voluntary sadaqah", sub: "Endowment contributions and additional voluntary giving activated for emergencies." },
                ].map((stat, i) => (
                  <div key={i} className="p-6 border border-primary-foreground/15 bg-primary-foreground/5">
                    <p className="font-serif text-4xl text-secondary mb-2">{stat.value}</p>
                    <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/50 mb-3">{stat.label}</p>
                    <p className="font-sans text-xs text-primary-foreground/50 leading-relaxed">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── IMPACT AREAS (honest, no fabricated stats — company is newly founded) ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Impact & Reach</p>
              <p className="font-serif text-2xl text-primary mb-6 max-w-2xl">
                Real relief work, already reaching people across multiple countries.
              </p>
              <div className="p-6 border border-primary/10 bg-card mb-6">
                <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-4">Where we've helped:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Bangladesh", "Pakistan", "Nigeria", "Ghana", "Gambia", "and other African nations"].map((c, i) => (
                    <span key={i} className="font-sans text-xs tracking-wide bg-background border border-primary/10 text-primary/65 px-3 py-1.5">{c}</span>
                  ))}
                </div>
                <p className="font-sans text-sm text-primary/65 leading-relaxed">
                  Through The Muslim Company Foundation, we have provided humanitarian relief and community support to people
                  across these countries. This work has been made possible in part by individuals from multiple countries
                  who have personally donated directly to support it — a trust we take as an amanah in its own right.
                </p>
              </div>
              <div className="p-6 border border-primary/10 bg-card mb-6">
                <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-4">Our impact areas include:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {IMPACT_AREAS.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                      <p className="font-sans text-sm text-primary/65">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 border border-secondary/30 bg-secondary/5">
                <p className="font-sans text-xs text-primary/60 leading-relaxed">
                  <span className="text-secondary font-bold uppercase tracking-widest text-xs">Note — </span>
                  The Muslim Company was founded in January 2025, and the Foundation is formalizing this ongoing
                  humanitarian work under a single accountable structure. Verified, detailed case studies and beneficiary
                  numbers for each project will be published here and in our <a href="/transparency" className="text-secondary hover:underline">Transparency Reports</a> as documentation is finalized.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── DONATE / SUPPORT ── */}
        <section className="py-20 px-6 lg:px-12 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Support the Foundation</p>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-6 max-w-2xl leading-tight">
                Formal individual-donor channels are being finalized. In the meantime, reach out directly.
              </p>
              <p className="font-sans text-sm text-primary/70 leading-relaxed max-w-2xl mb-8">
                Organizations, partners, and individuals interested in supporting or collaborating with The Muslim Company Foundation — through funding, in-kind donations, volunteering, or project partnership — are welcome to contact us directly. We will never ask for payment through unofficial or unverified channels.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:help@themuslim.company" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-primary font-sans text-xs uppercase tracking-widest font-bold hover:bg-secondary/90 transition-colors">
                  <Mail className="w-4 h-4" /> help@themuslim.company
                </a>
                <a href="/get-involved" className="inline-flex items-center gap-2 px-6 py-3 border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest hover:border-secondary/50 transition-colors">
                  Get Involved <ArrowUpRight className="w-4 h-4" />
                </a>
                <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest hover:border-secondary/50 transition-colors">
                  Contact Us <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── GOVERNANCE & TRUST ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-5 h-5 text-secondary" />
                    <h3 className="font-serif text-lg text-primary">Full Accountability</h3>
                  </div>
                  <p className="font-sans text-sm text-primary/65 leading-relaxed">
                    Every Foundation activity is reviewed by the Supreme Shariah Board and reported publicly through The Muslim Company's <a href="/transparency" className="text-secondary hover:underline">annual transparency reports</a> — covering fund distribution, zakat calculation, and humanitarian outcomes.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe2 className="w-5 h-5 text-secondary" />
                    <h3 className="font-serif text-lg text-primary">Global Reach</h3>
                  </div>
                  <p className="font-sans text-sm text-primary/65 leading-relaxed">
                    The Foundation extends across every country where The Muslim Company operates and has provided relief across Bangladesh, India, Pakistan, the United Arab Emirates, Nigeria, Ghana, and Gambia — with support from donors across multiple countries and more regions planned as the company grows.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CLOSING QUOTE ── */}
        <section className="py-24 px-6 lg:px-12 bg-primary">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <Heart className="w-8 h-8 text-secondary mx-auto mb-6" />
              <p className="font-serif text-2xl md:text-3xl text-primary-foreground italic leading-relaxed mb-6">
                "Whoever saves a life, it is as if he had saved all of mankind."
              </p>
              <p className="font-sans text-xs tracking-widest uppercase text-secondary/60">— Quran 5:32</p>
            </motion.div>
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}
