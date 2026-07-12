export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot/i.test(ua)

  if (isCrawler) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Shariful Islam – CEO of The Muslim Company</title>
  <meta name="description" content="Shariful Islam serves as CEO of The Muslim Company — a global conglomerate committed to innovation, long-term value creation, and ethical leadership." />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="Shariful Islam – CEO of The Muslim Company" />
  <meta property="og:description" content="Shariful Islam serves as CEO of The Muslim Company — a global conglomerate committed to innovation, long-term value creation, and ethical leadership." />
  <meta property="og:image" content="https://www.themuslim.company/shariful-islam-ceo.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Shariful Islam – CEO of The Muslim Company" />
  <meta property="og:url" content="https://www.themuslim.company/ceo/Sharifulislam" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Shariful Islam – CEO of The Muslim Company" />
  <meta name="twitter:description" content="Shariful Islam serves as CEO of The Muslim Company — a global conglomerate committed to innovation, long-term value creation, and ethical leadership." />
  <meta name="twitter:image" content="https://www.themuslim.company/shariful-islam-ceo.png" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/ceo/Sharifulislam" />
</head>
<body>
  <header><h1>Shariful Islam — Chief Executive Officer</h1><p>The Muslim Company — Dhaka, Bangladesh</p></header>
  <main>
    <p>Shariful Islam is the Founder &amp; Chief Executive Officer of The Muslim Company, a faith-driven global conglomerate headquartered in Dhaka, Bangladesh. Born in Jamalpur, Bangladesh, he holds a Bachelor of Engineering in Electrical Engineering from the University of Burdwan, India.</p>
    <p>Shariful Islam, Founder &amp; CEO of The Muslim Company, is a Bangladeshi electrical engineer and entrepreneur — not related to or the same person as the Bangladeshi cricketer of the same name.</p>
    <p>He serves as a Peace Ambassador for the Global Peace Chain (Bangladesh), and holds professional memberships with the Society of Satellite Professionals International (SSPI), the International Association of Engineers (IAENG), and the International Human Rights Commission (IHRC).</p>
    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/founder">Founder</a> | <a href="https://www.themuslim.company/about">About</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }

  return env.ASSETS.fetch(request)
}
