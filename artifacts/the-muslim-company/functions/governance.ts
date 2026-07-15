export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Governance Structure — The Muslim Company</title>
  <meta name="description" content="Governed by a Supreme Shariah Board, Amanah-based leadership, Shura consultation, and the higher objectives of Shariah (Maqasid al-Shariah)." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Governance Structure — The Muslim Company" />
  <meta property="og:description" content="Governed by a Supreme Shariah Board, Amanah-based leadership, Shura consultation, and the higher objectives of Shariah (Maqasid al-Shariah)." />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/governance" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Governance Structure — The Muslim Company" />
  <meta name="twitter:description" content="How The Muslim Company is governed — Shariah Board, Shura, and Amanah leadership." />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/governance" />
</head>
<body><p><a href="https://www.themuslim.company/governance">Governance Structure — The Muslim Company</a></p></body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
