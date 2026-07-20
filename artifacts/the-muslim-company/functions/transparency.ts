export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "The Muslim Company's commitment to full transparency — charity distribution, zakat, humanitarian impact, governance, and financial ethics — all accountable to Allah and humanity."

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Transparency & Accountability — The Muslim Company",
      "description": "The Muslim Company's full transparency report on charity, zakat, governance, and ethical operations.",
      "url": "https://www.themuslim.company/transparency",
      "isPartOf": { "@type": "WebSite", "name": "The Muslim Company", "url": "https://www.themuslim.company" },
      "about": { "@id": "https://www.themuslim.company/#organization" },
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "Transparency", "item": "https://www.themuslim.company/transparency" },
      ],
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Transparency & Accountability — The Muslim Company</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Transparency & Accountability — The Muslim Company" />
  <meta property="og:description" content="Full transparency in charity, zakat, humanitarian impact, governance, and ethical finance." />
  <meta property="og:image" content="https://www.themuslim.company/og-transparency.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/transparency" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Transparency & Accountability — The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/og-transparency.png" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/transparency" />
  <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header>
    <p>Accountability</p>
    <h1>We Account to Allah First. Then to Humanity.</h1>
    <p>Transparency is not a corporate obligation for The Muslim Company — it is a divine one. Every dirham, every decision, and every action will be presented before Allah on the Day of Judgment. This page reflects our commitment to being answerable, honest, and accountable in all that we do.</p>
    <blockquote><p>"Indeed, Allah commands you to render trusts to whom they are due and when you judge between people to judge with justice." — Quran 4:58</p></blockquote>
  </header>
  <main>
    <h2>Official Reports</h2>
    <p>Monthly, quarterly, semi-annual, and annual reports covering all aspects of our ethical operations. Reports will include: revenue and expenditure summary, zakat calculation and distribution details, monthly charity disbursement breakdown, humanitarian activities and beneficiary numbers, Shariah board audit findings, worker welfare metrics, environmental impact assessment, tax and VAT compliance confirmation, governance violations (if any) and corrective actions, and waqf/endowment fund status.</p>
    <p><em>Note: The Muslim Company was founded in January 2025 and is currently in its development and establishment phase. This page reflects our constitutional commitments and ethical framework that govern all reporting, published as reports become available.</em></p>

    <h2>Six Pillars of Accountability</h2>
    <h3>Financial Transparency</h3>
    <p>All revenue, expenditure, profit distribution, zakat, and charitable giving fully documented and publicly summarized.</p>
    <h3>Charitable Accountability</h3>
    <p>10% of monthly net profit goes to charity. Every recipient, amount, and cause is recorded and reported.</p>
    <h3>Governance Integrity</h3>
    <p>Supreme Shariah Board oversight on all major decisions. No action proceeds without ethical and Islamic review.</p>
    <h3>Worker Welfare Reporting</h3>
    <p>Annual reports on employee welfare, fair wages, maternity leave, pension provision, and working conditions.</p>
    <h3>Environmental Stewardship</h3>
    <p>Carbon impact, reforestation efforts, waste reduction, and ecological restoration activities publicly reported.</p>
    <h3>Ethical Compliance</h3>
    <p>Annual Shariah audit, external ethics review, and public declaration of any violations and corrections made.</p>

    <h2>Charitable Giving</h2>
    <p>Giving is not optional — it is woven into the financial DNA of The Muslim Company. 10% of net profit every month is allocated to charity and humanitarian causes before any executive bonus or dividend distribution. Zakat is calculated annually on all eligible assets by a qualified Shariah scholar. Beyond obligatory giving, additional sadaqah, waqf contributions, and emergency humanitarian funds are activated when needed.</p>
    <p>Charitable causes include: Mosques &amp; Madrasas, Education Scholarships, Healthcare Support, Orphan Care, Widow Support, Disaster Relief, Poverty Alleviation, Community Development, Clean Water Access, Refugee Assistance, Food Security Programs, and Waqf Endowments.</p>

    <h2>Financial Ethics</h2>
    <h3>What We Practice</h3>
    <ul>
      <li>Profit-and-loss sharing as the foundation of all investment</li>
      <li>Transparent contracts with zero hidden fees or clauses</li>
      <li>Fair wages paid on time — the Prophet ﷺ commanded this</li>
      <li>Annual Shariah audit of all financial products and operations</li>
      <li>Refund delay compensation — customer funds are amanah</li>
      <li>Published maximum retail prices to prevent exploitation</li>
      <li>External independent financial audit annually</li>
      <li>Full tax and VAT compliance in all jurisdictions</li>
    </ul>
    <h3>What We Prohibit</h3>
    <ul>
      <li>Riba (interest) in any form — buying, selling, or investing</li>
      <li>Bribery, corruption, or unethical financial influence</li>
      <li>Deceptive marketing or misleading product claims</li>
      <li>Participation in gambling, speculation, or haram industries</li>
      <li>Exploitation of workers, customers, or suppliers</li>
      <li>Price manipulation during crisis or artificial scarcity</li>
      <li>Haram investment regardless of financial return</li>
      <li>Off-book transactions or financial concealment</li>
    </ul>

    <h2>Governance Transparency</h2>
    <h3>Supreme Shariah Board</h3>
    <p>An independent board of qualified Islamic scholars reviews all major decisions. No product, service, investment, or partnership proceeds without board approval. The board may revoke approval if future evidence reveals harm.</p>
    <h3>Annual Public Report</h3>
    <p>TMC publishes annual summaries covering revenue overview, zakat and charity distribution, humanitarian activities, governance updates, environmental projects, and worker welfare outcomes.</p>
    <h3>Internal Ethics Division</h3>
    <p>A confidential internal division monitors compliance, investigates ethical concerns, and maintains whistleblower protection, reporting directly to the founder — insulated from commercial pressure.</p>
    <h3>Anti-Corruption Policy</h3>
    <p>Zero tolerance for bribery at any level. Any confirmed corruption results in immediate termination and, where appropriate, legal action. No exceptions for seniority or commercial importance.</p>

    <h2>Worker Welfare</h2>
    <p>Workers are not resources. They are human beings — and they carry rights before Allah. Key commitments: 1.5 years maternity leave, 30% salary during leave, 15-year pension threshold, zero tolerance for humiliation.</p>
    <ul>
      <li>Fair and competitive salaries reviewed annually</li>
      <li>Safe and dignified working environments</li>
      <li>Prayer facilities and Jumu'ah scheduling</li>
      <li>Training and development opportunities for all</li>
      <li>Family welfare programs including healthcare and education support</li>
      <li>Emergency financial assistance for employees in crisis</li>
      <li>Separate and privacy-respecting facilities for women</li>
      <li>Worker loyalty archive — every contributor honored</li>
    </ul>

    <h2>Environmental Accountability</h2>
    <p>The earth is a trust from Allah. We are answerable for how we treat it.</p>
    <h3>Carbon Reduction</h3>
    <p>Commitment to reducing carbon footprint across all operations, with transition to renewable energy across TMC facilities.</p>
    <h3>Reforestation</h3>
    <p>Active tree plantation and ecological restoration programs. Target: one million trees as first milestone.</p>
    <h3>No Intentional Destruction</h3>
    <p>No TMC project, facility, or operation will intentionally damage ecosystems, waterways, or wildlife habitats.</p>

    <blockquote><p>"Institutions are not judged only by their profits. They are judged by their honesty, their justice, their care for people, and their answerable relationship with their Creator." — The Muslim Company</p></blockquote>

    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/governance">Governance</a> | <a href="https://www.themuslim.company/contact">Contact</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
