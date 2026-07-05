const SECTORS: Record<string, { label: string; tagline: string }> = {
  "agriculture-food": { label: "Agriculture & Food", tagline: "Nourishing Humanity Through Ethical Farming and Halal Food Systems" },
  "education-research": { label: "Education & Research", tagline: "Reviving the Islamic Tradition of Knowledge, Inquiry, and Civilization" },
  "technology-ai": { label: "Technology & AI", tagline: "Ethical Innovation for a Humanity-Centered Digital Future" },
  "healthcare-medicine": { label: "Healthcare & Medicine", tagline: "Healing Humanity With Compassion, Ethics, and Islamic Medical Principles" },
  "construction-housing": { label: "Construction & Housing", tagline: "Building Dignified Homes and Ethical Infrastructure for All of Humanity" },
  "renewable-energy": { label: "Renewable Energy", tagline: "Powering Civilization With Clean, Ethical, and Sustainable Energy" },
  "media-journalism": { label: "Media & Journalism", tagline: "Truth-Based, Ethical Media for an Informed and Just World" },
  "software-cybersecurity": { label: "Software & Cybersecurity", tagline: "Protecting Digital Sovereignty With Ethical Software and Islamic Values" },
  "manufacturing-industry": { label: "Manufacturing & Industry", tagline: "Ethical Production, Dignified Labor, and Halal Industry at Global Scale" },
  "islamic-finance-fintech": { label: "Islamic Finance & FinTech", tagline: "Riba-Free, Justice-Centered Financial Systems for the Modern World" },
  "transportation-logistics": { label: "Transportation & Logistics", tagline: "Ethical Mobility and Supply Chain Solutions for a Connected World" },
  "e-commerce": { label: "E-commerce", tagline: "Ethical Online Commerce Connecting Halal Producers With Global Consumers" },
  "literature-publishing": { label: "Literature & Publishing", tagline: "Ethical Knowledge, Islamic Literature, and Civilization-Building Through Words" },
  "philosophy-civilization-studies": { label: "Philosophy & Civilization Studies", tagline: "Reviving Islamic Thought, Ethics, and Civilizational Wisdom for the Modern Age" },
  "scientific-research": { label: "Scientific Research", tagline: "Faith-Guided Scientific Inquiry for the Benefit of All Humanity" },
  "social-welfare-humanitarian-work": { label: "Social Welfare & Humanitarian Work", tagline: "Serving the Vulnerable With Compassion, Justice, and Prophetic Ethics" },
  "environmental-protection": { label: "Environmental Protection", tagline: "Fulfilling Our Sacred Trust as Stewards of Allah's Creation" },
  "robotics-automation": { label: "Robotics & Automation", tagline: "Ethical Automation That Serves Humanity Without Replacing Human Dignity" },
  "international-trade": { label: "International Trade", tagline: "Reviving the Ethical Islamic Trading Tradition at Global Scale" },
  "community-development": { label: "Community Development", tagline: "Building Thriving, Ethical, and Faith-Centered Communities Worldwide" },
  "retail-business": { label: "Retail Business", tagline: "Ethical, Halal-Certified Retail Bringing Quality to Every Muslim Household" },
  "fashion-apparel": { label: "Fashion & Apparel", tagline: "Modest, Ethical, and Beautiful Clothing for a Faith-Conscious World" },
  "lifestyle-personal-care": { label: "Lifestyle & Personal Care", tagline: "Halal, Pure, and Ethical Personal Care for the Faith-Conscious Individual" },
}

export async function onRequestGet(context: any) {
  const { request, env, params } = context
  const slug = params.slug as string

  const sector = SECTORS[slug]
  if (!sector) {
    return env.ASSETS.fetch(request)
  }

  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot/i.test(ua)

  const title = `${sector.label} — The Muslim Company`
  const description = `${sector.tagline} — Explore The Muslim Company's ${sector.label} sector and its long-term goals rooted in Islamic ethics and innovation.`
  const image = 'https://www.themuslim.company/opengraph.jpg'
  const url = `https://www.themuslim.company/sectors/${slug}`

  if (isCrawler) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="${url}" />
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a></p>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }

  return env.ASSETS.fetch(request)
}
