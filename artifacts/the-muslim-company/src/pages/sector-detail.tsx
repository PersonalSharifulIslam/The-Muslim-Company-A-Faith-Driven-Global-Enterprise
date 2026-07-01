import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeft, MoveRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

type SectorData = {
  label: string;
  slug: string;
  icon: string;
  tagline: string;
  overview: string;
  islamicContext: string;
  activities: string[];
  approach: string[];
  whyItMatters: string;
  globalProblem: string;
  goals: { short: string[]; long: string[] };
  related: string[];
};

const SECTORS_DATA: SectorData[] = [
  {
    label: "Agriculture & Food",
    slug: "agriculture-food",
    icon: "🌱",
    tagline: "Nourishing Humanity Through Ethical Farming and Halal Food Systems",
    overview: "The Muslim Company's Agriculture & Food sector is committed to building ethical, sustainable, and halal food systems that nourish humanity with dignity. Food is one of the most fundamental human rights — and ensuring its purity, accessibility, and sustainability is a divine responsibility.",
    islamicContext: "Islam places profound emphasis on halal and tayyib (pure) food. The Quran repeatedly commands believers to eat what is halal and good. The Prophet ﷺ said: 'Every body nourished by haram will not enter Paradise.' TMC's agriculture sector exists to ensure that food reaching Muslim households and humanity at large is not only halal in slaughter — but ethical in farming, fair in trade, and clean in processing.",
    activities: [
      "Halal-certified food production and processing",
      "Sustainable and organic farming initiatives",
      "Agricultural research and innovation centers",
      "Ethical supply chain management",
      "Food security programs for low-income communities",
      "Reduction of food waste through smart distribution",
      "Farmer empowerment and fair trade programs",
      "Aquaculture and ethical livestock farming",
    ],
    approach: [
      "All produce certified halal and ethically sourced",
      "No GMO products without full ethical review",
      "Fair wages and safe conditions for all farm workers",
      "Environmentally sustainable farming methods",
      "Shariah-compliant finance for agricultural development",
      "Community-owned cooperative farming models",
    ],
    whyItMatters: "Over 800 million people go to bed hungry every night. At the same time, one-third of all food produced globally is wasted. The Muslim world, once a leader in agricultural innovation, must reclaim its role in feeding humanity with justice and compassion.",
    globalProblem: "Food insecurity, malnutrition, exploitative farming practices, and the absence of genuine halal standards threaten both human dignity and ecological balance worldwide.",
    goals: {
      short: ["Launch halal-certified food brands", "Partner with ethical farmers globally", "Establish food security programs in underserved communities"],
      long: ["Build a global halal food ecosystem from farm to table", "Develop agricultural research centers", "Create food waqf systems for sustained humanitarian feeding"],
    },
    related: ["Environmental Protection", "Social Welfare & Humanitarian Work", "E-commerce", "Manufacturing & Industry"],
  },
  {
    label: "Education & Research",
    slug: "education-research",
    icon: "🎓",
    tagline: "Reviving the Islamic Tradition of Knowledge, Inquiry, and Civilization",
    overview: "Education is the cornerstone of every civilization. The Muslim Company's Education & Research sector is dedicated to building world-class, ethically grounded educational institutions and research centers that integrate Islamic values with modern knowledge — producing scholars, scientists, engineers, and leaders who are equally strong in faith and intellect.",
    islamicContext: "The first word revealed to the Prophet Muhammad ﷺ was 'Iqra' — Read. Islam is fundamentally a civilization built on knowledge. From Baghdad's Bayt al-Hikmah to Cordoba's libraries, Muslims once led the world in science, mathematics, philosophy, and medicine. TMC's education sector seeks to revive this noble tradition for the 21st century.",
    activities: [
      "Establishing Islamic universities and academies",
      "Funding scholarships for deserving students globally",
      "Research centers for Islamic economics, ethics, and science",
      "Online learning platforms with Islamic values integration",
      "Teacher training and curriculum development",
      "Publishing educational materials and textbooks",
      "Science and technology education for Muslim youth",
      "Arabic language and Quranic studies programs",
    ],
    approach: [
      "Curriculum integrating Islamic ethics with modern sciences",
      "Accessible and affordable education for all income levels",
      "Research guided by both divine revelation and empirical inquiry",
      "Emphasis on character development alongside academic excellence",
      "Gender-appropriate learning environments with full opportunities for women",
      "Partnerships with global Islamic scholarly institutions",
    ],
    whyItMatters: "The Muslim world comprises 1.8 billion people, yet produces a disproportionately small fraction of global scientific research and innovation. Restoring the Muslim world's intellectual leadership requires a complete reimagining of educational systems.",
    globalProblem: "Millions of Muslim children lack access to quality education. Existing education systems often strip Islamic identity from students while failing to produce critical thinkers and ethical leaders.",
    goals: {
      short: ["Launch online Islamic education platform", "Fund 1,000 scholarships in Year 1", "Establish first research center"],
      long: ["Build TMC University — a world-class Islamic institution", "Create a global network of Islamic research centers", "Produce Muslim Nobel laureates and global scientific leaders"],
    },
    related: ["Technology & AI", "Scientific Research", "Philosophy & Civilization Studies", "Literature & Publishing"],
  },
  {
    label: "Technology & AI",
    slug: "technology-ai",
    icon: "💻",
    tagline: "Ethical Innovation for a Humanity-Centered Digital Future",
    overview: "Technology is among the most powerful forces shaping modern civilization. The Muslim Company's Technology & AI sector is dedicated to building, deploying, and governing technology that serves humanity — not exploits it. Every algorithm, platform, and system developed under TMC must meet strict ethical, Islamic, and humanitarian standards.",
    islamicContext: "The Quran commands believers to use their intellect and explore the signs of Allah in creation. Technology, at its core, is the application of human intellect to improve life. However, when technology is weaponized for addiction, surveillance, exploitation, or moral corruption — it becomes a tool of harm. TMC's technology sector ensures that every innovation is a mercy, not a menace.",
    activities: [
      "Ethical AI research and development",
      "Islamic-values-aligned software and mobile applications",
      "Cybersecurity solutions for Muslim institutions",
      "Privacy-first digital platforms",
      "Anti-addiction algorithm design",
      "Technology for humanitarian and social welfare applications",
      "Smart city and infrastructure technology",
      "Digital literacy programs for Muslim communities",
    ],
    approach: [
      "All AI systems reviewed by Ethics Board before deployment",
      "No participation in surveillance capitalism or data exploitation",
      "Human oversight maintained over all automated systems",
      "Open-source contributions to the global Muslim tech community",
      "Child and family safety built into all digital products",
      "Transparent data policies with zero data selling",
    ],
    whyItMatters: "Big Tech currently dominates Muslim digital life while serving values fundamentally at odds with Islamic ethics — addictive algorithms, privacy violations, and moral corruption disguised as entertainment. The Muslim world needs ethical, sovereignty-preserving alternatives.",
    globalProblem: "Addiction-based digital platforms are destroying mental health, family structures, and moral values globally. AI systems built without ethical oversight pose existential risks to humanity's future.",
    goals: {
      short: ["Launch first ethical Muslim app", "Establish AI Ethics Review Board", "Begin cybersecurity services for Islamic institutions"],
      long: ["Build TMC Tech — a globally recognized ethical tech company", "Develop halal AI systems serving billions", "Create Muslim-owned digital infrastructure independent of exploitative Big Tech"],
    },
    related: ["Software & Cybersecurity", "Robotics & Automation", "Media & Journalism", "Education & Research"],
  },
  {
    label: "Healthcare & Medicine",
    slug: "healthcare-medicine",
    icon: "🏥",
    tagline: "Healing Humanity With Compassion, Ethics, and Islamic Medical Principles",
    overview: "Healthcare is a divine trust. The Muslim Company's Healthcare & Medicine sector is committed to making quality, ethical, and affordable healthcare accessible to every human being — regardless of income, geography, or background. Inspired by the rich Islamic medical tradition, TMC approaches healing as an act of worship and humanitarian service.",
    islamicContext: "The Prophet Muhammad ﷺ said: 'Make use of medical treatment, for Allah has not made a disease without appointing a remedy for it.' Islamic civilization produced some of history's greatest physicians — Ibn Sina, Al-Razi, Ibn al-Nafis. TMC's healthcare sector seeks to honor this legacy by combining the compassion of Islamic ethics with the precision of modern medicine.",
    activities: [
      "Establishing affordable clinics and hospitals globally",
      "Halal pharmaceutical research and production",
      "Mental health support within Islamic frameworks",
      "Maternal and child healthcare programs",
      "Medical research and clinical innovation",
      "Telemedicine platforms for remote communities",
      "Medical scholarships and training programs",
      "Humanitarian medical missions in crisis zones",
    ],
    approach: [
      "Patient dignity and privacy treated as sacred",
      "Affordable tiered pricing — no one turned away for inability to pay",
      "Halal medicines and treatment protocols",
      "Gender-appropriate medical care environments",
      "Integration of spiritual care alongside physical treatment",
      "Ethical medical research with full Shariah board oversight",
    ],
    whyItMatters: "Over 4.5 billion people worldwide lack access to essential health services. In Muslim-majority countries, healthcare infrastructure is often severely underdeveloped. Quality healthcare should not be a privilege of the wealthy.",
    globalProblem: "Exploitative pharmaceutical pricing, inaccessible healthcare in poor communities, and the absence of halal medical products leave billions without ethical healthcare options.",
    goals: {
      short: ["Launch free health camps in underserved areas", "Begin halal pharmaceutical research", "Establish mental health support services"],
      long: ["Build TMC Medical Centers across Muslim-majority countries", "Develop globally recognized halal pharmaceutical brands", "Create a medical waqf providing free care to the poor"],
    },
    related: ["Scientific Research", "Social Welfare & Humanitarian Work", "Community Development", "Environmental Protection"],
  },
  {
    label: "Construction & Housing",
    slug: "construction-housing",
    icon: "🏗️",
    tagline: "Building Dignified Homes and Ethical Infrastructure for All of Humanity",
    overview: "Shelter is among the most basic human rights. The Muslim Company's Construction & Housing sector is dedicated to creating ethical, sustainable, and affordable housing solutions — from individual homes to entire community developments — guided by Islamic principles of justice, stewardship, and human dignity.",
    islamicContext: "In Islam, providing shelter and removing harm from people's path are acts of great virtue. The concept of 'umran' — civilizational development — is central to Islamic thought. TMC's construction sector builds not just structures, but dignified spaces where families can thrive in safety, comfort, and spiritual harmony.",
    activities: [
      "Affordable housing development for low-income communities",
      "Islamic-architecture inspired residential and commercial projects",
      "Sustainable green building initiatives",
      "Infrastructure development in underserved regions",
      "Housing waqf programs for the poor",
      "Ethical construction employment and worker welfare",
      "Smart home technology integration",
      "Urban planning with Islamic civilization principles",
    ],
    approach: [
      "No riba-based financing in any construction project",
      "Fair wages and safe working conditions for all construction workers",
      "Environmentally sustainable materials and methods",
      "Community consultation in all development projects",
      "Halal-compliant design principles",
      "Priority given to affordable housing over luxury development",
    ],
    whyItMatters: "Over 1.6 billion people worldwide live in inadequate housing. Homelessness, slums, and overcrowding represent a profound failure of civilization. Ethical construction can be transformative for entire communities.",
    globalProblem: "Exploitative real estate markets, riba-based mortgages, and corrupt construction industries deny billions access to dignified housing while the wealthy accumulate properties as investment vehicles.",
    goals: {
      short: ["Launch first affordable housing project", "Establish ethical construction standards", "Begin housing waqf fund"],
      long: ["Build TMC Housing — a global ethical real estate brand", "Develop complete Islamic smart cities", "House one million families through waqf and affordable programs"],
    },
    related: ["Community Development", "Renewable Energy", "Environmental Protection", "Islamic Finance & FinTech"],
  },
  {
    label: "Renewable Energy",
    slug: "renewable-energy",
    icon: "⚡",
    tagline: "Powering Civilization With Clean, Ethical, and Sustainable Energy",
    overview: "Energy is the lifeblood of modern civilization. The Muslim Company's Renewable Energy sector is dedicated to transitioning humanity toward clean, sustainable, and ethically produced energy — protecting Allah's creation while empowering communities that have long been denied reliable power.",
    islamicContext: "The Quran declares humanity as khalifah — stewards of the earth. Destroying the environment for fossil fuel profits is a profound violation of this trust. Solar, wind, and other renewable energies represent one of the most powerful tools available to fulfill our divine responsibility as custodians of creation.",
    activities: [
      "Solar energy projects for Muslim-majority communities",
      "Wind and hydroelectric power development",
      "Energy access programs for off-grid rural communities",
      "Renewable energy research and innovation",
      "Green energy financing through Islamic instruments",
      "Energy efficiency consulting and auditing",
      "Training programs for renewable energy technicians",
      "Advocacy for clean energy policy globally",
    ],
    approach: [
      "Priority given to communities with no reliable energy access",
      "All energy projects environmentally assessed",
      "Community ownership models for local empowerment",
      "Shariah-compliant green sukuk financing",
      "No participation in fossil fuel exploitation",
      "Technology transfer to enable local capacity building",
    ],
    whyItMatters: "Over 750 million people still lack access to electricity. Climate change — driven largely by fossil fuels — threatens the poorest and most vulnerable communities disproportionately. Clean energy is both an environmental and justice imperative.",
    globalProblem: "Energy poverty, fossil fuel dependence, and climate destruction disproportionately harm Muslim-majority and developing nations while enriching fossil fuel corporations with no regard for creation.",
    goals: {
      short: ["Launch pilot solar projects in rural communities", "Establish renewable energy research lab", "Issue first green sukuk"],
      long: ["Provide clean energy to 10 million homes", "Build TMC Energy — a global Islamic green energy company", "Achieve carbon neutrality across all TMC operations"],
    },
    related: ["Environmental Protection", "Construction & Housing", "Scientific Research", "Community Development"],
  },
  {
    label: "Media & Journalism",
    slug: "media-journalism",
    icon: "📡",
    tagline: "Truth-Based, Ethical Media for an Informed and Just World",
    overview: "Media shapes minds, cultures, and civilizations. The Muslim Company's Media & Journalism sector is committed to producing truth-based, ethically responsible, and humanizing content — countering misinformation, bias, and moral corruption in global media narratives.",
    islamicContext: "Islam places immense value on truth — 'truthfulness leads to righteousness and righteousness leads to Paradise' (Hadith). In an age of fake news, propaganda, and sensationalism, TMC's media sector stands as a beacon of journalistic integrity, rooted in the Prophetic tradition of honest and compassionate communication.",
    activities: [
      "Ethical news and journalism platforms",
      "Islamic documentary and educational film production",
      "Children's ethical media and animation",
      "Podcasts and digital content on Islamic thought",
      "Investigative journalism on humanitarian crises",
      "Media literacy education programs",
      "Muslim representation in global media",
      "Counter-misinformation initiatives",
    ],
    approach: [
      "Zero tolerance for fake news or sensationalism",
      "All content reviewed for ethical and Islamic compliance",
      "Diverse, accurate, and dignified representation of Muslims",
      "No clickbait, addiction-based content algorithms",
      "Transparency about funding and editorial independence",
      "Platform for marginalized voices globally",
    ],
    whyItMatters: "Muslims represent 25% of the world's population yet are consistently misrepresented, demonized, or ignored in mainstream global media. Truth-based Islamic media can reshape global understanding and counter decades of harmful narratives.",
    globalProblem: "Misinformation, Islamophobia, and morally corrosive entertainment dominate global media, shaping public opinion in ways that harm Muslim communities and erode universal ethical values.",
    goals: {
      short: ["Launch TMC News digital platform", "Begin documentary production", "Establish ethical journalism standards"],
      long: ["Build globally recognized Islamic news network", "Produce award-winning ethical entertainment", "Establish TMC Media as the world's most trusted Muslim media brand"],
    },
    related: ["Literature & Publishing", "Technology & AI", "Education & Research", "Philosophy & Civilization Studies"],
  },
  {
    label: "Software & Cybersecurity",
    slug: "software-cybersecurity",
    icon: "🔐",
    tagline: "Protecting Digital Sovereignty With Ethical Software and Islamic Values",
    overview: "In an increasingly digital world, software infrastructure and cybersecurity are matters of sovereignty, privacy, and trust. The Muslim Company's Software & Cybersecurity sector builds ethical software solutions and provides robust security services — protecting individuals, institutions, and Muslim communities from digital threats.",
    islamicContext: "Privacy, trust, and the protection of amanah (trust) are fundamental Islamic values. Just as Islam protects the sanctity of homes and private conversations, TMC's cybersecurity sector protects the digital homes and communications of the 21st century. Data is amanah — it must never be abused, sold, or exploited.",
    activities: [
      "Ethical enterprise software development",
      "Cybersecurity auditing and consulting",
      "Secure communications platforms for Islamic institutions",
      "Anti-surveillance privacy tools",
      "Halal app store and digital marketplace",
      "Open-source Islamic software contributions",
      "Digital forensics and incident response",
      "Security awareness training programs",
    ],
    approach: [
      "Privacy-by-design in all software development",
      "Zero data selling or third-party exploitation",
      "End-to-end encryption as standard practice",
      "Transparent open-source code where possible",
      "Regular Shariah board review of digital ethics",
      "Affordable security solutions for small Islamic institutions",
    ],
    whyItMatters: "Islamic institutions, Muslim businesses, and individual Muslims are increasingly targeted by cyberattacks, state surveillance, and data exploitation. Digital sovereignty is inseparable from religious and political freedom.",
    globalProblem: "Big Tech monopolies harvest Muslim user data, surveillance states monitor Islamic communities, and underfunded Muslim institutions are highly vulnerable to increasingly sophisticated cyberattacks.",
    goals: {
      short: ["Launch cybersecurity services for Islamic institutions", "Develop first TMC privacy app", "Establish software ethics framework"],
      long: ["Build TMC Software — a globally trusted ethical tech company", "Create Muslim-owned secure digital infrastructure", "Achieve complete data sovereignty for TMC ecosystem"],
    },
    related: ["Technology & AI", "Media & Journalism", "Islamic Finance & FinTech", "E-commerce"],
  },
  {
    label: "Manufacturing & Industry",
    slug: "manufacturing-industry",
    icon: "🏭",
    tagline: "Ethical Production, Dignified Labor, and Halal Industry at Global Scale",
    overview: "Manufacturing is the backbone of economic development. The Muslim Company's Manufacturing & Industry sector is committed to building ethical, halal-certified, and environmentally responsible industrial operations — creating quality products and dignified employment while refusing to participate in exploitative industrial practices.",
    islamicContext: "The Prophet Muhammad ﷺ said: 'Allah loves that when one of you does a job, he does it with excellence.' Itqan — excellence and precision in work — is a core Islamic value that must extend to manufacturing. Every product bearing TMC's name must be made with care, honesty, and responsibility.",
    activities: [
      "Halal-certified manufacturing facilities",
      "Ethical consumer goods production",
      "Industrial training and vocational programs",
      "Quality assurance and certification services",
      "Sustainable packaging and eco-friendly production",
      "Supply chain ethics auditing",
      "Manufacturing innovation and automation research",
      "Worker welfare and fair labor advocacy",
    ],
    approach: [
      "Living wages and safe conditions for all factory workers",
      "No child labor or forced labor under any circumstances",
      "Environmental impact assessment for all facilities",
      "Halal certification for all applicable products",
      "Local sourcing prioritized over exploitative global chains",
      "Worker-owned cooperative models encouraged",
    ],
    whyItMatters: "The Muslim world imports the vast majority of its manufactured goods from non-Muslim nations, creating economic dependency and exposure to haram supply chains. Developing ethical Muslim-owned manufacturing is an economic and religious necessity.",
    globalProblem: "Global manufacturing is plagued by worker exploitation, environmental destruction, and supply chains linked to child labor and forced work. Consumers globally are increasingly demanding ethical production.",
    goals: {
      short: ["Establish first halal-certified manufacturing facility", "Launch worker welfare program", "Begin supply chain ethics auditing service"],
      long: ["Build TMC Manufacturing — a globally recognized ethical industrial brand", "Create one million dignified manufacturing jobs in Muslim-majority countries", "Achieve full supply chain transparency and traceability"],
    },
    related: ["E-commerce", "International Trade", "Environmental Protection", "Retail Business"],
  },
  {
    label: "Islamic Finance & FinTech",
    slug: "islamic-finance-fintech",
    icon: "💰",
    tagline: "Riba-Free, Justice-Centered Financial Systems for the Modern World",
    overview: "Finance built on riba (interest) is explicitly forbidden in Islam — yet the vast majority of the world's financial infrastructure is built upon it. The Muslim Company's Islamic Finance & FinTech sector is dedicated to building comprehensive, innovative, and globally competitive riba-free financial systems that serve both Muslims and all humanity.",
    islamicContext: "Allah declared war on those who persist in riba (Quran 2:279). The destruction caused by interest-based economies — debt slavery, wealth concentration, financial crises — validates what Islamic economics has always taught. TMC's finance sector demonstrates that a completely riba-free financial system is not only possible but superior in justice, stability, and sustainability.",
    activities: [
      "Islamic banking and investment products",
      "Halal fintech applications and digital wallets",
      "Zakat management and distribution platforms",
      "Waqf (endowment) management systems",
      "Microfinance for Muslim entrepreneurs (qard hasan)",
      "Islamic crowdfunding platforms",
      "Shariah-compliant insurance (takaful)",
      "Ethical investment screening and ESG Islamic funds",
    ],
    approach: [
      "Complete elimination of riba in all financial products",
      "Profit-and-loss sharing as default financing model",
      "Transparent contracts with zero hidden fees",
      "Financial literacy education for Muslim communities",
      "Accessible microfinance for the economically marginalized",
      "Annual Shariah audit of all financial products",
    ],
    whyItMatters: "1.8 billion Muslims need financial services consistent with their faith. The Islamic finance industry is growing rapidly but remains dominated by institutions that only superficially comply with Islamic principles while maintaining exploitative structures.",
    globalProblem: "Interest-based finance perpetuates global inequality, debt crises, and exploitation of the poor. Muslims are forced to choose between financial exclusion and compromising their religious convictions.",
    goals: {
      short: ["Launch halal digital wallet", "Establish zakat platform", "Begin Islamic microfinance program"],
      long: ["Build TMC Bank — a globally licensed Islamic financial institution", "Manage $1 billion in ethical Islamic assets", "Make halal finance accessible to every Muslim on earth"],
    },
    related: ["E-commerce", "International Trade", "Community Development", "Social Welfare & Humanitarian Work"],
  },
  {
    label: "Transportation & Logistics",
    slug: "transportation-logistics",
    icon: "🚢",
    tagline: "Ethical Mobility and Supply Chain Solutions for a Connected World",
    overview: "The movement of people and goods is the circulatory system of civilization. The Muslim Company's Transportation & Logistics sector is committed to building ethical, efficient, and environmentally responsible mobility solutions — ensuring that global supply chains reflect Islamic values of trust, fairness, and accountability.",
    islamicContext: "The Islamic trading tradition was built on trust, fair dealing, and global connectivity. Muslim traders carried not only goods but values, knowledge, and civilization across continents. TMC's transportation and logistics sector revives this noble tradition in the modern era — building supply chains of integrity.",
    activities: [
      "Halal-certified logistics and cold chain management",
      "Ethical freight and shipping services",
      "Last-mile delivery in underserved communities",
      "Electric and clean transportation fleet development",
      "Global trade facilitation for Muslim businesses",
      "Supply chain transparency and tracking technology",
      "Driver welfare and fair employment programs",
      "Regional transportation infrastructure development",
    ],
    approach: [
      "Full halal integrity throughout cold chains",
      "Fair wages and safe conditions for all drivers and workers",
      "Transition to electric and clean-fuel fleets",
      "Transparent tracking for all shipments",
      "Priority support for Muslim-owned businesses",
      "No participation in haram cargo or smuggling networks",
    ],
    whyItMatters: "Global supply chains are opaque, exploitative, and frequently linked to haram activities. Muslim businesses struggle to access logistics partners who respect halal requirements throughout the entire supply chain.",
    globalProblem: "Modern logistics is dominated by a handful of corporations with little regard for ethical sourcing, worker welfare, or environmental impact. Halal supply chain integrity is nearly impossible to guarantee in the current system.",
    goals: {
      short: ["Launch halal logistics service", "Establish supply chain ethics audit", "Begin clean vehicle fleet transition"],
      long: ["Build TMC Logistics — a globally trusted halal supply chain company", "Connect Muslim businesses worldwide through ethical logistics", "Achieve full supply chain transparency across all TMC sectors"],
    },
    related: ["E-commerce", "International Trade", "Manufacturing & Industry", "Environmental Protection"],
  },
  {
    label: "E-commerce",
    slug: "e-commerce",
    icon: "🛒",
    tagline: "Ethical Online Commerce Connecting Halal Producers With Global Consumers",
    overview: "E-commerce has revolutionized how the world buys and sells. The Muslim Company's E-commerce sector is building an ethical, halal-certified, and transparent online marketplace that connects Muslim producers, artisans, and businesses with consumers globally — while ensuring every transaction meets the highest standards of Islamic commercial ethics.",
    islamicContext: "The Prophet Muhammad ﷺ was himself a merchant, and Islamic commercial history is a tradition of ethical trade, honest dealing, and mutual benefit. 'The truthful, trustworthy merchant will be with the Prophets, the truthful, and the martyrs.' (Tirmidhi). TMC's e-commerce platform embodies this noble commercial tradition in the digital age.",
    activities: [
      "Global halal marketplace platform",
      "Muslim artisan and small business support",
      "Ethical product verification and certification",
      "Consumer protection and dispute resolution",
      "Logistics integration with halal supply chains",
      "Digital payment through Islamic FinTech",
      "Social commerce for community-based selling",
      "B2B trade platform for Muslim businesses globally",
    ],
    approach: [
      "Zero tolerance for haram products or deceptive listings",
      "Transparent pricing with no hidden fees",
      "Fair commission structures supporting small sellers",
      "Consumer data protected and never sold",
      "Dispute resolution guided by Islamic commercial law",
      "Priority promotion of ethical and sustainable products",
    ],
    whyItMatters: "Muslim consumers globally spend over $2 trillion annually, yet lack a trusted, fully halal-compliant marketplace. Existing platforms carry haram products, exploit seller data, and operate on interest-based payment systems.",
    globalProblem: "Amazon, Alibaba, and other e-commerce giants dominate Muslim consumer markets while violating halal standards, exploiting small sellers, and operating on riba-based financial systems.",
    goals: {
      short: ["Launch TMC Marketplace beta", "Onboard 1,000 halal-verified sellers", "Establish product certification system"],
      long: ["Build the world's largest halal e-commerce platform", "Connect Muslim businesses in 50+ countries", "Process $1 billion in ethical transactions annually"],
    },
    related: ["Retail Business", "Islamic Finance & FinTech", "Transportation & Logistics", "Manufacturing & Industry"],
  },
  {
    label: "Literature & Publishing",
    slug: "literature-publishing",
    icon: "📚",
    tagline: "Ethical Knowledge, Islamic Literature, and Civilization-Building Through Words",
    overview: "Words shape civilizations. The Muslim Company's Literature & Publishing sector is dedicated to producing, preserving, and distributing ethical literature — from Islamic scholarship to contemporary fiction, from children's books to academic research — that nurtures the mind, soul, and moral character of readers worldwide.",
    islamicContext: "The first divine command was 'Read.' Islam's civilization was built on books — the libraries of Baghdad, Cairo, and Cordoba contained millions of manuscripts when Europe was in its dark ages. TMC's publishing sector honors this tradition by making quality, ethical, and Islamic-values-aligned literature accessible to all of humanity.",
    activities: [
      "Islamic scholarly and academic publishing",
      "Children's Islamic literature and storytelling",
      "Translation of Islamic classics into world languages",
      "Contemporary Muslim fiction and creative writing",
      "Research journals on Islamic thought and civilization",
      "Digital libraries and open-access publishing",
      "Support programs for Muslim authors and writers",
      "Publication of Quran, Hadith, and Islamic educational materials",
    ],
    approach: [
      "All publications reviewed for Islamic compliance",
      "Affordable pricing to maximize accessibility",
      "Fair royalties and support for Muslim authors",
      "Multi-language publishing prioritizing Arabic and major global languages",
      "No publication of content that contradicts Islamic values",
      "Digital-first approach for global reach",
    ],
    whyItMatters: "The Muslim world publishes a fraction of global literature relative to its population. Quality Islamic literature for children, youth, and adults is scarce while morally corrosive content floods global markets.",
    globalProblem: "Publishing is dominated by Western conglomerates that rarely represent Muslim perspectives authentically, while Islamic literature in languages accessible to modern Muslim youth is critically underdeveloped.",
    goals: {
      short: ["Launch TMC Publishing imprint", "Publish first children's Islamic series", "Begin translation project for Islamic classics"],
      long: ["Build largest Islamic publishing house globally", "Publish 1,000 titles across 20 languages", "Establish TMC Literary Prize for Islamic literature"],
    },
    related: ["Education & Research", "Media & Journalism", "Philosophy & Civilization Studies", "Scientific Research"],
  },
  {
    label: "Philosophy & Civilization Studies",
    slug: "philosophy-civilization-studies",
    icon: "🏛️",
    tagline: "Reviving Islamic Thought, Ethics, and Civilizational Wisdom for the Modern Age",
    overview: "Every great civilization is built on a philosophical foundation. The Muslim Company's Philosophy & Civilization Studies sector is dedicated to reviving, developing, and applying Islamic thought — from Quranic epistemology to Islamic ethics, from political philosophy to civilizational theory — providing the intellectual backbone for TMC's entire civilization-building mission.",
    islamicContext: "Islamic civilization produced thinkers of unparalleled depth — Ibn Rushd, Al-Ghazali, Ibn Khaldun, Ibn Taymiyyah. Their thought shaped not only Islamic civilization but European philosophy, modern science, and global ethics. TMC's philosophy sector honors these giants while developing Islamic thought for 21st century challenges.",
    activities: [
      "Islamic philosophy research and publication",
      "Civilizational studies and historical research",
      "Islamic ethics applied to modern challenges (AI, bioethics, finance)",
      "Inter-civilizational dialogue and comparative studies",
      "Workshops and conferences on Islamic thought",
      "Translation and commentary on classical Islamic texts",
      "Policy research grounded in Islamic political thought",
      "Development of Islamic epistemology for modern sciences",
    ],
    approach: [
      "Rigorous academic methodology combined with Islamic epistemic principles",
      "Engagement with both Islamic tradition and contemporary thought",
      "Practical application of philosophy to real-world challenges",
      "Multi-disciplinary approach combining theology, science, and humanities",
      "Support for independent Muslim thinkers and scholars",
      "Accessible publications for general educated readers",
    ],
    whyItMatters: "The Muslim world faces profound intellectual challenges — from the rise of atheism among Muslim youth to the absence of Islamic frameworks for navigating technology, bioethics, and political crises. Strong Islamic philosophy is the antidote.",
    globalProblem: "Western secular philosophy dominates global intellectual discourse, leaving Muslim civilization without a strong contemporary philosophical voice. Islamic institutions are often focused on theology alone, neglecting broader civilizational thought.",
    goals: {
      short: ["Establish TMC Center for Islamic Thought", "Launch civilization studies journal", "Begin applied ethics research"],
      long: ["Develop a comprehensive Islamic philosophy for the 21st century", "Build the world's premier institution for Islamic civilizational studies", "Train a generation of Muslim philosopher-scholars"],
    },
    related: ["Education & Research", "Scientific Research", "Literature & Publishing", "Media & Journalism"],
  },
  {
    label: "Scientific Research",
    slug: "scientific-research",
    icon: "🔬",
    tagline: "Faith-Guided Scientific Inquiry for the Benefit of All Humanity",
    overview: "Science is among the highest callings in Islamic civilization. The Muslim Company's Scientific Research sector is dedicated to conducting rigorous, ethics-guided scientific research across disciplines — from medicine to materials science, from environmental science to artificial intelligence — producing knowledge that serves humanity and honors creation.",
    islamicContext: "The Quran contains hundreds of verses inviting humanity to observe, reflect, and understand the natural world. Muslim scientists of the Golden Age laid the foundations of modern science. Ibn al-Haytham invented the scientific method. Al-Biruni pioneered systematic empirical research. TMC's scientific research sector continues this sacred intellectual tradition.",
    activities: [
      "Medical and pharmaceutical research",
      "Environmental and climate science",
      "Materials science and engineering research",
      "Artificial intelligence and computational research",
      "Agricultural and food science innovation",
      "Renewable energy technology development",
      "Islamic epistemology of science",
      "Research grants for Muslim scientists globally",
    ],
    approach: [
      "All research must pass Shariah ethics review",
      "No research on prohibited areas (e.g., porcine products, genetic manipulation of humans)",
      "Open-access publication of research findings",
      "Collaboration with global scientific institutions",
      "Priority given to research addressing Muslim world needs",
      "Integration of ethical review throughout research process",
    ],
    whyItMatters: "The Muslim world produces less than 2% of global scientific research despite comprising 25% of the population. This scientific deficit has devastating consequences for Muslim development, health, and technological independence.",
    globalProblem: "Science divorced from ethics has produced weapons of mass destruction, ecological catastrophe, and tools of human exploitation. Ethical, faith-guided science offers a superior model for inquiry and discovery.",
    goals: {
      short: ["Establish TMC Research Institute", "Fund 100 Muslim scientists in Year 1", "Launch open-access science journal"],
      long: ["Build world-class Islamic research university", "Produce Muslim Nobel Prize winners", "Make the Muslim world a global leader in ethical scientific research"],
    },
    related: ["Technology & AI", "Healthcare & Medicine", "Education & Research", "Environmental Protection"],
  },
  {
    label: "Social Welfare & Humanitarian Work",
    slug: "social-welfare-humanitarian-work",
    icon: "🤲",
    tagline: "Serving the Vulnerable With Compassion, Justice, and Prophetic Ethics",
    overview: "Social welfare and humanitarian service are not optional add-ons for The Muslim Company — they are at the heart of our entire mission. Dedicated 10% of monthly net profits to humanitarian causes, TMC's Social Welfare sector operates programs that directly address poverty, inequality, disaster relief, and social exclusion globally.",
    islamicContext: "The Prophet Muhammad ﷺ said: 'The best of people are those most beneficial to people.' Islam makes social welfare an obligation — through zakat, sadaqah, waqf, and direct service. TMC embodies this prophetic command by institutionalizing generosity and ensuring that our commercial success directly translates to human benefit.",
    activities: [
      "Poverty alleviation and income support programs",
      "Orphan sponsorship and care programs",
      "Widow support and empowerment initiatives",
      "Emergency disaster relief operations",
      "Refugee support and resettlement assistance",
      "Community feeding programs",
      "Social rehabilitation for marginalized populations",
      "Advocacy for the rights of the vulnerable",
    ],
    approach: [
      "Dignity-centered service — no humiliation in receiving help",
      "Transparent accounting of all charitable expenditure",
      "Sustainable programs addressing root causes not just symptoms",
      "Local partner organizations for effective on-ground delivery",
      "Regular audit of impact and outcomes",
      "Community ownership of welfare programs",
    ],
    whyItMatters: "Over 700 million people live in extreme poverty. Natural disasters, conflicts, and systemic inequality continue to devastate vulnerable communities globally. Ethical, faith-driven humanitarian organizations are among the most effective responders.",
    globalProblem: "Humanitarian aid is often politicized, poorly coordinated, and fails to address structural causes of poverty. Many aid organizations lack transparency or fail to respect the dignity of those they serve.",
    goals: {
      short: ["Launch orphan sponsorship program", "Establish disaster relief fund", "Begin community feeding initiative"],
      long: ["Serve 10 million people annually through welfare programs", "Build global TMC Humanitarian Network", "Establish permanent waqf for sustained welfare operations"],
    },
    related: ["Healthcare & Medicine", "Education & Research", "Community Development", "Agriculture & Food"],
  },
  {
    label: "Environmental Protection",
    slug: "environmental-protection",
    icon: "🌿",
    tagline: "Fulfilling Our Sacred Trust as Stewards of Allah's Creation",
    overview: "The earth and everything on it is a trust from Allah — and The Muslim Company takes this trust with the utmost seriousness. Our Environmental Protection sector is dedicated to preserving, restoring, and protecting the natural world through research, advocacy, direct action, and the integration of environmental ethics into all TMC operations.",
    islamicContext: "The Prophet Muhammad ﷺ said: 'If the Hour is about to be established and one of you was holding a palm shoot, let him take advantage of even one second before the Hour is established to plant it.' This hadith encapsulates the Islamic duty of environmental stewardship — continuing to act for the earth's benefit even in the most difficult circumstances.",
    activities: [
      "Reforestation and ecological restoration programs",
      "Wildlife conservation and biodiversity protection",
      "Ocean and water body cleanup initiatives",
      "Climate change research and advocacy",
      "Environmental education and awareness campaigns",
      "Green certification for TMC operations",
      "Renewable energy advocacy and development",
      "Anti-pollution monitoring and reporting",
    ],
    approach: [
      "Zero intentional environmental destruction in any TMC operation",
      "Carbon footprint reduction across all sectors",
      "Partnership with indigenous communities in conservation",
      "Science-based environmental targets and monitoring",
      "Integration of environmental review in all business decisions",
      "Advocacy for strong environmental policy globally",
    ],
    whyItMatters: "Climate change, deforestation, species extinction, and pollution represent among the gravest crises facing humanity. Muslim-majority countries are disproportionately affected by climate disasters while contributing least to their causes.",
    globalProblem: "Corporate greed and political short-termism have accelerated environmental destruction to catastrophic levels. The absence of ethical, faith-based voices in environmental advocacy has weakened the moral case for urgent action.",
    goals: {
      short: ["Plant one million trees", "Launch environmental review for all TMC operations", "Begin ocean cleanup initiative"],
      long: ["Achieve carbon neutrality across all TMC operations", "Restore 1,000 square kilometers of degraded ecosystems", "Become a globally recognized leader in Islamic environmental stewardship"],
    },
    related: ["Renewable Energy", "Agriculture & Food", "Scientific Research", "Community Development"],
  },
  {
    label: "Robotics & Automation",
    slug: "robotics-automation",
    icon: "🤖",
    tagline: "Ethical Automation That Serves Humanity Without Replacing Human Dignity",
    overview: "Robotics and automation are transforming every industry. The Muslim Company's Robotics & Automation sector is committed to developing and deploying ethical automation — harnessing technology to reduce human suffering, improve quality of life, and handle dangerous or tedious tasks, while ensuring that automation never becomes a tool of unemployment exploitation or dehumanization.",
    islamicContext: "Islam honors human dignity and the value of meaningful work. Any technology — including robotics — must be evaluated by its impact on human welfare. TMC's approach to automation is guided by the principle that technology must serve people, not enslave them. Automation should free humans for higher-value, more dignified, and more fulfilling work.",
    activities: [
      "Humanitarian robotics for disaster response",
      "Medical robotics for enhanced healthcare delivery",
      "Agricultural automation for food security",
      "Educational robotics and STEM programs",
      "Industrial automation with worker transition programs",
      "Research in ethical AI and robotics",
      "Accessibility technology for disabled communities",
      "Environmental monitoring through robotic systems",
    ],
    approach: [
      "Automation always assessed for impact on employment",
      "Worker retraining programs mandatory alongside automation deployment",
      "Priority use in dangerous, degrading, or inaccessible environments",
      "Human oversight maintained over all robotic systems",
      "No development of autonomous weapons under any circumstances",
      "Disability-inclusive design in all robotic products",
    ],
    whyItMatters: "Automation is coming regardless of ethical considerations — the question is whether it will serve humanity or exploit it. Islamic ethics demand that we shape technology's impact on work and human dignity before it is shaped for us.",
    globalProblem: "Unguided automation threatens mass unemployment, deepening inequality, and the degradation of human purpose. Without ethical frameworks, robotics will disproportionately harm unskilled workers in developing nations.",
    goals: {
      short: ["Establish robotics ethics framework", "Launch humanitarian robotics pilot", "Begin educational robotics program"],
      long: ["Build TMC Robotics — a globally recognized ethical automation company", "Deploy humanitarian robotics in 20 countries", "Develop Islamic ethics of human-robot interaction"],
    },
    related: ["Technology & AI", "Manufacturing & Industry", "Scientific Research", "Healthcare & Medicine"],
  },
  {
    label: "International Trade",
    slug: "international-trade",
    icon: "🚢",
    tagline: "Reviving the Ethical Islamic Trading Tradition at Global Scale",
    overview: "International trade built the Islamic world's greatest civilizations. The Muslim Company's International Trade sector is dedicated to facilitating ethical, halal-compliant, and mutually beneficial trade between Muslim-majority countries and the global market — reducing economic dependency and building genuine Muslim economic sovereignty.",
    islamicContext: "From the Silk Road to the Indian Ocean trade routes, Muslim merchants were the connective tissue of the medieval global economy. They carried goods, knowledge, and Islamic values across continents. The Prophet Muhammad ﷺ himself was a merchant of the highest integrity. TMC's trade sector revives this noble tradition in the modern global economy.",
    activities: [
      "Halal trade facilitation and certification",
      "Muslim business networking and matchmaking",
      "Import-export consulting for Islamic businesses",
      "Trade finance through Islamic instruments",
      "Market entry support for Muslim-majority countries",
      "International trade advocacy and policy engagement",
      "Ethical commodity trading",
      "South-South Muslim trade corridor development",
    ],
    approach: [
      "All trade activities Shariah-compliant and ethically reviewed",
      "Fair terms prioritized over extractive trade relationships",
      "Support for small Muslim businesses entering global markets",
      "No trade in haram commodities under any circumstances",
      "Transparency in all trade documentation and contracts",
      "Priority given to intra-Muslim world trade development",
    ],
    whyItMatters: "Muslim-majority countries represent enormous economic potential yet remain economically dependent on non-Muslim nations. Developing genuine intra-Muslim trade networks could transform the economic landscape of the Islamic world.",
    globalProblem: "Current global trade systems were designed by and for Western economic powers. Muslim-majority countries often receive unfair terms, and trade is frequently used as a tool of political pressure against Islamic nations.",
    goals: {
      short: ["Launch Muslim business trade directory", "Begin halal trade certification service", "Establish first trade corridor"],
      long: ["Facilitate $10 billion in annual halal trade", "Create unified Muslim world trade network", "Build TMC Trade — globally recognized ethical trade company"],
    },
    related: ["E-commerce", "Transportation & Logistics", "Islamic Finance & FinTech", "Manufacturing & Industry"],
  },
  {
    label: "Community Development",
    slug: "community-development",
    icon: "🏘️",
    tagline: "Building Thriving, Ethical, and Faith-Centered Communities Worldwide",
    overview: "Strong communities are the foundation of strong civilizations. The Muslim Company's Community Development sector is dedicated to building, strengthening, and revitalizing communities — from urban neighborhoods to rural villages — through comprehensive programs that address economic empowerment, social cohesion, physical infrastructure, and spiritual wellbeing.",
    islamicContext: "Islam is inherently a communal religion. The concept of the ummah — the global Muslim community — is not merely spiritual but practical. Masjids were historically the centers of community life, education, social welfare, and economic activity. TMC's community development sector seeks to restore the masjid and the Islamic community center to their rightful place as the foundation of civilizational development.",
    activities: [
      "Community center and masjid development programs",
      "Youth leadership and empowerment initiatives",
      "Community economic development and entrepreneurship support",
      "Social cohesion and conflict resolution programs",
      "Community health and wellness initiatives",
      "Elderly care and support programs",
      "Islamic family counseling and support services",
      "Community clean-up and beautification projects",
    ],
    approach: [
      "Community-led development with full local ownership",
      "Masjid-centered model for community services",
      "Inclusion of all community members regardless of background",
      "Sustainable funding through waqf and community investment",
      "Holistic approach addressing spiritual, social, and economic needs",
      "Long-term commitment rather than short-term project mentality",
    ],
    whyItMatters: "Modern forces of individualism, urbanization, and digital distraction have fragmented communities globally. The Muslim world faces particular challenges as traditional community structures are eroded by modernization and economic pressure.",
    globalProblem: "Isolation, social fragmentation, and the breakdown of family and community structures are driving mental health crises, crime, and moral deterioration globally. Strong communities are the most effective prevention.",
    goals: {
      short: ["Launch community development pilot in Dhaka", "Establish community center model", "Begin youth leadership program"],
      long: ["Develop 100 thriving TMC communities globally", "Build comprehensive Islamic community center network", "Create replicable model for Islamic civilizational community development"],
    },
    related: ["Social Welfare & Humanitarian Work", "Construction & Housing", "Education & Research", "Healthcare & Medicine"],
  },
  {
    label: "Retail Business",
    slug: "retail-business",
    icon: "🏪",
    tagline: "Ethical, Halal-Certified Retail Bringing Quality to Every Muslim Household",
    overview: "Retail is the most direct point of contact between a company and the people it serves. The Muslim Company's Retail Business sector is dedicated to building ethical, halal-certified retail networks that bring quality products to Muslim consumers — from grocery to electronics, from clothing to household goods — with complete transparency, fair pricing, and Islamic commercial ethics.",
    islamicContext: "The Prophet Muhammad ﷺ warned against deceptive selling practices and praised the honest merchant. 'The merchant who is honest and trustworthy will be with the Prophets, the truthful, and the martyrs.' Every retail transaction is an opportunity to practice Islamic ethics in daily commercial life — and TMC's retail sector makes this possible at scale.",
    activities: [
      "Halal-certified retail stores in Muslim communities",
      "Online halal retail marketplace",
      "Ethical sourcing and product verification",
      "Consumer education on halal standards",
      "Fair pricing and anti-price-gouging policies",
      "Community retail cooperatives",
      "Retail training programs with Islamic commercial ethics",
      "Product return and consumer protection policies",
    ],
    approach: [
      "Complete halal certification for all food and personal care products",
      "Transparent pricing with published maximum retail prices",
      "No deceptive advertising or misleading product claims",
      "Fair treatment of all customers regardless of social status",
      "Support for local and Muslim-owned supplier products",
      "Consumer complaint resolution within Islamic commercial law",
    ],
    whyItMatters: "Muslim consumers globally spend trillions annually in retail — but most retail chains make no accommodation for halal requirements, Islamic values, or fair dealing. Muslim communities deserve retail options that respect their faith and values.",
    globalProblem: "Mainstream retail is plagued by deceptive marketing, exploitative pricing, and products that violate halal standards. Muslim consumers are forced to compromise their values or forgo essential goods.",
    goals: {
      short: ["Launch first TMC retail concept store", "Establish halal verification system", "Begin ethical supplier partnership program"],
      long: ["Build globally recognized TMC Retail brand", "Operate in 50+ countries", "Become the most trusted halal retail brand for Muslim consumers worldwide"],
    },
    related: ["E-commerce", "Manufacturing & Industry", "Fashion & Apparel", "Lifestyle & Personal Care"],
  },
  {
    label: "Fashion & Apparel",
    slug: "fashion-apparel",
    icon: "👔",
    tagline: "Modest, Ethical, and Beautiful Clothing for a Faith-Conscious World",
    overview: "Clothing is an expression of identity, values, and dignity. The Muslim Company's Fashion & Apparel sector is dedicated to producing modest, high-quality, and ethically manufactured clothing that allows Muslims to dress beautifully while honoring their faith — without compromising on style, quality, or Islamic values.",
    islamicContext: "Islam commands modesty in dress as a form of dignity, self-respect, and worship. The Prophet Muhammad ﷺ described modesty as a branch of faith. Yet modest fashion need not be dull, uncomfortable, or culturally stagnant. TMC's fashion sector celebrates the rich diversity of Islamic aesthetic traditions while meeting the modern Muslim's desire for beautiful, practical, and affordable modest clothing.",
    activities: [
      "Modest fashion design and production for men and women",
      "Ethical and sustainable fabric sourcing",
      "Modest sportswear and activewear",
      "Traditional Islamic clothing from diverse cultures",
      "Children's modest clothing lines",
      "Professional Islamic workwear",
      "Islamic fashion education and design programs",
      "Modest fashion e-commerce platform",
    ],
    approach: [
      "All clothing meets Islamic modesty standards",
      "Ethical manufacturing with full worker welfare standards",
      "Sustainable and eco-friendly materials prioritized",
      "Affordable pricing accessible to all income levels",
      "Diverse representation of Muslim cultural aesthetics",
      "No exploitation of workers or use of child labor",
    ],
    whyItMatters: "The global modest fashion market is estimated at $300 billion annually yet is poorly served by mainstream fashion brands that treat modesty as an afterthought. Muslim consumers deserve fashion that is designed with their values at the center.",
    globalProblem: "Fast fashion exploits workers, destroys the environment, and produces immodest clothing that conflicts with Islamic values. Muslim consumers face an impossible choice between affordable accessible fashion and their religious convictions.",
    goals: {
      short: ["Launch TMC modest fashion line", "Establish ethical manufacturing partnership", "Begin modest fashion e-commerce"],
      long: ["Build TMC Fashion — globally recognized modest fashion brand", "Serve 50 million Muslim consumers annually", "Become the global standard for ethical modest fashion"],
    },
    related: ["Retail Business", "Lifestyle & Personal Care", "E-commerce", "Manufacturing & Industry"],
  },
  {
    label: "Lifestyle & Personal Care",
    slug: "lifestyle-personal-care",
    icon: "✨",
    tagline: "Halal, Pure, and Ethical Personal Care for the Faith-Conscious Individual",
    overview: "Personal care and lifestyle products are intimate — they touch our bodies, our homes, and our daily rituals. The Muslim Company's Lifestyle & Personal Care sector is dedicated to producing halal-certified, ethically sourced, and genuinely pure personal care products that meet the highest Islamic standards of purity while delivering real quality and effectiveness.",
    islamicContext: "Tahara — purity — is foundational to Islamic practice. The Prophet Muhammad ﷺ emphasized cleanliness as half of faith. Yet the personal care industry is filled with haram ingredients — alcohol, porcine derivatives, and carcinogenic chemicals. Muslims deserve personal care products that are genuinely pure, not just labeled halal. TMC's lifestyle sector delivers authentic purity.",
    activities: [
      "Halal-certified skincare and beauty products",
      "Natural and organic personal care formulations",
      "Halal hair care products",
      "Islamic lifestyle products and home goods",
      "Prayer and spiritual practice accessories",
      "Wudu-friendly cosmetics and nail products",
      "Halal fragrance and attar production",
      "Personal care education on halal standards",
    ],
    approach: [
      "Every ingredient verified halal and tayyib (pure)",
      "No alcohol, porcine derivatives, or harmful chemicals",
      "Cruelty-free and no animal testing",
      "Eco-friendly packaging and sustainable production",
      "Transparent ingredient labeling",
      "Affordable pricing without compromising on purity",
    ],
    whyItMatters: "Most personal care products contain ingredients that are haram or questionable for Muslims. Halal cosmetics and personal care is one of the fastest-growing segments of the Islamic economy, yet is dominated by brands with superficial halal claims.",
    globalProblem: "The personal care industry uses deceptive labeling, harmful ingredients, and exploitative manufacturing. Muslim consumers cannot easily identify genuinely halal products amid a sea of misleading certifications.",
    goals: {
      short: ["Launch halal skincare line", "Establish ingredient verification system", "Begin wudu-friendly cosmetics range"],
      long: ["Build TMC Personal Care — globally trusted halal beauty brand", "Certify 500+ halal products", "Become the most trusted halal personal care brand worldwide"],
    },
    related: ["Retail Business", "Fashion & Apparel", "Healthcare & Medicine", "E-commerce"],
  },
];

export function getSectorBySlug(slug: string): SectorData | undefined {
  return SECTORS_DATA.find(s => s.slug === slug);
}

export function getAllSectors(): SectorData[] {
  return SECTORS_DATA;
}

export default function SectorDetail() {
  const [, params] = useRoute("/sectors/:slug");
  const slug = params?.slug ?? "";
  const sector = getSectorBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!sector) return;

    // Inject dynamic schema for this sector page
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "Sectors", "item": "https://www.themuslim.company/sectors" },
          { "@type": "ListItem", "position": 3, "name": sector.label, "item": `https://www.themuslim.company/sectors/${sector.slug}` }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${sector.label} — The Muslim Company`,
        "description": sector.tagline,
        "url": `https://www.themuslim.company/sectors/${sector.slug}`,
        "breadcrumb": {
          "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
            { "@type": "ListItem", "position": 2, "name": "Sectors", "item": "https://www.themuslim.company/sectors" },
            { "@type": "ListItem", "position": 3, "name": sector.label, "item": `https://www.themuslim.company/sectors/${sector.slug}` }
          ]
        },
        "publisher": {
          "@type": "Organization",
          "name": "The Muslim Company",
          "url": "https://www.themuslim.company",
          "logo": "https://www.themuslim.company/favicon.png"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": sector.label,
        "description": sector.overview,
        "provider": {
          "@type": "Organization",
          "name": "The Muslim Company",
          "url": "https://www.themuslim.company"
        },
        "serviceType": sector.label,
        "url": `https://www.themuslim.company/sectors/${sector.slug}`
      }
    ];

    // Remove old injected schemas
    document.querySelectorAll('script[data-sector-schema]').forEach(el => el.remove());

    // Inject new schemas
    // FAQ schema for sector
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does The Muslim Company do in " + sector.label + "?",
          "acceptedAnswer": { "@type": "Answer", "text": sector.overview }
        },
        {
          "@type": "Question",
          "name": "Why is " + sector.label + " important from an Islamic perspective?",
          "acceptedAnswer": { "@type": "Answer", "text": sector.islamicContext }
        },
        {
          "@type": "Question",
          "name": "What are the goals of The Muslim Company in " + sector.label + "?",
          "acceptedAnswer": { "@type": "Answer", "text": sector.goals.short.join(". ") }
        }
      ]
    };

    [...schemas, faqSchema].forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-sector-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Dynamic SEO
    const pageUrl = `https://www.themuslim.company/sectors/${sector.slug}`;
    const ogImage = "https://www.themuslim.company/og-image.png";

    document.title = `${sector.label} — The Muslim Company`;

    // Dynamic meta description from sector data
    const _md = document.querySelector('meta[name="description"]');
    const _sectorDesc = `${sector.tagline} — Explore The Muslim Company's ${sector.label} sector: vision, activities, and long-term goals rooted in Islamic ethics and ethical innovation.`;
    if (_md) _md.setAttribute('content', _sectorDesc);
    else { const _ml = document.createElement('meta'); _ml.name = 'description'; _ml.content = _sectorDesc; document.head.appendChild(_ml); }
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', _sectorDesc);

    // Canonical URL
    const _can = document.querySelector('link[rel="canonical"]');
    const _canonicalUrl = `https://www.themuslim.company/sectors/${sector.slug}`;
    if (_can) { _can.setAttribute('href', _canonicalUrl); }
    else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = _canonicalUrl; document.head.appendChild(_cl); }

    // OG URL
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', _canonicalUrl);
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) _rob.setAttribute('content', 'index, follow');
    else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }

    // OG tags
    const ogTags: Record<string, string> = {
      'og:title': `${sector.label} — The Muslim Company`,
      'og:description': sector.tagline,
      'og:url': pageUrl,
      'og:image': ogImage,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:type': 'website',
    };
    Object.entries(ogTags).forEach(([prop, val]) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.setAttribute('content', val);
    });

    // Twitter
    const twTags: Record<string, string> = {
      'twitter:title': `${sector.label} — The Muslim Company`,
      'twitter:description': sector.tagline,
      'twitter:image': ogImage,
      'twitter:card': 'summary_large_image',
    };
    Object.entries(twTags).forEach(([name, val]) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', val);
    });

    return () => {
      document.querySelectorAll('script[data-sector-schema]').forEach(el => el.remove());
    };
  }, [slug, sector]);

  if (!sector) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center px-6">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-secondary mb-4">404</p>
            <h1 className="font-serif text-4xl text-primary mb-4">Sector Not Found</h1>
            <p className="font-sans text-sm text-primary/60 mb-8">This sector does not exist or has not been added yet.</p>
            <Link href="/sectors">
              <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Sectors
              </Button>
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const relatedSectors = getAllSectors().filter(s => sector.related.includes(s.label));

  return (
    <SiteLayout>
      <div className="w-full bg-background text-foreground">

        {/* ── HERO ── */}
        <section className="bg-primary pt-32 pb-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Link href="/sectors" className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-primary-foreground/40 hover:text-secondary transition-colors mb-8">
                <ArrowLeft className="w-3 h-3" /> All Sectors
              </Link>
              <div className="text-5xl mb-6">{sector.icon}</div>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Area of Work</p>
              <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-6 leading-tight">{sector.label}</h1>
              <p className="font-sans text-lg text-primary-foreground/60 max-w-2xl leading-relaxed">{sector.tagline}</p>
            </motion.div>
          </div>
        </section>

        {/* ── OVERVIEW ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-4">Overview</p>
              <p className="font-serif text-2xl md:text-3xl text-primary leading-relaxed mb-8 max-w-3xl">{sector.overview}</p>
            </motion.div>
          </div>
        </section>

        {/* ── ISLAMIC CONTEXT ── */}
        <section className="py-20 px-6 lg:px-12 bg-primary border-b border-primary-foreground/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-4">Islamic Foundation</p>
              <div className="border-l-4 border-secondary pl-6 py-2">
                <p className="font-serif text-lg text-primary-foreground/85 leading-relaxed italic">{sector.islamicContext}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── ACTIVITIES + APPROACH ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-6">What We Do</p>
                <div className="space-y-3">
                  {sector.activities.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <p className="font-sans text-sm text-primary/70">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-6">Our Approach</p>
                <div className="space-y-3">
                  {sector.approach.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                      <p className="font-sans text-sm text-primary/70">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── WHY IT MATTERS ── */}
        <section className="py-20 px-6 lg:px-12 bg-card border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-4">Why It Matters</p>
              <p className="font-serif text-2xl text-primary leading-relaxed mb-6 max-w-3xl">{sector.whyItMatters}</p>
              <div className="p-6 border border-primary/10 bg-background">
                <p className="font-sans text-xs tracking-widest uppercase text-primary/40 mb-2">The Global Challenge</p>
                <p className="font-sans text-sm text-primary/65 leading-relaxed">{sector.globalProblem}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── GOALS ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-8">Goals & Vision</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <p className="font-serif text-lg text-primary mb-4">Near-Term Goals</p>
                  <div className="space-y-3">
                    {sector.goals.short.map((g, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="font-sans text-[10px] text-secondary/50 w-5 flex-shrink-0 mt-1">{String(i+1).padStart(2,"0")}</span>
                        <p className="font-sans text-sm text-primary/70">{g}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-serif text-lg text-primary mb-4">Long-Term Vision</p>
                  <div className="space-y-3">
                    {sector.goals.long.map((g, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="font-sans text-[10px] text-secondary/50 w-5 flex-shrink-0 mt-1">{String(i+1).padStart(2,"0")}</span>
                        <p className="font-sans text-sm text-primary/70">{g}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FEATURED INITIATIVE ── */}
        {sector.slug === "islamic-finance-fintech" && (
          <section className="py-20 px-6 lg:px-12 border-b border-primary/10">
            <div className="container mx-auto max-w-5xl">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-6">Featured Initiative</p>
                <Link href="/BaytAlMalBank" className="block p-8 lg:p-10 bg-card border border-primary/10 hover:border-secondary/40 transition-colors group">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <p className="font-sans text-[10px] tracking-widest uppercase text-secondary/70 mb-2">In Development — Launching 2031</p>
                      <h3 className="font-serif text-2xl md:text-3xl text-primary mb-3 group-hover:text-secondary transition-colors">
                        The Bayt Al-Mal Bank
                      </h3>
                      <p className="font-sans text-sm text-primary/60 leading-relaxed max-w-xl">
                        The flagship realization of this sector's vision — an international, Shariah-compliant bank built on the Prophetic model of wealth stewardship, serving individuals and institutions worldwide, online and offline.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-secondary">
                        Learn More <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* ── RELATED SECTORS ── */}
        <section className="py-20 px-6 lg:px-12 border-b border-primary/10 bg-card">
          <div className="container mx-auto max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-6">Related Sectors</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-primary/10">
                {relatedSectors.map((s, i) => (
                  <Link key={i} href={`/sectors/${s.slug}`}>
                    <div className="py-4 px-5 border-b border-primary/10 flex justify-between items-center group hover:bg-background transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{s.icon}</span>
                        <span className="font-serif text-base text-primary group-hover:text-secondary transition-colors">{s.label}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-primary/20 group-hover:text-secondary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-6 lg:px-12 bg-primary">
          <div className="container mx-auto max-w-3xl text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary mb-4">Get Involved</p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-4">Join This Mission</h2>
              <p className="font-sans text-sm text-primary-foreground/60 mb-8 max-w-xl mx-auto">
                Whether you are an investor, researcher, professional, or partner — if you share our vision for ethical civilization-scale development in this sector, we want to hear from you.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <a href="mailto:ceo@themuslim.company?subject=Partnership Inquiry — {sector.label}">
                  <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold">
                    Partner With Us <MoveRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <Link href="/sectors">
                  <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs">
                    All Sectors
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}
