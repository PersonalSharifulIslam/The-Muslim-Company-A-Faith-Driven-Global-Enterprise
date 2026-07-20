export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "Get in touch with The Muslim Company — for general inquiries, partnerships, media, careers, research, or customer support."

    const contactPageSchema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact The Muslim Company",
      "description": desc,
      "url": "https://www.themuslim.company/contact",
      "publisher": {
        "@type": "Organization",
        "name": "The Muslim Company",
        "url": "https://www.themuslim.company",
        "email": "help@themuslim.company",
        "address": { "@type": "PostalAddress", "addressLocality": "Dhaka", "addressCountry": "BD" }
      }
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://www.themuslim.company/contact" },
      ],
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact Us — The Muslim Company</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Contact — The Muslim Company" />
  <meta property="og:description" content="Get in touch with The Muslim Company — for partnerships, careers, media, research, or support." />
  <meta property="og:image" content="https://www.themuslim.company/og-contact.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/contact" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contact — The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/og-contact.png" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/contact" />
  <script type="application/ld+json">${JSON.stringify(contactPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header>
    <p>Get In Touch</p>
    <h1>Contact Us</h1>
    <p>Whether you are an investor, researcher, journalist, partner, or someone who simply shares our vision — we welcome your message. Every inquiry is treated with honesty, respect, and care.</p>
  </header>
  <main>
    <h2>How Can We Help?</h2>
    <ul>
      <li><strong>General Inquiry</strong> — Questions about The Muslim Company, our mission, or general information. help@themuslim.company</li>
      <li><strong>Partnership</strong> — Business collaborations, NGO partnerships, investment, and strategic alliances. ceo@themuslim.company</li>
      <li><strong>Careers</strong> — Questions about open positions, the application process, or career opportunities. careers@themuslim.company</li>
      <li><strong>Media &amp; Press</strong> — Journalists, media organizations, and press inquiries about TMC. media@themuslim.company</li>
      <li><strong>Research &amp; Academic</strong> — Academic collaborations, research partnerships, and scholarly inquiries. research@themuslim.company</li>
      <li><strong>Customer Support</strong> — Help with products, services, orders, or any customer-related concerns. help@themuslim.company</li>
    </ul>

    <h2>Partnership Opportunities</h2>
    <ul>
      <li>Investment Partnership — ceo@themuslim.company</li>
      <li>Business Collaboration — ceo@themuslim.company</li>
      <li>Research Partnership — research@themuslim.company</li>
      <li>NGO &amp; Humanitarian Partnership — ceo@themuslim.company</li>
      <li>Academic &amp; Educational Partnership — research@themuslim.company</li>
      <li>Technology Partnership — ceo@themuslim.company</li>
      <li>Personal Partnership — ceo@themuslim.company</li>
      <li>Media Partnership — media@themuslim.company</li>
    </ul>

    <h2>Company Information</h2>
    <ul>
      <li>Legal Name: The Muslim Company LTD</li>
      <li>Headquarters: Dhaka, Bangladesh</li>
      <li>Website: themuslim.company</li>
      <li>General Email: help@themuslim.company</li>
    </ul>

    <h2>Email Directory</h2>
    <ul>
      <li>General Support — help@themuslim.company</li>
      <li>CEO &amp; Partnerships — ceo@themuslim.company</li>
      <li>Careers &amp; HR — careers@themuslim.company</li>
      <li>Media &amp; Press — media@themuslim.company</li>
      <li>Research &amp; Academic — research@themuslim.company</li>
      <li>Investor Relations — ceo@themuslim.company</li>
    </ul>

    <blockquote><p>"Every message we receive is a trust. We respond with honesty, respect, and care — because in Islam, fulfilling amanah is not optional." — The Muslim Company</p></blockquote>

    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/careers">Careers</a> | <a href="https://www.themuslim.company/get-involved">Get Involved</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
