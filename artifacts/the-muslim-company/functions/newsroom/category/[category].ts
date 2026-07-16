function escapeHtml(s: string) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function onRequestGet(context: any) {
  const { request, env, params } = context
  const category = decodeURIComponent(params.category as string)
  const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL
  const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY

  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (!isCrawler) return env.ASSETS.fetch(request)

  let posts: any[] = []
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/newsroom_posts?category=eq.${encodeURIComponent(category)}&published=eq.true&select=title,slug,excerpt,created_at&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    if (res.ok) posts = await res.json()
  } catch {
    posts = []
  }

  const desc = `${category} news and press releases from The Muslim Company.`
  const url = `https://www.themuslim.company/newsroom/category/${encodeURIComponent(category)}`

  const postsHtml = posts.map(p => `
    <article>
      <h2><a href="https://www.themuslim.company/newsroom/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2>
      ${p.excerpt ? `<p>${escapeHtml(p.excerpt)}</p>` : ''}
    </article>`).join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(category)} — Newsroom — The Muslim Company</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(category)} — Newsroom — The Muslim Company" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="The Muslim Company" />
  <link rel="canonical" href="${url}" />
</head>
<body>
  <h1>${escapeHtml(category)}</h1>
  <p>${escapeHtml(desc)}</p>
  ${postsHtml}
</body>
</html>`
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=1800' }
  })
}
