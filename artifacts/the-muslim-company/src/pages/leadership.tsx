import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Handshake, ArrowUpRight } from "lucide-react";
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

type PersonEntry = {
  name: string;
  role: string;
  bio: string;
  joined: string;
  href?: string;
};

const BOARD_MEMBERS: PersonEntry[] = [
  {
    name: "Shariful Islam",
    role: "Founder & CEO",
    bio: "Founder, Chairman, Managing Director, and CEO of The Muslim Company. A Bangladeshi electrical engineer and entrepreneur leading the company's overall vision, strategy, and Shariah-compliant operations across all sectors.",
    joined: "2025",
    href: "/founder",
  },
  {
    name: "Edward Henry Philips",
    role: "Co-founder",
    bio: "Co-founder of The Muslim Company, contributing to the company's founding direction and long-term strategic development.",
    joined: "2025",
  },
];

const STRATEGIC_PARTNERS: PersonEntry[] = [
  {
    name: "Jason Barnard",
    role: "Website Design, SEO & Analysis",
    bio: "CEO and Founder of Kalicube. Leads website design, search engine optimization strategy, and digital visibility analysis for The Muslim Company.",
    joined: "2025",
  },
  {
    name: "Ameer Al-Khatahtbeh",
    role: "Media, Strategy & Collaboration",
    bio: "Founder & Editor-in-Chief of Muslim, and a Forbes 30 Under 30 honoree. Leads media relations, strategic direction, and cross-organizational collaboration for The Muslim Company.",
    joined: "2025",
  },
];

export default function LeadershipPage() {
  const [isBot] = useState(isCrawlerUA);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const title = "Board of Directors, Investors & Partners | The Muslim Company";
    const description =
      "Meet the Board of Directors, investors, and strategic partners of The Muslim Company — the leadership team and outside collaborators guiding our faith-driven global conglomerate across 20+ sectors.";
    const url = "https://www.themuslim.company/leadership";

    document.title = title;

    const upsert = (selector: string, attr: string, value: string, make: () => HTMLElement) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
      else document.head.appendChild(make());
    };

    upsert('meta[name="description"]', "content", description, () => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); m.setAttribute("content", description); return m;
    });
    upsert('link[rel="canonical"]', "href", url, () => {
      const l = document.createElement("link"); l.setAttribute("rel", "canonical"); l.setAttribute("href", url); return l;
    });
    upsert('meta[property="og:title"]', "content", title, () => {
      const m = document.createElement("meta"); m.setAttribute("property", "og:title"); m.setAttribute("content", title); return m;
    });
    upsert('meta[property="og:description"]', "content", description, () => {
      const m = document.createElement("meta"); m.setAttribute("property", "og:description"); m.setAttribute("content", description); return m;
    });
    upsert('meta[property="og:url"]', "content", url, () => {
      const m = document.createElement("meta"); m.setAttribute("property", "og:url"); m.setAttribute("content", url); return m;
    });
    upsert('meta[property="og:image"]', "content", "https://www.themuslim.company/opengraph.jpg", () => {
      const m = document.createElement("meta"); m.setAttribute("property", "og:image"); m.setAttribute("content", "https://www.themuslim.company/opengraph.jpg"); return m;
    });
    upsert('meta[name="twitter:title"]', "content", title, () => {
      const m = document.createElement("meta"); m.setAttribute("name", "twitter:title"); m.setAttribute("content", title); return m;
    });
    upsert('meta[name="twitter:description"]', "content", description, () => {
      const m = document.createElement("meta"); m.setAttribute("name", "twitter:description"); m.setAttribute("content", description); return m;
    });
    upsert('meta[name="twitter:image"]', "content", "https://www.themuslim.company/opengraph.jpg", () => {
      const m = document.createElement("meta"); m.setAttribute("name", "twitter:image"); m.setAttribute("content", "https://www.themuslim.company/opengraph.jpg"); return m;
    });

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());

    const ORG_ID = "https://www.themuslim.company/#organization";
    const SAME_AS: Record<string, string[]> = {
      "Jason Barnard": ["https://kalicube.com", "https://jasonbarnard.com"],
      "Ameer Al-Khatahtbeh": ["https://muslim.co", "https://x.com/ameer"],
    };

    const personSchema = (p: PersonEntry) => {
      const entry: any = {
        "@type": "Person",
        "name": p.name,
        "jobTitle": p.role,
        "description": p.bio,
        "worksFor": { "@type": "Organization", "@id": ORG_ID, "name": "The Muslim Company", "url": "https://www.themuslim.company" },
      };
      if (SAME_AS[p.name]) entry.sameAs = SAME_AS[p.name];
      return entry;
    };

    const allPeople = [...BOARD_MEMBERS, ...STRATEGIC_PARTNERS];

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "Board of Directors, Investors & Partners", "item": url }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": title,
        "description": description,
        "url": url,
        "isPartOf": { "@type": "Organization", "@id": ORG_ID, "name": "The Muslim Company", "url": "https://www.themuslim.company" },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": allPeople.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": personSchema(p),
          })),
        },
      },
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
                <Users className="w-5 h-5 text-secondary" />
                <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary">Leadership</p>
              </div>
              <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-6 leading-tight max-w-3xl">
                Board of Directors
              </h1>
              <p className="font-sans text-base text-primary-foreground/60 max-w-2xl leading-relaxed">
                The people guiding The Muslim Company — our Board of Directors, the investors backing our growth, and the strategic partners collaborating with us across sectors.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 1: BOARD MEMBERS ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-secondary" />
                <h2 className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold">Board Members</h2>
              </div>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-10 max-w-3xl leading-tight">
                The founding leadership of The Muslim Company.
              </p>
            </motion.div>
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BOARD_MEMBERS.map((p, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 border border-primary/10 bg-card">
                  <h3 className="font-serif text-xl text-primary mb-1">
                    {p.href ? <a href={p.href} className="hover:text-secondary transition-colors">{p.name}</a> : p.name}
                  </h3>
                  <p className="font-sans text-xs tracking-widest uppercase text-secondary mb-1">{p.role}</p>
                  <p className="font-sans text-xs text-primary/40 mb-4">Joined {p.joined}</p>
                  <p className="font-sans text-sm text-primary/65 leading-relaxed">{p.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 2: INVESTORS ── */}
        <section className="py-20 px-6 lg:px-12 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-secondary" />
                <h2 className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold">Investors</h2>
              </div>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-6 max-w-3xl leading-tight">
                Backing our long-term, ethical growth.
              </p>
              <div className="p-6 border border-secondary/30 bg-secondary/5 max-w-2xl">
                <p className="font-sans text-sm text-primary/60 leading-relaxed">
                  The Muslim Company is privately held and self-funded in its early stage. Investor relationships will be announced here as they are formally confirmed.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 3: STRATEGIC PARTNERS ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <div className="flex items-center gap-2 mb-3">
                <Handshake className="w-4 h-4 text-secondary" />
                <h2 className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold">Strategic Partners</h2>
              </div>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-10 max-w-3xl leading-tight">
                Outside expertise collaborating with The Muslim Company.
              </p>
            </motion.div>
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STRATEGIC_PARTNERS.map((p, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 border border-primary/10 bg-card">
                  <h3 className="font-serif text-xl text-primary mb-1">{p.name}</h3>
                  <p className="font-sans text-xs tracking-widest uppercase text-secondary mb-1">{p.role}</p>
                  <p className="font-sans text-xs text-primary/40 mb-4">Joined {p.joined}</p>
                  <p className="font-sans text-sm text-primary/65 leading-relaxed">{p.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className="py-20 px-6 lg:px-12 bg-card text-center">
          <div className="container mx-auto max-w-2xl">
            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <a href="/governance" className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-secondary hover:underline">
                Read our Governance Framework <ArrowUpRight className="w-3 h-3" />
              </a>
            </motion.div>
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}
