export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "Frequently asked questions about The Muslim Company — our business, sectors, Shariah governance, careers, and humanitarian Foundation work."

    const FAQS: { title: string; items: { q: string; a: string }[] }[] = [
      {
        title: "About The Muslim Company",
        items: [
          { q: "What is The Muslim Company?", a: "The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by Shariful Islam. It operates across 20+ sectors — including Technology, AI, Manufacturing, Renewable Energy, Healthcare, Education, Media, and Humanitarian Development — under a fully Shariah-compliant, halal, and riba-free framework." },
          { q: "Who founded The Muslim Company, and who leads it today?", a: "The Muslim Company was founded by Shariful Islam, who serves as its Founder, Chairman, Managing Director, and CEO." },
          { q: "Is Shariful Islam of The Muslim Company the same person as the Bangladeshi cricketer Shariful Islam?", a: "No. Shariful Islam, Founder & CEO of The Muslim Company, is a Bangladeshi electrical engineer and entrepreneur born in Jamalpur, Bangladesh, and is not related to or the same person as the Bangladeshi cricketer of the same name." },
          { q: "Where is The Muslim Company headquartered?", a: "The Muslim Company is headquartered in Niketon Bazaar, Dhaka-1212, Bangladesh." },
          { q: "What does 'Amanah, Ilm, Rahmah' mean?", a: "These are the company's three guiding principles: Amanah (Trust & Integrity), Ilm (Knowledge & Excellence), and Rahmah (Mercy & Service) — drawn from Islamic teaching and applied to every business decision." },
        ],
      },
      {
        title: "Business & Sectors",
        items: [
          { q: "What sectors does The Muslim Company operate in?", a: "The company works across 20+ beneficial and halal sectors, including Technology & AI, Healthcare, Renewable Energy, Manufacturing, Education, Islamic Finance & FinTech, Media, and Humanitarian & Social Welfare." },
          { q: "What is The Bayt Al-Mal Bank?", a: "The Bayt Al-Mal Bank is The Muslim Company's Islamic banking arm, offering interest-free (riba-free), Shariah-compliant banking, savings, and financing products, alongside its fintech app DinarX and the Dirham Payment Gateway." },
          { q: "Is The Muslim Company publicly traded?", a: "No. The Muslim Company is privately held. Business inquiries and partnership requests can be directed to our Contact page." },
        ],
      },
      {
        title: "Governance & Shariah Compliance",
        items: [
          { q: "Is The Muslim Company Shariah-compliant?", a: "Yes. Every entity under the group is overseen by a Supreme Shariah Board and reviewed against the Maqasid al-Shariah (the higher objectives of Islamic law). Operations are completely free from riba (interest), bribery, and exploitation." },
          { q: "How are new products and services approved?", a: "New products, services, and technologies follow a three-stage pipeline: Research & Development builds and documents the initiative, the Council of Ethical Scholars, Scientists & Experts independently analyzes its scientific validity and safety, and the Supreme Shariah Board gives final approval against Quran, Sunnah, and Maqasid al-Shariah." },
          { q: "Where can I read the company's governance structure?", a: "Full details are published on our Governance and Constitution pages, along with our Transparency Reports." },
        ],
      },
      {
        title: "Careers",
        items: [
          { q: "How do I apply for a job at The Muslim Company?", a: "Open roles are listed on our Careers page. You can also reach the recruitment team directly at careers@themuslim.company." },
          { q: "Does The Muslim Company hire internationally?", a: "The Muslim Company operates and hires across multiple countries as the business grows. Check the Careers page for current openings and their locations." },
        ],
      },
      {
        title: "Foundation & Humanitarian Work",
        items: [
          { q: "What is The Muslim Company Foundation?", a: "The Muslim Company Foundation is the company's dedicated humanitarian and environmental arm, funded by zakat, sadaqah, and 10% of monthly net profit — directed toward relief, education, healthcare, orphan care, and environmental work." },
          { q: "Which countries has the Foundation helped?", a: "The Foundation has provided humanitarian relief and community support to people in Bangladesh, Pakistan, Nigeria, Ghana, Gambia, and other African nations, with support from individual donors across multiple countries." },
          { q: "Does The Muslim Company give back to the community?", a: "Yes. The company commits 10% of monthly net profit to Fi Sabilillah — for Allah's path — in addition to fully distributing annual zakat, supporting mosques, madrasas, education scholarships, healthcare, and orphan care." },
          { q: "How can I donate or get involved?", a: "Visit our Get Involved or Foundation pages, or email help@themuslim.company. Formal individual-donor channels are being finalized." },
        ],
      },
    ]

    const allFaqs = FAQS.flatMap(g => g.items)
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allFaqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
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
