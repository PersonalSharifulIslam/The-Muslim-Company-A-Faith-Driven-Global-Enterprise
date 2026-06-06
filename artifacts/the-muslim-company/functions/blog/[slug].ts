export async function onRequestGet(context: any) {
  const { request, env, params } = context
  const slug = params.slug as string
  const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL
  const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY

  // Check if this is a social media crawler
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot/i.test(ua)

  // Fetch post data from Supabase
  let post: any = null
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${slug}&published=eq.true&select=title,excerpt,image_url,created_at`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    const data = await res.json() as any[]
    if (data && data.length > 0) post = data[0]
  } catch {}

  if (!post) {
    // Not found - pass through to SPA
    return env.ASSETS.fetch(request)
  }

  const title = `${post.title} — The Muslim Company Blog`
  const description = post.excerpt?.slice(0, 160) || 'Read this article on The Muslim Company Blog.'
  const image = post.image_url || 'https://www.themuslim.company/og-image.png'
  const url = `https://www.themuslim.company/blog/${slug}`

  if (isCrawler) {
    // Return HTML with proper OG tags for crawlers
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="article" />
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
  <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>
  <p>Redirecting to <a href="${url}">${title}</a></p>
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    })
  }

  // For regular users, serve the SPA
  return env.ASSETS.fetch(request)
}
