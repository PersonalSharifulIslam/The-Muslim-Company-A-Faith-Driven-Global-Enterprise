export async function onRequestGet(context: any) {
  const { env } = context
  const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL
  const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY
  const BASE = 'https://www.themuslim.company'

  async function fetchTable(table: string, select: string) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?${select}&order=created_at.desc&limit=50`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      )
      if (!res.ok) return []
      return res.json() as Promise<any[]>
    } catch {
      return []
    }
  }

  const [blogs, news] = await Promise.all([
    fetchTable('blog_posts', 'select=title,slug,excerpt,author,created_at&published=eq.true'),
    fetchTable('newsroom_posts', 'select=title,slug,excerpt,created_at&published=eq.true'),
  ])

  function escapeXml(s: string) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
  }

  const blogItems = blogs.map((b: any) => `  <item>
    <title>${escapeXml(b.title)}</title>
    <link>${BASE}/blog/${b.slug}</link>
    <guid isPermaLink="true">${BASE}/blog/${b.slug}</guid>
    <description>${escapeXml(b.excerpt || '')}</description>
    ${b.author ? `<author>${escapeXml(b.author)}</author>` : ''}
    <category>Blog</category>
    <pubDate>${new Date(b.created_at).toUTCString()}</pubDate>
  </item>`).join('\n')

  const newsItems = news.map((n: any) => `  <item>
    <title>${escapeXml(n.title)}</title>
    <link>${BASE}/newsroom/${n.slug}</link>
    <guid isPermaLink="true">${BASE}/newsroom/${n.slug}</guid>
    <description>${escapeXml(n.excerpt || '')}</description>
    <category>Newsroom</category>
    <pubDate>${new Date(n.created_at).toUTCString()}</pubDate>
  </item>`).join('\n')

  const allItems = [blogItems, newsItems].filter(Boolean).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>The Muslim Company — Blog &amp; Newsroom</title>
  <link>${BASE}</link>
  <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
  <description>Latest blog posts and press releases from The Muslim Company — a faith-driven global conglomerate.</description>
  <language>en</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${allItems}
</channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800'
    }
  })
}
