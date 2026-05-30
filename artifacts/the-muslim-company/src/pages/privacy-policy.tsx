import { useEffect, motion } from "framer-motion";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeIn} className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-secondary flex-shrink-0" />
        <h2 className="font-serif text-xl text-primary">{title}</h2>
      </div>
      <div className="font-sans text-sm text-primary/70 leading-relaxed space-y-3 pl-4">
        {children}
      </div>
    </motion.div>
  );
}

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy — The Muslim Company";
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "Privacy Policy of The Muslim Company — how we collect, use, and protect your personal information in accordance with Islamic ethics and international standards.");
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "Privacy Policy — The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "Privacy Policy of The Muslim Company — how we collect, use, and protect your personal information in accordance with Islamic ethics and international standards.");
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/privacy-policy");

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"}, {"@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://www.themuslim.company/privacy-policy"}]}, {"@context": "https://schema.org", "@type": "WebPage", "name": "Privacy Policy \u2014 The Muslim Company", "description": "Privacy Policy of The Muslim Company \u2014 how we collect, use, and protect your personal information in accordance with Islamic ethics and international standards.", "url": "https://www.themuslim.company/privacy-policy", "publisher": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}}].forEach(schema => {
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
      <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Legal</p>
            <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">Privacy Policy</h1>
            <div className="flex flex-wrap gap-6 mt-6">
              <div><p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/40 mb-1">Effective Date</p><p className="font-sans text-sm text-secondary">1 January 2026</p></div>
              <div><p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/40 mb-1">Governed By</p><p className="font-sans text-sm text-secondary">Islamic Law · Bangladesh Law · International Law</p></div>
              <div><p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/40 mb-1">Contact</p><p className="font-sans text-sm text-secondary">help@themuslim.company</p></div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="py-16 px-6 lg:px-12 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
            <motion.div variants={fadeIn} className="border-l-4 border-secondary pl-5 py-3 mb-10 bg-secondary/5">
              <p className="font-serif text-base text-primary italic">"In the name of Allah, the Most Gracious, the Most Merciful."</p>
              <p className="font-sans text-xs text-primary/50 mt-2">The Muslim Company is built upon the principles of Amanah (trust), transparency, and ethical responsibility. This Privacy Policy reflects our commitment to honoring the trust you place in us when you share your personal information.</p>
            </motion.div>
            <Section title="1. Introduction & Our Commitment">
              <p>The Muslim Company LTD ("Company", "we", "our", or "us"), headquartered in Dhaka, Bangladesh, operates the website <strong>www.themuslim.company</strong> and all associated portals. This Privacy Policy governs how we collect, process, store, and protect your personal information in accordance with:</p>
              <ul className="list-none space-y-1">{["The principles of Islamic Shariah — including Amanah (trustworthiness), justice, and the prohibition of harm","The laws of Bangladesh, including the Digital Security Act and relevant data protection regulations","Applicable international standards including GDPR principles where relevant"].map((item,i)=><li key={i} className="flex items-start gap-2"><span className="text-secondary mt-0.5">◆</span><span>{item}</span></li>)}</ul>
              <p>By using our website or services, you acknowledge that you have read, understood, and consent to the practices described in this Policy.</p>
            </Section>
            <Section title="2. Information We Collect">
              <p>We collect the following categories of personal information:</p>
              <div className="space-y-3">{[{title:"Identity Information",desc:"Full name, as provided during job applications or contact forms."},{title:"Contact Information",desc:"Email address, phone number, and physical address."},{title:"Professional Information",desc:"Educational background, work experience, skills, portfolio links, cover letters, and CV documents submitted during the recruitment process."},{title:"Technical Information",desc:"IP address, browser type, device information, and usage data collected automatically when you visit our website."},{title:"Communications",desc:"Any messages, inquiries, or feedback you send to us directly."}].map(({title,desc})=><div key={title} className="border border-primary/10 p-4"><p className="font-sans text-xs font-bold text-secondary uppercase tracking-wider mb-1">{title}</p><p className="font-sans text-sm text-primary/70">{desc}</p></div>)}</div>
            </Section>
            <Section title="3. How We Use Your Information">
              <p>We use your information strictly for the following purposes:</p>
              <ul className="list-none space-y-2">{["Processing and evaluating job applications through our recruitment pipeline","Communicating with you regarding your application status, interview schedules, and employment offers","Improving and maintaining the functionality of our website and portals","Ensuring the security and integrity of our systems","Complying with legal obligations under Bangladesh law and applicable international regulations","Sending important notices, updates, or information relevant to your engagement with us"].map((item,i)=><li key={i} className="flex items-start gap-2"><span className="text-secondary mt-0.5">◆</span><span>{item}</span></li>)}</ul>
              <p className="border-l-2 border-secondary pl-3 italic text-primary/60">We do not sell, rent, trade, or monetize your personal information to any third party.</p>
            </Section>
            <Section title="4. Legal Basis for Processing">
              <ul className="list-none space-y-2">{["Consent — where you have explicitly provided your information for a specific purpose","Contractual necessity — where processing is necessary to fulfill a recruitment or employment agreement","Legal obligation — where we are required by law to process your information","Legitimate interests — where processing is necessary for our legitimate institutional interests"].map((item,i)=><li key={i} className="flex items-start gap-2"><span className="text-secondary mt-0.5">◆</span><span>{item}</span></li>)}</ul>
            </Section>
            <Section title="5. Data Storage & Security">
              <p>Your data is stored securely using industry-standard encryption and security protocols. We employ technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              <p className="border-l-2 border-secondary pl-3 italic text-primary/60">As a trust (Amanah) entrusted to us, we treat your data with the highest level of responsibility and care.</p>
            </Section>
            <Section title="6. Sharing of Information">
              <ul className="list-none space-y-2">{["With trusted service providers who assist in our operations, bound by strict confidentiality obligations","When required by Bangladesh law, court order, or lawful government authority","In the event of a corporate restructuring, merger, or acquisition","With your explicit prior consent for any other purpose"].map((item,i)=><li key={i} className="flex items-start gap-2"><span className="text-secondary mt-0.5">◆</span><span>{item}</span></li>)}</ul>
            </Section>
            <Section title="7. Your Rights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[{right:"Right of Access",desc:"Request a copy of the data we hold about you"},{right:"Right to Rectification",desc:"Request correction of inaccurate or incomplete data"},{right:"Right to Erasure",desc:"Request deletion of your data where no legal basis exists"},{right:"Right to Restriction",desc:"Request that we limit how we process your data"},{right:"Right to Portability",desc:"Request transfer of your data in a structured format"},{right:"Right to Object",desc:"Object to processing based on legitimate interests"}].map(({right,desc})=><div key={right} className="border border-primary/10 p-4"><p className="font-sans text-xs font-bold text-secondary uppercase tracking-wider mb-1">{right}</p><p className="font-sans text-xs text-primary/60">{desc}</p></div>)}</div>
              <p>To exercise any of these rights, contact us at <strong>help@themuslim.company</strong>.</p>
            </Section>
            <Section title="8. Cookies & Tracking">
              <p>Our website uses essential cookies necessary for core functionality. We do not use advertising cookies, tracking pixels, or behavioral profiling technologies.</p>
            </Section>
            <Section title="9. Children's Privacy">
              <p>Our website and services are not directed to individuals under the age of 18. If you believe we have inadvertently collected such information, please contact us at <strong>help@themuslim.company</strong>.</p>
            </Section>
            <Section title="10. Policy Updates">
              <p>We may update this Privacy Policy from time to time. Material changes will be communicated through a prominent notice on our website.</p>
            </Section>
            <Section title="11. Contact & Complaints">
              <div className="bg-primary text-primary-foreground p-5">
                <p className="font-sans text-[10px] tracking-widest uppercase text-secondary/60 mb-3">Contact Information</p>
                <p className="font-sans text-sm mb-1"><strong className="text-secondary">The Muslim Company LTD</strong></p>
                <p className="font-sans text-sm text-primary-foreground/70 mb-1">Dhaka, Bangladesh</p>
                <p className="font-sans text-sm text-secondary">help@themuslim.company</p>
              </div>
              <p className="italic text-primary/50">Jazakallah Khair for trusting The Muslim Company.</p>
            </Section>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
