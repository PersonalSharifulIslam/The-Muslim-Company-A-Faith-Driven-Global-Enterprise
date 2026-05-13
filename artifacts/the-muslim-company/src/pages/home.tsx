import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MoveRight, Globe2, Leaf, HeartHandshake, ShieldCheck, ArrowUpRight,
  BookOpen, Scale, Users, Sprout, Cpu, Building2, Heart,
  GraduationCap, Handshake, ChevronDown, ChevronUp, Microscope, Megaphone,
  TreePine, Zap, FlaskConical, Truck, ShoppingBag, Factory,
  DollarSign, BookMarked, Atom, HandHeart, Radio, Bot, Ship,
  Home as LucideHome, UserCheck, Baby, Clock, Award, Briefcase, Shield,
  Gavel, Globe, Flame, Check, Quote, Menu, X, Plus, Minus
} from "lucide-react";
import heroBg from "@/assets/images/hero-bg.png";
import visionBg from "@/assets/images/vision.png";
import logo from "@/assets/images/logo.png";

/* ─── animation variants ─── */
const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

/* ─── small helpers ─── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-sans tracking-[0.35em] uppercase text-secondary font-bold mb-3">
      {children}
    </p>
  );
}

function Bullets({ items, light = false }: { items: string[]; light?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className={`flex items-start gap-3 font-sans text-sm ${light ? "text-primary-foreground/70" : "text-primary/70"}`}>
          <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InlineQuote({ children, author, light = false }: { children: React.ReactNode; author?: string; light?: boolean }) {
  return (
    <div className={`border-l-4 border-secondary pl-5 py-1 my-6`}>
      <p className={`font-serif text-lg italic leading-relaxed ${light ? "text-primary-foreground/90" : "text-primary/80"}`}>
        "{children}"
      </p>
      {author && <p className={`mt-3 font-sans text-xs tracking-widest uppercase ${light ? "text-secondary/70" : "text-primary/40"}`}>— {author}</p>}
    </div>
  );
}

function AccordionItem({ title, children, light = false }: { title: string; children: React.ReactNode; light?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b ${light ? "border-primary-foreground/15" : "border-primary/10"}`}>
      <button
        data-testid={`accordion-${title.toLowerCase().replace(/\s+/g, "-")}`}
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center py-4 text-left font-serif text-base transition-colors ${light ? "text-primary-foreground hover:text-secondary" : "text-primary hover:text-secondary"}`}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
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
            <div className="pb-5 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── ExpandableSection ─── */
function ExpandableSection({
  id,
  label,
  summary,
  summaryNode,
  children,
  dark = false,
}: {
  id?: string;
  label: string;
  summary: string;
  summaryNode?: React.ReactNode;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const fg = dark ? "text-primary-foreground" : "text-primary";
  const fg2 = dark ? "text-primary-foreground/60" : "text-primary/60";
  const border = dark ? "border-primary-foreground/15" : "border-primary/10";

  return (
    <section
      id={id}
      className={`py-20 lg:py-28 px-6 lg:px-12 border-t ${border} ${dark ? "bg-primary text-primary-foreground" : "bg-background"}`}
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeIn}
        >
          {/* always-visible head */}
          <Label>{label}</Label>
          <p className={`font-sans text-sm tracking-[0.2em] uppercase mb-5 ${fg2}`}>{summary}</p>

          {summaryNode && (
            <div className="mb-6">{summaryNode}</div>
          )}

          {/* expand toggle */}
          <button
            data-testid={`expand-${label.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-2 font-sans text-xs tracking-widest uppercase font-bold transition-colors ${
              dark
                ? "text-secondary hover:text-secondary/80"
                : "text-secondary hover:text-secondary/80"
            }`}
          >
            {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {open ? "Collapse" : "Read Full Detail"}
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-10 space-y-8">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── data ─── */
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
  { label: "Community Development", icon: <LucideHome className="w-5 h-5" /> },
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

const NAV_LINKS_DESKTOP = [
  { label: "Mission", href: "#mission" },
  { label: "Sectors", href: "#sectors" },
  { label: "Governance", href: "#governance" },
  { label: "Vision", href: "#vision" },
  { label: "Constitution", href: "#constitution" },
  { label: "Founder", href: "#founder" },
];

/* ─── component ─── */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.3], ["0%", "30%"]);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="w-full bg-background text-foreground overflow-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        {/* Single row — logo+title · tagline · hamburger */}
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-14">
          {/* Left */}
          <a href="#" className="flex items-center gap-3">
            <img src={logo} alt="The Muslim Company Logo" className="w-7 h-7 invert opacity-90 flex-shrink-0" />
            <span className="font-serif text-sm font-bold tracking-widest uppercase text-primary-foreground whitespace-nowrap">
              The Muslim Company
            </span>
          </a>
          {/* Right */}
          <div className="flex justify-end">
            <button
              data-testid="nav-mobile-toggle"
              className="text-primary-foreground/70 hover:text-secondary transition-colors"
              onClick={() => setNavOpen(!navOpen)}
            >
              {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Dropdown nav */}
        <AnimatePresence>
          {navOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-primary border-t border-primary-foreground/10 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setNavOpen(false)}
                    className="font-sans text-xs tracking-widest uppercase text-primary-foreground/60 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a href="#contact" onClick={() => setNavOpen(false)}
                  className="font-sans text-xs tracking-widest uppercase text-secondary hover:text-secondary/80 transition-colors font-bold">
                  Join Us →
                </a>
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
            A faith-driven, civilization-oriented global company built upon the Quran and authentic Sunnah.
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

      {/* ── MISSION ── */}
      <ExpandableSection
        id="mission"
        label="Core Mission"
        summary="Serving humanity through ethical business, knowledge, justice, and the revival of Islamic civilization."
        summaryNode={
          <p className="font-serif text-2xl md:text-3xl text-primary leading-tight max-w-3xl">
            "To build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, justice, sustainability, and social development."
          </p>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
        </div>
        <p className="font-sans text-sm text-primary/60 leading-relaxed max-w-3xl">
          The purpose of the company is not only commercial success, but also the development of humanity, establishment of justice, protection of moral values, advancement of knowledge, and rebuilding a strong ethical civilization. The company seeks to contribute toward restoring the Muslim world's historical excellence in science, philosophy, literature, medicine, economics, technology, education, governance, and social development.
        </p>
      </ExpandableSection>

      {/* ── OUR STORY ── */}
      <ExpandableSection
        id="our-story"
        label="Our Story"
        summary="From observing a world drifting from ethics to envisioning a civilization-scale ethical enterprise — this is how The Muslim Company was born."
        dark
        summaryNode={
          <InlineQuote light author="Shariful Islam, Founder & CEO">
            Can there not be a global institution built upon ethics, transparency, halal economics, knowledge, research, technology, humanitarian responsibility, and Prophetic principles?
          </InlineQuote>
        }
      >
        <div className="space-y-10">

          {/* Observation */}
          <div>
            <h3 className="font-serif text-2xl mb-5">From Observation, Pain & Responsibility</h3>
            <p className="font-sans text-sm text-primary-foreground/65 leading-relaxed mb-5">
              Shariful Islam spent much of his early life observing society, people, technology, education, economics, media, and the changing direction of the modern world. Over time, he realized that although humanity was advancing technologically, many societies were simultaneously moving away from morality, humanity, justice, and true peace.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-primary-foreground/5 border border-primary-foreground/10">
                <h4 className="font-serif text-base mb-3">What He Observed in Corporations</h4>
                <Bullets light items={[
                  "Focus only on profit, market domination, and power",
                  "People exploited through addiction-based business models",
                  "Misleading marketing manipulating public emotions",
                  "Workers underpaid and treated unfairly",
                  "Corruption and bribery controlling markets",
                  "Environmental destruction normalized for profit",
                  "Technology used more for control than human benefit",
                  "Knowledge commercialized while true education is neglected",
                ]} />
              </div>
              <div className="p-5 bg-primary-foreground/5 border border-primary-foreground/10">
                <h4 className="font-serif text-base mb-3">What Muslims Were Facing</h4>
                <Bullets light items={[
                  "Visible Islamic identity discouraged in workplaces",
                  "Halal professional ecosystems limited globally",
                  "Modest and respectful work systems for women rare",
                  "Ethical workplace culture largely absent",
                  "Muslim youth lacking organized opportunities for innovation",
                  "Islamic values treated as obstacles rather than strengths",
                ]} />
              </div>
            </div>
          </div>

          {/* Vision Beyond Business */}
          <div>
            <h3 className="font-serif text-2xl mb-5">A Vision Beyond Business</h3>
            <p className="font-sans text-sm text-primary-foreground/65 leading-relaxed mb-5">
              The Muslim Company was never intended to become only a traditional business corporation. Its vision was always much larger.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Ethical Business Ecosystem", "Halal Economic Model", "Humanitarian Development Platform", "Knowledge & Research Revival", "Ethical Technology Ecosystem", "Transparent Institution", "Civilization-Focused Enterprise", "Environmental Stewardship"].map((v, i) => (
                <div key={i} className="p-3 border border-secondary/20 text-center">
                  <p className="font-sans text-[10px] tracking-wide uppercase text-primary-foreground/60">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Islamic Civilization Inspiration */}
          <div className="p-6 bg-primary-foreground/10 border border-secondary/20">
            <h3 className="font-serif text-xl mb-4">Inspired by Islamic Civilization</h3>
            <p className="font-sans text-sm text-primary-foreground/65 leading-relaxed mb-4">
              Shariful Islam has always been deeply inspired by the Islamic Golden Age — a time when Muslims contributed greatly not only to religious scholarship but also to science, medicine, mathematics, astronomy, engineering, economics, architecture, philosophy, and literature.
            </p>
            <p className="font-sans text-sm text-primary-foreground/65 leading-relaxed mb-5">
              He believes Islam never teaches ignorance, injustice, corruption, or backwardness — but encourages knowledge, ethics, justice, research, discipline, compassion, and balanced civilization-building. He believes Muslims can once again contribute positively to humanity if knowledge, ethics, innovation, technology, and humanitarian responsibility are developed together.
            </p>
            <Bullets light items={[
              "The Muslim world once led in science, medicine, mathematics, and philosophy",
              "Islam inherently encourages knowledge, justice, and ethical progress",
              "Muslims can contribute again through ethics, innovation, and responsibility",
              "Faith and technology are not opposites — they complement each other",
            ]} />
          </div>

          {/* Dream */}
          <div>
            <h3 className="font-serif text-2xl mb-5">A Dream for Muslims & Humanity</h3>
            <p className="font-sans text-sm text-primary-foreground/65 leading-relaxed mb-5">
              Shariful Islam's dream is not limited to business success alone. He hopes to help create ethical professional ecosystems for Muslims, halal economic systems, opportunities for practicing Muslims to work with dignity, and civilization-level positive contribution from the Muslim world once again.
            </p>
            <InlineQuote light author="Shariful Islam">
              I envision a future where faith exists alongside technology, ethics exists alongside innovation, research exists alongside spirituality, and humanity remains at the center of development.
            </InlineQuote>
          </div>

        </div>
      </ExpandableSection>

      {/* ── ISLAMIC FOUNDATION ── */}
      <ExpandableSection
        id="foundation"
        label="Islamic Foundation"
        summary="Every operation follows the Quran, authentic Hadith, and the Prophetic Model — completely free from riba, bribery, corruption, and exploitation."
        dark
        summaryNode={
          <div className="grid grid-cols-3 gap-6 max-w-lg">
            {[
              { icon: <BookOpen className="w-5 h-5" />, title: "Quran & Sunnah" },
              { icon: <ShieldCheck className="w-5 h-5" />, title: "Halal Only" },
              { icon: <Scale className="w-5 h-5" />, title: "Riba-Free" },
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <div className="text-secondary">{v.icon}</div>
                <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/50">{v.title}</p>
              </div>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <BookOpen className="w-5 h-5" />, title: "Quran & Authentic Sunnah", desc: "All operations, values, and decisions are guided by divine revelation and verified Prophetic tradition." },
            { icon: <ShieldCheck className="w-5 h-5" />, title: "Halal Operations", desc: "Every product, service, investment, and partnership must meet strict Shariah-compliant standards." },
            { icon: <Scale className="w-5 h-5" />, title: "Free from Riba", desc: "Completely free from interest, bribery, corruption, fraud, exploitation, and unethical financial practices." },
            { icon: <Gavel className="w-5 h-5" />, title: "Justice & Honesty", desc: "Justice, honesty, discipline, modesty, and accountability are non-negotiable in all dealings." },
            { icon: <Globe className="w-5 h-5" />, title: "Shariah Governance", desc: "A Supreme Shariah Board oversees all major decisions, ensuring Islamic compliance at every level." },
            { icon: <Globe2 className="w-5 h-5" />, title: "Prophetic Model", desc: "Leadership and culture are inspired by the Prophetic Model of mercy, justice, and responsibility." },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-primary-foreground/5 border border-primary-foreground/10">
              <div className="text-secondary mb-3">{item.icon}</div>
              <h4 className="font-serif text-base mb-2">{item.title}</h4>
              <p className="font-sans text-xs text-primary-foreground/55 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Allah-Centered Business */}
        <div className="p-8 bg-primary-foreground/10 border border-secondary/20">
          <h3 className="font-serif text-xl mb-6 text-primary-foreground">Allah-Centered Business — 10% Monthly to Charity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <p className="text-4xl font-serif text-secondary font-bold mb-1">10%</p>
              <p className="font-sans text-xs text-primary-foreground/55">of net profit every month to charity and humanitarian causes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-secondary font-bold mb-1">Zakat</p>
              <p className="font-sans text-xs text-primary-foreground/55">Annual zakat calculated and fully distributed at year end</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-secondary font-bold mb-1">Beyond</p>
              <p className="font-sans text-xs text-primary-foreground/55">Additional welfare programs beyond obligatory charity</p>
            </div>
          </div>
          <p className="font-sans text-xs text-primary-foreground/50 mb-4">Charitable causes include:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["Mosques & Madrasas", "Education Funding", "Healthcare Support", "Poor Communities", "Social Development", "Disaster Relief", "Orphan Support", "Widow Support"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 font-sans text-xs text-primary-foreground/60">
                <Check className="w-3 h-3 text-secondary flex-shrink-0" />{item}
              </div>
            ))}
          </div>
          <InlineQuote light>Businesses that maintain honesty, justice, charity, and the pleasure of Allah receive barakah and long-term stability.</InlineQuote>
        </div>
      </ExpandableSection>

      {/* ── SECTORS ── */}
      <ExpandableSection
        id="sectors"
        label="Areas of Work"
        summary="The company works across 20 beneficial and halal sectors — from agriculture and healthcare to AI, renewable energy, and Islamic finance."
        summaryNode={
          <div className="flex flex-wrap gap-2 max-w-3xl">
            {SECTORS.slice(0, 6).map((s, i) => (
              <span key={i} className="font-sans text-xs tracking-wide bg-card border border-primary/10 text-primary/60 px-3 py-1">
                {s.label}
              </span>
            ))}
            <span className="font-sans text-xs tracking-wide bg-card border border-primary/10 text-secondary px-3 py-1">
              +14 more
            </span>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-primary/10">
          {SECTORS.map((sector, idx) => (
            <div
              key={idx}
              data-testid={`sector-${idx}`}
              className="py-4 px-5 border-b border-primary/10 flex justify-between items-center group hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-secondary/50 group-hover:text-secondary transition-colors">{sector.icon}</span>
                <span className="font-serif text-lg text-primary group-hover:text-secondary transition-colors">{sector.label}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-primary/20 group-hover:text-secondary transition-colors" />
            </div>
          ))}
        </div>
        <p className="font-sans text-sm text-primary/55 leading-relaxed max-w-2xl">
          The company believes no beneficial and halal sector should remain outside ethical development. The goal is to build an integrated civilization-scale ecosystem where every domain of human life is guided by faith, justice, and responsibility.
        </p>
      </ExpandableSection>

      {/* ── GOVERNANCE ── */}
      <ExpandableSection
        id="governance"
        label="Governance Structure"
        summary="Governed by a Supreme Shariah Board, Amanah-based leadership, Shura consultation, and the higher objectives of Shariah (Maqasid al-Shariah)."
        dark
        summaryNode={
          <div className="flex flex-wrap gap-6">
            {["Supreme Shariah Board", "Amanah Leadership", "Shura Framework", "Maqasid al-Shariah"].map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                <span className="font-sans text-xs tracking-wide text-primary-foreground/55">{v}</span>
              </div>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <Gavel className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-xl mb-3">Supreme Shariah Board</h3>
            <p className="font-sans text-sm text-primary-foreground/60 mb-4">The highest ethical authority. No major project, product, technology, investment, service, research, media activity, marketing campaign, financial structure, or partnership can begin without Board approval.</p>
            <p className="font-sans text-xs text-primary-foreground/45 mb-3">Evaluates based on: Quran, Sahih Hadith, Ijma, Qiyas, scientific evidence, ethical reasoning, social impact, human welfare, environmental effect, and long-term civilization consequences.</p>
            <p className="font-sans text-xs text-primary-foreground/45 italic">Even after approval, if future evidence proves harm, the Board may cancel approval, stop production, recall products, or shut down services.</p>
          </div>
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <UserCheck className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-xl mb-3">Amanah-Based Leadership</h3>
            <p className="font-sans text-sm text-primary-foreground/60 mb-4">Leadership is not privilege — it is amanah (trust) and accountability before Allah. Leaders should:</p>
            <Bullets light items={["Serve people with humility", "Protect justice and fairness", "Avoid arrogance and abuse of power", "Remain transparent and accountable", "Prioritize truth over personal benefit", "Protect the weak and vulnerable"]} />
            <InlineQuote light>True leadership is measured by responsibility, service, justice, and moral integrity.</InlineQuote>
          </div>
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <Users className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-xl mb-3">Shura — Consultation Framework</h3>
            <p className="font-sans text-sm text-primary-foreground/60 mb-4">Inspired by the Islamic principle of Shura, important decisions involve consultation, wisdom, and collective expertise.</p>
            <Bullets light items={["Expert consultation councils", "Strategic advisory committees", "Ethical review sessions", "Community feedback systems", "Emergency consultation mechanisms"]} />
          </div>
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <Scale className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-xl mb-3">Maqasid al-Shariah</h3>
            <p className="font-sans text-sm text-primary-foreground/60 mb-4">Every major policy, technology, product, or project is reviewed against the higher objectives of Shariah:</p>
            <Bullets light items={["Faith and religious integrity", "Human life and safety", "Human intellect and education", "Wealth and economic justice", "Family and social stability", "Human dignity and honor", "Environmental balance and creation"]} />
          </div>
        </div>

        <div className="p-6 bg-primary-foreground/10 border border-secondary/20">
          <Microscope className="w-6 h-6 text-secondary mb-3" />
          <h3 className="font-serif text-xl mb-3">Council of Ethical Scholars, Scientists & Experts</h3>
          <p className="font-sans text-sm text-primary-foreground/60 mb-4">A permanent interdisciplinary council: Islamic scholars, scientists, engineers, economists, AI researchers, doctors, psychologists, environmental specialists, strategic thinkers, and humanitarian experts — guided by Quran, Hadith, and verified science.</p>
        </div>

        <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
          <h3 className="font-serif text-lg mb-4">Annual Audit & Public Transparency</h3>
          <p className="font-sans text-sm text-primary-foreground/60 mb-4">Annual reports may publicly include: revenue & expenditure summaries, zakat & charity distributions, tax & VAT payments, welfare activities, humanitarian achievements, ethical governance updates, environmental projects, and audit summaries.</p>
        </div>
      </ExpandableSection>

      {/* ── OUR PEOPLE ── */}
      <ExpandableSection
        id="people"
        label="Our People"
        summary="Fair wages, dignified workplaces, women's separate facilities, 1–1.5 year maternity leave, 15-year pension qualification, and family welfare programs."
        summaryNode={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl">
            {[
              { v: "1.5 Yrs", l: "Maternity Leave" },
              { v: "30%", l: "Salary During Leave" },
              { v: "15 Yrs", l: "Pension Threshold" },
              { v: "Huffaz", l: "Leadership Priority" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-serif text-xl text-secondary">{s.v}</p>
                <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-card border border-primary/10">
            <Users className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Workforce Structure</h3>
            <p className="font-sans text-sm text-primary/65 leading-relaxed mb-3">The company aims for a Muslim-majority workforce while welcoming qualified people from other religions who respect the company's ethics and professional culture.</p>
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <Baby className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Women's Workplace & Maternity</h3>
            <p className="font-sans text-sm text-primary/65 mb-3">Separate and secure working environments, privacy-focused facilities, and respectful communication policies.</p>
            <Bullets items={["Maternity leave: 1 to 1.5 years", "30% salary continued at home", "70% may fund a temporary replacement", "Original position retained upon return"]} />
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <Clock className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Long-Term Pension</h3>
            <p className="font-sans text-sm text-primary/65 mb-3">15+ years of honest service qualifies for:</p>
            <Bullets items={["Pension systems & monthly retirement support", "One-time retirement assistance", "Emergency welfare support", "Family assistance programs", "Long-service appreciation benefits"]} />
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <Award className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Recruitment & Leadership</h3>
            <p className="font-sans text-sm text-primary/65 mb-3">Prioritizes knowledge, character, honesty, discipline, and Islamic ethics. Special consideration for Huffaz and those with deep Shariah understanding.</p>
            <InlineQuote>Knowledge, morality, character, and skill together create strong leaders and strong civilizations.</InlineQuote>
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <Briefcase className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Employee Rights & Welfare</h3>
            <Bullets items={["Fair salaries & benefits", "Safe work environments", "Respectful treatment — no humiliation culture", "Training & development opportunities", "Prayer facilities in the workplace", "Jumu'ah-centered scheduling where possible"]} />
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <Heart className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Family Welfare System</h3>
            <Bullets items={["Educational scholarships for children", "Emergency family support", "Healthcare assistance", "Housing assistance programs", "Mental wellness & emotional support", "Family counseling"]} />
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <GraduationCap className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Education & Development</h3>
            <Bullets items={["Islamic ethics education", "Technology & AI training", "Leadership development programs", "Communication & professionalism training", "Financial literacy programs", "Research & innovation support"]} />
          </div>
          <div className="p-6 bg-card border border-primary/10 md:col-span-2">
            <h3 className="font-serif text-lg text-primary mb-3">Dress Code & Professional Appearance</h3>
            <p className="font-sans text-sm text-primary/65 mb-3">The company maintains a modest, organized, disciplined, and professional dress culture. Attire may include shirts, polo shirts, t-shirts, trousers, and jeans following professional standards. Employees must maintain cleanliness, modesty, and respectful presentation.</p>
          </div>
        </div>

        <div className="p-6 bg-card border border-primary/10">
          <h3 className="font-serif text-lg text-primary mb-3">Worker Loyalty Recognition System</h3>
          <p className="font-sans text-sm text-primary/65 mb-4">A permanent digital historical worker archive may be maintained for all current, former, and retired employees — recording names, duration of contribution, service records, and loyalty recognition.</p>
          <InlineQuote>Institutions are not built only by founders and executives, but also by the workers, staff, and ordinary people who dedicated their time, effort, and loyalty.</InlineQuote>
        </div>
      </ExpandableSection>

      {/* ── ENVIRONMENT ── */}
      <ExpandableSection
        id="environment"
        label="Environmental Stewardship"
        summary="Nature is a trust from Allah. No development will intentionally destroy the environment. The company supports renewable energy, wildlife protection, and ecological restoration."
        summaryNode={
          <InlineQuote>Human development should never come through the destruction of Allah's creation.</InlineQuote>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <TreePine />, title: "No Intentional Destruction", desc: "No development will intentionally destroy nature. Environmental balance must be protected in all operations." },
            { icon: <Zap />, title: "Renewable Energy", desc: "Clean and renewable energy encouraged across all operations. Pollution and waste minimized." },
            { icon: <Globe />, title: "Wildlife Protection", desc: "Animals and wildlife treated with mercy and responsibility. Biodiversity protection initiatives supported." },
            { icon: <Sprout />, title: "Reforestation", desc: "Tree plantation and ecological restoration programs actively encouraged and funded." },
            { icon: <Leaf />, title: "Minimal Waste Policy", desc: "Sustainable production, waste reduction, recyclable systems, eco-friendly packaging, long-lasting product design, and repair-friendly products." },
            { icon: <Globe2 />, title: "Environmental Restoration", desc: "Active restoration including reforestation, water restoration, wildlife rehabilitation, carbon reduction, and ecological balance projects." },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-card border border-primary/10">
              <div className="text-secondary mb-3 w-5 h-5">{item.icon}</div>
              <h4 className="font-serif text-base text-primary mb-2">{item.title}</h4>
              <p className="font-sans text-xs text-primary/55 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-6 bg-card border border-primary/10">
          <h4 className="font-serif text-lg text-primary mb-3">Anti-Waste & Responsible Resource System</h4>
          <p className="font-sans text-sm text-primary/65 mb-4">Inspired by Quranic teachings against wastefulness: sustainable production, minimal waste systems, responsible energy use, food waste reduction, water conservation, long-lasting product design, and repair and recycling systems. The company believes resources are blessings and trusts from Allah.</p>
        </div>
      </ExpandableSection>

      {/* ── HUMANITARIAN ── */}
      <ExpandableSection
        id="humanitarian"
        label="Humanitarian Development"
        summary="10% of monthly net profit goes to charity. The company supports disaster relief, orphans, widows, affordable education, healthcare, housing, and social welfare globally."
        dark
        summaryNode={
          <div className="flex flex-wrap gap-6">
            {["Disaster Relief", "Orphan Support", "Widow Support", "Education Access", "Healthcare Support", "Housing Assistance"].map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-3 h-3 text-secondary" />
                <span className="font-sans text-xs text-primary-foreground/55">{v}</span>
              </div>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <HandHeart className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-xl mb-3">Social Welfare & Human Dignity</h3>
            <p className="font-sans text-sm text-primary-foreground/60 mb-4">The company believes low-income and working-class people should never lose access to education, healthcare, food, clothing, housing, knowledge, or opportunity.</p>
            <Bullets light items={["Scholarship systems for education", "Healthcare support funds", "Affordable food systems", "Housing support projects", "Worker welfare programs", "Employment development initiatives", "Skill development centers"]} />
          </div>
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <Flame className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-xl mb-3">Disaster Response & Relief</h3>
            <p className="font-sans text-sm text-primary-foreground/60 mb-4">An emergency response division may be established for:</p>
            <Bullets light items={["Floods & earthquakes", "Famines & drought response", "War-related humanitarian crises", "Refugee support", "Emergency food & medical aid", "Crisis price stability & fair distribution"]} />
            <p className="font-sans text-xs italic text-primary-foreground/40 mt-4">Humanitarian assistance should remain organized, transparent, and dignity-focused.</p>
          </div>
        </div>

        <div className="p-6 bg-primary-foreground/10 border border-secondary/20">
          <h3 className="font-serif text-xl mb-4">Humanitarian Development Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Bullets light items={["Reduce poverty and inequality", "Improve education & healthcare accessibility", "Promote ethical technology and research", "Support sustainable development"]} />
            <Bullets light items={["Build future universities, research centers & hospitals", "Develop skilled and ethical future generations", "Build innovation hubs for humanity", "Contribute toward a balanced and just civilization"]} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <h4 className="font-serif text-base mb-3">Marriage, Family & Social Stability</h4>
            <Bullets light items={["Marriage counseling", "Family education systems", "Parenting support", "Ethical family media", "Social harmony initiatives"]} />
          </div>
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <h4 className="font-serif text-base mb-3">Children & Next Generation Protection</h4>
            <Bullets light items={["Child-safe technologies", "Ethical educational systems", "Anti-addiction digital design", "Child mental health protection", "Safe online environments"]} />
          </div>
        </div>
      </ExpandableSection>

      {/* ── TECHNOLOGY & AI ── */}
      <ExpandableSection
        id="technology"
        label="Technology & AI Ethics"
        summary="Technology must remain under ethical supervision. The company opposes harmful AI, addiction-based systems, privacy abuse, and mass misinformation."
        summaryNode={
          <p className="font-sans text-sm text-primary/60 max-w-xl">Not every technologically possible action is ethically acceptable. Advanced technology must remain human-centered and under Shariah supervision.</p>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-card border border-primary/10">
            <Cpu className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Ethical AI Policy</h3>
            <p className="font-sans text-sm text-primary/65 mb-4">AI and digital systems must avoid:</p>
            <Bullets items={["Human exploitation & addiction-based manipulation", "Mass misinformation & privacy abuse", "Psychological harm & unethical surveillance", "Harmful automation practices"]} />
            <p className="font-sans text-sm text-primary/65 mt-5 mb-3">AI Ethics Oversight may include:</p>
            <Bullets items={["AI ethics review boards", "Human oversight protocols", "Algorithm fairness & bias detection systems", "Child safety protections"]} />
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <Shield className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Data Privacy & Cybersecurity</h3>
            <p className="font-sans text-sm text-primary/65 mb-4">Customer, employee, and organizational data is treated as amanah. Personal information will never be sold, abused, or exploited.</p>
            <Bullets items={["Strong cybersecurity systems", "Encrypted communication systems", "Secure cloud infrastructure", "Access-controlled databases", "Responsible data management frameworks"]} />
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <Megaphone className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Ethical Media & Entertainment</h3>
            <p className="font-sans text-sm text-primary/65 mb-3">Company media must be truth-based, responsible, and educational — free from fake news, manipulative content, hate-based communication, and unethical sensationalism.</p>
            <p className="font-sans text-sm text-primary/65">May produce: educational documentaries, ethical animation, children's learning content, historical and civilization-focused media, and Islamic educational content.</p>
          </div>
          <div className="p-6 bg-card border border-primary/10">
            <FlaskConical className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-3">Future Technology Research Labs</h3>
            <p className="font-sans text-sm text-primary/65 mb-3">Research laboratories for AI, robotics, renewable energy, ethical biotechnology, sustainable manufacturing, and smart infrastructure — all under Supreme Shariah Board oversight.</p>
          </div>
        </div>

        <div className="p-6 bg-card border border-primary/10">
          <h3 className="font-serif text-lg text-primary mb-3">Digital Civilization & Cyber Ethics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Bullets items={["Ethical internet systems & privacy protection", "Child digital safety & anti-addiction design", "Responsible social technology", "Truthful information preservation"]} />
            <Bullets items={["Deepfake detection & AI misinformation defense", "Anti-monopoly & market fairness principles", "Ethical social platforms with anti-addiction algorithms", "Human Purpose & mental well-being research"]} />
          </div>
        </div>
      </ExpandableSection>

      {/* ── FINANCE & COMMERCE ── */}
      <ExpandableSection
        id="finance"
        label="Ethical Finance & Commerce"
        summary="Fully Shariah-compliant. Transparent pricing, no riba, no exploitation, fair wages, ethical supply chains, and product verification systems."
        dark
        summaryNode={
          <div className="flex flex-wrap gap-3">
            {["No Riba", "No Bribery", "No Fraud", "No Gambling", "Transparent Pricing", "Fair Wages"].map((v, i) => (
              <span key={i} className="font-sans text-xs border border-secondary/30 text-secondary/70 px-3 py-1">{v}</span>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <DollarSign className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-xl mb-3">Shariah-Compliant Investment</h3>
            <p className="font-sans text-sm text-primary-foreground/60 mb-4">All investors, partners, and stakeholders must comply with Shariah-based principles. Completely free from:</p>
            <div className="grid grid-cols-2 gap-2">
              {["Interest (Riba)", "Bribery", "Corruption", "Fraud", "Gambling", "Exploitative finance", "Haram industries", "Unethical activities"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 font-sans text-xs text-primary-foreground/55">
                  <X className="w-3 h-3 text-red-400 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
            <Handshake className="w-6 h-6 text-secondary mb-3" />
            <h3 className="font-serif text-xl mb-3">Ethical Commerce & Pricing</h3>
            <Bullets light items={["Transparent pricing with full cost disclosure", "Maximum reseller price maintained and published", "Opposition to artificial price manipulation & crisis profiteering", "Existing inventory prices remain unchanged if costs rise", "Product verification via QR codes, serial authentication & digital tracking", "24/7 customer support — hotline, live chat, email & messaging portals"]} />
          </div>
        </div>

        <div className="p-6 bg-primary-foreground/10 border border-secondary/20">
          <Scale className="w-6 h-6 text-secondary mb-3" />
          <h3 className="font-serif text-xl mb-3">Fair Wage & Worker Dignity Charter</h3>
          <p className="font-sans text-sm text-primary-foreground/60 mb-4">Inspired by Prophetic teachings: timely salary payment, fair contracts, safe working environments, respectful treatment, no humiliation culture, welfare systems, and skill development. The company believes workers are not disposable resources, but valuable human beings.</p>
          <InlineQuote light>Workers are not disposable resources, but valuable human beings.</InlineQuote>
        </div>

        <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
          <h3 className="font-serif text-lg mb-3">Ethical Procurement & Supply Chain</h3>
          <p className="font-sans text-sm text-primary-foreground/60 mb-4">The company may avoid suppliers connected with child exploitation, forced labor, unethical working conditions, environmentally destructive systems, or haram industries. Supply chains must remain transparent, responsible, ethical, and sustainable.</p>
        </div>

        <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
          <h3 className="font-serif text-lg mb-3">Refund Delay Compensation Policy</h3>
          <p className="font-sans text-sm text-primary-foreground/60">The company believes customer funds are amanah. If refunds are delayed beyond the promised time or payment failures occur due to company systems, compensation may be added after the deadline and may increase according to delay duration.</p>
        </div>
      </ExpandableSection>

      {/* ── VISION (image break) ── */}
      <section id="vision" className="relative h-[65svh] flex items-center justify-center overflow-hidden bg-primary">
        <motion.div className="absolute inset-0 z-0"
          initial={{ scale: 1.08 }} whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }} viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-primary/70 z-10" />
          <img src={visionBg} alt="Vision" className="w-full h-full object-cover" />
        </motion.div>
        <div className="relative z-10 container px-6 mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-5">Long-Term Vision</p>
            <h2 className="text-4xl md:text-6xl font-serif text-primary-foreground mb-6">The Future is Ethical</h2>
            <p className="font-sans text-lg text-primary-foreground/75 max-w-2xl mx-auto">
              Universities. Research centers. Hospitals. Innovation hubs. Ethical AI institutions. Civilization-scale development — guided by faith, knowledge, and justice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── KNOWLEDGE & LONG-TERM VISION ── */}
      <ExpandableSection
        id="knowledge"
        label="Knowledge Revival & Long-Term Vision"
        summary="The company aims to revive the Muslim world's tradition of science, philosophy, and innovation — building universities, research centers, hospitals, and smart cities for future generations."
        summaryNode={
          <p className="font-sans text-sm text-primary/60 max-w-2xl">The Muslim world once contributed greatly to human civilization and can contribute positively again through knowledge, ethics, and responsible development.</p>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <GraduationCap />, title: "Corporate University & Academies", items: ["Universities & leadership academies", "Islamic economics institutes", "AI research centers", "Technology training institutes", "Research laboratories"] },
            { icon: <Microscope />, title: "Future Civilization Research Center", items: ["Islamic civilization studies", "Ethical economics & AI ethics", "Environmental sustainability", "Education reform", "Healthcare innovation"] },
            { icon: <Globe2 />, title: "Global Muslim Innovation Network", items: ["Muslim scientists & engineers", "Ethical entrepreneurs & AI specialists", "Islamic scholars & educators", "Humanitarian experts"] },
            { icon: <Building2 />, title: "Ethical Smart Cities", items: ["Knowledge-centered urban systems", "Sustainable communities", "Halal economic districts", "Environmentally balanced infrastructure"] },
            { icon: <BookOpen />, title: "Civilization Archive & Waqf", items: ["Educational, healthcare & research waqf systems", "Humanitarian waqf funds", "Multi-language knowledge accessibility", "Historical & governance preservation"] },
            { icon: <Atom />, title: "Strategic Vision Office", items: ["50-year & 100-year civilization planning", "Ethical future development", "Global technological change forecasting", "Human survival challenge research"] },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-card border border-primary/10">
              <div className="text-secondary mb-3 w-5 h-5">{item.icon}</div>
              <h4 className="font-serif text-base text-primary mb-3">{item.title}</h4>
              <Bullets items={item.items} />
            </div>
          ))}
        </div>

        <div className="p-6 bg-card border border-primary/10">
          <h3 className="font-serif text-lg text-primary mb-4">Future of Humanity Research</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {["AI civilization risks", "Global moral decline", "Mental health crises", "Family instability", "Water & food insecurity", "Economic injustice", "Digital addiction", "Spiritual emptiness", "Social fragmentation", "Human survival challenges"].map((item, i) => (
              <div key={i} className="flex items-start gap-1.5 font-sans text-xs text-primary/55">
                <div className="w-1 h-1 bg-secondary rounded-full mt-1.5 flex-shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
      </ExpandableSection>

      {/* ── CONSTITUTION ── */}
      <ExpandableSection
        id="constitution"
        label="Constitutional Framework"
        summary="A permanent constitutional framework protects the company's mission from corruption, hostile takeover, and ethical drift — for generations to come."
        dark
        summaryNode={
          <InlineQuote light>If an institution can no longer remain faithful to truth, justice, ethics, and the pleasure of Allah, then its wealth and power should continue benefiting humanity rather than becoming tools of corruption.</InlineQuote>
        }
      >
        <div className="space-y-0 border border-primary-foreground/15">
          <AccordionItem light title="Mission Preservation Obligation">
            <p className="font-sans text-sm text-primary-foreground/65">All future chairpersons, CEOs, executive councils, directors, investors, and strategic leaders carry a moral and constitutional responsibility to preserve the company according to Quran, Sahih Hadith, Prophetic ethics, Supreme Shariah Board principles, and the original constitutional framework. No leadership authority should have the right to intentionally destroy the company's ethical mission or convert the company into a harmful institution.</p>
          </AccordionItem>
          <AccordionItem light title="Emergency Ethical Dissolution Clause">
            <p className="font-sans text-sm text-primary-foreground/65 mb-3">If the company is intentionally transformed away from its Islamic foundation, a dissolution mechanism may be activated:</p>
            <Bullets light items={["99% of remaining eligible wealth redirected toward humanitarian, educational, charitable, and social welfare causes", "1% allocated for workers who served throughout the company's history", "Resources would support Islamic organizations, humanitarian NGOs, educational institutions, and poverty relief"]} />
          </AccordionItem>
          <AccordionItem light title="Constitutional Safeguards Against Hostile Takeover">
            <p className="font-sans text-sm text-primary-foreground/65 mb-3">Strict protections against forced sale, hostile takeover, mission destruction, political capture, and removal of Shariah governance. Mechanisms include:</p>
            <Bullets light items={["Supreme Shariah Board intervention powers", "Mission preservation voting protections", "Emergency ethical review systems", "Long-term constitutional enforcement clauses"]} />
          </AccordionItem>
          <AccordionItem light title="Internal Ethics & Whistleblower System">
            <p className="font-sans text-sm text-primary-foreground/65 mb-3">A confidential internal division accountable to the Founder may prevent corruption, detect unethical behavior, and protect organizational integrity. Whistleblower protections include:</p>
            <Bullets light items={["Offline complaint boxes & online anonymous reporting", "Confidentiality & anti-retaliation protection", "Fair investigation systems & evidence-based review"]} />
          </AccordionItem>
          <AccordionItem light title="Post-Founder Continuity Doctrine">
            <p className="font-sans text-sm text-primary-foreground/65 mb-3">The company recognizes many institutions collapse after the founder's death. Therefore:</p>
            <Bullets light items={["Founder philosophy archives", "Institutional continuity systems", "Leadership transition frameworks", "Long-term mission preservation protocols", "Ethical succession systems"]} />
          </AccordionItem>
          <AccordionItem light title="Political Neutrality Policy">
            <p className="font-sans text-sm text-primary-foreground/65 mb-3">The company will not become a political party or tool of political power. It will avoid political exploitation, unethical lobbying, bribery-based influence, hate and division politics, and abuse of authority. Contribution through: knowledge, ethical business, humanitarian work, employment creation, peaceful cooperation.</p>
          </AccordionItem>
          <AccordionItem light title="Global Governance Architecture">
            <p className="font-sans text-sm text-primary-foreground/65">The company may establish international governance councils, regional leadership structures, country-level operational boards, global ethical coordination systems, and international Shariah compliance divisions — all aligned with halal ethics, human welfare, and long-term civilization benefit.</p>
          </AccordionItem>
          <AccordionItem light title="Enterprise Risk Management">
            <p className="font-sans text-sm text-primary-foreground/65">Systems for financial crisis management, cybersecurity threats, supply chain disruption, political instability, environmental disasters, leadership corruption prevention, AI misuse protection, and emergency operational continuity. Prevention and preparation are forms of amanah.</p>
          </AccordionItem>
        </div>

        <div className="p-6 bg-primary-foreground/5 border border-primary-foreground/10">
          <h3 className="font-serif text-lg mb-4">The Global Civilization Blueprint</h3>
          <div className="flex flex-wrap gap-3">
            {["Faith", "Knowledge", "Justice", "Ethics", "Compassion", "Innovation", "Responsibility"].map((v, i) => (
              <div key={i} className="px-5 py-2 border border-secondary/30 font-serif text-sm text-secondary">{v}</div>
            ))}
          </div>
        </div>
      </ExpandableSection>

      {/* ── FOUNDER ── */}
      <ExpandableSection
        id="founder"
        label="Founder & CEO"
        summary="Shariful Islam's personal aspiration is not wealth or fame — but to seek the pleasure of Allah and leave behind something ethical, beneficial, and just."
        summaryNode={
          <InlineQuote author="Shariful Islam, Founder & CEO">True success is not only wealth, fame, or power. True success is becoming accepted by Allah and leaving behind benefit for humanity.</InlineQuote>
        }
      >
        <div className="space-y-8">

          {/* Bio card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          </div>

          {/* About */}
          <div className="p-6 bg-card border border-primary/10">
            <h3 className="font-serif text-lg text-primary mb-3">About Shariful Islam</h3>
            <p className="font-sans text-sm text-primary/65 leading-relaxed">
              Shariful Islam is a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur dedicated to ethical innovation, humanitarian development, knowledge-driven progress, and civilization-focused institution building. From an early age he developed strong interests in technology, engineering, Islamic ethics, global affairs, media and journalism, education, research, humanitarian development, renewable energy, and future civilization studies.
            </p>
          </div>

          {/* Areas of interest */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Personal aspiration */}
          <div className="p-6 bg-card border border-primary/10">
            <h4 className="font-serif text-lg text-primary mb-4">Personal Aspiration</h4>
            <p className="font-sans text-sm text-primary/65 leading-relaxed mb-4">
              Shariful Islam holds a personal aspiration that goes beyond conventional ambition. He hopes, InshaAllah:
            </p>
            <Bullets items={[
              "The Muslim Company becomes one of the world's most trusted, respected, and influential ethical Muslim-led enterprises",
              "\"InshaAllah, one day I want to become the world's number one Muslim billionaire through halal, ethical, and humanity-centered systems\"",
              "Wealth becomes a tool for humanitarian development, education, research, ethical systems, and long-term benefit for humanity — not luxury or personal status",
              "A practicing Muslim-led ethical civilization-scale company becomes globally successful and a model for others",
            ]} />
          </div>

          <InlineQuote author="Shariful Islam">Allah is the owner of everything. Rizq, honor, power, and success come only from Allah.</InlineQuote>
          <InlineQuote author="Shariful Islam">True success is not only wealth, fame, or power. True success is becoming accepted by Allah and leaving behind benefit for humanity.</InlineQuote>

          <p className="font-sans text-sm text-primary/55 leading-relaxed">
            The Muslim Company does not claim perfection. The company will correct mistakes when discovered, accept truth when it becomes clear, protect ethics and justice, benefit humanity, and keep accountability and humility. The journey continues through tawakkul upon Allah, sincerity, halal effort, Prophetic ethics, and continuous striving for goodness. <span className="font-serif italic text-secondary">InshaAllah, as far as Allah allows.</span>
          </p>
        </div>
      </ExpandableSection>

      {/* ── FINAL PHILOSOPHY ── */}
      <ExpandableSection
        id="philosophy"
        label="Final Philosophy"
        summary="The Muslim Company seeks a future where faith and technology work together, business and morality remain connected, and economic systems serve humanity rather than exploit it."
        summaryNode={
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="space-y-3 max-w-2xl"
          >
            {["Faith and technology work together", "Business and morality remain connected", "Human development remains ethical", "Nature and civilization remain balanced", "Knowledge, justice, and compassion guide leadership", "Economic systems serve humanity rather than exploit it"].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="flex items-center gap-4">
                <span className="font-sans text-[10px] text-secondary/50 w-6 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-sans text-sm text-primary/70">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        }
      >
        <p className="font-sans text-sm text-primary/65 leading-relaxed max-w-3xl">
          The Muslim Company ultimately aims to build a global ethical civilization model inspired by Islamic values, knowledge, justice, sustainability, and service to humanity — not only as a successful institution, but as a protected ethical legacy designed to survive beyond individuals, generations, and changing times.
        </p>
      </ExpandableSection>

      {/* ── CTA FOOTER ── */}
      <section id="contact" className="py-24 lg:py-32 px-6 lg:px-12 bg-primary text-primary-foreground border-t border-primary-foreground/10">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <Label>Join the Effort</Label>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Be Part of Something Historic</h2>
            <p className="font-sans text-base text-primary-foreground/60 mb-10 leading-relaxed">
              Whether you are an investor, scientist, scholar, engineer, educator, or professional — if you share our vision for an ethical global civilization, the door is open.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Button data-testid="cta-contact" size="lg"
                className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold">
                Contact Us <MoveRight className="ml-2 w-4 h-4" />
              </Button>
              <Button data-testid="cta-partner" variant="outline" size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs">
                Partner With Us
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-primary-foreground/10 pt-14 mb-14">
            {[
              { v: "20+", l: "Sectors of Work" },
              { v: "10%", l: "Monthly Profit to Charity" },
              { v: "1.5 Yrs", l: "Maternity Leave" },
              { v: "15 Yrs", l: "Pension Threshold" },
            ].map((stat, i) => (
              <div key={i} className="text-center" data-testid={`stat-${i}`}>
                <p className="font-serif text-3xl text-secondary mb-1">{stat.v}</p>
                <p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/40">{stat.l}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-primary-foreground/10 pt-10 flex flex-col md:flex-row justify-between items-center text-xs font-sans text-primary-foreground/35">
            <div>
              <p className="font-serif text-base text-primary-foreground/50 mb-1">The Muslim Company</p>
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
