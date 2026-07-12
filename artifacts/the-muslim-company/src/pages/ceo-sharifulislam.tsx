import { useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Quote, Globe, Award, BookOpen, Briefcase, GraduationCap, Building2, Star, ExternalLink, Linkedin, Newspaper, Calendar, TrendingUp } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-3 flex items-center gap-2">
      <span className="inline-block w-5 h-px bg-secondary" />
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-primary/8 last:border-0">
      <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary/35 mb-0.5">{label}</p>
      <p className="font-sans text-sm text-primary/80">{value}</p>
    </div>
  );
}

function PillarCard({ icon: Icon, title, items }: { icon: React.ElementType; title: string; items: string[] }) {
  return (
    <div className="p-7 bg-card border border-primary/10 hover:border-secondary/30 transition-colors duration-300">
      <Icon className="w-5 h-5 text-secondary mb-4" />
      <h4 className="font-serif text-base text-primary mb-4">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 font-sans text-sm text-primary/65">
            <span className="w-1 h-1 bg-secondary/60 rounded-full mt-2.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who is the CEO of The Muslim Company?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Shariful Islam is the Chief Executive Officer (CEO) of The Muslim Company, a faith-driven global enterprise headquartered in Dhaka, Bangladesh."
      }
    },
    {
      "@type": "Question",
      "name": "What is The Muslim Company?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Muslim Company is a faith-driven global enterprise founded in January 2025, built on Islamic principles, ethical innovation, and civilization-focused leadership."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Shariful Islam from?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Shariful Islam is a Bangladeshi Engineer and Entrepreneur, born in Jamalpur, Bangladesh. He holds a Bachelor of Engineering in Electrical Engineering from the University of Burdwan, India."
      }
    },
    {
      "@type": "Question",
      "name": "What sectors does The Muslim Company operate in under CEO Shariful Islam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Under CEO Shariful Islam, The Muslim Company operates across Technology & AI, Media & Journalism, Education & Research, Humanitarian Development, Renewable Energy, Ethical Commerce, Social Welfare, Retail Business, Fashion & Apparel, Agriculture & Food, Manufacturing & Industry, and Lifestyle & Personal Care."
      }
    },
    {
      "@type": "Question",
      "name": "How can I contact the CEO of The Muslim Company?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Contact the CEO of The Muslim Company via the official website at https://www.themuslim.company/contact or via email at ceo@themuslim.company."
      }
    }
  ]
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.themuslim.company/ceo/Sharifulislam#person",
  "name": [
    { "@language": "en", "@value": "Shariful Islam" },
    { "@language": "bn", "@value": "শরিফুল ইসলাম" }
  ],
  "givenName": "Shariful",
  "familyName": "Islam",
  "birthDate": "2001",
  "birthPlace": { "@type": "Place", "name": "Jamalpur, Bangladesh" },
  "nationality": { "@type": "Country", "name": "Bangladesh" },
  "gender": "Male",
  "knowsLanguage": ["Bengali", "English"],
  "jobTitle": "Chief Executive Officer",
  "disambiguatingDescription": "Shariful Islam, Founder & CEO of The Muslim Company, is a Bangladeshi electrical engineer and entrepreneur born in Jamalpur, Bangladesh. He is a different person from, and should not be confused with, the Bangladeshi cricketer whose name is sometimes spelled 'Shoriful Islam' and sometimes 'Shariful Islam'.",
  "description": [
    { "@language": "en", "@value": "Shariful Islam is a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur. He is the Chief Executive Officer (CEO) of The Muslim Company — a faith-driven global enterprise built on Islamic principles and prophetic values. He is also a Peace Ambassador for the Global Peace Chain (Bangladesh)." },
    { "@language": "bn", "@value": "শরিফুল ইসলাম একজন বাংলাদেশি ইঞ্জিনিয়ার, নৈতিক দূরদর্শী এবং উদ্যোক্তা। তিনি দ্য মুসলিম কোম্পানি-র প্রধান নির্বাহী কর্মকর্তা (সিইও) — একটি বিশ্বাস-চালিত বৈশ্বিক প্রতিষ্ঠান, যা ইসলামী নীতি ও নববী আদর্শের ওপর প্রতিষ্ঠিত। তিনি গ্লোবাল পিস চেইন (বাংলাদেশ)-এরও একজন শান্তি দূত।" }
  ],
  "url": "https://www.themuslim.company/ceo/Sharifulislam",
  "image": {
    "@type": "ImageObject",
    "url": "https://www.themuslim.company/shariful-islam-ceo.png",
    "width": 1122,
    "height": 1160,
    "caption": "Shariful Islam — Founder & CEO, The Muslim Company"
  },
  "worksFor": {
    "@type": "Organization",
    "@id": "https://www.themuslim.company/#organization",
    "name": "The Muslim Company",
    "url": "https://www.themuslim.company"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "The University of Burdwan",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Burdwan Rajbati, Raiganj",
      "addressLocality": "Bardhaman",
      "addressRegion": "West Bengal",
      "postalCode": "713102",
      "addressCountry": "IN"
    },
    "url": "https://www.buruniv.ac.in"
  },
  "knowsAbout": [
    "Islamic Business Ethics", "Ethical Innovation", "Electrical Engineering",
    "Renewable Energy", "Artificial Intelligence", "Global Entrepreneurship",
    "Islamic Civilization", "Humanitarian Development", "Corporate Governance", "Faith-Driven Enterprise"
  ],
  "sameAs": [
    "https://sharifulislam.engineer",
    "https://g.co/kgs/4n3CijW",
    "https://www.google.com/search?kgmid=/g/11n_vfnlwt",
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
    "https://about.me/Personalsharifulislam/",
    "https://globalpeacechain.org/team_members/shariful-islam/",
    "https://www.openpr.com/news/4523843/the-muslim-company-building-a-faith-driven-global",
    "https://www.openpr.com/news/4563968/shariful-islam-unveils-global-vision-for-the-muslim-company"
  ],
  "award": "Global Peace Ambassador 2025-2026, Global Peace Chain",
  "memberOf": [
    { "@type": "Organization", "name": "Society of Satellite Professionals International", "alternateName": "SSPI" },
    { "@type": "Organization", "name": "International Association of Engineers", "alternateName": "IAENG" },
    { "@type": "Organization", "name": "International Human Rights Commission", "alternateName": "IHRC" }
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree",
      "name": "Bachelor of Engineering in Electrical Engineering",
      "educationalLevel": "Bachelor's Degree"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Global Peace Ambassador (2025–2026)",
      "credentialCategory": "appointment",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Global Peace Chain",
        "url": "https://globalpeacechain.org"
      }
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Member, Society of Satellite Professionals International (SSPI)",
      "credentialCategory": "membership",
      "recognizedBy": { "@type": "Organization", "name": "Society of Satellite Professionals International" }
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Member, International Association of Engineers (IAENG)",
      "credentialCategory": "membership",
      "recognizedBy": { "@type": "Organization", "name": "International Association of Engineers" }
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Member, International Human Rights Commission (IHRC)",
      "credentialCategory": "membership",
      "recognizedBy": { "@type": "Organization", "name": "International Human Rights Commission" }
    }
  ]
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.themuslim.company/#organization",
  "name": [
    { "@language": "en", "@value": "The Muslim Company" },
    { "@language": "bn", "@value": "দ্য মুসলিম কোম্পানি" }
  ],
  "legalName": "The Muslim Company LTD",
  "alternateName": ["TMC", "TMC Bangladesh", "TheMuslimCompany"],
  "url": "https://www.themuslim.company",
  "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/logo.png", "width": 512, "height": 512 },
  "image": ["https://www.themuslim.company/logo.png", "https://www.themuslim.company/logo-letterhead-1.png", "https://www.themuslim.company/logo-letterhead-2.png"],
  "description": "The Muslim Company is a faith-driven global conglomerate built on Islamic principles, ethical innovation, and civilization-focused leadership. Founded by Shariful Islam in Dhaka, Bangladesh.",
  "foundingDate": "2025-01-09",
  "foundingLocation": { "@type": "Place", "name": "Dhaka, Bangladesh" },
  "disambiguatingDescription": "The Muslim Company is not affiliated with, owned by, or related to other similarly-named organizations such as The Muslim Journal or Productive Muslim — any resemblance is in name only.",
  "founder": {
    "@type": "Person",
    "@id": "https://www.themuslim.company/ceo/Sharifulislam#person",
    "name": "Shariful Islam",
    "jobTitle": "Founder & CEO"
  },
  "employee": [{
    "@type": "OrganizationRole",
    "roleName": "Chief Executive Officer",
    "startDate": "2025",
    "employee": {
      "@type": "Person",
      "@id": "https://www.themuslim.company/ceo/Sharifulislam#person",
      "name": "Shariful Islam"
    }
  }],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Niketon Bazaar",
    "addressLocality": "Dhaka",
    "postalCode": "1212",
    "addressCountry": "BD"
  },
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 10
  },
  "sameAs": [
    "https://www.facebook.com/TheMuslimCompany",
    "https://www.instagram.com/officialTheMuslimCompany",
    "https://www.youtube.com/@TheMuslimCompany",
    "https://www.linkedin.com/company/themuslimcompany",
    "https://x.com/officialtmchq",
    "https://www.crunchbase.com/organization/the-muslim-company",
    "https://www.openpr.com/news/4523843/the-muslim-company-building-a-faith-driven-global",
    "https://www.openpr.com/news/4563968/shariful-islam-unveils-global-vision-for-the-muslim-company"
  ]
};

const PROFILE_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "name": "Shariful Islam – CEO of The Muslim Company",
  "description": "Official CEO profile of Shariful Islam, Chief Executive Officer (CEO) of The Muslim Company.",
  "url": "https://www.themuslim.company/ceo/Sharifulislam",
  "datePublished": "2025-01-09T00:00:00+06:00",
  "dateModified": "2026-06-13T00:00:00+06:00",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
      { "@type": "ListItem", "position": 2, "name": "CEO Profile — Shariful Islam", "item": "https://www.themuslim.company/ceo/Sharifulislam" }
    ]
  },
  "mainEntity": { "@id": "https://www.themuslim.company/ceo/Sharifulislam#person" }
};

export default function CeoSharifulIslamPage() {
  useEffect(() => {
    document.title = "Shariful Islam – CEO of The Muslim Company";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Shariful Islam serves as the Chief Executive Officer (CEO) of The Muslim Company, a diversified global conglomerate committed to innovation, long-term value creation, and ethical leadership.");

    document.querySelectorAll("script[data-page-schema]").forEach(el => el.remove());
    [PERSON_SCHEMA, ORG_SCHEMA, PROFILE_PAGE_SCHEMA, FAQ_SCHEMA].forEach(schema => {
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
      <Helmet>
        <title>Shariful Islam – CEO of The Muslim Company</title>
        <meta name="description" content="Shariful Islam serves as CEO of The Muslim Company — a global conglomerate committed to innovation, long-term value creation, and ethical leadership." />
        <link rel="canonical" href="https://www.themuslim.company/ceo/Sharifulislam" />
        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="Shariful Islam – CEO of The Muslim Company" />
        <meta property="og:description" content="Shariful Islam serves as CEO of The Muslim Company — a global conglomerate committed to innovation, long-term value creation, and ethical leadership." />
        <meta property="og:url" content="https://www.themuslim.company/ceo/Sharifulislam" />
        <meta property="og:image" content="https://www.themuslim.company/shariful-islam-ceo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="The Muslim Company" />
        <meta property="og:locale" content="en_US" />
        <meta property="profile:first_name" content="Shariful" />
        <meta property="profile:last_name" content="Islam" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shariful Islam – CEO of The Muslim Company" />
        <meta name="twitter:description" content="Chief Executive Officer (CEO) of The Muslim Company." />
        <meta name="twitter:image" content="https://www.themuslim.company/og-image.png" />
        <meta name="twitter:site" content="@PersonalSIslam" />
        <meta name="twitter:creator" content="@PersonalSIslam" />
        {/* SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="keywords" content="Shariful Islam, Shariful Islam CEO, CEO Shariful Islam, CEO of The Muslim Company, Chief Executive Officer The Muslim Company, The Muslim Company CEO, Bangladeshi CEO, Muslim Entrepreneur, Islamic Business Leader, Ethical Leadership, The Muslim Company, TMC CEO, Shariful Islam Engineer" />
        <meta name="author" content="Shariful Islam" />
        {/* rel=me for Knowledge Panel entity disambiguation */}
        <link rel="me" href="https://www.linkedin.com/in/personalsharifulislam" />
        <link rel="me" href="https://x.com/PersonalSIslam" />
        <link rel="me" href="https://www.facebook.com/PersonalSharifulIslam/" />
      </Helmet>

      <div className="bg-background min-h-screen">

        {/* ══════════════════════════════ HERO ══════════════════════════════ */}
        <section className="relative bg-primary overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 39px, var(--color-secondary) 39px, var(--color-secondary) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, var(--color-secondary) 39px, var(--color-secondary) 40px)",
            }}
          />
          <div className="relative container mx-auto max-w-5xl px-6 py-28 md:py-36">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center text-center">

              {/* CEO Photo */}
              <motion.div variants={fadeIn} className="mb-6">
                <img
                  src="/shariful-islam-ceo.png"
                  alt="Shariful Islam — CEO of The Muslim Company"
                  className="w-32 h-32 md:w-40 md:h-40 object-cover object-top mx-auto border border-secondary/20"
                />
              </motion.div>

              <motion.h1 variants={fadeIn} className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary-foreground mt-2 mb-4 tracking-tight">
                Shariful Islam
              </motion.h1>
              <motion.p variants={fadeIn} className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-6">
                Chief Executive Officer
              </motion.p>
              <motion.p variants={fadeIn} className="font-sans text-base text-primary-foreground/55 max-w-xl mx-auto leading-relaxed">
                Bangladeshi Engineer, CEO, Ethical Visionary &amp; Entrepreneur — building a faith-driven global civilization on Prophetic values.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeIn} className="mt-10 flex flex-wrap justify-center items-center gap-3">
                <a
                  href="https://g.co/kgs/4n3CijW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-11 px-7 hover:bg-secondary/90 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.45 2.09 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google Knowledge Panel
                </a>
                <a
                  href="https://www.linkedin.com/in/personalsharifulislam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground font-sans text-xs uppercase tracking-widest h-11 px-7 hover:bg-primary-foreground/15 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn Profile
                </a>
              </motion.div>

              {/* Social icons */}
              <motion.div variants={fadeIn} className="mt-7 flex items-center gap-5">
                {[
                  { href: "https://www.facebook.com/PersonalSharifulIslam/", label: "Facebook", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { href: "https://x.com/PersonalSIslam", label: "X", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                  { href: "https://www.instagram.com/personalsharifulislam/", label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                  { href: "https://www.youtube.com/@PersonalSharifulIslam", label: "YouTube", d: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                ].map(({ href, label, d }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="text-primary-foreground/55 hover:text-secondary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
                  </a>
                ))}
              </motion.div>

              {/* Stats Bar */}
              <motion.div variants={fadeIn} className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 max-w-2xl mx-auto border-t border-primary-foreground/10 pt-10">
                {[
                  { label: "Founded", value: "2025" },
                  { label: "Sectors", value: "20+" },
                  { label: "Headquarters", value: "Dhaka, Bangladesh" },
                  { label: "Reach", value: "Global" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-serif text-2xl md:text-3xl text-secondary mb-1">{s.value}</p>
                    <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════ BODY ══════════════════════════════ */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-5xl space-y-16">

            {/* —— BIOGRAPHY —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10">
              <SectionLabel>Biography</SectionLabel>
              <h2 className="font-serif text-2xl text-primary mb-5">
                About Shariful Islam,{" "}
                <br className="hidden md:block" />
                CEO of The Muslim Company
              </h2>
              <div className="space-y-4 font-sans text-sm text-primary/65 leading-relaxed">
                <p>
                  Shariful Islam is a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur dedicated to ethical innovation, humanitarian development, knowledge-driven progress, and civilization-focused institution building. Born in 2001 in Jamalpur, Bangladesh, he graduated with a Bachelor of Engineering in Electrical Engineering from The University of Burdwan, India.
                </p>
                <p>
                  From an early age, Shariful developed strong interests spanning technology, engineering, Islamic ethics, global affairs, media and journalism, education, research, humanitarian development, renewable energy, and future civilization studies. His intellectual journey led him to found <strong className="text-primary/80">The Muslim Company</strong> in January 2025. He currently serves as the Chief Executive Officer (CEO) of The Muslim Company, guiding the organization's long-term vision, leadership, and strategic growth.
                </p>
                <p>
                  As Chief Executive Officer (CEO), he leads the company across multiple key sectors: Technology &amp; AI, Media &amp; Journalism, Education &amp; Research, Humanitarian Development, Governance &amp; Policy, Renewable Energy, Ethical Commerce, Social Welfare &amp; Humanitarian Work, Retail Business, Fashion &amp; Apparel, Agriculture &amp; Food, Manufacturing &amp; Industry, and Lifestyle &amp; Personal Care — with a growing operational presence across Bangladesh, India, Pakistan, the United Arab Emirates, Nigeria, Ghana, and the wider African continent. He also serves as a Peace Ambassador for the Global Peace Chain (Bangladesh), reflecting his commitment to dialogue, unity, and global humanitarian responsibility.
                </p>
                <p>
                  Shariful is a member of the Society of Satellite Professionals International (SSPI) and the International Association of Engineers (IAENG), reflecting his cross-disciplinary expertise spanning engineering, technology, and international institutional development. He also contributes to human rights advocacy as a recognized member of the International Human Rights Commission (IHRC), working on humanitarian issues at the international level.
                </p>
                <p>
                  Shariful's leadership philosophy is grounded in the Quran and the Sunnah of Prophet Muhammad ﷺ — combining ancient prophetic wisdom with modern global corporate strategy to create a model of enterprise that is simultaneously world-class and deeply principled.
                </p>
              </div>
            </motion.div>

            {/* —— STATEMENT + PROFILE CARD —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 gap-6">
              <div className="lg:col-span-2 p-7 bg-card border border-primary/10">
                <SectionLabel>Executive Profile</SectionLabel>
                {[
                  { label: "Full Name", value: "Shariful Islam" },
                  { label: "Born", value: "2001, Jamalpur, Bangladesh" },
                  { label: "Nationality", value: "Bangladeshi" },
                  { label: "Degree", value: "B.E. in Electrical Engineering" },
                  { label: "University", value: "University of Burdwan, India" },
                  { label: "Role", value: "Chief Executive Officer (CEO)" },
                  { label: "Company", value: "The Muslim Company" },
                  { label: "Founded", value: "January 2025, Dhaka" },
                  { label: "Other Role", value: "Peace Ambassador, Global Peace Chain (BD)" },
                  { label: "Memberships", value: "SSPI · IAENG · IHRC" },
                ].map((r) => <InfoRow key={r.label} label={r.label} value={r.value} />)}
              </div>
            
            </motion.div>

            {/* —— LEADERSHIP PILLARS —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <SectionLabel>Executive Leadership</SectionLabel>
              <h2 className="font-serif text-2xl text-primary mb-8">Leadership Pillars</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    icon: Star, title: "Faith & Ethics",
                    items: ["Quran and Sunnah as the constitutional foundation", "Prophetic model of ethical business conduct", "Halal, transparent & shariah-conscious operations", "Accountability to Allah above all stakeholders"]
                  },
                  {
                    icon: Globe, title: "Global Vision",
                    items: ["Building a world-class Islamic conglomerate", "Civilization-scale institution for humanity", "Operating across diverse strategic sectors", "Long-term 50–100 year civilizational thinking"]
                  },
                  {
                    icon: Briefcase, title: "Corporate Governance",
                    items: ["Global professional corporate standards", "Ethical innovation over profit-first models", "Transparent reporting & accountability", "Servant-leadership model inspired by the Prophet ﷺ"]
                  },
                  {
                    icon: BookOpen, title: "Knowledge & Research",
                    items: ["Electrical engineering & smart power systems", "AI, technology & ethical digital innovation", "Islamic civilization scholarship", "Academic publishing & research culture"]
                  },
                  {
                    icon: Award, title: "Humanitarian Mission",
                    items: ["Wealth as a tool for human benefit, not hoarding", "Peace Ambassador — Global Peace Chain (BD)", "Education, development & poverty alleviation", "Upliftment of Muslim communities globally"]
                  },
                  {
                    icon: Building2, title: "Entrepreneurship",
                    items: ["Faith-driven startup methodology", "Growing from Bangladesh to global markets", "Muslim-led enterprise as a model for the Ummah", "Sustainability and long-term value creation"]
                  },
                ].map((card) => (
                  <motion.div key={card.title} variants={fadeIn}>
                    <PillarCard {...card} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* —— CAREER TIMELINE —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-20">
              <SectionLabel>Leadership Journey</SectionLabel>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-10">Career Timeline</h2>
              <div className="space-y-8">
                {[
                  { year: "2025", title: "B.E. Electrical Engineering", desc: "Graduated from the University of Burdwan, India, laying the technical foundation for a career in engineering and systems thinking." },
                  { year: "2025", title: "Founded The Muslim Company", desc: "Established The Muslim Company in Dhaka, Bangladesh — a diversified global conglomerate guided by Islamic principles and civilizational vision." },
                  { year: "2025–2026", title: "Appointed Global Peace Ambassador", desc: "Recognized by Global Peace Chain for contributions toward ethical leadership and global peace initiatives." },
                  { year: "2025–Present", title: "Expansion Across Sectors", desc: "Led the growth of The Muslim Company across technology, finance, education, retail, manufacturing, and humanitarian development." },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeIn} className="flex gap-6 border-l-2 border-secondary/30 pl-6 relative">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-secondary" />
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase text-secondary mb-1">{item.year}</p>
                      <h3 className="font-serif text-lg text-primary mb-1">{item.title}</h3>
                      <p className="font-sans text-sm text-primary/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* —— GUIDING PHILOSOPHY —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-20 p-8 bg-card border border-primary/10">
              <SectionLabel>Guiding Philosophy</SectionLabel>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">Leadership Rooted in Faith</h2>
              <p className="font-sans text-sm text-primary/65 leading-relaxed mb-4">
                Shariful Islam's approach to leadership draws directly from Quranic principles and the Prophetic model of stewardship — viewing wealth, authority, and enterprise not as ends in themselves, but as trusts (amanah) to be exercised with justice, accountability, and long-term benefit to society.
              </p>
              <p className="font-sans text-sm text-primary/65 leading-relaxed">
                This philosophy shapes every major decision at The Muslim Company: from the choice to build interest-free financial institutions, to the commitment to humanitarian development, to a workforce policy grounded in dignity and fairness. Business, in this view, is inseparable from ethics — and profit is a means toward civilizational good, not the ultimate goal.
              </p>
            </motion.div>

            {/* —— IN THE NEWS —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-20">
              <SectionLabel>Media Coverage</SectionLabel>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-8">In the News</h2>
              <div className="space-y-4">
                <a
                  href="https://www.openpr.com/news/4563968/shariful-islam-unveils-global-vision-for-the-muslim-company"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 bg-card border border-primary/10 hover:border-secondary/40 transition-colors group"
                >
                  <Newspaper className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg text-primary mb-1 group-hover:text-secondary transition-colors">
                      Shariful Islam Unveils Global Vision for The Muslim Company, a Faith-Driven Conglomerate Spanning Twenty Sectors Across Asia, the Middle East, and Africa
                    </h3>
                    <p className="font-sans text-xs text-primary/65">OpenPR — Press Release</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-primary/30 ml-auto flex-shrink-0 mt-1" />
                </a>
                <a
                  href="https://www.openpr.com/news/4523843/the-muslim-company-building-a-faith-driven-global"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 bg-card border border-primary/10 hover:border-secondary/40 transition-colors group"
                >
                  <Newspaper className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-lg text-primary mb-1 group-hover:text-secondary transition-colors">
                      The Muslim Company: Building a Faith-Driven Global Civilization Through Innovation, Ethics, and Excellence
                    </h3>
                    <p className="font-sans text-xs text-primary/65">OpenPR — Press Release</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-primary/30 ml-auto flex-shrink-0 mt-1" />
                </a>
              </div>
            </motion.div>

            {/* —— ACADEMIC + INSPIRATIONS —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-7 bg-card border border-primary/10">
                <GraduationCap className="w-5 h-5 text-secondary mb-4" />
                <SectionLabel>Expertise</SectionLabel>
                <h3 className="font-serif text-base text-primary mb-4">Academic &amp; Intellectual Interests</h3>
                <ul className="space-y-2.5">
                  {[
                    "Electrical engineering & smart power grid systems",
                    "Solar and photovoltaic (PV) technology",
                    "Renewable and green energy",
                    "Artificial intelligence & ethical technology",
                    "International business and relations",
                    "Media, journalism & humanitarian development",
                    "Islamic civilization, education & research",
                    "Future-focused ethical innovation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-sm text-primary/65">
                      <span className="w-1 h-1 bg-secondary/60 rounded-full mt-2.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-7 bg-card border border-primary/10">
                <Star className="w-5 h-5 text-secondary mb-4" />
                <SectionLabel>Inspirations</SectionLabel>
                <h3 className="font-serif text-base text-primary mb-4">Inspirations &amp; Influences</h3>
                <p className="font-sans text-sm text-primary/60 leading-relaxed mb-5">
                  Shariful Islam's worldview and leadership style are deeply shaped by the prophetic tradition, the scholarly legacy of Islamic civilization, and contemporary leaders of principle.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "The life and example of Prophet Muhammad ﷺ — the ultimate model",
                    "The Sahabah and the scholars of Islamic civilization",
                    "Dr. Zakir Naik — Islamic knowledge and comparative religion",
                    "Imran Khan — principled leadership against corruption",
                    "The great Muslim scientists, philosophers, and civilizational builders",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-sm text-primary/65">
                      <span className="w-1 h-1 bg-secondary/60 rounded-full mt-2.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* —— ASPIRATIONS DARK BLOCK —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-primary text-primary-foreground">
              <SectionLabel>Vision Statement</SectionLabel>
              <h2 className="font-serif text-2xl text-primary-foreground mb-6">The Aspiration</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { num: "01", text: "The Muslim Company becomes one of the world's most trusted, respected, and influential ethical Muslim-led enterprises." },
                  { num: "02", text: "Wealth becomes a tool for humanitarian development, education, research, ethical systems, and long-term benefit for humanity." },
                  { num: "03", text: "A practicing Muslim-led ethical civilization-scale company becomes globally successful and a model for the entire Ummah." },
                ].map((item) => (
                  <div key={item.num} className="border border-primary-foreground/15 p-6">
                    <p className="font-serif text-4xl text-secondary/40 mb-3">{item.num}</p>
                    <p className="font-sans text-sm text-primary-foreground/65 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="border-l-4 border-secondary pl-6 py-2">
                <Quote className="w-7 h-7 text-secondary/40 mb-5" />
                <p className="font-serif text-xl md:text-2xl italic text-primary/85 leading-relaxed mb-6">
                  &ldquo;I do not know whether this company will fully succeed, how far it will go, or whether I will be able to implement every part of this vision. But my intention is to seek the pleasure of Allah and, by following the teachings and ethics of Prophet Muhammad ﷺ as much as possible, try to build something beneficial for humanity.&rdquo;
                </p>
                <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary/60">&mdash; Shariful Islam, CEO</p>
              </div>
            </motion.div>

            {/* —— VISION QUOTE —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="border-l-4 border-secondary pl-8 py-3">
              <SectionLabel>Founding Vision</SectionLabel>
              <p className="font-serif text-xl md:text-2xl italic text-primary/80 leading-relaxed">
                &ldquo;True success is not only wealth, fame, or power. True success is becoming accepted by Allah and leaving behind benefit for humanity.&rdquo;
              </p>
              <p className="mt-4 font-sans text-xs tracking-widest uppercase text-primary/35">&mdash; Shariful Islam</p>
            </motion.div>

            {/* —— SECOND QUOTE —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="border-l-4 border-secondary pl-8 py-2">
              <p className="font-serif text-xl italic text-primary/80 leading-relaxed">
                &ldquo;Allah is the owner of everything. Rizq, honor, power, and success come only from Allah.&rdquo;
              </p>
              <p className="mt-4 font-sans text-xs tracking-[0.35em] uppercase text-primary/35">
                &mdash; Shariful Islam, CEO — The Muslim Company
              </p>
            </motion.div>

            {/* —— VERIFIED EXTERNAL PROFILES —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <SectionLabel>Official Presence</SectionLabel>
              <h2 className="font-serif text-2xl text-primary mb-7">Verified External Profiles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Google Knowledge Panel", sub: "g.co/kgs/4n3CijW", href: "https://g.co/kgs/4n3CijW" },
                  { label: "LinkedIn", sub: "linkedin.com/in/personalsharifulislam", href: "https://www.linkedin.com/in/personalsharifulislam" },
                  { label: "Personal Website", sub: "sharifulislam.engineer", href: "https://sharifulislam.engineer" },
                  { label: "ORCID", sub: "0000-0002-6634-5090", href: "https://orcid.org/0000-0002-6634-5090" },
                  { label: "VIAF", sub: "viaf.org", href: "http://viaf.org/viaf/503162664557855002426" },
                  { label: "ISNI", sub: "isni.org", href: "https://isni.org/isni/0000000502719745" },
                  { label: "ResearchGate", sub: "researchgate.net", href: "https://www.researchgate.net/profile/Shariful-Islam-130" },
                  { label: "Crunchbase", sub: "crunchbase.com", href: "https://www.crunchbase.com/person/shariful-islam-4eee" },
                  { label: "IMDB", sub: "imdb.com", href: "https://www.imdb.com/name/nm12843320/" },
                ].map((link) => (
                  <motion.a
                    key={link.label}
                    variants={fadeIn}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-5 bg-card border border-primary/10 hover:border-secondary/40 transition-colors"
                  >
                    <div>
                      <p className="font-sans text-sm font-medium text-primary group-hover:text-secondary transition-colors">{link.label}</p>
                      <p className="font-sans text-xs text-primary/65 mt-0.5">{link.sub}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-primary/25 group-hover:text-secondary/60 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* —— CONNECT —— */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 border-t border-primary/10">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-secondary mb-2">Connect</p>
                <p className="font-serif text-xl text-primary">Follow Shariful Islam</p>
                <p className="font-sans text-sm text-primary/65 mt-1">Official insights and leadership updates from the CEO of The Muslim Company.</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "X / Twitter", href: "https://x.com/PersonalSIslam" },
                  { label: "YouTube", href: "https://www.youtube.com/@PersonalSharifulIslam" },
                  { label: "Instagram", href: "https://www.instagram.com/personalsharifulislam/" },
                  { label: "Facebook", href: "https://www.facebook.com/PersonalSharifulIslam/" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs uppercase tracking-widest h-10 px-6 border border-primary/20 text-primary/70 hover:border-secondary hover:text-secondary transition-colors inline-flex items-center"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
