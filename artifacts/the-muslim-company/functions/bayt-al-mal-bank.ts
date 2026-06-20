export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot/i.test(ua)

  if (isCrawler) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>The Bayt Al-Mal Bank — The Muslim Company</title>
  <meta name="description" content="The Bayt Al-Mal Bank — an international Shariah-compliant financial institution under The Muslim Company, offering ethical, interest-free banking worldwide." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="The Bayt Al-Mal Bank — The Muslim Company" />
  <meta property="og:description" content="The Bayt Al-Mal Bank — an international Shariah-compliant financial institution under The Muslim Company, offering ethical, interest-free banking worldwide." />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/BaytAlMalBank" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="The Bayt Al-Mal Bank — The Muslim Company" />
  <meta name="twitter:description" content="An international Shariah-compliant financial institution under The Muslim Company." />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/BaytAlMalBank" />
</head>
<body><p><a href="https://www.themuslim.company/BaytAlMalBank">The Bayt Al-Mal Bank — The Muslim Company</a></p></body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
