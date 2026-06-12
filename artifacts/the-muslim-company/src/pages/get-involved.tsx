import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, GraduationCap, FlaskConical, BookOpen, Users, Lightbulb, Globe2, MoveRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const INVOLVEMENT_TYPES = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Volunteer",
    subtitle: "Serve Humanity Directly",
    desc: "Join our humanitarian, community development, and social welfare programs. Volunteers are the heartbeat of our mission to serve people at the grassroots level — from food distribution to education support and disaster relief.",
    qualities: ["Commitment to service", "Compassion and empathy", "Reliability and integrity", "Any professional background welcome"],
    email: "help@themuslim.company",
    subject: "Volunteer Application — The Muslim Company",
    label: "Apply to Volunteer",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Intern",
    subtitle: "Build Your Career With Purpose",
    desc: "We offer internship opportunities for students and recent graduates who want to gain real-world experience in an ethical, Islamic-values-aligned environment. Internships are available across technology, research, media, humanitarian work, and business.",
    qualities: ["Currently studying or recently graduated", "Strong ethical character", "Eagerness to learn and contribute", "Open to students of any field"],
    email: "careers@themuslim.company",
    subject: "Internship Application — The Muslim Company",
    label: "Apply for Internship",
  },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    title: "Research Contributor",
    subtitle: "Advance Knowledge for Civilization",
    desc: "We welcome researchers, academics, and independent scholars who want to contribute to Islamic civilization studies, ethical technology research, Islamic economics, environmental science, humanitarian research, and interdisciplinary studies that serve humanity.",
    qualities: ["Academic or research background", "Interest in Islamic civilization", "Ability to contribute original research", "Commitment to ethical inquiry"],
    email: "research@themuslim.company",
    subject: "Research Contribution — The Muslim Company",
    label: "Propose Research",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Shariah Scholar",
    subtitle: "Guard the Ethical Foundation",
    desc: "Qualified Islamic scholars are invited to contribute to our Supreme Shariah Board advisory framework, ethical product review processes, and the development of Islamic commercial and technological ethics guidelines that will shape TMC's operations globally.",
    qualities: ["Formal Islamic scholarly qualification", "Knowledge of fiqh al-muamalat", "Familiarity with contemporary issues", "Commitment to principled independence"],
    email: "research@themuslim.company",
    subject: "Shariah Scholar Application — The Muslim Company",
    label: "Express Interest",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Mentor",
    subtitle: "Guide the Next Generation",
    desc: "Experienced professionals, entrepreneurs, and leaders are invited to mentor TMC team members, interns, and young Muslim professionals — sharing knowledge, experience, and wisdom to build the ethical leaders of tomorrow.",
    qualities: ["Significant professional experience", "Willingness to invest time in others", "Strong ethical character", "Industry expertise in any sector"],
    email: "ceo@themuslim.company",
    subject: "Mentorship — The Muslim Company",
    label: "Become a Mentor",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Strategic Advisor",
    subtitle: "Shape the Global Vision",
    desc: "Senior leaders, executives, policy experts, and global thinkers are invited to serve as strategic advisors — contributing high-level guidance on governance, global expansion, sector development, and civilization-scale strategy.",
    qualities: ["Senior leadership or global expertise", "Strategic and long-term thinking", "Alignment with Islamic ethical values", "Willingness to engage meaningfully"],
    email: "ceo@themuslim.company",
    subject: "Strategic Advisory — The Muslim Company",
    label: "Apply as Advisor",
  },
];

export default function GetInvolvedPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    document.title = "Get Involved — The Muslim Company";
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "Partner with or support The Muslim Company. Discover opportunities to contribute to a faith-driven global conglomerate building long-term civilizational impact.");
    const _ogt_d = document.querySelector('meta[property="og:description"]');
    if (_ogt_d) _ogt_d.setAttribute('content', "Partner with or support The Muslim Company. Discover opportunities to contribute to a faith-driven global conglomerate building long-term civilizational impact.");
    const _can = document.querySelector('link[rel="canonical"]');
    if (_can) _can.setAttribute('href', 'https://www.themuslim.company/get-involved');
    else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = 'https://www.themuslim.company/get-involved'; document.head.appendChild(_cl); }
    const _ogu_pg = document.querySelector('meta[property="og:url"]');
    if (_ogu_pg) _ogu_pg.setAttribute('content', 'https://www.themuslim.company/get-involved');
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) _rob.setAttribute('content', 'index, follow');
    else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", "Join The Muslim Company's mission — volunteer, intern, research, advise, or mentor. The best of people are those most beneficial to people.");
    const ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", "Get Involved — The Muslim Company");
    const ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute("content", "Volunteer, intern, research, mentor, or advise. Join a faith-driven global enterprise building ethical civilization.");

    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "Get Involved", "item": "https://www.themuslim.company/get-involved" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Get Involved — The Muslim Company",
        "description": "Join The Muslim Company — volunteer, intern, research, mentor, or advise.",
        "url": "https://www.themuslim.company/get-involved",
        "publisher": { "@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company" }
      }
    ];

    document.querySelectorAll("script[data-page-schema]").forEach(el => el.remove());
    schemas.forEach(schema => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-page-schema", "true");
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });

    return () => { document.querySelectorAll("script[data-page-schema]").forEach(el => el.remove()); };
  }, []);

  return (
    <SiteLayout>
      <div className="w-full bg-background text-foreground">

        {/* ── HERO ── */}
        <section className="bg-primary pt-32 pb-24 px-6 lg:px-12">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Join the Mission</p>
              <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-6 leading-tight max-w-3xl">
                The Best of People Are Those Most Beneficial to People.
              </h1>
              <p className="font-sans text-base text-primary-foreground/60 max-w-2xl leading-relaxed mb-8">
                The Muslim Company is not just a company — it is a civilization mission. We are building something the world has not yet seen: an ethical, Islamic-values-driven global enterprise that serves humanity across every domain of life. This mission requires people — people of character, knowledge, skill, and sincere intention.
              </p>
              <div className="border-l-4 border-secondary pl-6 py-1">
                <p className="font-serif text-lg italic text-primary-foreground/80 leading-relaxed">
                  "The best of people are those most beneficial to people."
                </p>
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mt-3">— Prophet Muhammad ﷺ (Al-Mu'jam Al-Awsat)</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WHY GET INVOLVED ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Why This Matters</p>
              <p className="font-serif text-2xl md:text-3xl text-primary mb-10 max-w-3xl leading-tight">
                The Muslim world needs builders, thinkers, scholars, and servants. This is your invitation.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Globe2 className="w-5 h-5" />,
                  title: "Civilization-Scale Impact",
                  desc: "Your contribution — however small — becomes part of something designed to outlast individuals and generations. TMC's constitutional framework is built to carry forward your work for decades.",
                },
                {
                  icon: <BookOpen className="w-5 h-5" />,
                  title: "Faith-Centered Environment",
                  desc: "Work in an environment where your Islamic identity is not just tolerated but celebrated. Prayer times, Islamic ethics, and prophetic values guide every interaction and decision.",
                },
                {
                  icon: <Heart className="w-5 h-5" />,
                  title: "Barakah in Your Work",
                  desc: "When your skills are directed toward the pleasure of Allah and the benefit of humanity, your work carries barakah. This is not just a career opportunity — it is an act of worship.",
                },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="p-6 border border-primary/10 bg-card">
                  <div className="text-secondary mb-4">{item.icon}</div>
                  <h3 className="font-serif text-lg text-primary mb-2">{item.title}</h3>
                  <p className="font-sans text-sm text-primary/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── INVOLVEMENT TYPES ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Ways to Contribute</p>
              <p className="font-serif text-2xl text-primary mb-10 max-w-2xl">
                Six pathways to join The Muslim Company's mission — each meaningful, each necessary.
              </p>
            </motion.div>
            <div className="space-y-6">
              {INVOLVEMENT_TYPES.map((type, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="border border-primary/10 bg-card p-8 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-secondary">{type.icon}</div>
                        <div>
                          <h3 className="font-serif text-2xl text-primary">{type.title}</h3>
                          <p className="font-sans text-xs tracking-widest uppercase text-secondary/70">{type.subtitle}</p>
                        </div>
                      </div>
                      <p className="font-sans text-sm text-primary/65 leading-relaxed mb-5">{type.desc}</p>
                      <div className="space-y-2">
                        {type.qualities.map((q, qi) => (
                          <div key={qi} className="flex items-start gap-3">
                            <Check className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                            <p className="font-sans text-xs text-primary/55">{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <a href={`mailto:${type.email}?subject=${encodeURIComponent(type.subject)}`}>
                        <button className="w-full border border-primary/20 hover:border-secondary text-primary hover:text-secondary font-sans text-xs uppercase tracking-widest h-12 px-6 transition-colors flex items-center justify-between group-hover:border-secondary">
                          {type.label}
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </a>
                      <p className="font-sans text-[10px] text-primary/30 mt-3 text-center">{type.email}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO WE WANT ── */}
        <section className="py-20 px-6 lg:px-12 bg-primary border-b border-primary-foreground/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Who We Welcome</p>
              <p className="font-serif text-2xl text-primary-foreground mb-8 max-w-2xl">
                We do not look only at qualifications. We look at character, intention, and commitment.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/40 mb-4">What we value most:</p>
                  <div className="space-y-3">
                    {[
                      "Taqwa — genuine God-consciousness in daily life",
                      "Honesty — in word, work, and interaction",
                      "Discipline — consistency, reliability, and professionalism",
                      "Humility — willingness to learn and serve",
                      "Sincerity of intention — working for Allah, not recognition",
                      "Knowledge — continuous learning and intellectual curiosity",
                      "Compassion — for people, for creation, for the vulnerable",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <p className="font-sans text-sm text-primary-foreground/65">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/40 mb-4">We welcome people from:</p>
                  <div className="space-y-3">
                    {[
                      "Technology and engineering backgrounds",
                      "Islamic scholarship and religious studies",
                      "Business, economics, and finance",
                      "Medicine, healthcare, and public health",
                      "Media, journalism, and communication",
                      "Research, academia, and education",
                      "Humanitarian work and social development",
                      "Law, governance, and policy",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                        <p className="font-sans text-sm text-primary-foreground/65">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6 lg:px-12 bg-background">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-6">Your Next Step</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                The Door Is Open.
              </h2>
              <p className="font-sans text-sm text-primary/60 mb-3 max-w-xl mx-auto leading-relaxed">
                If you have read this far and feel a resonance — a sense that this is something you want to be part of — then this is your invitation. Write to us. Tell us who you are, what you believe, and how you want to contribute.
              </p>
              <p className="font-sans text-sm text-primary/60 mb-10 max-w-xl mx-auto leading-relaxed">
                We do not promise perfection. We promise sincerity, accountability, and a genuine commitment to building something that matters — for this life and the next.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <a href="mailto:help@themuslim.company?subject=Get Involved — The Muslim Company">
                  <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold">
                    Write to Us <MoveRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href="/careers">
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs">
                    View Open Positions
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
