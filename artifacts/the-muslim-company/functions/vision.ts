export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "The Muslim Company's long-term vision: building universities, research centers, hospitals, and ethical institutions guided by faith, knowledge, and justice."

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Vision — The Muslim Company",
      "description": "The Muslim Company's long-term vision for ethical civilization-scale development.",
      "url": "https://www.themuslim.company/vision",
      "isPartOf": { "@type": "WebSite", "name": "The Muslim Company", "url": "https://www.themuslim.company" },
      "about": { "@id": "https://www.themuslim.company/#organization" },
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "Vision", "item": "https://www.themuslim.company/vision" },
      ],
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Our Vision — The Muslim Company</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Our Vision | The Muslim Company" />
  <meta property="og:description" content="The Muslim Company's long-term vision: universities, research centers, hospitals, ethical AI institutions, and civilization-scale development guided by faith, knowledge, and justice." />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/vision" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Our Vision — The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/vision" />
  <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header>
    <p>Long-Term Vision</p>
    <h1>The Future is Ethical</h1>
    <p>Universities. Research centers. Hospitals. Innovation hubs. Ethical AI institutions. Civilization-scale development — guided by faith, knowledge, and justice.</p>
  </header>
  <main>
    <h2>Our Vision</h2>
    <p>To become a globally recognized faith-driven institution demonstrating how Islamic values and modern innovation can work together to solve humanity's greatest challenges.</p>

    <h3>Corporate University &amp; Academies</h3>
    <ul>
      <li>Universities &amp; leadership academies</li>
      <li>Islamic economics institutes</li>
      <li>AI research centers</li>
      <li>Technology training institutes</li>
    </ul>

    <h3>Future Civilization Research Center</h3>
    <ul>
      <li>Islamic civilization studies</li>
      <li>Ethical economics &amp; AI ethics</li>
      <li>Environmental sustainability</li>
      <li>Healthcare innovation</li>
    </ul>

    <h3>Global Muslim Innovation Network</h3>
    <ul>
      <li>Muslim scientists &amp; engineers</li>
      <li>Ethical entrepreneurs &amp; AI specialists</li>
      <li>Islamic scholars &amp; educators</li>
      <li>Humanitarian experts</li>
    </ul>

    <h3>Ethical Smart Cities</h3>
    <ul>
      <li>Knowledge-centered urban systems</li>
      <li>Sustainable communities</li>
      <li>Halal economic districts</li>
      <li>Environmentally balanced infrastructure</li>
    </ul>

    <h3>Civilization Archive &amp; Waqf</h3>
    <ul>
      <li>Educational &amp; research waqf systems</li>
      <li>Humanitarian waqf funds</li>
      <li>Multi-language knowledge accessibility</li>
    </ul>

    <h3>Strategic Vision Office</h3>
    <ul>
      <li>50-year &amp; 100-year civilization planning</li>
      <li>Ethical future development</li>
      <li>Global technological change forecasting</li>
    </ul>

    <h2>The Global Civilization Blueprint</h2>
    <ul>
      <li>Faith</li>
      <li>Knowledge</li>
      <li>Justice</li>
      <li>Ethics</li>
      <li>Compassion</li>
      <li>Innovation</li>
      <li>Responsibility</li>
    </ul>

    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/mission">Mission</a> | <a href="https://www.themuslim.company/founder">Founder</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
