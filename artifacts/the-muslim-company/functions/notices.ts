export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const desc = "Official notices, announcements, and upcoming events from The Muslim Company. Stay informed on corporate updates, policy changes, and organizational milestones."

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Notices & Events — The Muslim Company",
      "description": desc,
      "url": "https://www.themuslim.company/notices",
      "isPartOf": { "@type": "WebSite", "name": "The Muslim Company", "url": "https://www.themuslim.company" },
      "about": { "@id": "https://www.themuslim.company/#organization" },
    }
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
        { "@type": "ListItem", "position": 2, "name": "Notices & Events", "item": "https://www.themuslim.company/notices" },
      ],
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Notices & Events — The Muslim Company</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Notices & Events — The Muslim Company" />
  <meta property="og:description" content="Official notices, announcements, and upcoming events from The Muslim Company." />
  <meta property="og:image" content="https://www.themuslim.company/og-notices.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/notices" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Notices & Events — The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="https://www.themuslim.company/og-notices.png" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/notices" />
  <script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header>
    <p>Official</p>
    <h1>Notice &amp; Event</h1>
    <p>Official notices, circulars, announcements, and upcoming events from The Muslim Company.</p>
  </header>
  <main>
    <p>This page lists official notices, circulars, announcements, and event updates, searchable and filterable by category and year. Categories include General Notice, Important, Circular, Recruitment, Event, and Announcement.</p>
    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/newsroom">Newsroom</a> | <a href="https://www.themuslim.company/blog">Blog</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
