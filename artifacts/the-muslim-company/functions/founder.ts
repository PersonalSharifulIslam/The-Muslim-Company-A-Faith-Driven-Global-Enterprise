export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot/i.test(ua)

  if (isCrawler) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Founder & CEO — Shariful Islam — The Muslim Company</title>
  <meta name="description" content="Shariful Islam is the Founder of The Muslim Company — a global conglomerate built on ethical leadership and long-term civilizational impact. Dhaka, Bangladesh." />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="Shariful Islam – Founder & CEO | The Muslim Company" />
  <meta property="og:description" content="Shariful Islam is the Founder of The Muslim Company — a global conglomerate built on ethical leadership and long-term civilizational impact. Dhaka, Bangladesh." />
  <meta property="og:image" content="https://www.themuslim.company/shariful-islam-ceo.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Shariful Islam – Founder & CEO of The Muslim Company" />
  <meta property="og:url" content="https://www.themuslim.company/founder" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Shariful Islam – Founder & CEO | The Muslim Company" />
  <meta name="twitter:description" content="Shariful Islam is the Founder of The Muslim Company — a global conglomerate built on ethical leadership and long-term civilizational impact." />
  <meta name="twitter:image" content="https://www.themuslim.company/shariful-islam-ceo.png" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="https://www.themuslim.company/founder" />
</head>
<body>
  <header><h1>Founder & CEO — Shariful Islam</h1><p>The Muslim Company — Dhaka, Bangladesh</p></header>
  <main>
    <p>Shariful Islam is the Founder of The Muslim Company — a diversified, faith-driven global conglomerate built on Islamic principles, ethical leadership, and long-term civilizational impact. Born in Jamalpur, Bangladesh, he holds a Bachelor of Engineering in Electrical Engineering from the University of Burdwan, India.</p>
    <p>Shariful Islam founded The Muslim Company in January 2025 with the explicit intent of building an institution — not merely a business — governed by Islamic ethical principle at every level of decision-making. The company now operates across more than twenty sectors and extends across Bangladesh, India, Pakistan, the United Arab Emirates, Nigeria, and Ghana.</p>
    <p>He also serves as a Peace Ambassador for the Global Peace Chain (Bangladesh) and holds professional memberships with the Society of Satellite Professionals International (SSPI), the International Association of Engineers (IAENG), and the International Human Rights Commission (IHRC).</p>
    <nav><a href="https://www.themuslim.company/">Home</a> | <a href="https://www.themuslim.company/ceo/Sharifulislam">CEO Profile</a> | <a href="https://www.themuslim.company/about">About</a></nav>
  </main>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }

  return env.ASSETS.fetch(request)
}
