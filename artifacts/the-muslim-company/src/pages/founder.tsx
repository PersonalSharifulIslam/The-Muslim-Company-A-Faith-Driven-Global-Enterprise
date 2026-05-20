import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
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

export default function FounderPage() {
  return (
    <SiteLayout>
      <Helmet>
        <title>Shariful Islam – Founder & CEO | The Muslim Company</title>
        <meta name="description" content="Shariful Islam is a Bangladeshi Engineer, Ethical Visionary and Entrepreneur. Founder & CEO of The Muslim Company." />
        <link rel="canonical" href="https://www.themuslim.company/founder" />
        <meta property="og:title" content="Shariful Islam – Founder & CEO | The Muslim Company" />
        <meta property="og:url" content="https://www.themuslim.company/founder" />
      </Helmet>
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-primary py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-4">Founder & CEO</p>
              <h1 className="font-serif text-5xl md:text-7xl text-primary-foreground mb-6">Shariful Islam</h1>
              <p className="font-sans text-base text-primary-foreground/60 max-w-2xl mx-auto">
                Bangladeshi Engineer, Ethical Visionary & Entrepreneur dedicated to building a faith-driven global civilization.
              </p>
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
