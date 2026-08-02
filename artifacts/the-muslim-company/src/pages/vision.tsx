import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";
import visionBg from "@/assets/images/vision.webp";
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

export default function VisionPage() {
  const [isBot] = useState(isCrawlerUA);
  useEffect(() => {
    document.title = "Our Vision — The Muslim Company";

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
    if (_md) _md.setAttribute('content', "The Muslim Company's long-term vision extends beyond commerce: establishing universities, research centers, hospitals, and ethical AI institutions, and pursuing civilization-scale humanitarian and scientific development guided by Islamic principles of faith, knowledge, and justice.");
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "Our Vision | The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "The Muslim Company's long-term vision: universities, research centers, hospitals, ethical AI institutions, and civilization-scale development guided by faith, knowledge, and justice.");
    const _twt_fix = document.querySelector('meta[name="twitter:title"]');
    if (_twt_fix) _twt_fix.setAttribute('content', "Our Vision | The Muslim Company");
    const _twd_fix = document.querySelector('meta[name="twitter:description"]');
    if (_twd_fix) _twd_fix.setAttribute('content', "The Muslim Company's long-term vision: universities, research centers, hospitals, ethical AI institutions, and civilization-scale development guided by faith, knowledge, and justice.");
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) { _ogi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _il = document.createElement('meta'); _il.setAttribute('property', 'og:image'); _il.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_il); }
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) { _twi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _tl = document.createElement('meta'); _tl.setAttribute('name', 'twitter:image'); _tl.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_tl); }
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/vision");
    const _can = document.querySelector('link[rel="canonical"]');
    if (_can) { _can.setAttribute('href', 'https://www.themuslim.company/vision'); } else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = 'https://www.themuslim.company/vision'; document.head.appendChild(_cl); }
    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"}, {"@type": "ListItem", "position": 2, "name": "Vision", "item": "https://www.themuslim.company/vision"}]}, {"@context": "https://schema.org", "@type": "WebPage", "name": "Vision \u2014 The Muslim Company", "description": "The Muslim Company's long-term vision for ethical civilization-scale development.", "url": "https://www.themuslim.company/vision", "publisher": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}}].forEach(schema => {
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
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-primary">
          <motion.div className="absolute inset-0 z-0"
            initial={isBot ? { scale: 1 } : { scale: 1.08 }} animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}>
            <div className="absolute inset-0 bg-primary/70 z-10" />
            <img src={visionBg} alt="Vision" className="w-full h-full object-cover" />
          </motion.div>
          <div className="relative z-10 container px-6 mx-auto text-center">
            <motion.div initial={isBot ? "visible" : "hidden"} animate="visible" variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-5">Long-Term Vision</p>
              <h1 className="text-4xl md:text-6xl font-serif text-primary-foreground mb-6">The Future is Ethical</h1>
              <p className="font-sans text-lg text-primary-foreground/75 max-w-2xl mx-auto">
                Universities. Research centers. Hospitals. Innovation hubs. Ethical AI institutions. Civilization-scale development — guided by faith, knowledge, and justice.
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
 viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Our Vision</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">
                To become a globally recognized faith-driven institution demonstrating how Islamic values and modern innovation can work together to solve humanity's greatest challenges.
              </h2>
            </motion.div>

            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: "Corporate University & Academies", items: ["Universities & leadership academies", "Islamic economics institutes", "AI research centers", "Technology training institutes"] },
                { title: "Future Civilization Research Center", items: ["Islamic civilization studies", "Ethical economics & AI ethics", "Environmental sustainability", "Healthcare innovation"] },
                { title: "Global Muslim Innovation Network", items: ["Muslim scientists & engineers", "Ethical entrepreneurs & AI specialists", "Islamic scholars & educators", "Humanitarian experts"] },
                { title: "Ethical Smart Cities", items: ["Knowledge-centered urban systems", "Sustainable communities", "Halal economic districts", "Environmentally balanced infrastructure"] },
                { title: "Civilization Archive & Waqf", items: ["Educational & research waqf systems", "Humanitarian waqf funds", "Multi-language knowledge accessibility"] },
                { title: "Strategic Vision Office", items: ["50-year & 100-year civilization planning", "Ethical future development", "Global technological change forecasting"] },
              ].map((item, i) => (
                <div key={i} className="p-5 bg-card border border-primary/10">
                  <h4 className="font-serif text-base text-primary mb-3">{item.title}</h4>
                  <Bullets items={item.items} />
                </div>
              ))}
            </motion.div>

            <motion.div initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-primary text-primary-foreground">
              <h3 className="font-serif text-2xl mb-6">The Global Civilization Blueprint</h3>
              <div className="flex flex-wrap gap-3">
                {["Faith", "Knowledge", "Justice", "Ethics", "Compassion", "Innovation", "Responsibility"].map((v, i) => (
                  <div key={i} className="px-5 py-2 border border-secondary/30 font-serif text-sm text-secondary">{v}</div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
