export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "How The Muslim Company differs from conventional business: riba-free finance, Shariah Board oversight, structural charity, and a constitutional framework protecting its ethical mission permanently."

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Why The Muslim Company",
      "description": desc,
      "url": "https://www.themuslim.company/why-us",
      "isPartOf": { "@type": "WebSite", "name": "The Muslim Company", "url": "https://www.themuslim.company" },
      "about": { "@id": "https://www.themuslim.company/#organization" },
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "Why The Muslim Company", "item": "https://www.themuslim.company/why-us" },
      ],
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Why The Muslim Company — A Different Kind of Enterprise</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Why The Muslim Company" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/why-us" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Why The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/why-us" />
  <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header>
    <p>Why The Muslim Company</p>
    <h1>A Different Kind of Enterprise, By Design</h1>
    <p>We are not a conventional company with a charity page bolted on. Every structural decision — from financing to leadership to profit distribution — is built from the ground up on Islamic ethical principles.</p>
  </header>
  <main>
    <h2>The Difference</h2>
    <p>Not every business claiming "ethics" builds it into the structure. Here's what's actually different, compared to typical for-profit enterprise norms in general:</p>
    <table>
      <thead>
        <tr><th>Area</th><th>Conventional Business</th><th>The Muslim Company</th></tr>
      </thead>
      <tbody>
        <tr><td>Financial Foundation</td><td>Built on interest-bearing debt and loans</td><td>Completely riba (interest) free, Shariah-compliant financing only</td></tr>
        <tr><td>Profit Purpose</td><td>Profit maximized for shareholders alone</td><td>10% of monthly net profit directed to humanitarian and environmental work</td></tr>
        <tr><td>Ethical Oversight</td><td>Typically no religious or values-based review body</td><td>Supreme Shariah Board reviews all major business decisions</td></tr>
        <tr><td>Leadership Model</td><td>Top-down control, limited accountability structure</td><td>Amanah-based leadership with Shura (consultative) governance</td></tr>
        <tr><td>Long-Term Protection</td><td>Mission can shift with new ownership or leadership</td><td>Constitutional framework permanently protects founding mission</td></tr>
        <tr><td>Charity &amp; Zakat</td><td>Optional CSR, rarely structural or mandatory</td><td>Zakat and sadaqah built into the financial model, not optional</td></tr>
        <tr><td>Worker Welfare</td><td>Compliance-minimum labor standards</td><td>Fair wages, extended maternity leave, pension and family welfare programs</td></tr>
        <tr><td>Transparency</td><td>Financial disclosure often limited to legal minimums</td><td>Public transparency reports covering finances, zakat, and governance</td></tr>
      </tbody>
    </table>
    <p>Full detail on our governance and finances is available in our <a href="https://www.themuslim.company/governance">Governance</a> and <a href="https://www.themuslim.company/transparency">Transparency Reports</a> pages.</p>

    <h2>What Actually Drives This — Five Principles</h2>
    <h3>Rooted in Revelation</h3>
    <p>Every policy is checked against the Quran, authentic Sunnah, and the Prophetic model — not just modern business trends.</p>
    <h3>Justice Over Profit</h3>
    <p>Growth is pursued, but never at the cost of fairness to workers, partners, customers, or the environment.</p>
    <h3>Accountability by Design</h3>
    <p>A Supreme Shariah Board and constitutional framework — not just a mission statement — enforce ethical conduct.</p>
    <h3>Built-In Generosity</h3>
    <p>Charity isn't a marketing add-on. It's a structural percentage of every month's profit, before anything else is distributed.</p>
    <h3>People Before Extraction</h3>
    <p>Employees, customers, and communities are treated as trusts (amanah) to be honored, not resources to be maximized.</p>

    <blockquote><p>"The best of people are those most beneficial to people." — Prophetic tradition</p></blockquote>

    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/mission">Mission</a> | <a href="https://www.themuslim.company/careers">Careers</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
