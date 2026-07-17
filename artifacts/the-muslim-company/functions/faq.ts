function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "")
}

export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "Answers to common questions about The Muslim Company — our business, sectors, Shariah governance, careers, and humanitarian Foundation work."

    const FAQS: { title: string; items: { q: string; a: string }[] }[] = [
      {
        title: "About The Muslim Company",
        items: [
          { q: "What is The Muslim Company?", a: "The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by Shariful Islam. It operates across 23 sectors, with core sectors including Retail, Fashion & Apparel, E-commerce, Lifestyle & Personal Care, and Electronics, alongside Manufacturing, Education, Media, Healthcare, Renewable Energy, Technology & AI, and Humanitarian Development — under a fully Shariah-compliant, halal, and riba-free framework." },
          { q: "Who founded The Muslim Company, and who leads it today?", a: "The Muslim Company was founded by Shariful Islam, who has served as its Founder, Chairman, Managing Director, and CEO since 2025." },
          { q: "Is Shariful Islam of The Muslim Company the same person as the Bangladeshi cricketer Shariful Islam?", a: "No. Shariful Islam, Founder & CEO of The Muslim Company, is a Bangladeshi electrical engineer and entrepreneur born in Jamalpur, Bangladesh, and is not related to or the same person as the Bangladeshi cricketer of the same name." },
          { q: "Where is The Muslim Company headquartered?", a: "The Muslim Company is headquartered in Niketon Bazaar, Dhaka-1212, Bangladesh." },
          { q: "What does 'Amanah, Ilm, Rahmah' mean?", a: "These are the company's three guiding principles: Amanah (Trust & Integrity), Ilm (Knowledge & Excellence), and Rahmah (Mercy & Service) — drawn from Islamic teaching and applied to every business decision." },
        ],
      },
      {
        title: "Business & Sectors",
        items: [
          { q: "What sectors does The Muslim Company operate in?", a: "The company works across 23 beneficial and halal sectors. Our core sectors are Retail, Fashion & Apparel, E-commerce, Lifestyle & Personal Care, and Electronics, and we are also active in Manufacturing, Education, Media, Healthcare, Renewable Energy, Technology & AI, Islamic Finance & FinTech, and Humanitarian & Social Welfare." },
          { q: "What is The Bayt Al-Mal Bank?", a: "The Bayt Al-Mal Bank is The Muslim Company's Islamic banking arm, offering interest-free (riba-free), Shariah-compliant banking, savings, and financing products, alongside its fintech app DinarX and the Dirham Payment Gateway." },
          { q: "Is The Muslim Company publicly traded?", a: 'No. The Muslim Company is privately held. Business inquiries and partnership requests can be directed to our <a href="https://www.themuslim.company/contact">Contact page</a>.' },
          { q: "Where can I see the company's financial transparency reports?", a: 'Annual and periodic Transparency Reports covering finances, zakat distribution, and governance are published on our <a href="https://www.themuslim.company/transparency">Transparency page</a>.' },
        ],
      },
      {
        title: "Governance & Shariah Compliance",
        items: [
          { q: "Is The Muslim Company Shariah-compliant?", a: "Yes. Every entity under the group is overseen by a Supreme Shariah Board and reviewed against the Maqasid al-Shariah (the higher objectives of Islamic law). Operations are completely free from riba (interest), bribery, and exploitation." },
          { q: "Is the Supreme Shariah Board independent?", a: "Yes. The Supreme Shariah Board operates independently of business and commercial leadership, giving final approval on products and services purely on Shariah grounds, free from operational or profit-driven influence." },
          { q: "How are new products and services approved?", a: "New products, services, and technologies follow a three-stage pipeline: Research & Development builds and documents the initiative, the Council of Ethical Scholars, Scientists & Experts independently analyzes its scientific validity and safety, and the Supreme Shariah Board gives final approval against Quran, Sunnah, and Maqasid al-Shariah." },
          { q: "Where can I read the company's governance structure?", a: 'Full details are published on our <a href="https://www.themuslim.company/governance">Governance</a> and <a href="https://www.themuslim.company/constitution">Constitution</a> pages, along with our Transparency Reports.' },
          { q: "When will Bayt Al-Mal Bank officially launch?", a: 'The Bayt Al-Mal Bank is targeting an official launch in 2031, pending regulatory licensing and approval. Updates on progress will be shared through our <a href="https://www.themuslim.company/newsroom">Newsroom</a> and <a href="https://www.themuslim.company/transparency">Transparency Reports</a>.' },
          { q: "Is The Muslim Company a legally registered company?", a: "Yes, The Muslim Company is registered in Bangladesh as The Muslim Company LTD." },
          { q: "How can I report an ethical concern or complaint?", a: "A confidential internal division monitors compliance, investigates ethical concerns, and maintains whistleblower protection, reporting directly to the founder and insulated from commercial pressure. Concerns can be raised via help@themuslim.company." },
        ],
      },
      {
        title: "Careers",
        items: [
          { q: "How do I apply for a job at The Muslim Company?", a: 'Open roles are listed on our <a href="https://www.themuslim.company/careers">Careers page</a>. You can also reach the recruitment team directly at careers@themuslim.company.' },
          { q: "Does The Muslim Company hire internationally?", a: 'The Muslim Company operates and hires across multiple countries as the business grows. Check the <a href="https://www.themuslim.company/careers">Careers page</a> for current openings and their locations.' },
          { q: "How do I check my job application status?", a: 'You can track your application anytime on our <a href="https://www.themuslim.company/recruitment-status">Application Status page</a> using the reference number provided when you applied.' },
          { q: "What employee benefits does The Muslim Company offer?", a: "Employees receive fair wages, dignified workplaces with separate facilities for women, extended maternity leave (1–1.5 years), long-term pension qualification, and family welfare programs." },
        ],
      },
      {
        title: "Foundation & Humanitarian Work",
        items: [
          { q: "What is The Muslim Company Foundation?", a: "The Muslim Company Foundation is the company's dedicated humanitarian and environmental arm, funded by zakat, sadaqah, and 10% of monthly net profit — directed toward relief, education, healthcare, orphan care, and environmental work." },
          { q: "Which countries has the Foundation helped?", a: "The Foundation has provided humanitarian relief and community support to people in Bangladesh, Pakistan, Nigeria, Ghana, Gambia, and other African nations, with support from individual donors across multiple countries." },
          { q: "Does The Muslim Company give back to the community?", a: "Yes. The company commits 10% of monthly net profit to Fi Sabilillah — for Allah's path — in addition to fully distributing annual zakat, supporting mosques, madrasas, education scholarships, healthcare, and orphan care." },
          { q: "Does the Foundation support animal welfare and environmental causes?", a: "Yes. Alongside humanitarian relief for people, the Foundation protects, feeds, and rescues animals, birds, and wildlife, and works on reforestation, tree planting, and ecological restoration — caring for all of Allah's creation." },
          { q: "How is zakat calculated and distributed?", a: 'Zakat is calculated annually on all eligible company assets and fully distributed by a qualified Shariah scholar, with distribution details published in our <a href="https://www.themuslim.company/transparency">Transparency Reports</a>.' },
          { q: "How can I donate or get involved?", a: 'Visit our <a href="https://www.themuslim.company/get-involved">Get Involved</a> or <a href="https://www.themuslim.company/foundation">Foundation</a> pages, or email help@themuslim.company. Formal individual-donor channels are being finalized.' },
        ],
      },
      {
        title: "Contact & Media",
        items: [
          { q: "How do I contact The Muslim Company?", a: 'You can reach us at help@themuslim.company, or visit our <a href="https://www.themuslim.company/contact">Contact page</a> for department-specific contacts and our Dhaka office address.' },
          { q: "Is there a separate contact for press and media inquiries?", a: 'Yes. Journalists and media professionals can reach us at media@themuslim.company, or visit our <a href="https://www.themuslim.company/newsroom">Newsroom</a> for press releases and company updates.' },
        ],
      },
    ]

    const allFaqs = FAQS.flatMap(g => g.items)
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allFaqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": stripHtml(f.a) } })),
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://www.themuslim.company/faq" },
      ],
    }

    const groupsHtml = FAQS.map(g => `
      <section>
        <h2>${g.title}</h2>
        ${g.items.map(f => `<h3>${f.q}</h3><p>${f.a}</p>`).join('\n')}
      </section>`).join('\n')

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Frequently Asked Questions — The Muslim Company</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Frequently Asked Questions — The Muslim Company" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:url" content="https://www.themuslim.company/faq" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Frequently Asked Questions — The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <link rel="canonical" href="https://www.themuslim.company/faq" />
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <h1>Frequently Asked Questions</h1>
  <p>${desc}</p>
  ${groupsHtml}
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
