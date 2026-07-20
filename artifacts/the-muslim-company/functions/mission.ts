export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "The Muslim Company's mission: to build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, justice, sustainability, and social development."

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Our Mission — The Muslim Company",
      "description": desc,
      "url": "https://www.themuslim.company/mission",
      "isPartOf": { "@type": "WebSite", "name": "The Muslim Company", "url": "https://www.themuslim.company" },
      "about": { "@id": "https://www.themuslim.company/#organization" },
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "Our Mission", "item": "https://www.themuslim.company/mission" },
      ],
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Our Mission — The Muslim Company</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Our Mission — The Muslim Company" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/mission" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Our Mission — The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/mission" />
  <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header><h1>Our Mission</h1><p>Core Mission — The Muslim Company</p></header>
  <main>
    <blockquote><p>"To build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, justice, sustainability, and social development."</p></blockquote>

    <h2>What We Are Here to Do</h2>
    <ul>
      <li>Serve humanity through ethical and Shariah-compliant systems</li>
      <li>Build a global Islamic ethical business ecosystem</li>
      <li>Ensure human welfare and social justice</li>
      <li>Make food, clothing, housing, education, and healthcare more accessible</li>
      <li>Support research, science, innovation, and technology</li>
      <li>Create sustainable economic opportunities</li>
      <li>Promote knowledge, morality, and human dignity</li>
      <li>Revive the legacy of Muslim civilization through ethical development</li>
    </ul>

    <h2>Organizational Philosophy</h2>
    <ul>
      <li>Business should serve humanity</li>
      <li>Knowledge and morality must go together</li>
      <li>Economic development must remain ethical</li>
      <li>Nature and creation are trusts from Allah</li>
      <li>Human welfare is a responsibility, not only a strategy</li>
      <li>Long-term success comes through honesty, justice, discipline, and service</li>
      <li>Ethical and halal wealth contains true barakah</li>
    </ul>

    <p>The purpose of the company is not only commercial success, but also the development of humanity, establishment of justice, protection of moral values, advancement of knowledge, and rebuilding a strong ethical civilization. The company seeks to contribute toward restoring the Muslim world's historical excellence in science, philosophy, literature, medicine, economics, technology, education, governance, and social development.</p>

    <h2>Serving Humanity Through</h2>
    <ul>
      <li>Ethical Business</li>
      <li>Knowledge</li>
      <li>Innovation</li>
      <li>Justice</li>
      <li>Sustainability</li>
      <li>Social Development</li>
      <li>Humanitarian Work</li>
      <li>Civilization Building</li>
    </ul>

    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/vision">Vision</a> | <a href="https://www.themuslim.company/foundation">Foundation</a> | <a href="https://www.themuslim.company/founder">Founder</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
