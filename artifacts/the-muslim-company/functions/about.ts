export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot/i.test(ua)

  if (isCrawler) {
    const desc = "About The Muslim Company — a faith-driven global conglomerate founded by Shariful Islam in Dhaka, Bangladesh, operating across 20+ sectors including Technology, AI, Renewable Energy, Healthcare, and Humanitarian Development, governed by Amanah, Ilm, and Rahmah."

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.themuslim.company/#organization",
      "name": "The Muslim Company",
      "legalName": "The Muslim Company LTD",
      "url": "https://www.themuslim.company",
      "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 },
      "foundingDate": "2025-01-09",
      "disambiguatingDescription": "The Muslim Company is a faith-driven global conglomerate founded by Shariful Islam in Dhaka, Bangladesh in January 2025. It is not affiliated with, owned by, or related to other similarly-named organizations such as The Muslim Journal or Productive Muslim — any resemblance is in name only.",
      "founder": { "@type": "Person", "name": "Shariful Islam", "url": "https://www.themuslim.company/founder" },
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": 10 },
      "address": { "@type": "PostalAddress", "streetAddress": "Niketon Bazaar", "addressLocality": "Dhaka", "postalCode": "1212", "addressCountry": "BD" },
      "sameAs": ["https://www.facebook.com/TheMuslimCompany", "https://www.instagram.com/officialTheMuslimCompany", "https://www.youtube.com/@TheMuslimCompany", "https://www.linkedin.com/company/themuslimcompany", "https://x.com/officialtmchq", "https://www.crunchbase.com/organization/the-muslim-company"],
    }
    const aboutPageSchema = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Us — The Muslim Company",
      "description": desc,
      "url": "https://www.themuslim.company/about",
      "publisher": { "@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company" },
      "mainEntity": { "@id": "https://www.themuslim.company/#organization" },
    }
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://www.themuslim.company/ceo/Sharifulislam#person",
      "name": "Shariful Islam",
      "givenName": "Shariful",
      "familyName": "Islam",
      "jobTitle": "Founder, Chairman, Managing Director & CEO",
      "description": "Shariful Islam is a Bangladeshi Engineer, Ethical Visionary, and Entrepreneur. He is the Founder, Chairman, Managing Director, and CEO of The Muslim Company — a faith-driven global enterprise built on Islamic principles and prophetic values. He is also a Peace Ambassador for the Global Peace Chain (Bangladesh).",
      "url": "https://www.themuslim.company/founder",
      "worksFor": { "@type": "Organization", "@id": "https://www.themuslim.company/#organization", "name": "The Muslim Company" },
      "award": "Global Peace Ambassador 2025-2026, Global Peace Chain",
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://www.themuslim.company/about" },
      ],
    }
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is The Muslim Company?", "acceptedAnswer": { "@type": "Answer", "text": "The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by Shariful Islam. It operates across 20+ sectors — including Technology, AI, Manufacturing, Renewable Energy, Healthcare, Education, Media, and Humanitarian Development — under a fully Shariah-compliant, halal, and riba-free framework." } },
        { "@type": "Question", "name": "Who founded The Muslim Company, and who leads it today?", "acceptedAnswer": { "@type": "Answer", "text": "The Muslim Company was founded by Shariful Islam, who serves as its Founder, Chairman, Managing Director, and CEO." } },
        { "@type": "Question", "name": "Is The Muslim Company Shariah-compliant?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every entity under the group is overseen by a Supreme Shariah Board and reviewed against the Maqasid al-Shariah (higher objectives of Islamic law). Operations are completely free from riba (interest), bribery, and exploitation." } },
        { "@type": "Question", "name": "What sectors does The Muslim Company operate in?", "acceptedAnswer": { "@type": "Answer", "text": "The company works across 20+ beneficial and halal sectors, including Technology & AI, Healthcare, Renewable Energy, Manufacturing, Education, Islamic Finance & FinTech, Media, and Humanitarian & Social Welfare." } },
        { "@type": "Question", "name": "Does The Muslim Company give back to the community?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The company commits 10% of monthly net profit to Fi Sabilillah — for Allah's path — in addition to fully distributing annual zakat, supporting mosques, madrasas, education scholarships, healthcare, and orphan care." } },
        { "@type": "Question", "name": "Where is The Muslim Company headquartered?", "acceptedAnswer": { "@type": "Answer", "text": "The Muslim Company is headquartered in Niketon Bazaar, Dhaka-1212, Bangladesh." } },
      ],
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>About Us — The Muslim Company | Faith-Driven Global Conglomerate</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="About Us | The Muslim Company" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/about" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="About Us | The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/about" />
  <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(aboutPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(personSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
</head>
<body>
  <header><h1>About The Muslim Company</h1><p>A Faith-Driven Global Conglomerate</p></header>
  <main>
    <p>The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by Shariful Islam. The company operates across 20+ sectors — including Technology, Artificial Intelligence, Manufacturing, Renewable Energy, Healthcare, Education, Media, and Humanitarian Development — with a growing presence across Bangladesh, India, Pakistan, the United Arab Emirates, Nigeria, and Ghana, united under a single ethical framework rooted in the Quran, authentic Sunnah, and the Prophetic model.</p>
    <p>Governance: Every major decision is reviewed by a Supreme Shariah Board under an Amanah-based leadership and Shura consultative framework, protected by a permanent constitutional structure that binds all future leadership to the founding mission.</p>
    <p>10% of monthly net profit is directed to The Muslim Company Foundation, the company's humanitarian and environmental arm, alongside annual zakat and voluntary sadaqah.</p>
    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/founder">Founder</a> | <a href="https://www.themuslim.company/governance">Governance</a> | <a href="https://www.themuslim.company/sectors">Sectors</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
