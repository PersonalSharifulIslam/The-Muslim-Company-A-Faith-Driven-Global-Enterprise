export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.themuslim.company/#organization",
      "name": "The Muslim Company",
      "legalName": "The Muslim Company LTD",
      "url": "https://www.themuslim.company",
      "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 },
      "foundingDate": "2025-01-09",
      "address": { "@type": "PostalAddress", "streetAddress": "Niketon Bazaar", "addressLocality": "Dhaka", "postalCode": "1212", "addressCountry": "BD" },
    }
    const financialServiceSchema = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "The Bayt Al-Mal Bank",
      "url": "https://www.themuslim.company/baytalmalbank",
      "description": "The Bayt Al-Mal Bank — an international Shariah-compliant financial institution under The Muslim Company, offering ethical, interest-free banking worldwide.",
      "parentOrganization": { "@id": "https://www.themuslim.company/#organization" },
      "areaServed": "Worldwide",
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "The Bayt Al-Mal Bank", "item": "https://www.themuslim.company/baytalmalbank" },
      ],
    }
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>The Bayt Al-Mal Bank — The Muslim Company</title>
  <meta name="description" content="The Bayt Al-Mal Bank — an international Shariah-compliant financial institution under The Muslim Company, offering ethical, interest-free banking worldwide." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="The Bayt Al-Mal Bank — The Muslim Company" />
  <meta property="og:description" content="The Bayt Al-Mal Bank — an international Shariah-compliant financial institution under The Muslim Company, offering ethical, interest-free banking worldwide." />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/baytalmalbank" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="The Bayt Al-Mal Bank — The Muslim Company" />
  <meta name="twitter:description" content="An international Shariah-compliant financial institution under The Muslim Company." />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/baytalmalbank" />
  <script type="application/ld+json">${JSON.stringify(orgSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(financialServiceSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body><p><a href="https://www.themuslim.company/baytalmalbank">The Bayt Al-Mal Bank — The Muslim Company</a></p></body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
