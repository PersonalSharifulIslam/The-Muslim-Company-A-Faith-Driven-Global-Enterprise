import { useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Quote, Linkedin, Twitter, Globe2, Award } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 font-sans text-sm text-primary/70">
          <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InlineQuote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <div className="border-l-4 border-secondary pl-5 py-1 my-6">
      <p className="font-serif text-lg italic leading-relaxed text-primary/80">"{children}"</p>
      {author && <p className="mt-3 font-sans text-xs tracking-widest uppercase text-primary/40">— {author}</p>}
    </div>
  );
}

export default function FounderPage() {
  useEffect(() => {
    document.title = "Founder & CEO — Shariful Islam — The Muslim Company";
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "Shariful Islam is the Founder of The Muslim Company — a global conglomerate built on ethical leadership and long-term civilizational impact. Dhaka, Bangladesh.");
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "Shariful Islam is the Founder of The Muslim Company — a global conglomerate built on ethical leadership and long-term civilizational impact. Dhaka, Bangladesh.");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "Shariful Islam is the Founder of The Muslim Company — a diversified global conglomerate built on Islamic principles, ethical leadership, and civilizational impact. Based in Dhaka, Bangladesh.");
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) { _ogi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _il = document.createElement('meta'); _il.setAttribute('property', 'og:image'); _il.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_il); }
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) { _twi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _tl = document.createElement('meta'); _tl.setAttribute('name', 'twitter:image'); _tl.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_tl); }
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/founder");
    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"}, {"@type": "ListItem", "position": 2, "name": "Founder \u2014 Shariful Islam", "item": "https://www.themuslim.company/founder"}]}, {"@context": "https://schema.org", "@type": "ProfilePage",
        "dateModified": "2026-06-12T00:00:00+06:00", "name": "Shariful Islam \u2014 Founder & CEO", "description": "Shariful Islam is the Founder of The Muslim Company — a diversified global conglomerate built on Islamic principles, ethical leadership, and long-term civilizational impact.", "url": "https://www.themuslim.company/founder", "mainEntity": {"@type": "Person", "name": "Shariful Islam", "jobTitle": "Founder & CEO", "worksFor": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}, "nationality": "Bangladeshi", "url": "https://sharifulislam.engineer", "sameAs": ["https://sharifulislam.engineer", "https://g.co/kgs/4n3CijW", "https://www.google.com/search?kgmid=/g/11n_vfnlwt", "http://viaf.org/viaf/503162664557855002426", "https://isni.org/isni/0000000502719745", "https://www.linkedin.com/in/personalsharifulislam", "https://x.com/PersonalSIslam", "https://orcid.org/0000-0002-6634-5090", "https://www.crunchbase.com/person/shariful-islam-4eee", "https://www.imdb.com/name/nm12843320/",
      "https://globalpeacechain.org/team_members/shariful-islam/",
      "https://www.openpr.com/news/4523843/the-muslim-company-building-a-faith-driven-global"
    ],
    "award": "Global Peace Ambassador 2025-2026, Global Peace Chain",
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "degree",
        "name": "Bachelor of Engineering in Electrical Engineering",
        "educationalLevel": "Bachelor's Degree"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "Global Peace Ambassador",
        "credentialCategory": "appointment",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Global Peace Chain",
          "url": "https://globalpeacechain.org"
        },
        "validFrom": "2025",
        "validUntil": "2026"
      }
    ]
  }}].forEach(schema => {
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
        <title>Shariful Islam – Founder & CEO | The Muslim Company</title>
        <meta name="description" content="Shariful Islam is the Founder of The Muslim Company — a global conglomerate built on ethical leadership and long-term civilizational impact. Dhaka, Bangladesh." />
        <link rel="canonical" href="https://www.themuslim.company/founder" />
        <meta property="og:title" content="Shariful Islam – Founder & CEO | The Muslim Company" />
        <meta property="og:url" content="https://www.themuslim.company/founder" />
      </Helmet>
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-primary py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="mb-8 flex justify-center">
                <img
                  src="/images/shariful-islam.jpg"
                  alt="Shariful Islam — Founder & CEO, The Muslim Company"
                  className="w-36 h-36 md:w-44 md:h-44 object-cover object-top border-4 border-secondary/30"
                />
              </div>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-4">Founder & CEO</p>
              <h1 className="font-serif text-5xl md:text-7xl text-primary-foreground mb-6">Shariful Islam</h1>
              <p className="font-sans text-base text-primary-foreground/60 max-w-2xl mx-auto">
                Bangladeshi Engineer, Ethical Visionary & Entrepreneur dedicated to building a faith-driven global civilization.
              </p>
              <div className="mt-8">
                <a
                  href="https://g.co/kgs/4n3CijW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary text-primary hover:bg-secondary/90 font-sans text-xs font-bold uppercase tracking-widest h-12 px-8 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  View on Google
                </a>
                <a
                  href="/ceo/Sharifulislam"
                  className="inline-flex items-center gap-2 border border-secondary text-secondary hover:bg-secondary hover:text-primary font-sans text-xs font-bold uppercase tracking-widest h-12 px-8 transition-colors mt-3"
                >
                  CEO Profile
                </a>
              </div>

              {/* Global Peace Ambassador badge */}
              <div className="mt-6 inline-flex items-center gap-2 border border-primary-foreground/15 px-4 py-2">
                <Award className="w-4 h-4 text-secondary" />
                <span className="font-sans text-xs text-primary-foreground/70">
                  Global Peace Ambassador 2025–2026, Global Peace Chain
                </span>
              </div>

              {/* Social / professional links */}
              <div className="mt-6 flex items-center justify-center gap-5">
                <a href="https://sharifulislam.engineer" target="_blank" rel="noopener noreferrer"
                  aria-label="Personal website"
                  className="text-primary-foreground/40 hover:text-secondary transition-colors">
                  <Globe2 className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/personalsharifulislam" target="_blank" rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-primary-foreground/40 hover:text-secondary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://x.com/PersonalSIslam" target="_blank" rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="text-primary-foreground/40 hover:text-secondary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://orcid.org/0000-0002-6634-5090" target="_blank" rel="noopener noreferrer"
                  aria-label="ORCID"
                  className="text-primary-foreground/40 hover:text-secondary transition-colors font-sans text-xs font-bold tracking-wide">
                  ORCID
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl space-y-12">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-6 bg-card border border-primary/10">
              <h3 className="font-serif text-lg text-primary mb-3">About Shariful Islam</h3>
              <p className="font-sans text-sm text-primary/65 leading-relaxed">
                Shariful Islam is a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur dedicated to ethical innovation, humanitarian development, knowledge-driven progress, and civilization-focused institution building. From an early age he developed strong interests in technology, engineering, Islamic ethics, global affairs, media and journalism, education, research, humanitarian development, renewable energy, and future civilization studies.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-8 bg-card border border-primary/10">
                <Quote className="w-8 h-8 text-secondary/40 mb-4" />
                <p className="font-serif text-xl italic text-primary/85 leading-relaxed mb-5">
                  "I do not know whether this company will fully succeed, how far it will go, or whether I will be able to implement every part of this vision. But my intention is to seek the pleasure of Allah and, by following the teachings and ethics of Prophet Muhammad ﷺ as much as possible, try to build something beneficial for humanity."
                </p>
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/60">— Shariful Islam, Founder & CEO</p>
              </div>
              <div className="p-6 bg-card border border-primary/10 space-y-3">
                <h4 className="font-serif text-base text-primary mb-2">Profile</h4>
                {[
                  { l: "Born", v: "2001, Jamalpur, Bangladesh" },
                  { l: "Degree", v: "B.E. Electrical Engineering" },
                  { l: "University", v: "The University of Burdwan, India" },
                  { l: "Founded", v: "The Muslim Company, January 2025" },
                  { l: "Role", v: "Founder & CEO" },
                ].map((r, i) => (
                  <div key={i}>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40">{r.l}</p>
                    <p className="font-sans text-sm text-primary/80">{r.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-card border border-primary/10">
                <h4 className="font-serif text-base text-primary mb-4">Academic & Intellectual Interests</h4>
                <Bullets items={[
                  "Electrical engineering & smart power grid systems",
                  "Solar and photovoltaic (PV) technology",
                  "Renewable and green energy",
                  "Artificial intelligence & ethical technology",
                  "International business and relations",
                  "Media, journalism & humanitarian development",
                  "Islamic civilization, education & research",
                  "Future-focused ethical innovation",
                ]} />
              </div>
              <div className="p-6 bg-card border border-primary/10">
                <h4 className="font-serif text-base text-primary mb-4">Inspirations & Influences</h4>
                <p className="font-sans text-sm text-primary/65 leading-relaxed mb-4">
                  Inspired by Islamic ethics, Prophetic principles, humanitarian responsibility, and the legacy of past Muslim scholars, scientists, philosophers, and the Sahabah of Prophet Muhammad ﷺ.
                </p>
                <Bullets items={[
                  "The life and example of Prophet Muhammad ﷺ",
                  "The Sahabah and the scholars of Islamic civilization",
                  "Dr. Zakir Naik — Islamic knowledge and comparative religion",
                  "Imran Khan — principled leadership against corruption",
                ]} />
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-6 bg-card border border-primary/10">
              <h4 className="font-serif text-lg text-primary mb-4">Personal Aspiration</h4>
              <Bullets items={[
                "The Muslim Company becomes one of the world's most trusted, respected, and influential ethical Muslim-led enterprises",
                "Wealth becomes a tool for humanitarian development, education, research, ethical systems, and long-term benefit for humanity",
                "A practicing Muslim-led ethical civilization-scale company becomes globally successful and a model for others",
              ]} />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <InlineQuote author="Shariful Islam">True success is not only wealth, fame, or power. True success is becoming accepted by Allah and leaving behind benefit for humanity.</InlineQuote>
              <InlineQuote author="Shariful Islam">Allah is the owner of everything. Rizq, honor, power, and success come only from Allah.</InlineQuote>
            </motion.div>

          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
