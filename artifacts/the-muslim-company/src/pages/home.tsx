import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MoveRight, Globe2, Leaf, HeartHandshake, ShieldCheck, ArrowUpRight } from "lucide-react";
import heroBg from "@/assets/images/hero-bg.png";
import visionBg from "@/assets/images/vision.png";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const SECTORS = [
  "Agriculture & Food", "Education & Research", "Technology & AI", 
  "Healthcare & Medicine", "Construction & Housing", "Renewable Energy", 
  "Media & Journalism", "Software & Cybersecurity", "Manufacturing & Industry", 
  "Islamic Finance & FinTech", "Transportation & Logistics", "E-commerce", 
  "Literature & Publishing", "Philosophy & Civilization", "Scientific Research", 
  "Social Welfare", "Environmental Protection", "Robotics & Automation", 
  "International Trade", "Community Development"
];

const VALUES = [
  { title: "Shariah Compliant", desc: "Absolute adherence to divine principles in every transaction.", icon: <ShieldCheck className="w-6 h-6 text-primary" /> },
  { title: "Justice & Honesty", desc: "Fairness to employees, partners, and humanity at large.", icon: <HeartHandshake className="w-6 h-6 text-primary" /> },
  { title: "No Riba", desc: "A financial ecosystem free of usury, exploitation, and predatory debt.", icon: <Leaf className="w-6 h-6 text-primary" /> },
  { title: "Global Impact", desc: "Building solutions that uplift human civilization worldwide.", icon: <Globe2 className="w-6 h-6 text-primary" /> },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  return (
    <div className="w-full bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 lg:px-12 mix-blend-difference text-primary-foreground">
        <div className="font-serif text-2xl font-bold tracking-widest uppercase">The Muslim Company</div>
        <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-none font-sans uppercase tracking-widest text-xs h-10 px-6">
          Join Us
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: yHero }}
        >
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply z-10" />
          <img 
            src={heroBg} 
            alt="Islamic geometric pattern" 
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>
        
        <div className="relative z-10 container px-6 mx-auto flex flex-col items-center text-center">
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
            className="mt-8 text-lg md:text-xl lg:text-2xl text-primary-foreground/80 max-w-3xl font-sans font-light"
          >
            A faith-driven, civilization-oriented global company built upon the Quran and authentic Sunnah.
          </motion.p>
        </div>
      </section>

      {/* Core Mission */}
      <section className="py-32 lg:py-48 px-6 lg:px-12 bg-background relative z-20">
        <div className="container mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-secondary font-bold mb-8">Our Mission</h2>
            <p className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight text-primary">
              To build a civilization-driven global company inspired by the Prophetic Model — empowering humanity through ethical business, knowledge, innovation, justice, and social development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values & Principles */}
      <section className="py-24 px-6 lg:px-12 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-secondary font-bold mb-4">Principles</h2>
            <h3 className="text-4xl md:text-5xl font-serif">Business as Worship</h3>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {VALUES.map((val, idx) => (
              <motion.div key={idx} variants={fadeIn} className="flex flex-col items-center text-center p-6 border border-primary-foreground/10 rounded-none bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h4 className="text-xl font-serif font-bold mb-3">{val.title}</h4>
                <p className="font-sans text-sm text-primary-foreground/70 font-light leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 20 Sectors */}
      <section className="py-32 px-6 lg:px-12 bg-card">
        <div className="container mx-auto flex flex-col lg:flex-row gap-16 items-start">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="lg:w-1/3 sticky top-32"
          >
            <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-secondary font-bold mb-4">Ecosystem</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-primary leading-none mb-6">Across All Sectors of Life</h3>
            <p className="font-sans text-primary/70 text-lg mb-8">
              We do not build in isolation. True civilization requires excellence in every domain of human endeavor.
            </p>
            <Button variant="default" className="bg-primary text-primary-foreground rounded-none uppercase tracking-widest font-sans h-12 px-8">
              Explore Our Work <MoveRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
          
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECTORS.map((sector, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 10) * 0.05 }}
                  className="py-4 border-b border-primary/10 flex justify-between items-center group cursor-pointer"
                >
                  <span className="font-serif text-xl lg:text-2xl text-primary group-hover:text-secondary transition-colors">{sector}</span>
                  <ArrowUpRight className="w-5 h-5 text-primary/30 group-hover:text-secondary transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Charity & Environment */}
      <section className="py-32 px-6 lg:px-12 bg-background border-t border-primary/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h3 className="text-3xl md:text-5xl font-serif text-primary mb-6">Social Welfare</h3>
              <p className="font-sans text-lg text-primary/80 mb-6 leading-relaxed">
                Profit is not the end goal; it is the fuel for human development. 
                <strong> 10% of net profit monthly</strong> goes directly to humanitarian causes.
              </p>
              <ul className="space-y-4 font-sans text-primary/70">
                <li className="flex items-center"><div className="w-1.5 h-1.5 bg-secondary rounded-full mr-4" /> Annual Zakat fully distributed</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 bg-secondary rounded-full mr-4" /> Orphan & widow support programs</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 bg-secondary rounded-full mr-4" /> Funding for mosques, madrasas & education</li>
              </ul>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h3 className="text-3xl md:text-5xl font-serif text-primary mb-6">Environmental Trust</h3>
              <p className="font-sans text-lg text-primary/80 mb-6 leading-relaxed">
                We are stewards (Khulafa) of the earth. We strictly forbid the intentional destruction of nature in the pursuit of wealth.
              </p>
              <ul className="space-y-4 font-sans text-primary/70">
                <li className="flex items-center"><div className="w-1.5 h-1.5 bg-secondary rounded-full mr-4" /> Massive tree plantation drives</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 bg-secondary rounded-full mr-4" /> Wildlife & natural habitat protection</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 bg-secondary rounded-full mr-4" /> Heavy investment in renewable energy</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Image */}
      <section className="relative h-[80svh] w-full flex items-center justify-center overflow-hidden bg-primary">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply z-10" />
          <img 
            src={visionBg} 
            alt="Future vision" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative z-10 container px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl md:text-7xl font-serif text-primary-foreground mb-8">The Future is Ethical</h2>
            <p className="font-sans text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-light leading-relaxed">
              We are building universities, research centers, hospitals, and innovation hubs. The renaissance of ethical human civilization starts now.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-primary pt-32 pb-12 px-6 lg:px-12 text-primary-foreground">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-serif mb-8">Join the Effort</h2>
            <p className="font-sans text-lg text-primary-foreground/70 mb-12">
              Whether you are an investor, a scientist, a scholar, or a professional—if you share our vision for an ethical global civilization, the door is open.
            </p>
            <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-14 px-10 text-sm font-bold">
              Contact Us
            </Button>
          </div>
          
          <div className="border-t border-primary-foreground/10 pt-12 flex flex-col md:flex-row justify-between items-center text-sm font-sans text-primary-foreground/40">
            <p>&copy; {new Date().getFullYear()} The Muslim Company. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-primary-foreground cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-primary-foreground cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
