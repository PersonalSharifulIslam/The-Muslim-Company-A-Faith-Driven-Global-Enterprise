import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { MoveRight } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { isCrawlerUA } from "@/lib/isCrawler";

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

export default function MissionPage() {
  const [isBot] = useState(isCrawlerUA);
  useEffect(() => {
    document.title = "Our Mission — The Muslim Company";

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
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "The Muslim Company's mission: building a civilization-driven global conglomerate inspired by ethical leadership — empowering humanity through innovation.");
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "The Muslim Company's mission: building a civilization-driven global conglomerate inspired by ethical leadership — empowering humanity through innovation.");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "The Muslim Company's mission: to build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, and justice.");
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) { _ogi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _il = document.createElement('meta'); _il.setAttribute('property', 'og:image'); _il.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_il); }
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) { _twi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _tl = document.createElement('meta'); _tl.setAttribute('name', 'twitter:image'); _tl.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_tl); }
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/mission");
    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"}, {"@type": "ListItem", "position": 2, "name": "Mission", "item": "https://www.themuslim.company/mission"}]}, {"@context": "https://schema.org", "@type": "WebPage", "name": "Mission \u2014 The Muslim Company", "description": "The mission of The Muslim Company: faith-driven, civilization-oriented global development.", "url": "https://www.themuslim.company/mission", "publisher": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}}].forEach(schema => {
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
        <title>Our Mission — The Muslim Company</title>
        <meta name="description" content="The Muslim Company's mission: building a civilization-driven global conglomerate inspired by ethical leadership — empowering humanity through innovation." />
        <link rel="canonical" href="https://www.themuslim.company/mission" />
        <meta property="og:title" content="Our Mission | The Muslim Company" />
        <meta property="og:url" content="https://www.themuslim.company/mission" />
      </Helmet>
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-primary py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial={isBot ? "visible" : "hidden"} animate="visible" variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-4">Core Mission</p>
              <h1 className="font-serif text-5xl md:text-6xl text-primary-foreground mb-6">Our Mission</h1>
              <p className="font-serif text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                "To build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, justice, sustainability, and social development."
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl space-y-12">

            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="font-serif text-2xl text-primary mb-5">What We Are Here to Do</h3>
                <Bullets items={[
                  "Serve humanity through ethical and Shariah-compliant systems",
                  "Build a global Islamic ethical business ecosystem",
                  "Ensure human welfare and social justice",
                  "Make food, clothing, housing, education, and healthcare more accessible",
                  "Support research, science, innovation, and technology",
                  "Create sustainable economic opportunities",
                  "Promote knowledge, morality, and human dignity",
                  "Revive the legacy of Muslim civilization through ethical development",
                ]} />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-primary mb-5">Organizational Philosophy</h3>
                <Bullets items={[
                  "Business should serve humanity",
                  "Knowledge and morality must go together",
                  "Economic development must remain ethical",
                  "Nature and creation are trusts from Allah",
                  "Human welfare is a responsibility, not only a strategy",
                  "Long-term success comes through honesty, justice, discipline, and service",
                  "Ethical and halal wealth contains true barakah",
                ]} />
              </div>
            </motion.div>

            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10">
              <p className="font-sans text-sm text-primary/60 leading-relaxed">
                The purpose of the company is not only commercial success, but also the development of humanity, establishment of justice, protection of moral values, advancement of knowledge, and rebuilding a strong ethical civilization. The company seeks to contribute toward restoring the Muslim world's historical excellence in science, philosophy, literature, medicine, economics, technology, education, governance, and social development.
              </p>
            </motion.div>

            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-primary text-primary-foreground">
              <h3 className="font-serif text-2xl mb-4">Serving humanity through:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Ethical Business", "Knowledge", "Innovation", "Justice", "Sustainability", "Social Development", "Humanitarian Work", "Civilization Building"].map((v, i) => (
                  <div key={i} className="px-4 py-3 border border-secondary/30 text-center">
                    <p className="font-sans text-xs tracking-wide text-secondary/80">{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <h3 className="font-serif text-2xl text-primary mb-5">Continue Exploring</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-primary/10">
                {[
                  { href: "/vision", label: "Our Vision", desc: "A century-long roadmap toward an ethical civilization." },
                  { href: "/foundation", label: "Islamic Foundation", desc: "The Quranic and Prophetic basis for every decision we make." },
                  { href: "/founder", label: "Founder & CEO", desc: "Meet Shariful Islam and the story behind The Muslim Company." },
                  { href: "/sectors", label: "Areas of Work", desc: "20+ halal, Shariah-compliant sectors we operate in." },
                  { href: "/constitution", label: "Constitutional Framework", desc: "How our mission is protected for generations to come." },
                  { href: "/humanitarian", label: "Humanitarian Development", desc: "10% of monthly profit to charity and disaster relief." },
                ].map((item, i) => (
                  <Link key={i} href={item.href} className="py-5 px-6 border-b border-r-0 sm:border-r border-primary/10 flex justify-between items-center group hover:bg-card transition-colors">
                    <div>
                      <span className="font-serif text-lg text-primary group-hover:text-secondary transition-colors block">{item.label}</span>
                      <span className="font-sans text-xs text-primary/55">{item.desc}</span>
                    </div>
                    <MoveRight className="w-4 h-4 text-primary/20 group-hover:text-secondary transition-colors flex-shrink-0 ml-4" />
                  </Link>
                ))}
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
