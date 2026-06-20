export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot/i.test(ua)

  if (isCrawler) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Recruitment Status — The Muslim Company</title>
  <meta name="description" content="Track the status of your job application at The Muslim Company. Enter your reference number to check where you are in our recruitment process." />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Recruitment Status — The Muslim Company" />
  <meta property="og:description" content="Track the status of your job application at The Muslim Company." />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="https://www.themuslim.company/recruitment-status" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="robots" content="noindex, follow" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Recruitment Status — The Muslim Company" />
  <meta name="twitter:image" content="https://www.themuslim.company/opengraph.jpg" />
  <link rel="canonical" href="https://www.themuslim.company/recruitment-status" />
</head>
<body><p><a href="https://www.themuslim.company/recruitment-status">Recruitment Status — The Muslim Company</a></p></body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }
  return env.ASSETS.fetch(request)
}
