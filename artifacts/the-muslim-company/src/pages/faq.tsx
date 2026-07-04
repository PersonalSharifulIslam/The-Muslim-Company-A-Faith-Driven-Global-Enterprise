import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ChevronDown } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const FAQ_GROUPS = [
  {
    title: "About The Muslim Company",
    items: [
      { q: "What is The Muslim Company?", a: "The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by Shariful Islam. It operates across 20+ sectors — including Technology, AI, Manufacturing, Renewable Energy, Healthcare, Education, Media, and Humanitarian Development — under a fully Shariah-compliant, halal, and riba-free framework." },
      { q: "Who founded The Muslim Company, and who leads it today?", a: "The Muslim Company was founded by Shariful Islam, who serves as its Founder, Chairman, Managing Director, and CEO." },
      { q: "Where is The Muslim Company headquartered?", a: "The Muslim Company is headquartered in Niketon Bazaar, Dhaka-1212, Bangladesh." },
      { q: "What does 'Amanah, Ilm, Rahmah' mean?", a: "These are the company's three guiding principles: Amanah (Trust & Integrity), Ilm (Knowledge & Excellence), and Rahmah (Mercy & Service) — drawn from Islamic teaching and applied to every business decision." },
    ],
  },
  {
    title: "Business & Sectors",
    items: [
      { q: "What sectors does The Muslim Company operate in?", a: "The company works across 20+ beneficial and halal sectors, including Technology & AI, Healthcare, Renewable Energy, Manufacturing, Education, Islamic Finance & FinTech, Media, and Humanitarian & Social Welfare." },
      { q: "What is The Bayt Al-Mal Bank?", a: "The Bayt Al-Mal Bank is The Muslim Company's Islamic banking arm, offering interest-free (riba-free), Shariah-compliant banking, savings, and financing products, alongside its fintech app DinarX and the Dirham Payment Gateway." },
      { q: "Is The Muslim Company publicly traded?", a: "No. The Muslim Company is privately held. Business inquiries and partnership requests can be directed to our Contact page." },
    ],
  },
  {
    title: "Governance & Shariah Compliance",
    items: [
      { q: "Is The Muslim Company Shariah-compliant?", a: "Yes. Every entity under the group is overseen by a Supreme Shariah Board and reviewed against the Maqasid al-Shariah (the higher objectives of Islamic law). Operations are completely free from riba (interest), bribery, and exploitation." },
      { q: "How are new products and services approved?", a: "New products, services, and technologies follow a three-stage pipeline: Research & Development builds and documents the initiative, the Council of Ethical Scholars, Scientists & Experts independently analyzes its scientific validity and safety, and the Supreme Shariah Board gives final approval against Quran, Sunnah, and Maqasid al-Shariah." },
      { q: "Where can I read the company's governance structure?", a: "Full details are published on our Governance and Constitution pages, along with our Transparency Reports." },
    ],
  },
  {
    title: "Careers",
    items: [
      { q: "How do I apply for a job at The Muslim Company?", a: "Open roles are listed on our Careers page. You can also reach the recruitment team directly at careers@themuslim.company." },
      { q: "Does The Muslim Company hire internationally?", a: "The Muslim Company operates and hires across multiple countries as the business grows. Check the Careers page for current openings and their locations." },
    ],
  },
  {
    title: "Foundation & Humanitarian Work",
    items: [
      { q: "What is The Muslim Company Foundation?", a: "The Muslim Company Foundation is the company's dedicated humanitarian and environmental arm, funded by zakat, sadaqah, and 10% of monthly net profit — directed toward relief, education, healthcare, orphan care, and environmental work." },
      { q: "Which countries has the Foundation helped?", a: "The Foundation has provided humanitarian relief and community support to people in Bangladesh, Pakistan, Nigeria, Ghana, Gambia, and other African nations, with support from individual donors across multiple countries." },
      { q: "Does The Muslim Company give back to the community?", a: "Yes. The company commits 10% of monthly net profit to Fi Sabilillah — for Allah's path — in addition to fully distributing annual zakat, supporting mosques, madrasas, education scholarships, healthcare, and orphan care." },
      { q: "How can I donate or get involved?", a: "Visit our Get Involved or Foundation pages, or email help@themuslim.company. Formal individual-donor channels are being finalized." },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-primary/10 bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
      >
        <span className="font-serif text-base text-primary">{q}</span>
        <ChevronDown className={`w-4 h-4 text-secondary flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="font-sans text-sm text-primary/60 leading-relaxed px-5 pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  useEffect(() => {
    document.title = "Frequently Asked Questions — The Muslim Company";
    const desc = "Answers to common questions about The Muslim Company — our business, sectors, Shariah governance, careers, and humanitarian Foundation work.";

    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', desc);
    const _can = document.querySelector('link[rel="canonical"]');
    if (_can) { _can.setAttribute('href', 'https://www.themuslim.company/faq'); } else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = 'https://www.themuslim.company/faq'; document.head.appendChild(_cl); }
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "Frequently Asked Questions — The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', desc);
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/faq");

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const allFaqs = FAQ_GROUPS.flatMap(g => g.items);
    [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" }, { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://www.themuslim.company/faq" }] },
      { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": allFaqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
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
        <title>Frequently Asked Questions — The Muslim Company</title>
        <meta name="description" content="Answers to common questions about The Muslim Company — our business, sectors, Shariah governance, careers, and humanitarian Foundation work." />
        <link rel="canonical" href="https://www.themuslim.company/faq" />
      </Helmet>

      <section className="bg-primary py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-4">Help Center</p>
            <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">Frequently Asked Questions</h1>
            <p className="font-sans text-sm text-primary-foreground/60 max-w-xl mx-auto">
              Common questions about The Muslim Company, our sectors, governance, careers, and humanitarian work.
              Can't find what you're looking for? <a href="/contact" className="text-secondary hover:underline">Contact us</a>.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background">
        <div className="container mx-auto max-w-3xl space-y-12">
          {FAQ_GROUPS.map(group => (
            <motion.div key={group.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h2 className="font-serif text-xl text-primary mb-4">{group.title}</h2>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
