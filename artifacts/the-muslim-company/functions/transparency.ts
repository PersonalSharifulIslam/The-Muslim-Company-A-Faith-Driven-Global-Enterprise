export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Transparency & Accountability — The Muslim Company</title>
  <meta name="description" content="Our commitment to full transparency in charity, governance, and ethical operations." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Transparency & Accountability — The Muslim Company" />
  <meta property="og:description" content="Our commitment to full transparency in charity, governance, and ethical operations." />
  <meta property="og:image" content="https://www.themuslim.company/images/transparency.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Transparency & Accountability — The Muslim Company" />
  <meta property="og:url" content="https://www.themuslim.company/transparency" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Transparency & Accountability — The Muslim Company" />
  <meta name="twitter:description" content="Our commitment to full transparency in charity, governance, and ethical operations." />
  <meta name="twitter:image" content="https://www.themuslim.company/images/transparency.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/transparency" />
</head>
<body><p><a href="https://www.themuslim.company/transparency">Transparency & Accountability — The Muslim Company</a></p></body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }

  return env.ASSETS.fetch(request)
}
