export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ClaudeBot|anthropic-ai|PerplexityBot|CCBot/i.test(ua)

  if (isCrawler) {
    const title = "The Muslim Company — A Faith-Driven Global Enterprise"
    const desc = "The Muslim Company is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded January 2025 by Shariful Islam — operating across 20+ sectors including Technology, AI, Renewable Energy, Healthcare, Education, and Humanitarian Development, guided by the Quran, authentic Sunnah, and the Prophetic model."
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/" />
</head>
<body>
  <header><h1>The Muslim Company</h1><p>A Faith-Driven Global Enterprise — Dhaka, Bangladesh</p></header>
  <main>
    <section>
      <h2>About</h2>
      <p>The Muslim Company (registered as The Muslim Company LTD) is a faith-driven global conglomerate headquartered in Dhaka, Bangladesh, founded in January 2025 by Shariful Islam. The company operates across more than twenty sectors — including Technology &amp; Artificial Intelligence, Manufacturing, Renewable Energy, Healthcare, Education, Media, Retail, Agriculture, and Humanitarian Development — united under a single ethical framework rooted in the Quran, authentic Sunnah, and the Prophetic model.</p>
    </section>
    <section>
      <h2>Mission</h2>
      <p>To build a civilization-driven global company inspired by the Quran, authentic Sunnah, and the Prophetic model — empowering humanity through ethical business, knowledge, innovation, justice, sustainability, and social development.</p>
    </section>
    <section>
      <h2>Vision</h2>
      <p>A century-long roadmap toward universities, hospitals, research centers, innovation hubs, and ethical AI institutions — civilization-scale development guided by faith, knowledge, and justice.</p>
    </section>
    <section>
      <h2>Foundation &amp; Governance</h2>
      <p>Every operation is checked against the Quran, authentic Hadith, and the Prophetic model, entirely free from riba (interest), bribery, and exploitation. A Supreme Shariah Board oversees all major decisions under an Amanah-based leadership and Shura consultative framework, protected by a permanent constitutional structure. <a href="https://www.themuslim.company/governance">Read about our Governance</a> and <a href="https://www.themuslim.company/constitution">Constitution</a>.</p>
    </section>
    <section>
      <h2>Sectors</h2>
      <p>The Muslim Company operates across Technology &amp; AI, Media &amp; Journalism, Education &amp; Research, Humanitarian Development, Governance &amp; Policy, Renewable Energy, Ethical Commerce, Social Welfare, Retail, Fashion &amp; Apparel, Agriculture &amp; Food, Manufacturing &amp; Industry, Islamic Finance &amp; Banking, and more. <a href="https://www.themuslim.company/sectors">View all sectors</a>.</p>
    </section>
    <section>
      <h2>The Muslim Company Foundation</h2>
      <p>The company's humanitarian and environmental arm, funded by zakat, sadaqah, and 10% of monthly net profit, serving humanitarian relief, orphan care, healthcare, education, animal and wildlife welfare, and environmental restoration. <a href="https://www.themuslim.company/the-muslim-company-foundation">Learn more</a>.</p>
    </section>
    <section>
      <h2>Global Presence</h2>
      <p>Headquartered in Dhaka, Bangladesh, with operations extending across India, Pakistan, the United Arab Emirates, Nigeria, and Ghana.</p>
    </section>
    <nav>
      <a href="https://www.themuslim.company/about">About</a> |
      <a href="https://www.themuslim.company/founder">Founder</a> |
      <a href="https://www.themuslim.company/ceo/Sharifulislam">CEO</a> |
      <a href="https://www.themuslim.company/careers">Careers</a> |
      <a href="https://www.themuslim.company/newsroom">Newsroom</a> |
      <a href="https://www.themuslim.company/blog">Blog</a> |
      <a href="https://www.themuslim.company/transparency">Transparency</a> |
      <a href="https://www.themuslim.company/contact">Contact</a>
    </nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }

  return env.ASSETS.fetch(request)
}
