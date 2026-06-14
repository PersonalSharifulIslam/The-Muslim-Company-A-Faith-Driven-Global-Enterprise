import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Shield, Scale, Heart, TreePine, Users, BookOpen, Globe2, Landmark, HandHeart, Leaf } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function TransparencyPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    document.title = "Transparency & Accountability — The Muslim Company";

    // Organization Schema — consistent across all pages
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
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": 10 },
      "address": { "@type": "PostalAddress", "streetAddress": "Niketon Bazaar", "addressLocality": "Dhaka", "postalCode": "1212", "addressCountry": "BD" },
      "sameAs": ["https://www.facebook.com/TheMuslimCompany", "https://www.instagram.com/officialTheMuslimCompany", "https://www.youtube.com/@TheMuslimCompany", "https://www.linkedin.com/company/themuslimcompany", "https://x.com/officialtmchq", "https://www.crunchbase.com/organization/the-muslim-company"]
    };
    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.setAttribute("data-org-schema", "true");
    orgScript.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgScript);
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "The Muslim Company's commitment to transparency, ethical governance, and accountability. Explore our corporate policies, values, and operational standards.");
    const _ogt_d = document.querySelector('meta[property="og:description"]');
    if (_ogt_d) _ogt_d.setAttribute('content', "The Muslim Company's commitment to transparency, ethical governance, and accountability. Explore our corporate policies, values, and operational standards.");
    const _can = document.querySelector('link[rel="canonical"]');
    if (_can) _can.setAttribute('href', 'https://www.themuslim.company/transparency');
    else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = 'https://www.themuslim.company/transparency'; document.head.appendChild(_cl); }
    const _ogu_pg = document.querySelector('meta[property="og:url"]');
    if (_ogu_pg) _ogu_pg.setAttribute('content', 'https://www.themuslim.company/transparency');
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) _rob.setAttribute('content', 'index, follow');
    else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) _ogi.setAttribute('content', 'https://www.themuslim.company/og-transparency.png');
    else {
      const _m = document.createElement('meta'); _m.setAttribute('property', 'og:image');
      _m.setAttribute('content', 'https://www.themuslim.company/og-transparency.png'); document.head.appendChild(_m);
    }
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) _twi.setAttribute('content', 'https://www.themuslim.company/og-transparency.png');
    else {
      const _t = document.createElement('meta'); _t.setAttribute('name', 'twitter:image');
      _t.setAttribute('content', 'https://www.themuslim.company/og-transparency.png'); document.head.appendChild(_t);
    }
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", "The Muslim Company's commitment to full transparency — charity distribution, zakat, humanitarian impact, governance, and financial ethics — all accountable to Allah and humanity.");
    const ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", "Transparency & Accountability — The Muslim Company");
    const ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute("content", "Full transparency in charity, zakat, humanitarian impact, governance, and ethical finance.");

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "Transparency", "item": "https://www.themuslim.company/transparency" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Transparency & Accountability — The Muslim Company",
        "description": "The Muslim Company's full transparency report on charity, zakat, governance, and ethical operations.",
        "url": "https://www.themuslim.company/transparency",
        "publisher": { "@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company" }
      }
    ];

    document.querySelectorAll("script[data-page-schema]").forEach(el => el.remove());
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
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Accountability</p>
              <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-6 leading-tight max-w-3xl">
                We Account to Allah First. Then to Humanity.
              </h1>
              <p className="font-sans text-base text-primary-foreground/60 max-w-2xl leading-relaxed mb-8">
                Transparency is not a corporate obligation for The Muslim Company — it is a divine one. Every dirham, every decision, and every action will be presented before Allah on the Day of Judgment. This page reflects our commitment to being answerable, honest, and accountable in all that we do.
              </p>
              <div className="border-l-4 border-secondary pl-6 py-1">
                <p className="font-serif text-lg italic text-primary-foreground/80 leading-relaxed">
                  "Indeed, Allah commands you to render trusts to whom they are due and when you judge between people to judge with justice."
                </p>
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mt-3">— Quran 4:58</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PILLARS ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Our Commitment</p>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-10 max-w-3xl leading-tight">
                Six pillars of accountability that govern everything The Muslim Company does.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: <Landmark className="w-5 h-5" />, title: "Financial Transparency", desc: "All revenue, expenditure, profit distribution, zakat, and charitable giving fully documented and publicly summarized." },
                { icon: <HandHeart className="w-5 h-5" />, title: "Charitable Accountability", desc: "10% of monthly net profit goes to charity. Every recipient, amount, and cause is recorded and reported." },
                { icon: <Scale className="w-5 h-5" />, title: "Governance Integrity", desc: "Supreme Shariah Board oversight on all major decisions. No action proceeds without ethical and Islamic review." },
                { icon: <Users className="w-5 h-5" />, title: "Worker Welfare Reporting", desc: "Annual reports on employee welfare, fair wages, maternity leave, pension provision, and working conditions." },
                { icon: <TreePine className="w-5 h-5" />, title: "Environmental Stewardship", desc: "Carbon impact, reforestation efforts, waste reduction, and ecological restoration activities publicly reported." },
                { icon: <Shield className="w-5 h-5" />, title: "Ethical Compliance", desc: "Annual Shariah audit, external ethics review, and public declaration of any violations and corrections made." },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 border border-primary/10 bg-card">
                  <div className="text-secondary mb-4">{item.icon}</div>
                  <h3 className="font-serif text-lg text-primary mb-2">{item.title}</h3>
                  <p className="font-sans text-xs text-primary/55 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CHARITY ── */}
        <section className="py-20 px-6 lg:px-12 bg-primary border-b border-primary-foreground/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Charitable Giving</p>
              <p className="font-serif text-2xl text-primary-foreground mb-10 max-w-2xl">
                Giving is not optional — it is woven into the financial DNA of The Muslim Company.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  { value: "10%", label: "of net profit every month", sub: "Allocated to charity and humanitarian causes before any executive bonus or dividend distribution." },
                  { value: "Zakat", label: "calculated annually", sub: "Full zakat on all eligible assets calculated by a qualified Shariah scholar and distributed by year end." },
                  { value: "Beyond", label: "obligatory giving", sub: "Additional sadaqah, waqf contributions, and emergency humanitarian funds activated when needed." },
                ].map((stat, i) => (
                  <div key={i} className="p-6 border border-primary-foreground/15 bg-primary-foreground/5">
                    <p className="font-serif text-4xl text-secondary mb-2">{stat.value}</p>
                    <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/50 mb-3">{stat.label}</p>
                    <p className="font-sans text-xs text-primary-foreground/50 leading-relaxed">{stat.sub}</p>
                  </div>
                ))}
              </div>
              <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/40 mb-4">Charitable causes include:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  "Mosques & Madrasas", "Education Scholarships", "Healthcare Support", "Orphan Care",
                  "Widow Support", "Disaster Relief", "Poverty Alleviation", "Community Development",
                  "Clean Water Access", "Refugee Assistance", "Food Security Programs", "Waqf Endowments"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 font-sans text-xs text-primary-foreground/60">
                    <Check className="w-3 h-3 text-secondary flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FINANCIAL ETHICS ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Financial Ethics</p>
              <p className="font-serif text-2xl text-primary mb-8 max-w-2xl">
                Our financial system is built on what Allah permitted — and firmly closed to what He prohibited.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/40 mb-4">What We Practice</p>
                  <div className="space-y-3">
                    {[
                      "Profit-and-loss sharing as the foundation of all investment",
                      "Transparent contracts with zero hidden fees or clauses",
                      "Fair wages paid on time — the Prophet ﷺ commanded this",
                      "Annual Shariah audit of all financial products and operations",
                      "Refund delay compensation — customer funds are amanah",
                      "Published maximum retail prices to prevent exploitation",
                      "External independent financial audit annually",
                      "Full tax and VAT compliance in all jurisdictions",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <p className="font-sans text-sm text-primary/70">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/40 mb-4">What We Prohibit</p>
                  <div className="space-y-3">
                    {[
                      "Riba (interest) in any form — buying, selling, or investing",
                      "Bribery, corruption, or unethical financial influence",
                      "Deceptive marketing or misleading product claims",
                      "Participation in gambling, speculation, or haram industries",
                      "Exploitation of workers, customers, or suppliers",
                      "Price manipulation during crisis or artificial scarcity",
                      "Haram investment regardless of financial return",
                      "Off-book transactions or financial concealment",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-0.5 bg-primary/30 rounded" />
                        </div>
                        <p className="font-sans text-sm text-primary/50">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── GOVERNANCE ── */}
        <section className="py-20 px-6 lg:px-12 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Governance Transparency</p>
              <p className="font-serif text-2xl text-primary mb-8 max-w-2xl">
                Governance is not a boardroom formality — it is an Islamic obligation of the highest order.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Supreme Shariah Board",
                    desc: "An independent board of qualified Islamic scholars reviews all major decisions. No product, service, investment, or partnership proceeds without board approval. The board may revoke approval if future evidence reveals harm.",
                  },
                  {
                    title: "Annual Public Report",
                    desc: "TMC publishes annual summaries covering: revenue overview, zakat and charity distribution, humanitarian activities, governance updates, environmental projects, and worker welfare outcomes.",
                  },
                  {
                    title: "Internal Ethics Division",
                    desc: "A confidential internal division monitors compliance, investigates ethical concerns, and maintains whistleblower protection. Reports directly to the founder — insulated from commercial pressure.",
                  },
                  {
                    title: "Anti-Corruption Policy",
                    desc: "Zero tolerance for bribery at any level. Any confirmed corruption results in immediate termination and, where appropriate, legal action. No exceptions for seniority or commercial importance.",
                  },
                ].map((item, i) => (
                  <div key={i} className="p-6 border border-primary/10 bg-background">
                    <h3 className="font-serif text-lg text-primary mb-3">{item.title}</h3>
                    <p className="font-sans text-sm text-primary/60 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WORKER WELFARE ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Worker Welfare</p>
              <p className="font-serif text-2xl text-primary mb-8 max-w-2xl">
                Workers are not resources. They are human beings — and they carry rights before Allah.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                  { value: "1.5 Yrs", label: "Maternity Leave" },
                  { value: "30%", label: "Salary During Leave" },
                  { value: "15 Yrs", label: "Pension Threshold" },
                  { value: "Zero", label: "Tolerance for Humiliation" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-5 border border-primary/10">
                    <p className="font-serif text-3xl text-secondary mb-1">{stat.value}</p>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Fair and competitive salaries reviewed annually",
                  "Safe and dignified working environments",
                  "Prayer facilities and Jumu'ah scheduling",
                  "Training and development opportunities for all",
                  "Family welfare programs including healthcare and education support",
                  "Emergency financial assistance for employees in crisis",
                  "Separate and privacy-respecting facilities for women",
                  "Worker loyalty archive — every contributor honored",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="font-sans text-sm text-primary/70">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ENVIRONMENT ── */}
        <section className="py-20 px-6 lg:px-12 bg-primary border-b border-primary-foreground/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Environmental Accountability</p>
              <p className="font-serif text-2xl text-primary-foreground mb-8 max-w-2xl">
                The earth is a trust from Allah. We are answerable for how we treat it.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { icon: <Leaf className="w-5 h-5" />, title: "Carbon Reduction", desc: "Commitment to reducing carbon footprint across all operations. Transition to renewable energy across TMC facilities." },
                  { icon: <TreePine className="w-5 h-5" />, title: "Reforestation", desc: "Active tree plantation and ecological restoration programs. Target: one million trees as first milestone." },
                  { icon: <Globe2 className="w-5 h-5" />, title: "No Intentional Destruction", desc: "No TMC project, facility, or operation will intentionally damage ecosystems, waterways, or wildlife habitats." },
                ].map((item, i) => (
                  <div key={i} className="p-6 border border-primary-foreground/15 bg-primary-foreground/5">
                    <div className="text-secondary mb-3">{item.icon}</div>
                    <h3 className="font-serif text-base text-primary-foreground mb-2">{item.title}</h3>
                    <p className="font-sans text-xs text-primary-foreground/50 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ANNUAL REPORT ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10 bg-card">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Annual Transparency Report</p>
              <p className="font-serif text-2xl text-primary mb-6 max-w-2xl">
                When operational, TMC will publish annual reports covering all aspects of our ethical operations.
              </p>
              <div className="p-6 border border-primary/10 bg-background mb-6">
                <p className="font-sans text-xs tracking-widest uppercase text-primary/40 mb-4">Annual reports will include:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Revenue and expenditure summary",
                    "Zakat calculation and distribution details",
                    "Monthly charity disbursement breakdown",
                    "Humanitarian activities and beneficiary numbers",
                    "Shariah board audit findings",
                    "Worker welfare metrics and improvements",
                    "Environmental impact assessment",
                    "Tax and VAT compliance confirmation",
                    "Governance violations (if any) and corrective actions",
                    "Waqf and endowment fund status",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                      <p className="font-sans text-sm text-primary/65">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 border border-secondary/30 bg-secondary/5">
                <p className="font-sans text-xs text-primary/60 leading-relaxed">
                  <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">Note — </span>
                  The Muslim Company was founded in January 2025 and is currently in its development and establishment phase. Full operational transparency reports will be published once commercial operations commence. This page reflects our constitutional commitments and ethical framework that govern all future reporting.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CLOSING QUOTE ── */}
        <section className="py-24 px-6 lg:px-12 bg-primary">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-6">Our Final Accountability</p>
              <blockquote className="font-serif text-2xl md:text-3xl text-primary-foreground/85 italic leading-relaxed mb-6">
                "Institutions are not judged only by their profits. They are judged by their honesty, their justice, their care for people, and their answerable relationship with their Creator."
              </blockquote>
              <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mb-10">— The Muslim Company</p>
              <a href="mailto:help@themuslim.company?subject=Transparency Inquiry">
                <button className="bg-secondary text-primary hover:bg-secondary/90 font-sans text-xs font-bold uppercase tracking-widest h-12 px-8 transition-colors inline-flex items-center gap-2">
                  Contact Our Ethics Team <ArrowUpRight className="w-4 h-4" />
                </button>
              </a>
            </motion.div>
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}
