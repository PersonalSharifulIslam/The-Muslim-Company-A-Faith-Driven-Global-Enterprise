import { motion } from "framer-motion";
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

export default function MissionPage() {
  return (
    <SiteLayout>
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="bg-primary py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-secondary mb-4">Core Mission</p>
              <h1 className="font-serif text-5xl md:text-6xl text-primary-foreground mb-6">Our Mission</h1>
              <p className="font-serif text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                "To build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, justice, sustainability, and social development."
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl space-y-12">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-card border border-primary/10">
              <p className="font-sans text-sm text-primary/60 leading-relaxed">
                The purpose of the company is not only commercial success, but also the development of humanity, establishment of justice, protection of moral values, advancement of knowledge, and rebuilding a strong ethical civilization. The company seeks to contribute toward restoring the Muslim world's historical excellence in science, philosophy, literature, medicine, economics, technology, education, governance, and social development.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-8 bg-primary text-primary-foreground">
              <h3 className="font-serif text-2xl mb-4">Serving humanity through:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Ethical Business", "Knowledge", "Innovation", "Justice", "Sustainability", "Social Development", "Humanitarian Work", "Civilization Building"].map((v, i) => (
                  <div key={i} className="px-4 py-3 border border-secondary/30 text-center">
                    <p className="font-sans text-xs tracking-wide text-secondary/80">{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
