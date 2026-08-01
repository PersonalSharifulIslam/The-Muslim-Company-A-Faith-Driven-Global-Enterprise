import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { isCrawlerUA } from "@/lib/isCrawler";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

type FaqLink = { text: string; href: string };
type FaqItemData = { q: string; a: string; links?: FaqLink[] };

const FAQ_GROUPS: { title: string; items: FaqItemData[] }[] = [
  {
    title: "About The Muslim Company",
    items: [
      { q: "What is The Muslim Company?", a: "The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by Shariful Islam. It operates across 20+ sectors — including Technology, AI, Manufacturing, Renewable Energy, Healthcare, Education, Media, and Humanitarian Development — under a fully Shariah-compliant, halal, and riba-free framework." },
      { q: "Who founded The Muslim Company, and who leads it today?", a: "The Muslim Company was founded by Shariful Islam, who serves as its Founder, Chairman, Managing Director, and CEO.", links: [{ text: "Shariful Islam", href: "/founder" }] },
      { q: "Is Shariful Islam of The Muslim Company the same person as the Bangladeshi cricketer Shariful Islam?", a: "No. Shariful Islam, Founder & CEO of The Muslim Company, is a Bangladeshi electrical engineer and entrepreneur born in Jamalpur, Bangladesh, and is not related to or the same person as the Bangladeshi cricketer of the same name." },
      { q: "Where is The Muslim Company headquartered?", a: "The Muslim Company is headquartered in Niketon Bazaar, Dhaka-1212, Bangladesh." },
      { q: "What does 'Amanah, Ilm, Rahmah' mean?", a: "These are the company's three guiding principles: Amanah (Trust & Integrity), Ilm (Knowledge & Excellence), and Rahmah (Mercy & Service) — drawn from Islamic teaching and applied to every business decision." },
    ],
  },
  {
    title: "Business & Sectors",
    items: [
      { q: "What sectors does The Muslim Company operate in?", a: "The company works across 20+ beneficial and halal sectors, including Technology & AI, Healthcare, Renewable Energy, Manufacturing, Education, Islamic Finance & FinTech, Media, and Humanitarian & Social Welfare.", links: [{ text: "20+ beneficial and halal sectors", href: "/sectors" }] },
      { q: "What is The Bayt Al-Mal Bank?", a: "The Bayt Al-Mal Bank is The Muslim Company's Islamic banking arm, offering interest-free (riba-free), Shariah-compliant banking, savings, and financing products, alongside its fintech app DinarX and the Dirham Payment Gateway.", links: [{ text: "The Bayt Al-Mal Bank", href: "/baytalmalbank" }] },
      { q: "Is The Muslim Company publicly traded?", a: "No. The Muslim Company is privately held. Business inquiries and partnership requests can be directed to our Contact page.", links: [{ text: "Contact page", href: "/contact" }] },
      { q: "Where can I see the company's financial transparency reports?", a: "Annual and periodic Transparency Reports covering finances, zakat distribution, and governance are published on our Transparency page.", links: [{ text: "Transparency page", href: "/transparency" }] },
    ],
  },
  {
    title: "Governance & Shariah Compliance",
    items: [
      { q: "Is The Muslim Company Shariah-compliant?", a: "Yes. Every entity under the group is overseen by a Supreme Shariah Board and reviewed against the Maqasid al-Shariah (the higher objectives of Islamic law). Operations are completely free from riba (interest), bribery, and exploitation.", links: [{ text: "Supreme Shariah Board", href: "/shariah-board" }] },
      { q: "How are new products and services approved?", a: "New products, services, and technologies follow a three-stage pipeline: Research & Development builds and documents the initiative, the Council of Ethical Scholars, Scientists & Experts independently analyzes its scientific validity and safety, and the Supreme Shariah Board gives final approval against Quran, Sunnah, and Maqasid al-Shariah.", links: [{ text: "Supreme Shariah Board", href: "/shariah-board" }] },
      { q: "Where can I read the company's governance structure?", a: "Full details are published on our Governance and Constitution pages, along with our Transparency Reports.", links: [{ text: "Governance", href: "/governance" }, { text: "Constitution pages", href: "/constitution" }, { text: "Transparency Reports", href: "/transparency" }] },
      { q: "Is The Muslim Company a legally registered company?", a: "Yes, The Muslim Company is registered in Bangladesh as The Muslim Company LTD." },
      { q: "How can I report an ethical concern or complaint?", a: "A confidential internal division monitors compliance, investigates ethical concerns, and maintains whistleblower protection, reporting directly to the founder and insulated from commercial pressure. Concerns can be raised via help@themuslim.company.", links: [{ text: "help@themuslim.company", href: "mailto:help@themuslim.company" }] },
    ],
  },
  {
    title: "Careers",
    items: [
      { q: "How do I apply for a job at The Muslim Company?", a: "Open roles are listed on our Careers page. You can also reach the recruitment team directly at careers@themuslim.company.", links: [{ text: "Careers page", href: "/careers" }, { text: "careers@themuslim.company", href: "mailto:careers@themuslim.company" }] },
      { q: "Does The Muslim Company hire internationally?", a: "The Muslim Company operates and hires across multiple countries as the business grows. Check the Careers page for current openings and their locations.", links: [{ text: "Careers page", href: "/careers" }] },
      { q: "How do I check my Recruitment/job application status?", a: "You can track your application anytime on our Application Status page using the reference number provided when you applied.", links: [{ text: "Application Status page", href: "/recruitment-status" }] },
      { q: "What employee benefits does The Muslim Company offer?", a: "Employees receive fair wages, dignified workplaces with separate facilities for women, extended maternity leave (1–1.5 years), long-term pension qualification, and family welfare programs." },
    ],
  },
  {
    title: "Foundation & Humanitarian Work",
    items: [
      { q: "What is The Muslim Company Foundation?", a: "The Muslim Company Foundation is the company's dedicated humanitarian and environmental arm, funded by zakat, sadaqah, and 10% of monthly net profit — directed toward relief, education, healthcare, orphan care, and environmental work.", links: [{ text: "The Muslim Company Foundation", href: "/the-muslim-company-foundation" }] },
      { q: "Which countries has the Foundation helped?", a: "The Foundation has provided humanitarian relief and community support to people in Bangladesh, Pakistan, Nigeria, Ghana, Gambia, and other African nations, with support from individual donors across multiple countries.", links: [{ text: "The Foundation", href: "/the-muslim-company-foundation" }] },
      { q: "Does The Muslim Company give back to the community?", a: "Yes. The company commits 10% of monthly net profit to Fi Sabilillah — for Allah's path — in addition to fully distributing annual zakat, supporting mosques, madrasas, education scholarships, healthcare, and orphan care." },
      { q: "Does the Foundation support animal welfare and environmental causes?", a: "Yes. Alongside humanitarian relief for people, the Foundation protects, feeds, and rescues animals, birds, and wildlife, and works on reforestation, tree planting, and ecological restoration — caring for all of Allah's creation." },
      { q: "How is zakat calculated and distributed?", a: "Zakat is calculated annually on all eligible company assets and fully distributed by a qualified Shariah scholar, with distribution details published in our Transparency Reports.", links: [{ text: "Transparency Reports", href: "/transparency" }] },
      { q: "How can I donate or get involved?", a: "Visit our Get Involved or Foundation pages, or email help@themuslim.company. Formal individual-donor channels are being finalized.", links: [{ text: "Get Involved", href: "/get-involved" }, { text: "Foundation pages", href: "/the-muslim-company-foundation" }, { text: "help@themuslim.company", href: "mailto:help@themuslim.company" }] },
    ],
  },
  {
    title: "Contact & Media",
    items: [
      { q: "How do I contact The Muslim Company?", a: "You can reach us at help@themuslim.company, or visit our Contact page for department-specific contacts and our Dhaka office address.", links: [{ text: "help@themuslim.company", href: "mailto:help@themuslim.company" }, { text: "Contact page", href: "/contact" }] },
      { q: "Is there a separate contact for press and media inquiries?", a: "Yes. Journalists and media professionals can reach us at media@themuslim.company, or visit our Newsroom for press releases and company updates.", links: [{ text: "media@themuslim.company", href: "mailto:media@themuslim.company" }, { text: "Newsroom", href: "/newsroom" }] },
    ],
  },
];

// Splits an answer's plain text on each link's `text` and wraps those
// occurrences in a real, clickable <a>. The plain-text `a` field itself
// stays untouched so the FAQPage schema.org JSON-LD (which requires plain
// text, not markup) keeps working exactly as before.
function renderAnswer(text: string, links?: FaqLink[]): ReactNode {
  if (!links || links.length === 0) return text;
  let parts: ReactNode[] = [text];
  links.forEach((link, li) => {
    const next: ReactNode[] = [];
    parts.forEach((part) => {
      if (typeof part !== "string") { next.push(part); return; }
      const pieces = part.split(link.text);
      pieces.forEach((piece, i) => {
        next.push(piece);
        if (i < pieces.length - 1) {
          next.push(
            <a key={`${li}-${i}`} href={link.href} className="text-secondary hover:underline">
              {link.text}
            </a>
          );
        }
      });
    });
    parts = next;
  });
  return parts;
}

function FaqItem({ q, a, links }: { q: string; a: string; links?: FaqLink[] }) {
  const [isBot] = useState(isCrawlerUA);
  const [open, setOpen] = useState(isBot);
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
            initial={isBot ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="font-sans text-sm text-primary/60 leading-relaxed px-5 pb-5">{renderAnswer(a, links)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [isBot] = useState(isCrawlerUA);
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
    const _twt_fix = document.querySelector('meta[name="twitter:title"]');
    if (_twt_fix) _twt_fix.setAttribute('content', "Frequently Asked Questions — The Muslim Company");
    const _twd_fix = document.querySelector('meta[name="twitter:description"]');
    if (_twd_fix) _twd_fix.setAttribute('content', desc);
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
      <section className="bg-primary py-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={isBot ? "visible" : "hidden"} animate="visible" variants={fadeIn}>
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
            <motion.div key={group.title} initial={isBot ? "visible" : "hidden"}
 animate={isBot ? "visible" : undefined}
 whileInView={isBot ? undefined : "visible"}
 viewport={{ once: true }} variants={fadeIn}>
              <h2 className="font-serif text-xl text-primary mb-4">{group.title}</h2>
              <div className="space-y-3">
                {group.items.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} links={item.links} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
