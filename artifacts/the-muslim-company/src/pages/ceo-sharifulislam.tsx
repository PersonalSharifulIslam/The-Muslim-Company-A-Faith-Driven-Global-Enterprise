import { useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Quote } from "lucide-react";
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

export default function CeoSharifulIslamPage() {
  useEffect(() => {
    document.title = "CEO/MD Profile — The Muslim Company";
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "Shariful Islam is the Chief Executive Officer and Managing Director of The Muslim Company — a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur building a faith-driven global enterprise on Islamic principles.");
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "CEO/MD Profile — Shariful Islam | The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "Shariful Islam is the Chief Executive Officer and Managing Director of The Muslim Company — a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur building a faith-driven global enterprise on Islamic principles.");
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/ceo/Sharifulislam");
    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "CEO/MD Profile — Shariful Islam", "item": "https://www.themuslim.company/ceo/Sharifulislam" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "name": "CEO/MD Profile — Shariful Islam | The Muslim Company",
        "description": "Shariful Islam is the Chief Executive Officer and Managing Director of The Muslim Company — a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur.",
        "url": "https://www.themuslim.company/ceo/Sharifulislam",
        "mainEntity": {
          "@type": "Person",
          "name": "Shariful Islam",
          "givenName": "Shariful",
          "familyName": "Islam",
          "birthName": "Shariful Islam",
          "nationality": "Bangladeshi",
          "jobTitle": ["Founder & CEO", "Chief Executive Officer", "Managing Director", "Bangladeshi Engineer", "Ethical Visionary", "Entrepreneur", "Peace Activist", "Preacher", "Social Commentator"],
          "description": "Shariful Islam is a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur. He is the Founder & CEO of The Muslim Company, a faith-driven global enterprise built on Islamic principles. He is also a Peace Ambassador for the Global Peace Chain (Bangladesh).",
          "url": "https://sharifulislam.engineer",
          "worksFor": {
            "@type": "Organization",
            "name": "The Muslim Company",
            "url": "https://www.themuslim.company"
          },
          "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "The University of Burdwan",
            "url": "https://www.buruniv.ac.in"
          },
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "credentialCategory": "degree",
            "name": "Bachelor of Engineering in Electrical Engineering",
            "educationalLevel": "Bachelor's Degree"
          },
          "sameAs": [
            "https://sharifulislam.engineer",
            "https://g.co/kgs/4n3CijW",
            "https://www.google.com/search?kgmid=/g/11n_vfnlwt",
            "https://www.google.com/search?kgmid=/g/11n4vqbl3_",
            "http://viaf.org/viaf/503162664557855002426",
            "https://isni.org/isni/0000000502719745",
            "https://www.facebook.com/PersonalSharifulIslam/",
            "https://www.facebook.com/PageSharifulIslam/",
            "https://x.com/PersonalSIslam",
            "https://x.com/Sharifultweet",
            "https://www.linkedin.com/in/personalsharifulislam",
            "https://www.linkedin.com/in/personalsharifulislam0",
            "https://www.instagram.com/personalsharifulislam/",
            "https://www.youtube.com/@PersonalSharifulIslam",
            "https://www.researchgate.net/profile/Shariful-Islam-130",
            "https://scholar.google.com/citations?user=8gtOT3AAAAAJ&hl=en",
            "https://orcid.org/0000-0002-6634-5090",
            "https://www.imdb.com/name/nm12843320/",
            "https://www.crunchbase.com/person/shariful-islam-4eee",
            "https://about.me/Personalsharifulislam/"
          ]
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "The Muslim Company",
        "legalName": "The Muslim Company LTD",
        "url": "https://www.themuslim.company",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.themuslim.company/favicon.png",
          "width": 512,
          "height": 512
        },
        "foundingDate": "2025-01-09",
        "foundingLocation": { "@type": "Place", "name": "Dhaka, Bangladesh" },
        "founder": {
          "@type": "Person",
          "name": "Shariful Islam",
          "jobTitle": "Founder & CEO",
          "url": "https://sharifulislam.engineer"
        },
        "employee": {
          "@type": "OrganizationRole",
          "roleName": "Chief Executive Officer",
          "startDate": "2025",
          "member": {
            "@type": "Person",
            "name": "Shariful Islam",
            "url": "https://sharifulislam.engineer"
          }
        },
        "sameAs": [
          "https://www.facebook.com/TheMuslimCompany",
          "https://www.instagram.com/officialTheMuslimCompany",
          "https://www.youtube.com/@TheMuslimCompany",
          "https://www.linkedin.com/company/themuslimcompany",
          "https://x.com/officialtmchq",
          "https://www.crunchbase.com/organization/the-muslim-company"
        ]
      }
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
        <title>CEO/MD Profile — The Muslim Company</title>
        <meta name="description" content="Shariful Islam is the Chief Executive Officer and Managing Director of The Muslim Company — a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur building a faith-driven global enterprise on Islamic principles." />
        <link rel="canonical" href="https://www.themuslim.company/ceo/Sharifulislam" />
        <meta property="og:title" content="CEO/MD Profile — Shariful Islam | The Muslim Company" />
        <meta property="og:url" content="https://www.themuslim.company/ceo/Sharifulislam" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-primary py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-4">Chief Executive Officer & Managing Director</p>
              <h1 className="font-serif text-5xl md:text-7xl text-primary-foreground mb-6">Shariful Islam</h1>
              <p className="font-sans text-base text-primary-foreground/60 max-w-2xl mx-auto">
                Bangladeshi Engineer, Ethical Visionary & Entrepreneur dedicated to building a faith-driven global civilization.
              </p>
              <div className="mt-8 flex flex-col items-center gap-5">
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
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.45 2.09 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  View on Google
                </a>
                {/* Social Media Icons */}
                <div className="flex items-center gap-4">
                  {[
                    { href: "https://www.facebook.com/PersonalSharifulIslam/", label: "Facebook", icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                    { href: "https://x.com/PersonalSIslam", label: "X / Twitter", icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                    { href: "https://www.instagram.com/personalsharifulislam/", label: "Instagram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                    { href: "https://www.linkedin.com/in/personalsharifulislam", label: "LinkedIn", icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                    { href: "https://www.youtube.com/@PersonalSharifulIslam", label: "YouTube", icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                  ].map(({ href, label, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-primary-foreground/50 hover:text-secondary transition-colors"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl space-y-12">

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
                  { l: "Role", v: "Founder, CEO & Managing Director" },
                ].map((r, i) => (
                  <div key={i}>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40">{r.l}</p>
                    <p className="font-sans text-sm text-primary/80">{r.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-6 bg-card border border-primary/10">
              <h3 className="font-serif text-lg text-primary mb-3">About Shariful Islam</h3>
              <p className="font-sans text-sm text-primary/65 leading-relaxed">
                Shariful Islam is a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur dedicated to ethical innovation, humanitarian development, knowledge-driven progress, and civilization-focused institution building. From an early age he developed strong interests in technology, engineering, Islamic ethics, global affairs, media and journalism, education, research, humanitarian development, renewable energy, and future civilization studies.
              </p>
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
