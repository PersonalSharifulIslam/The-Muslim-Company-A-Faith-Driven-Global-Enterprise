import { motion } from "framer-motion";
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

export default function TermsOfService() {
  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Legal</p>
            <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">Terms of Service</h1>
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
              <p className="font-sans text-xs text-primary/50 mt-2">These Terms of Service govern your relationship with The Muslim Company. By accessing our platform, you enter into a binding agreement rooted in ethical conduct, mutual respect, and the principles of Islamic Shariah.</p>
            </motion.div>
            <Section title="1. Acceptance of Terms">
              <p>By accessing or using <strong>www.themuslim.company</strong>, you agree to be bound by these Terms. If you do not agree, you must immediately cease use of the Platform.</p>
              <p>These Terms are governed by the laws of Bangladesh, Islamic Shariah, and applicable international legal standards.</p>
            </Section>
            <Section title="2. About The Muslim Company">
              <p>The Muslim Company LTD is a faith-driven global enterprise founded in January 2025, headquartered in Dhaka, Bangladesh. Our mission is to build ethical, knowledge-driven institutions that serve humanity in accordance with Islamic values.</p>
            </Section>
            <Section title="3. Eligibility & User Conduct">
              <ul className="list-none space-y-2">{["You are at least 18 years of age","All information you provide is accurate, truthful, and complete","You will use the Platform solely for lawful and ethical purposes","You will not engage in any activity contrary to Islamic ethical principles","You will not attempt to gain unauthorized access to any part of the Platform","You will not transmit any content that is unlawful, defamatory, or obscene"].map((item,i)=><li key={i} className="flex items-start gap-2"><span className="text-secondary mt-0.5">◆</span><span>{item}</span></li>)}</ul>
            </Section>
            <Section title="4. Recruitment & Application Terms">
              <ul className="list-none space-y-2">{["All information submitted is truthful and complete. False information constitutes a breach of Amanah","Your CV and documents may be reviewed by our Talent Acquisition team","Submission does not guarantee an interview, offer, or employment","Employment offers are subject to a 72-hour acceptance window","Upon accepting an offer, you are bound by the 7-day onboarding reporting window","Fraudulent credentials will result in immediate disqualification"].map((item,i)=><li key={i} className="flex items-start gap-2"><span className="text-secondary mt-0.5">◆</span><span>{item}</span></li>)}</ul>
            </Section>
            <Section title="5. Intellectual Property">
              <p>All content on this Platform is the exclusive intellectual property of The Muslim Company LTD. You may not reproduce, distribute, or commercially exploit any content without our prior written consent.</p>
              <p className="border-l-2 border-secondary pl-3 italic text-primary/60">The name "The Muslim Company," our logo, and brand elements are protected trademarks.</p>
            </Section>
            <Section title="6. Shariah Compliance Commitment">
              <ul className="list-none space-y-2">{["All our business activities are conducted on a Halal and Riba-free basis","We do not engage in or facilitate any transaction prohibited by Islamic law","Our platform is not to be used to promote any Haram activity","We reserve the right to refuse service to entities conflicting with our Islamic ethical standards"].map((item,i)=><li key={i} className="flex items-start gap-2"><span className="text-secondary mt-0.5">◆</span><span>{item}</span></li>)}</ul>
            </Section>
            <Section title="7. Disclaimer of Warranties">
              <p>The Platform is provided on an "as is" basis without warranties of any kind. Information provided does not constitute professional legal, financial, or religious advisory services.</p>
            </Section>
            <Section title="8. Limitation of Liability">
              <p>To the fullest extent permitted by law, The Muslim Company LTD shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>
            </Section>
            <Section title="9. Third-Party Links & Services">
              <p>Our Platform may contain links to third-party websites. These do not constitute an endorsement. The Muslim Company is not responsible for third-party content or practices.</p>
            </Section>
            <Section title="10. Termination of Access">
              <p>We reserve the right to suspend or terminate your access at our sole discretion for conduct violating these Terms, our ethical standards, or applicable law.</p>
            </Section>
            <Section title="11. Governing Law & Dispute Resolution">
              <p>These Terms are governed by the laws of Bangladesh. Disputes shall be subject to the courts of Dhaka, Bangladesh.</p>
              <p className="border-l-2 border-secondary pl-3 italic text-primary/60">"And if you disagree over anything, refer it to Allah and the Messenger." — Quran 4:59</p>
            </Section>
            <Section title="12. Amendments">
              <p>We reserve the right to modify these Terms at any time. Material changes will be notified through our website.</p>
            </Section>
            <Section title="13. Contact Us">
              <div className="bg-primary text-primary-foreground p-5">
                <p className="font-sans text-[10px] tracking-widest uppercase text-secondary/60 mb-3">Contact Information</p>
                <p className="font-sans text-sm mb-1"><strong className="text-secondary">The Muslim Company LTD</strong></p>
                <p className="font-sans text-sm text-primary-foreground/70 mb-1">Dhaka, Bangladesh</p>
                <p className="font-sans text-sm text-secondary">help@themuslim.company</p>
              </div>
              <p className="italic text-primary/50">Jazakallah Khair for choosing The Muslim Company.</p>
            </Section>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
