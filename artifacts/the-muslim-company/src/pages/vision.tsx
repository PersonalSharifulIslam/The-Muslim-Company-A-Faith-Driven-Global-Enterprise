import { useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import SiteLayout from "@/components/SiteLayout";
import visionBg from "@/assets/images/vision.webp";

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
  useEffect(() => {
    document.title = "Vision — The Muslim Company";
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "The Muslim Company's long-term vision: universities, research centers, hospitals, ethical AI institutions, and civilization-scale development guided by faith, knowledge, and justice.");
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "Vision — The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "The Muslim Company's long-term vision: universities, research centers, hospitals, ethical AI institutions, and civilization-scale development guided by faith, knowledge, and justice.");
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/vision");
    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"}, {"@type": "ListItem", "position": 2, "name": "Vision", "item": "https://www.themuslim.company/vision"}]}, {"@context": "https://schema.org", "@type": "WebPage", "name": "Vision \u2014 The Muslim Company", "description": "The Muslim Company's long-term vision for ethical civilization-scale development.", "url": "https://www.themuslim.company/vision", "publisher": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}}].forEach(schema => {
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
        <title>Our Vision – The Future is Ethical | The Muslim Company</title>
        <meta name="description" content="The Muslim Company's long-term vision: universities, research centers, hospitals, innovation hubs, and ethical AI institutions guided by faith, knowledge, and justice." />
        <link rel="canonical" href="https://www.themuslim.company/vision" />
        <meta property="og:title" content="Our Vision | The Muslim Company" />
        <meta property="og:url" content="https://www.themuslim.company/vision" />
      </Helmet>
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-primary">
          <motion.div className="absolute inset-0 z-0"
            initial={{ scale: 1.08 }} animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}>
            <div className="absolute inset-0 bg-primary/70 z-10" />
            <img src={visionBg} alt="Vision" className="w-full h-full object-cover" />
          </motion.div>
          <div className="relative z-10 container px-6 mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
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

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Our Vision</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-6">
                To become a globally recognized faith-driven institution demonstrating how Islamic values and modern innovation can work together to solve humanity's greatest challenges.
              </h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
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

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
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
