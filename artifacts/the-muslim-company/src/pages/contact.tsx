import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Mail, MapPin, Globe, Phone, ArrowUpRight, Building2, Users, Briefcase, HeartHandshake, Megaphone, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const CONTACT_TYPES = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "General Inquiry",
    desc: "Questions about The Muslim Company, our mission, or general information.",
    email: "help@themuslim.company",
    subject: "General Inquiry",
  },
  {
    icon: <HeartHandshake className="w-5 h-5" />,
    label: "Partnership",
    desc: "Business collaborations, NGO partnerships, investment, and strategic alliances.",
    email: "ceo@themuslim.company",
    subject: "Partnership Inquiry",
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    label: "Careers",
    desc: "Questions about open positions, the application process, or career opportunities.",
    email: "careers@themuslim.company",
    subject: "Career Inquiry",
  },
  {
    icon: <Megaphone className="w-5 h-5" />,
    label: "Media & Press",
    desc: "Journalists, media organizations, and press inquiries about TMC.",
    email: "media@themuslim.company",
    subject: "Media & Press Inquiry",
  },
  {
    icon: <FlaskConical className="w-5 h-5" />,
    label: "Research & Academic",
    desc: "Academic collaborations, research partnerships, and scholarly inquiries.",
    email: "research@themuslim.company",
    subject: "Research & Academic Inquiry",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Customer Support",
    desc: "Help with products, services, orders, or any customer-related concerns.",
    email: "help@themuslim.company",
    subject: "Customer Support",
  },
];

const PARTNER_TYPES = [
  { label: "Investment Partnership", email: "ceo@themuslim.company" },
  { label: "Business Collaboration", email: "ceo@themuslim.company" },
  { label: "Research Partnership", email: "research@themuslim.company" },
  { label: "NGO & Humanitarian Partnership", email: "ceo@themuslim.company" },
  { label: "Academic & Educational Partnership", email: "research@themuslim.company" },
  { label: "Technology Partnership", email: "ceo@themuslim.company" },
  { label: "Personal Partnership", email: "ceo@themuslim.company" },
  { label: "Media Partnership", email: "media@themuslim.company" },
];

export default function ContactPage() {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Schema injection
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://www.themuslim.company/contact" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact The Muslim Company",
        "description": "Get in touch with The Muslim Company for general inquiries, partnerships, careers, media, research, or customer support.",
        "url": "https://www.themuslim.company/contact",
        "publisher": {
          "@type": "Organization",
          "name": "The Muslim Company",
          "url": "https://www.themuslim.company",
          "email": "help@themuslim.company",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dhaka",
            "addressCountry": "BD"
          }
        }
      }
    ];

    document.title = "Contact Us — The Muslim Company";

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
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "Get in touch with The Muslim Company — a global conglomerate based in Dhaka, Bangladesh. Reach us for partnerships, media, or career inquiries.");
    const _ogt_d = document.querySelector('meta[property="og:description"]');
    if (_ogt_d) _ogt_d.setAttribute('content', "Get in touch with The Muslim Company — a global conglomerate based in Dhaka, Bangladesh. Reach us for partnerships, media, or career inquiries.");
    const _can = document.querySelector('link[rel="canonical"]');
    if (_can) { _can.setAttribute('href', 'https://www.themuslim.company/contact'); } else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = 'https://www.themuslim.company/contact'; document.head.appendChild(_cl); }
    const _ogu_c = document.querySelector('meta[property="og:url"]');
    if (_ogu_c) _ogu_c.setAttribute('content', 'https://www.themuslim.company/contact');
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) _ogi.setAttribute('content', 'https://www.themuslim.company/og-contact.png');
    else {
      const _m = document.createElement('meta'); _m.setAttribute('property', 'og:image');
      _m.setAttribute('content', 'https://www.themuslim.company/og-contact.png'); document.head.appendChild(_m);
    }
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) _twi.setAttribute('content', 'https://www.themuslim.company/og-contact.png');
    else {
      const _t = document.createElement('meta'); _t.setAttribute('name', 'twitter:image');
      _t.setAttribute('content', 'https://www.themuslim.company/og-contact.png'); document.head.appendChild(_t);
    }
    const _ogt2 = document.querySelector('meta[property="og:title"]');
    if (_ogt2) _ogt2.setAttribute('content', 'Contact — The Muslim Company');
    const _ogd2 = document.querySelector('meta[property="og:description"]');
    if (_ogd2) _ogd2.setAttribute('content', 'Get in touch with The Muslim Company — for partnerships, careers, media, research, or support.');
    const _ogu2 = document.querySelector('meta[property="og:url"]');
    if (_ogu2) _ogu2.setAttribute('content', 'https://www.themuslim.company/contact');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Get in touch with The Muslim Company — for general inquiries, partnerships, media, careers, research, or customer support.');

    document.querySelectorAll('script[data-contact-schema]').forEach(el => el.remove());
    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-contact-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-contact-schema]').forEach(el => el.remove());
    };
  }, []);

  function handleEmail(email: string, subject: string) {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  }

  return (
    <SiteLayout>
      <div className="w-full bg-background text-foreground">

        {/* ── HERO ── */}
        <section className="bg-primary pt-32 pb-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Get In Touch</p>
              <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-6 leading-tight">Contact Us</h1>
              <p className="font-sans text-lg text-primary-foreground/60 max-w-2xl leading-relaxed">
                Whether you are an investor, researcher, journalist, partner, or someone who simply shares our vision — we welcome your message. Every inquiry is treated with honesty, respect, and care.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── CONTACT TYPES ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-2">How Can We Help?</p>
              <p className="font-serif text-2xl text-primary mb-10 max-w-2xl">Select the nature of your inquiry and we will connect you with the right team.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CONTACT_TYPES.map((type, i) => (
                <motion.button
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  onClick={() => handleEmail(type.email, type.subject)}
                  className="text-left p-6 border border-primary/10 hover:border-secondary hover:bg-card transition-all group"
                >
                  <div className="text-secondary/60 group-hover:text-secondary transition-colors mb-4">{type.icon}</div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg text-primary group-hover:text-secondary transition-colors">{type.label}</h3>
                    <ArrowUpRight className="w-4 h-4 text-primary/20 group-hover:text-secondary transition-colors flex-shrink-0 mt-1" />
                  </div>
                  <p className="font-sans text-xs text-primary/65 leading-relaxed mb-3">{type.desc}</p>
                  <p className="font-sans text-xs text-secondary/70 tracking-wide">{type.email}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNERSHIP ── */}
        <section className="py-20 px-6 lg:px-12 bg-primary border-b border-primary-foreground/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-2">Partnership Opportunities</p>
              <p className="font-serif text-2xl text-primary-foreground mb-8 max-w-2xl">Select the type of partnership you are interested in.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-primary-foreground/15">
                {PARTNER_TYPES.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleEmail(p.email, p.label)}
                    className="py-4 px-5 border-b border-primary-foreground/10 flex justify-between items-center group hover:bg-primary-foreground/5 transition-colors text-left"
                  >
                    <span className="font-serif text-base text-primary-foreground group-hover:text-secondary transition-colors">{p.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-primary-foreground/20 group-hover:text-secondary transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── COMPANY INFO ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-8">Company Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-card border border-primary/10">
                  <Building2 className="w-5 h-5 text-secondary mb-3" />
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">Legal Name</p>
                  <p className="font-sans text-sm text-primary/80">The Muslim Company LTD</p>
                </div>
                <div className="p-6 bg-card border border-primary/10">
                  <MapPin className="w-5 h-5 text-secondary mb-3" />
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">Headquarters</p>
                  <p className="font-sans text-sm text-primary/80">Dhaka, Bangladesh</p>
                </div>
                <div className="p-6 bg-card border border-primary/10">
                  <Globe className="w-5 h-5 text-secondary mb-3" />
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">Website</p>
                  <a href="https://www.themuslim.company" className="font-sans text-sm text-primary/80 hover:text-secondary transition-colors underline-offset-2 hover:underline">themuslim.company</a>
                </div>
                <div className="p-6 bg-card border border-primary/10">
                  <Mail className="w-5 h-5 text-secondary mb-3" />
                  <p className="font-sans text-xs tracking-widest uppercase text-primary/65 mb-1">General Email</p>
                  <p className="font-sans text-sm text-primary/80">help@themuslim.company</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── EMAIL DIRECTORY ── */}
        <section className="py-20 px-6 lg:px-12 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-8">Email Directory</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-primary/10">
                {[
                  { dept: "General Support", email: "help@themuslim.company" },
                  { dept: "CEO & Partnerships", email: "ceo@themuslim.company" },
                  { dept: "Careers & HR", email: "careers@themuslim.company" },
                  { dept: "Media & Press", email: "media@themuslim.company" },
                  { dept: "Research & Academic", email: "research@themuslim.company" },
                  { dept: "Investor Relations", email: "ceo@themuslim.company" },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`mailto:${item.email}`}
                    className="py-4 px-5 border-b border-primary/10 flex justify-between items-center group hover:bg-background transition-colors"
                  >
                    <div>
                      <p className="font-sans text-xs tracking-wide uppercase text-primary/65 mb-0.5">{item.dept}</p>
                      <p className="font-serif text-base text-primary group-hover:text-secondary transition-colors">{item.email}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-primary/20 group-hover:text-secondary transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section className="py-20 px-6 lg:px-12 bg-primary">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-6">Our Commitment</p>
              <blockquote className="font-serif text-2xl md:text-3xl text-primary-foreground/85 italic leading-relaxed mb-6">
                "Every message we receive is a trust. We respond with honesty, respect, and care — because in Islam, fulfilling amanah is not optional."
              </blockquote>
              <p className="font-sans text-xs tracking-widest uppercase text-secondary/60">— The Muslim Company</p>
              <div className="mt-10">
                <a href="mailto:help@themuslim.company">
                  <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold">
                    Send Us a Message <MoveRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}
