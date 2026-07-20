export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "Join The Muslim Company's mission — volunteer, intern, research, advise, or mentor. The best of people are those most beneficial to people."

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Get Involved — The Muslim Company",
      "description": "Join The Muslim Company — volunteer, intern, research, mentor, or advise.",
      "url": "https://www.themuslim.company/get-involved",
      "isPartOf": { "@type": "WebSite", "name": "The Muslim Company", "url": "https://www.themuslim.company" },
      "about": { "@id": "https://www.themuslim.company/#organization" },
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "Get Involved", "item": "https://www.themuslim.company/get-involved" },
      ],
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Get Involved — The Muslim Company</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Get Involved — The Muslim Company" />
  <meta property="og:description" content="Volunteer, intern, research, mentor, or advise. Join a faith-driven global enterprise building ethical civilization." />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/get-involved" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Get Involved — The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/get-involved" />
  <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header>
    <p>Join the Mission</p>
    <h1>The Best of People Are Those Most Beneficial to People.</h1>
    <p>The Muslim Company is not just a company — it is a civilization mission. We are building an ethical, Islamic-values-driven global enterprise that serves humanity across every domain of life. This mission requires people of character, knowledge, skill, and sincere intention.</p>
    <blockquote><p>"The best of people are those most beneficial to people." — Prophet Muhammad ﷺ (Al-Mu'jam Al-Awsat)</p></blockquote>
  </header>
  <main>
    <h2>Why This Matters</h2>
    <h3>Civilization-Scale Impact</h3>
    <p>Your contribution — however small — becomes part of something designed to outlast individuals and generations. TMC's constitutional framework is built to carry forward your work for decades.</p>
    <h3>Faith-Centered Environment</h3>
    <p>Work in an environment where your Islamic identity is not just tolerated but celebrated. Prayer times, Islamic ethics, and prophetic values guide every interaction and decision.</p>
    <h3>Barakah in Your Work</h3>
    <p>When your skills are directed toward the pleasure of Allah and the benefit of humanity, your work carries barakah. This is not just a career opportunity — it is an act of worship.</p>

    <h2>Six Ways to Contribute</h2>

    <h3>Volunteer — Serve Humanity Directly</h3>
    <p>Join our humanitarian, community development, and social welfare programs, from food distribution to education support and disaster relief. Qualities sought: commitment to service, compassion and empathy, reliability and integrity — any professional background welcome. Contact: help@themuslim.company</p>

    <h3>Intern — Build Your Career With Purpose</h3>
    <p>Internship opportunities for students and recent graduates across technology, research, media, humanitarian work, and business. Qualities sought: currently studying or recently graduated, strong ethical character, eagerness to learn. Contact: careers@themuslim.company</p>

    <h3>Research Contributor — Advance Knowledge for Civilization</h3>
    <p>For researchers, academics, and independent scholars contributing to Islamic civilization studies, ethical technology research, Islamic economics, environmental science, and humanitarian research. Contact: research@themuslim.company</p>

    <h3>Shariah Scholar — Guard the Ethical Foundation</h3>
    <p>Qualified Islamic scholars are invited to contribute to the Supreme Shariah Board advisory framework, ethical product review, and Islamic commercial/technological ethics guidelines. Requires formal Islamic scholarly qualification and knowledge of fiqh al-muamalat. Contact: research@themuslim.company</p>

    <h3>Mentor — Guide the Next Generation</h3>
    <p>Experienced professionals, entrepreneurs, and leaders are invited to mentor TMC team members, interns, and young Muslim professionals. Contact: ceo@themuslim.company</p>

    <h3>Strategic Advisor — Shape the Global Vision</h3>
    <p>Senior leaders, executives, policy experts, and global thinkers contributing high-level guidance on governance, global expansion, and civilization-scale strategy. Contact: ceo@themuslim.company</p>

    <h2>Who We Welcome</h2>
    <p>We do not look only at qualifications. We look at character, intention, and commitment.</p>
    <h3>What we value most</h3>
    <ul>
      <li>Taqwa — genuine God-consciousness in daily life</li>
      <li>Honesty — in word, work, and interaction</li>
      <li>Discipline — consistency, reliability, and professionalism</li>
      <li>Humility — willingness to learn and serve</li>
      <li>Sincerity of intention — working for Allah, not recognition</li>
      <li>Knowledge — continuous learning and intellectual curiosity</li>
      <li>Compassion — for people, for creation, for the vulnerable</li>
    </ul>
    <h3>We welcome people from</h3>
    <ul>
      <li>Technology and engineering backgrounds</li>
      <li>Islamic scholarship and religious studies</li>
      <li>Business, economics, and finance</li>
      <li>Medicine, healthcare, and public health</li>
      <li>Media, journalism, and communication</li>
      <li>Research, academia, and education</li>
      <li>Humanitarian work and social development</li>
      <li>Law, governance, and policy</li>
    </ul>

    <h2>The Door Is Open</h2>
    <p>If you feel a resonance — a sense that this is something you want to be part of — then this is your invitation. Write to us at help@themuslim.company. We do not promise perfection. We promise sincerity, accountability, and a genuine commitment to building something that matters — for this life and the next.</p>

    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/careers">Careers</a> | <a href="https://www.themuslim.company/contact">Contact</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
