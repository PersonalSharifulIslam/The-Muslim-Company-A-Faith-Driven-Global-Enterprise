export async function onRequestGet(context: any) {
  const { request, env, params } = context
  const slug = params.slug as string

  const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL
  const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY

  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot/i.test(ua)

  let job: any = null
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?slug=eq.${slug}&select=title,description,location,employment_type,department,deadline,created_at,status`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const data = await res.json() as any[]
    if (data && data.length > 0) job = data[0]
  } catch {}

  if (!job) {
    return env.ASSETS.fetch(request)
  }

  const title = `${job.title} — Careers at The Muslim Company`
  const rawDesc = job.description || `The Muslim Company is hiring for ${job.title}. Join a global conglomerate building long-term civilizational impact.`
  const description = rawDesc.replace(/<[^>]*>/g, '').slice(0, 160)
  const image = 'https://www.themuslim.company/opengraph.jpg'
  const url = `https://www.themuslim.company/careers/${slug}`

  if (isCrawler) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:site" content="@officialtmchq" />
  <link rel="canonical" href="${url}" />
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a></p>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }

  return env.ASSETS.fetch(request)
}
