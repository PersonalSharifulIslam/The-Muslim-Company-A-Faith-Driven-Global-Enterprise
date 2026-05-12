import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MoveRight, Globe2, Leaf, HeartHandshake, ShieldCheck, ArrowUpRight,
  BookOpen, Scale, Users, Sprout, Cpu, Building2, Landmark, Heart,
  GraduationCap, Handshake, ChevronDown, ChevronUp, Microscope, Megaphone,
  TreePine, Zap, FlaskConical, Truck, ShoppingBag, BarChart3, Factory,
  DollarSign, BookMarked, Atom, HandHeart, Radio, Bot, Ship,
  Home as HomeIcon, UserCheck, Baby, Clock, Award, Briefcase, Shield, Eye,
  Gavel, Globe, Flame, Mountain, Check, Quote, Menu, X
} from "lucide-react";
import heroBg from "@/assets/images/hero-bg.png";
import visionBg from "@/assets/images/vision.png";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-sans tracking-[0.3em] uppercase text-secondary font-bold mb-4">
      {children}
    </p>
  );
}

function BlockQuote({ children, author }: { children: React.ReactNode; author?: string }) {
  return (
    <div className="border-l-4 border-secondary pl-6 py-2 my-8">
      <Quote className="w-6 h-6 text-secondary/50 mb-3" />
      <p className="font-serif text-xl md:text-2xl text-primary italic leading-relaxed">{children}</p>
      {author && <p className="mt-4 font-sans text-sm tracking-widest uppercase text-primary/50">— {author}</p>}
    </div>
  );
}

function BulletList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 font-sans text-primary/70 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2.5 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-primary/10">
      <button
        data-testid={`accordion-${title.toLowerCase().replace(/\s+/g, "-")}`}
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-5 text-left font-serif text-lg text-primary hover:text-secondary transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 font-sans text-primary/70 leading-relaxed space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SECTORS = [
  { label: "Agriculture & Food", icon: <Sprout className="w-5 h-5" /> },
  { label: "Education & Research", icon: <GraduationCap className="w-5 h-5" /> },
  { label: "Technology & AI", icon: <Cpu className="w-5 h-5" /> },
  { label: "Healthcare & Medicine", icon: <Heart className="w-5 h-5" /> },
  { label: "Construction & Housing", icon: <Building2 className="w-5 h-5" /> },
  { label: "Renewable Energy", icon: <Zap className="w-5 h-5" /> },
  { label: "Media & Journalism", icon: <Radio className="w-5 h-5" /> },
  { label: "Software & Cybersecurity", icon: <Shield className="w-5 h-5" /> },
  { label: "Manufacturing & Industry", icon: <Factory className="w-5 h-5" /> },
  { label: "Islamic Finance & FinTech", icon: <DollarSign className="w-5 h-5" /> },
  { label: "Transportation & Logistics", icon: <Truck className="w-5 h-5" /> },
  { label: "E-commerce", icon: <ShoppingBag className="w-5 h-5" /> },
  { label: "Literature & Publishing", icon: <BookMarked className="w-5 h-5" /> },
  { label: "Philosophy & Civilization Studies", icon: <BookOpen className="w-5 h-5" /> },
  { label: "Scientific Research", icon: <FlaskConical className="w-5 h-5" /> },
  { label: "Social Welfare & Humanitarian Work", icon: <HandHeart className="w-5 h-5" /> },
  { label: "Environmental Protection", icon: <TreePine className="w-5 h-5" /> },
  { label: "Robotics & Automation", icon: <Bot className="w-5 h-5" /> },
  { label: "International Trade", icon: <Ship className="w-5 h-5" /> },
  { label: "Community Development", icon: <HomeIcon className="w-5 h-5" /> },
];

const NAV_LINKS = [
  { label: "Mission", href: "#mission" },
  { label: "Foundation", href: "#foundation" },
  { label: "Sectors", href: "#sectors" },
  { label: "Governance", href: "#governance" },
  { label: "Our People", href: "#people" },
  { label: "Environment", href: "#environment" },
  { label: "Humanitarian", href: "#humanitarian" },
  { label: "Technology", href: "#technology" },
  { label: "Vision", href: "#vision" },
  { label: "Constitution", href: "#constitution" },
  { label: "Founder", href: "#founder" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.3], ["0%", "30%"]);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="w-full bg-background text-foreground overflow-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <a href="#" className="font-serif text-lg font-bold tracking-widest uppercase text-primary-foreground">
            The Muslim Company
          </a>
          <div className="hidden xl:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="font-sans text-xs tracking-widest uppercase text-primary-foreground/60 hover:text-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="#contact">
              <Button
                data-testid="nav-join-us"
                variant="outline"
                size="sm"
                className="border-secondary text-secondary hover:bg-secondary hover:text-primary rounded-none font-sans uppercase tracking-widest text-xs"
              >
                Join Us
              </Button>
            </a>
          </div>
          <button
            data-testid="nav-mobile-toggle"
            className="xl:hidden text-primary-foreground"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden bg-primary border-t border-primary-foreground/10 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setNavOpen(false)}
                    className="font-sans text-sm tracking-widest uppercase text-primary-foreground/70 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: yHero }}>
          <div className="absolute inset-0 bg-primary/75 mix-blend-multiply z-10" />
          <img src={heroBg} alt="Islamic architecture" className="w-full h-full object-cover" />
        </motion.div>
        <div className="relative z-10 container px-6 mx-auto flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-8"
          >
            Faith — Knowledge — Justice — Civilization
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-9xl font-serif text-primary-foreground max-w-5xl leading-[0.9]"
          >
            Building Human Civilization
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 text-lg md:text-xl text-primary-foreground/80 max-w-3xl font-sans font-light"
          >
            A faith-driven, civilization-oriented global company built upon the Quran and authentic Sunnah — serving humanity through ethical business, knowledge, innovation, and justice.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 flex gap-4 flex-wrap justify-center"
          >
            <a href="#mission">
              <Button data-testid="hero-explore" size="lg" className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold">
                Explore Our Mission <MoveRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href="#foundation">
              <Button data-testid="hero-foundation" variant="outline" size="lg" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs">
                Our Foundation
              </Button>
            </a>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown className="w-6 h-6 text-primary-foreground/40" />
          </motion.div>
        </div>
      </section>

      {/* ── INTRODUCTION ── */}
      <section id="intro" className="py-24 lg:py-32 px-6 lg:px-12 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}
            className="text-center"
          >
            <SectionLabel>Introduction</SectionLabel>
            <p className="text-xl md:text-2xl font-sans text-primary/80 leading-relaxed max-w-4xl mx-auto">
              The Muslim Company is a faith-driven, civilization-oriented global company built upon the teachings of the Quran and authentic Sunnah. The company follows a Shariah-compliant and Prophetic model in business, leadership, ethics, social welfare, education, research, technology, and human development.
            </p>
            <p className="mt-6 text-lg font-sans text-primary/60 leading-relaxed max-w-3xl mx-auto">
              The purpose is not only commercial success, but also the development of humanity, establishment of justice, protection of moral values, advancement of knowledge, and rebuilding a strong ethical civilization.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CORE MISSION ── */}
      <section id="mission" className="py-24 lg:py-36 px-6 lg:px-12 bg-card border-t border-primary/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              <SectionLabel>Core Mission</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-serif text-primary mb-10 leading-tight">What We Are Here to Do</h2>
              <BulletList items={[
                "Serve humanity through ethical and Shariah-compliant systems",
                "Build a global Islamic ethical business ecosystem",
                "Ensure human welfare and social justice",
                "Make food, clothing, housing, education, and healthcare more accessible",
                "Support research, science, innovation, and technology",
                "Create sustainable economic opportunities",
                "Promote knowledge, morality, and human dignity",
                "Revive the legacy of Muslim civilization through ethical development",
              ]} />
            </motion.div>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              <SectionLabel>Vision Statement</SectionLabel>
              <blockquote className="text-2xl md:text-3xl font-serif text-primary italic leading-relaxed border-l-4 border-secondary pl-8 py-4">
                "To build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, justice, sustainability, and social development."
              </blockquote>
              <div className="mt-12">
                <SectionLabel>Organizational Philosophy</SectionLabel>
                <BulletList items={[
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
          </div>
        </div>
      </section>

      {/* ── ISLAMIC FOUNDATION ── */}
      <section id="foundation" className="py-24 lg:py-36 px-6 lg:px-12 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-20">
            <SectionLabel>Islamic Foundation</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-serif mb-6">Built on Divine Principles</h2>
            <p className="font-sans text-primary-foreground/70 max-w-2xl mx-auto text-lg">
              Every operation, decision, and system within The Muslim Company is rooted in Quran, authentic Hadith, and Prophetic ethics.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            {[
              { icon: <BookOpen className="w-6 h-6" />, title: "Quran & Authentic Sunnah", desc: "All operations, values, and decisions are guided by divine revelation and verified Prophetic tradition." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Halal Operations", desc: "Every product, service, investment, and partnership must meet strict Shariah-compliant standards." },
              { icon: <Scale className="w-6 h-6" />, title: "Free from Riba", desc: "Completely free from interest, bribery, corruption, fraud, exploitation, and unethical financial practices." },
              { icon: <Gavel className="w-6 h-6" />, title: "Justice & Honesty", desc: "Justice, honesty, discipline, modesty, and accountability are non-negotiable in all dealings." },
              { icon: <Landmark className="w-6 h-6" />, title: "Shariah Governance", desc: "A Supreme Shariah Board oversees all major decisions, ensuring ethical and Islamic compliance at every level." },
              { icon: <Globe2 className="w-6 h-6" />, title: "Prophetic Model", desc: "Leadership, governance, and culture are inspired by the Prophetic Model of mercy, justice, and responsibility." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="p-6 border border-primary-foreground/10 bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors">
                <div className="w-10 h-10 bg-secondary rounded-none flex items-center justify-center mb-4 text-primary">
                  {item.icon}
                </div>
                <h4 className="font-serif text-xl mb-2">{item.title}</h4>
                <p className="font-sans text-sm text-primary-foreground/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Allah-Centered Business */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="bg-primary-foreground/10 border border-secondary/30 p-10 md:p-14"
          >
            <SectionLabel>Allah-Centered Business Philosophy</SectionLabel>
            <h3 className="text-3xl md:text-4xl font-serif mb-8">Charity as an Obligation, Not a Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="text-center">
                <p className="text-5xl font-serif text-secondary font-bold mb-2">10%</p>
                <p className="font-sans text-primary-foreground/70 text-sm leading-relaxed">of net profit allocated monthly to charity and humanitarian causes in the path of Allah</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif text-secondary font-bold mb-2">Zakat</p>
                <p className="font-sans text-primary-foreground/70 text-sm leading-relaxed">Annual zakat calculated and distributed according to Islamic principles at every financial year end</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif text-secondary font-bold mb-2">Beyond</p>
                <p className="font-sans text-primary-foreground/70 text-sm leading-relaxed">Additional welfare and social support programs beyond obligatory charity to help communities</p>
              </div>
            </div>
            <p className="font-sans text-primary-foreground/60 text-sm mb-6">Charitable causes include:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Mosques & Madrasas", "Education Funding", "Healthcare Support", "Poor Communities", "Social Development", "Disaster Relief", "Orphan Support", "Widow Support"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 font-sans text-sm text-primary-foreground/70">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />{item}
                </div>
              ))}
            </div>
            <blockquote className="mt-10 border-l-4 border-secondary pl-6 font-serif text-xl italic text-primary-foreground/90">
              "Businesses that maintain honesty, justice, charity, and the pleasure of Allah receive barakah and long-term stability."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── 20 SECTORS ── */}
      <section id="sectors" className="py-24 lg:py-36 px-6 lg:px-12 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="lg:w-1/3 lg:sticky lg:top-24"
            >
              <SectionLabel>Areas of Work</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-serif text-primary leading-tight mb-6">Across All Sectors of Human Civilization</h2>
              <p className="font-sans text-primary/70 text-lg leading-relaxed">
                The company intends to work across almost all beneficial and halal sectors of human civilization. No beneficial domain should remain outside ethical development.
              </p>
              <p className="mt-4 font-sans text-primary/50 text-sm italic">
                "The company aims to build an integrated civilization-scale ecosystem."
              </p>
            </motion.div>
            <div className="lg:w-2/3">
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 gap-0"
              >
                {SECTORS.map((sector, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeIn}
                    data-testid={`sector-${idx}`}
                    className="py-4 px-4 border-b border-primary/10 flex justify-between items-center group hover:bg-card cursor-default transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-secondary/60 group-hover:text-secondary transition-colors">{sector.icon}</span>
                      <span className="font-serif text-lg text-primary group-hover:text-secondary transition-colors">{sector.label}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-primary/20 group-hover:text-secondary transition-colors" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOVERNANCE ── */}
      <section id="governance" className="py-24 lg:py-36 px-6 lg:px-12 bg-card border-t border-primary/10">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-20">
            <SectionLabel>Governance Structure</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">Governed by Wisdom, Accountability & Faith</h2>
            <p className="font-sans text-primary/60 max-w-2xl mx-auto text-lg">
              The company's governance is inspired by the Prophetic Model — where leadership is amanah, decisions arise from shura, and all authority remains accountable to Allah.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Shariah Board */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-background border border-primary/10"
            >
              <Gavel className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-serif text-primary mb-4">Supreme Shariah Board</h3>
              <p className="font-sans text-primary/70 leading-relaxed mb-6">
                The highest ethical and Shariah approval authority. No major project, product, technology, investment, service, research initiative, marketing campaign, financial structure, or partnership can begin without Board approval.
              </p>
              <p className="font-sans text-sm text-primary/50 mb-4">The Board evaluates based on:</p>
              <BulletList items={[
                "Quran, Sahih Hadith, Ijma & Qiyas",
                "Scientific evidence & ethical reasoning",
                "Social impact & human welfare",
                "Environmental effect",
                "Long-term civilization consequences",
              ]} />
              <p className="mt-6 font-sans text-sm text-primary/60 italic">
                Even after approval, if future evidence proves harm, the Board may cancel approval, stop production, or shut down services.
              </p>
            </motion.div>

            {/* Amanah Leadership */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-background border border-primary/10"
            >
              <UserCheck className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-serif text-primary mb-4">Amanah-Based Leadership</h3>
              <p className="font-sans text-primary/70 leading-relaxed mb-6">
                Leadership is not a symbol of superiority or personal privilege. It is amanah (trust) and accountability before Allah. Leaders should:
              </p>
              <BulletList items={[
                "Serve people with humility",
                "Protect justice and fairness",
                "Avoid arrogance and abuse of power",
                "Remain transparent and accountable",
                "Prioritize truth over personal benefit",
                "Protect the weak and vulnerable",
              ]} />
              <blockquote className="mt-6 border-l-4 border-secondary pl-4 font-serif italic text-primary/80">
                "True leadership is measured by responsibility, service, justice, and moral integrity."
              </blockquote>
            </motion.div>

            {/* Shura */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-background border border-primary/10"
            >
              <Users className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-serif text-primary mb-4">Shura — Consultation Framework</h3>
              <p className="font-sans text-primary/70 leading-relaxed mb-6">
                Inspired by the Islamic principle of Shura, the company believes important decisions should involve consultation, wisdom, and collective expertise. The company may establish:
              </p>
              <BulletList items={[
                "Expert consultation councils",
                "Strategic advisory committees",
                "Ethical review sessions",
                "Community feedback systems",
                "Emergency consultation mechanisms",
              ]} />
            </motion.div>

            {/* Maqasid */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-background border border-primary/10"
            >
              <Scale className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-serif text-primary mb-4">Maqasid al-Shariah Framework</h3>
              <p className="font-sans text-primary/70 leading-relaxed mb-6">
                Every major policy, technology, product, or project is reviewed according to the higher objectives of Shariah. The company aims to protect:
              </p>
              <BulletList items={[
                "Faith and religious integrity",
                "Human life and safety",
                "Human intellect and education",
                "Wealth and economic justice",
                "Family and social stability",
                "Human dignity and honor",
                "Environmental balance and creation",
              ]} />
            </motion.div>
          </div>

          {/* Council of Scholars */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="p-8 bg-primary text-primary-foreground"
          >
            <Microscope className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-2xl font-serif mb-4">Council of Ethical Scholars, Scientists & Strategic Experts</h3>
            <p className="font-sans text-primary-foreground/70 leading-relaxed mb-6">
              A permanent interdisciplinary council to help the company responsibly navigate future civilization challenges, consisting of Islamic scholars, scientists, engineers, economists, AI researchers, doctors, psychologists, environmental specialists, strategic thinkers, and humanitarian experts — guided by Quranic ethics, Sahih Hadith, Prophetic principles, and verified scientific understanding.
            </p>
            <p className="font-sans text-sm text-primary-foreground/50">
              "The company believes future challenges require cooperation between knowledge, ethics, and wisdom."
            </p>
          </motion.div>

          {/* Transparency */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mt-10 p-8 bg-background border border-primary/10"
          >
            <Eye className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-2xl font-serif text-primary mb-4">Annual Audit & Public Transparency</h3>
            <p className="font-sans text-primary/70 mb-6">At the end of every year, the company may conduct financial audits, Shariah audits, operational reviews, ethical compliance reviews, environmental impact reviews, and welfare and zakat reviews. Public annual reports may include:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Revenue & expenditure summaries",
                "Zakat & charity distributions",
                "Tax & VAT payments",
                "Welfare activities",
                "Humanitarian achievements",
                "Ethical governance updates",
                "Environmental projects",
                "Public accountability summaries",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 font-sans text-sm text-primary/70">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />{item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OUR PEOPLE ── */}
      <section id="people" className="py-24 lg:py-36 px-6 lg:px-12 bg-background border-t border-primary/10">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-20">
            <SectionLabel>Our People</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">Workers are Human Beings, Not Disposable Resources</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <Users className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Workforce Structure</h3>
              <p className="font-sans text-primary/70 text-sm leading-relaxed mb-4">
                The company aims to maintain a workforce where the majority are Muslims while also welcoming qualified people from other religions to work respectfully within the company's ethical and professional guidelines.
              </p>
              <p className="font-sans text-primary/50 text-sm italic">
                All employees, regardless of religion, must respect the company's rules, ethics, discipline, and professional culture.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <Baby className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Women's Workplace & Maternity</h3>
              <p className="font-sans text-primary/70 text-sm leading-relaxed mb-4">
                Separate and secure working environments for women, with privacy and modesty-focused facilities. Safe, respectful workplaces with professional development opportunities.
              </p>
              <p className="font-sans text-sm font-bold text-primary mb-2">Maternity Leave: 1 to 1.5 Years</p>
              <BulletList items={[
                "30% of salary continued while at home",
                "Remaining 70% may fund a temporary replacement",
                "Original position retained upon return",
                "Maternal health & child welfare prioritized",
              ]} />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <Clock className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Long-Term Pension Policy</h3>
              <p className="font-sans text-primary/70 text-sm leading-relaxed mb-4">
                Employees who serve with honesty, loyalty, and professionalism for 15 or more years qualify for long-term service benefits.
              </p>
              <BulletList items={[
                "Pension systems & monthly retirement support",
                "One-time retirement assistance",
                "Emergency welfare support",
                "Family assistance programs",
                "Long-service appreciation benefits",
              ]} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <Award className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Recruitment & Leadership</h3>
              <p className="font-sans text-primary/70 text-sm mb-4">Recruitment prioritizes:</p>
              <BulletList items={[
                "Knowledge, education & professional skills",
                "Character, honesty & discipline",
                "Islamic ethics & manners",
                "Leadership ability & service mentality",
              ]} />
              <p className="mt-6 font-sans text-primary/70 text-sm mb-3">Special consideration is given to those who:</p>
              <BulletList items={[
                "Have strong Quran recitation skills",
                "Are Huffaz of the Quran",
                "Understand Shariah and Islamic ethics deeply",
                "Demonstrate strong moral character",
              ]} />
              <blockquote className="mt-6 border-l-4 border-secondary pl-4 font-serif text-sm italic text-primary/80">
                "Knowledge, morality, character, and skill together create strong leaders and strong civilizations."
              </blockquote>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <Briefcase className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Employee Rights & Welfare</h3>
              <p className="font-sans text-primary/70 text-sm mb-4">Fair treatment for all workers — from lowest-level workers to top executives:</p>
              <BulletList items={[
                "Fair salaries & benefits",
                "Safe work environments",
                "Respectful treatment at all times",
                "Training & development opportunities",
                "Welfare & support systems",
                "Justice & complaint resolution systems",
                "Prayer facilities in the workplace",
                "Jumu'ah-centered scheduling where possible",
              ]} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <Heart className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Employee Family Welfare System</h3>
              <BulletList items={[
                "Educational scholarships for children",
                "Emergency family support",
                "Healthcare assistance",
                "Orphan & widow support initiatives",
                "Housing assistance programs",
                "Employee family counseling & welfare",
                "Mental wellness & emotional support systems",
              ]} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <GraduationCap className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Employee Education & Development</h3>
              <BulletList items={[
                "Islamic ethics education",
                "Technology & AI training",
                "Leadership development programs",
                "Communication & professionalism training",
                "Financial literacy programs",
                "Mental wellness & personal development",
                "Research & innovation support",
              ]} />
            </motion.div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mt-10 p-8 bg-primary/5 border border-primary/10"
          >
            <h3 className="text-xl font-serif text-primary mb-4">Worker Loyalty Recognition System</h3>
            <p className="font-sans text-primary/70 leading-relaxed">
              The company believes workers who sincerely contributed to building the institution deserve recognition and respect. A permanent digital historical worker archive may be maintained containing names, duration of contribution, service records, and loyalty recognition records — for current workers, former workers, retired employees, and long-term contributors.
            </p>
            <blockquote className="mt-6 border-l-4 border-secondary pl-4 font-serif text-lg italic text-primary/80">
              "Institutions are not built only by founders and executives, but also by the workers, staff, and ordinary people who dedicated their time, effort, and loyalty."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── ENVIRONMENT ── */}
      <section id="environment" className="py-24 lg:py-36 px-6 lg:px-12 bg-card border-t border-primary/10">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-20">
            <SectionLabel>Environmental Stewardship</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6 max-w-3xl">
              Nature is a Trust from Allah. We Guard It.
            </h2>
            <p className="font-sans text-primary/70 text-lg max-w-2xl leading-relaxed">
              The company believes nature, animals, forests, rivers, mountains, ecosystems, and all living beings are creations of Allah and trusts upon humanity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { icon: <TreePine />, title: "No Intentional Destruction", desc: "No development will intentionally destroy nature. Environmental balance must be protected in all operations." },
              { icon: <Zap />, title: "Renewable Energy", desc: "Clean and renewable energy will be encouraged across all operations. Pollution and waste will be minimized." },
              { icon: <Mountain />, title: "Wildlife Protection", desc: "Animals and wildlife must be treated with mercy and responsibility. Biodiversity protection initiatives will be supported." },
              { icon: <Sprout />, title: "Reforestation", desc: "Tree plantation and ecological restoration programs will be actively encouraged and funded." },
              { icon: <Leaf />, title: "Minimal Waste", desc: "Sustainable production, waste reduction, recyclable systems, eco-friendly packaging, and long-lasting product design." },
              { icon: <Globe />, title: "Environmental Restoration", desc: "Not only protection — active restoration including reforestation, water restoration, wildlife rehabilitation, and ecological balance projects." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className="p-6 bg-background border border-primary/10"
              >
                <div className="text-secondary mb-4 w-7 h-7">{item.icon}</div>
                <h4 className="font-serif text-lg text-primary mb-2">{item.title}</h4>
                <p className="font-sans text-sm text-primary/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <blockquote className="text-2xl md:text-3xl font-serif text-primary italic border-l-4 border-secondary pl-8 py-4">
              "Human development should never come through the destruction of Allah's creation."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── HUMANITARIAN ── */}
      <section id="humanitarian" className="py-24 lg:py-36 px-6 lg:px-12 bg-background border-t border-primary/10">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-20">
            <SectionLabel>Humanitarian Development</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">Serving Humanity is a Moral Obligation</h2>
            <p className="font-sans text-primary/60 max-w-2xl mx-auto text-lg">
              The company believes low-income and working-class people should never lose access to education, healthcare, food, clothing, housing, knowledge, or opportunity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <HandHeart className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-serif text-primary mb-4">Social Welfare & Human Dignity Mission</h3>
              <BulletList items={[
                "Scholarship systems for education",
                "Healthcare support funds",
                "Affordable food systems",
                "Housing support projects",
                "Worker welfare programs",
                "Employment development initiatives",
                "Skill development centers",
              ]} />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <Flame className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-2xl font-serif text-primary mb-4">Disaster Response & Humanitarian Relief</h3>
              <p className="font-sans text-primary/70 text-sm mb-4">An emergency response division may be established for:</p>
              <BulletList items={[
                "Floods & earthquakes",
                "Famines & drought response",
                "War-related humanitarian crises",
                "Refugee support",
                "Emergency food & medical aid",
                "Crisis price stability & fair distribution",
              ]} />
              <p className="mt-6 font-sans text-sm italic text-primary/50">
                "Humanitarian assistance should remain organized, transparent, and dignity-focused."
              </p>
            </motion.div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="p-8 bg-primary text-primary-foreground mb-10"
          >
            <Globe2 className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-2xl font-serif mb-4">Humanitarian Development Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BulletList items={[
                "Reduce poverty and inequality",
                "Improve education & healthcare accessibility",
                "Promote ethical technology and research",
                "Support sustainable development",
              ]} className="text-primary-foreground/70" />
              <BulletList items={[
                "Build future universities, research centers & hospitals",
                "Develop skilled and ethical future generations",
                "Contribute toward a balanced and just civilization",
                "Build innovation hubs for humanity",
              ]} className="text-primary-foreground/70" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-6 bg-card border border-primary/10"
            >
              <h4 className="font-serif text-lg text-primary mb-3">Marriage, Family & Social Stability</h4>
              <p className="font-sans text-sm text-primary/70 mb-4">Strong families create stable civilizations. The company may support:</p>
              <BulletList items={["Marriage counseling", "Family education systems", "Parenting support", "Ethical family media", "Social harmony initiatives"]} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-6 bg-card border border-primary/10"
            >
              <h4 className="font-serif text-lg text-primary mb-3">Children & Next Generation Protection</h4>
              <p className="font-sans text-sm text-primary/70 mb-4">Children and future generations must be protected from harmful systems:</p>
              <BulletList items={["Child-safe technologies", "Ethical educational systems", "Anti-addiction digital design", "Child mental health protection", "Safe online environments"]} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY & AI ── */}
      <section id="technology" className="py-24 lg:py-36 px-6 lg:px-12 bg-card border-t border-primary/10">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-20">
            <SectionLabel>Technology & AI Ethics</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6 max-w-3xl">
              Technology Must Remain Under Ethics — Always
            </h2>
            <p className="font-sans text-primary/70 text-lg max-w-2xl leading-relaxed">
              The company believes not every technologically possible action is ethically acceptable. Advanced technology must remain under ethical and human supervision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-background border border-primary/10"
            >
              <Cpu className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Ethical AI Policy</h3>
              <p className="font-sans text-primary/70 text-sm mb-4">AI and digital systems developed or used by the company should avoid:</p>
              <BulletList items={[
                "Human exploitation & addiction-based manipulation",
                "Mass misinformation & privacy abuse",
                "Psychological harm & unethical surveillance",
                "Harmful automation practices",
                "Manipulation or deception in any form",
              ]} />
              <p className="mt-6 font-sans text-sm font-bold text-primary">AI Ethics Oversight may include:</p>
              <BulletList items={[
                "AI ethics review boards",
                "Human oversight protocols",
                "Algorithm fairness systems",
                "Bias detection systems",
                "Child safety protections",
              ]} />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-background border border-primary/10"
            >
              <Shield className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Data Privacy & Cybersecurity</h3>
              <p className="font-sans text-primary/70 text-sm mb-6">
                Customer, employee, and organizational data will be treated as amanah. Personal information should never be sold, abused, or exploited.
              </p>
              <BulletList items={[
                "Strong cybersecurity systems",
                "Encrypted communication systems",
                "Secure cloud infrastructure",
                "Access-controlled databases",
                "Responsible data management frameworks",
              ]} />
              <div className="mt-6">
                <h4 className="font-serif text-primary mb-3">Digital Civilization & Cyber Ethics</h4>
                <BulletList items={[
                  "Ethical internet systems & privacy protection",
                  "Child digital safety & anti-addiction design",
                  "Responsible social technology",
                  "Truthful information & deepfake detection systems",
                ]} />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Megaphone />, title: "Ethical Media Policy", desc: "Company media must be truth-based, responsible, and educational. Free from fake news, manipulative content, hate-based communication, and immoral promotional systems." },
              { icon: <Radio />, title: "Ethical Entertainment", desc: "Educational documentaries, ethical animation, children's learning content, historical and civilization-focused media — all maintaining ethical and modest standards." },
              { icon: <BarChart3 />, title: "Anti-Monopoly Policy", desc: "The company opposes artificial market manipulation, unfair monopoly systems, hoarding-based exploitation, and destructive syndicate culture." },
              { icon: <Globe />, title: "Ethical Social Media", desc: "The company may develop ethical social platforms with healthy engagement systems, educational communities, and anti-addiction algorithms." },
              { icon: <FlaskConical />, title: "Future Research Labs", desc: "Research laboratories for AI, robotics, renewable energy, ethical biotechnology, sustainable manufacturing, and smart infrastructure — all under Shariah oversight." },
              { icon: <Atom />, title: "Innovation Ethics Limits", desc: "Ethical restrictions regarding harmful AI, manipulative technologies, dangerous biotechnology, unethical surveillance, and human dignity violations." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className="p-6 bg-background border border-primary/10"
              >
                <div className="text-secondary mb-3 w-6 h-6">{item.icon}</div>
                <h4 className="font-serif text-lg text-primary mb-2">{item.title}</h4>
                <p className="font-sans text-sm text-primary/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHARIAH-COMPLIANT FINANCE & COMMERCE ── */}
      <section id="finance" className="py-24 lg:py-36 px-6 lg:px-12 bg-background border-t border-primary/10">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-16">
            <SectionLabel>Ethical Finance & Commerce</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6 max-w-3xl">
              Halal Wealth. Transparent Systems. Fair Trade.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <DollarSign className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Shariah-Compliant Investment</h3>
              <p className="font-sans text-sm text-primary/70 mb-4">All investors, partners, and stakeholders must comply with Shariah-based principles. Completely free from:</p>
              <div className="grid grid-cols-2 gap-2">
                {["Interest (Riba)", "Bribery", "Corruption", "Fraud", "Gambling", "Exploitative finance", "Haram industries", "Unethical activities"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 font-sans text-sm text-primary/70">
                    <X className="w-3 h-3 text-red-400 flex-shrink-0" />{item}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10"
            >
              <Handshake className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-serif text-primary mb-4">Ethical Commerce & Pricing</h3>
              <BulletList items={[
                "Transparent pricing with full cost disclosure",
                "Maximum reseller price maintained and published",
                "Opposition to artificial price manipulation & crisis profiteering",
                "Existing inventory prices remain unchanged if costs rise",
                "Product verification via QR codes, serial authentication & digital tracking",
                "24/7 customer support — hotline, live chat, email & messaging portals",
              ]} />
            </motion.div>
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="p-8 bg-card border border-primary/10"
          >
            <Scale className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-xl font-serif text-primary mb-4">Fair Wage & Worker Dignity Charter</h3>
            <p className="font-sans text-primary/70 mb-6">Inspired by Prophetic teachings regarding workers, the company believes workers deserve dignity, fairness, and respect. Systems to ensure:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BulletList items={["Timely salary payment", "Fair contracts", "Safe working environments", "Respectful treatment — no humiliation culture"]} />
              <BulletList items={["Welfare & support systems", "Skill development opportunities", "Responsible executive compensation", "Ethical wealth circulation"]} />
            </div>
            <blockquote className="mt-6 border-l-4 border-secondary pl-4 font-serif italic text-primary/80">
              "Workers are not disposable resources, but valuable human beings."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ── KNOWLEDGE & VISION ── */}
      <section id="vision" className="relative py-0 overflow-hidden">
        <div className="relative h-[70svh] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-primary/75 z-10" />
            <img src={visionBg} alt="The Future Vision" className="w-full h-full object-cover" />
          </motion.div>
          <div className="relative z-10 container px-6 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-6">Long-Term Global Vision</p>
              <h2 className="text-4xl md:text-6xl font-serif text-primary-foreground mb-8">The Future is Ethical</h2>
              <p className="font-sans text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                We are building universities, research centers, hospitals, innovation hubs, ethical AI institutions, ethical media platforms, and civilization-scale development systems — guided by faith, knowledge, and justice.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-36 px-6 lg:px-12 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-20 text-center">
            <SectionLabel>Knowledge Revival Mission</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Reviving the Golden Age of Islamic Civilization</h2>
            <p className="font-sans text-primary-foreground/60 max-w-2xl mx-auto text-lg">
              The Muslim world once contributed greatly to human civilization. The company seeks to help revive this tradition through ethics, knowledge, and responsible development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              { icon: <GraduationCap />, title: "Corporate University & Academies", items: ["Universities & leadership academies", "Islamic economics institutes", "AI research centers", "Technology training institutes", "Research laboratories"] },
              { icon: <Microscope />, title: "Future Civilization Research Center", items: ["Islamic civilization studies", "Ethical economics & AI ethics", "Environmental sustainability", "Education reform", "Healthcare innovation"] },
              { icon: <Globe />, title: "Global Muslim Innovation Network", items: ["Muslim scientists & engineers", "Ethical entrepreneurs", "AI specialists & educators", "Islamic scholars", "Humanitarian experts"] },
              { icon: <Building2 />, title: "Ethical Smart Cities", items: ["Knowledge-centered urban systems", "Sustainable communities", "Halal economic districts", "Environmentally balanced infrastructure", "Education-focused communities"] },
              { icon: <BookOpen />, title: "Civilization Archive & Waqf", items: ["Research & discoveries preservation", "Educational waqf systems", "Healthcare waqf projects", "Humanitarian waqf funds", "Multi-language knowledge access"] },
              { icon: <Atom />, title: "Strategic Vision Office", items: ["50-year & 100-year planning", "Civilization forecasting", "Ethical future development", "Global technological change", "Human survival challenges"] },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className="p-6 bg-primary-foreground/5 border border-primary-foreground/10"
              >
                <div className="text-secondary mb-4 w-7 h-7">{item.icon}</div>
                <h4 className="font-serif text-xl mb-4">{item.title}</h4>
                <BulletList items={item.items} className="text-primary-foreground/60 text-sm" />
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="p-10 bg-primary-foreground/10 border border-secondary/30"
          >
            <h3 className="text-2xl font-serif mb-6">Future of Humanity Research</h3>
            <p className="font-sans text-primary-foreground/70 mb-6">The company may establish dedicated research focused on major future risks facing humanity:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {["AI civilization risks", "Global moral decline", "Mental health crises", "Family instability", "Water & food insecurity", "Economic injustice", "Digital addiction", "Spiritual emptiness", "Social fragmentation", "Human survival challenges"].map((item, i) => (
                <div key={i} className="flex items-start gap-2 font-sans text-xs text-primary-foreground/60">
                  <div className="w-1 h-1 bg-secondary rounded-full mt-1.5 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION PROTECTION CONSTITUTION ── */}
      <section id="constitution" className="py-24 lg:py-36 px-6 lg:px-12 bg-background border-t border-primary/10">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-20">
            <SectionLabel>Constitutional Framework</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6 max-w-3xl">
              The Mission is Protected — For Generations
            </h2>
            <p className="font-sans text-primary/70 text-lg max-w-2xl leading-relaxed">
              Many great institutions in history lost their original mission because of greed, corruption, or unethical leadership. The Muslim Company establishes a long-term constitutional framework to permanently protect its founding vision.
            </p>
          </motion.div>

          <div className="space-y-0 border border-primary/10 mb-12">
            <AccordionItem title="Mission Preservation Obligation">
              <p>All future chairpersons, CEOs, executive councils, directors, investors, and strategic leaders carry a moral and constitutional responsibility to preserve the company according to Quran, Sahih Hadith, Prophetic ethics, Supreme Shariah Board principles, and the original constitutional framework. No leadership authority should have the right to intentionally destroy the company's ethical mission, remove the Islamic governance structure, or convert the company into a harmful institution.</p>
            </AccordionItem>
            <AccordionItem title="Emergency Ethical Dissolution Clause">
              <p className="mb-4">If the company is intentionally transformed away from its Islamic and ethical foundation, or leadership knowingly betrays the company's foundational principles, an emergency constitutional dissolution mechanism may be activated. Under this framework:</p>
              <BulletList items={[
                "99% of the company's remaining eligible wealth may be redirected toward humanitarian, Islamic, educational, charitable, research, and social welfare causes",
                "1% may be allocated for workers who served the company throughout its operational history",
                "Resources would support Islamic organizations, charitable foundations, humanitarian NGOs, educational institutions, and poverty relief systems",
              ]} />
              <blockquote className="mt-4 border-l-4 border-secondary pl-4 font-serif italic text-primary/80">
                "If an institution can no longer remain faithful to truth, justice, ethics, and the pleasure of Allah, then its wealth and power should continue benefiting humanity rather than becoming tools of corruption."
              </blockquote>
            </AccordionItem>
            <AccordionItem title="Constitutional Safeguards Against Takeover">
              <p className="mb-4">Strict constitutional protections against forced unethical sale, hostile takeover, mission destruction, political capture, corruption-driven restructuring, and removal of Shariah governance. Constitutional mechanisms may include:</p>
              <BulletList items={[
                "Supreme Shariah Board intervention powers",
                "Mission preservation voting protections",
                "Emergency ethical review systems",
                "Long-term constitutional enforcement clauses",
                "Founder vision preservation structures",
              ]} />
            </AccordionItem>
            <AccordionItem title="Internal Ethics & Whistleblower System">
              <p className="mb-4">A special confidential internal division accountable to the Founder may prevent corruption, detect unethical behavior, monitor operational abuse, investigate information leaks, and protect organizational integrity. Whistleblower protections include:</p>
              <BulletList items={[
                "Offline complaint boxes & online reporting systems",
                "Anonymous reporting channels",
                "Confidentiality & anti-retaliation protection",
                "Fair investigation systems & evidence-based review",
              ]} />
            </AccordionItem>
            <AccordionItem title="Post-Founder Continuity Doctrine">
              <p className="mb-4">The company recognizes many institutions collapse after the founder's death. Therefore, the company may establish:</p>
              <BulletList items={[
                "Founder philosophy archives",
                "Institutional continuity systems",
                "Leadership transition frameworks",
                "Long-term mission preservation protocols",
                "Ethical succession systems",
                "Institutional memory preservation tools",
              ]} />
            </AccordionItem>
            <AccordionItem title="Political Neutrality Policy">
              <p className="mb-4">The company will not become a political party or a tool of political power. It will avoid political exploitation, unethical lobbying, bribery-based influence, hate and division politics, and abuse of authority. The company seeks to contribute through:</p>
              <BulletList items={[
                "Knowledge & ethical business",
                "Humanitarian work & employment creation",
                "Research, innovation & social development",
                "Peaceful cooperation",
              ]} />
            </AccordionItem>
            <AccordionItem title="Global Governance Architecture">
              <p className="mb-4">The company may establish a global governance structure with international governance councils, regional leadership structures, country-level operational boards, global ethical coordination systems, and international Shariah compliance divisions — all aligned with halal ethics, human welfare, transparency, and long-term civilization benefit.</p>
            </AccordionItem>
            <AccordionItem title="Enterprise Risk Management">
              <p className="mb-4">Systems for financial crisis management, cybersecurity threats, supply chain disruption, political instability, economic collapse, environmental disasters, leadership corruption prevention, AI misuse protection, and emergency operational continuity. The company believes prevention and preparation are forms of responsibility and amanah.</p>
            </AccordionItem>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="p-8 bg-card border border-primary/10"
          >
            <h3 className="text-2xl font-serif text-primary mb-6">The Global Civilization Blueprint</h3>
            <p className="font-sans text-primary/70 mb-6">The company seeks to build a long-term civilization-focused roadmap guided by:</p>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {["Faith", "Knowledge", "Justice", "Ethics", "Compassion", "Innovation", "Responsibility"].map((v, i) => (
                <div key={i} className="text-center p-4 border border-secondary/30">
                  <p className="font-serif text-secondary text-sm">{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOUNDER'S STATEMENT ── */}
      <section id="founder" className="py-24 lg:py-36 px-6 lg:px-12 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <SectionLabel>Founder's Statement</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif mb-16">A Word from the Founder</h2>

            <div className="mb-16">
              <Quote className="w-10 h-10 text-secondary/50 mx-auto mb-6" />
              <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-primary-foreground/90 mb-8">
                "I do not know whether this company will become successful in the future, or whether I will be able to fully implement all of these plans properly. But my intention is to seek the pleasure of Allah alone and to try, as much as possible, to build something ethical, beneficial, and just by loving and following Prophet Muhammad ﷺ."
              </p>
              <p className="font-sans text-sm tracking-widest uppercase text-secondary">— Shariful Islam, Founder & CEO</p>
            </div>

            <div className="mb-16 p-8 bg-primary-foreground/10 border border-secondary/20">
              <Quote className="w-8 h-8 text-secondary/50 mx-auto mb-4" />
              <p className="font-serif text-lg md:text-xl italic text-primary-foreground/90 mb-6">
                "True success is not only wealth, fame, or power. True success is becoming accepted by Allah and leaving behind benefit for humanity."
              </p>
              <p className="font-sans text-xs tracking-widest uppercase text-secondary/70">— Shariful Islam</p>
            </div>

            <div className="mb-16">
              <Quote className="w-8 h-8 text-secondary/50 mx-auto mb-4" />
              <p className="font-serif text-lg italic text-primary-foreground/90 mb-4">
                "Allah is the owner of everything. Rizq, honor, power, and success come only from Allah."
              </p>
            </div>

            <div className="mb-16">
              <Quote className="w-8 h-8 text-secondary/50 mx-auto mb-4" />
              <p className="font-serif text-lg italic text-primary-foreground/90 mb-4">
                "Human beings plan, work, and struggle, but ultimate success, rizq, honor, and results belong only to Allah."
              </p>
            </div>

            <p className="font-sans text-primary-foreground/60 leading-relaxed max-w-2xl mx-auto">
              The Muslim Company does not claim perfection. The company will try to correct mistakes when they are discovered, accept truth when it becomes clear, protect ethics and justice, benefit humanity, and prioritize the pleasure of Allah above everything else.
            </p>
            <p className="mt-6 font-serif text-xl text-secondary">InshaAllah, as far as Allah allows.</p>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL PHILOSOPHY ── */}
      <section className="py-24 lg:py-36 px-6 lg:px-12 bg-background border-t border-primary/10">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
            <SectionLabel>Final Philosophy</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-serif text-primary mb-8">What We Ultimately Seek</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="space-y-6"
          >
            {[
              "Faith and technology work together",
              "Business and morality remain connected",
              "Human development remains ethical",
              "Nature and civilization remain balanced",
              "Knowledge, justice, and compassion guide leadership",
              "Economic systems serve humanity rather than exploit it",
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn}
                className="flex items-center gap-6 py-6 border-b border-primary/10 group"
              >
                <span className="font-sans text-xs text-secondary/60 w-8 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-serif text-2xl md:text-3xl text-primary group-hover:text-secondary transition-colors">{item}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mt-16 p-10 bg-card border border-primary/10 text-center"
          >
            <p className="font-sans text-primary/70 text-lg leading-relaxed max-w-3xl mx-auto">
              The Muslim Company ultimately aims to build a global ethical civilization model inspired by Islamic values, knowledge, justice, sustainability, and service to humanity — not only as a successful institution, but as a protected ethical legacy designed to survive beyond individuals, generations, and changing times.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA / CONTACT ── */}
      <section id="contact" className="py-24 lg:py-36 px-6 lg:px-12 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <SectionLabel>Join the Effort</SectionLabel>
            <h2 className="text-4xl md:text-6xl font-serif mb-8">Be Part of Something Historic</h2>
            <p className="font-sans text-lg text-primary-foreground/70 mb-12 max-w-2xl mx-auto">
              Whether you are an investor, scientist, scholar, engineer, educator, or professional — if you share our vision for an ethical global civilization built on faith, knowledge, and justice, the door is open.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Button
                data-testid="cta-contact"
                size="lg"
                className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-14 px-10 text-sm font-bold"
              >
                Contact Us <MoveRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                data-testid="cta-partner"
                variant="outline"
                size="lg"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 rounded-none uppercase tracking-widest font-sans h-14 px-10 text-sm"
              >
                Partner With Us
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-primary-foreground/10 pt-16 mb-16">
            {[
              { label: "Sectors of Work", value: "20+" },
              { label: "Monthly Profit to Charity", value: "10%" },
              { label: "Maternity Leave", value: "1.5 Yrs" },
              { label: "Pension after Service", value: "15 Yrs" },
            ].map((stat, i) => (
              <div key={i} className="text-center" data-testid={`stat-${i}`}>
                <p className="font-serif text-4xl text-secondary mb-2">{stat.value}</p>
                <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/50">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-primary-foreground/10 pt-12 flex flex-col md:flex-row justify-between items-center text-sm font-sans text-primary-foreground/40">
            <div>
              <p className="font-serif text-lg text-primary-foreground/60 mb-1">The Muslim Company</p>
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-primary-foreground cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-primary-foreground cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-primary-foreground cursor-pointer transition-colors">Shariah Compliance</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
