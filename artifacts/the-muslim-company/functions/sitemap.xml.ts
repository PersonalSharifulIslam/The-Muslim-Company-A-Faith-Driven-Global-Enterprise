export async function onRequestGet(context: any) {
  const { env } = context
  const SUPABASE_URL  = env.VITE_SUPABASE_URL  || env.SUPABASE_URL
  const SUPABASE_KEY  = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY
  const BASE          = 'https://www.themuslim.company'

  async function fetchTable(table: string, select: string) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?${select}&order=created_at.desc`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
      )
      if (!res.ok) return []
      return res.json() as Promise<any[]>
    } catch {
      return []
    }
  }

  const [jobs, blogs, news, notices] = await Promise.all([
    fetchTable('jobs',           'select=slug,created_at&status=eq.active'),
    fetchTable('blog_posts',     'select=slug,created_at&published=eq.true'),
    fetchTable('newsroom_posts', 'select=slug,created_at&published=eq.true'),
    fetchTable('notices',        'select=id,created_at'),
  ])

  function url(loc: string, changefreq: string, priority: string, lastmod?: string) {
    return `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod.split('T')[0]}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  }

  const now = new Date().toISOString().split('T')[0]

  const SECTORS = [
    "agriculture-food", "education-research", "technology-ai", "healthcare-medicine",
    "construction-housing", "renewable-energy", "media-journalism", "software-cybersecurity",
    "manufacturing-industry", "islamic-finance-fintech", "transportation-logistics",
    "e-commerce", "literature-publishing", "philosophy-civilization-studies",
    "scientific-research", "social-welfare-humanitarian-work", "environmental-protection",
    "robotics-automation", "international-trade", "community-development",
    "retail-business", "fashion-apparel", "lifestyle-personal-care"
  ]

  const staticUrls = [
    url(`${BASE}/`,                   'daily',   '1.0', now),
    url(`${BASE}/careers`,            'weekly',  '0.9', now),
    url(`${BASE}/newsroom`,           'weekly',  '0.8', now),
    url(`${BASE}/blog`,               'weekly',  '0.8', now),
    url(`${BASE}/notices`,            'weekly',  '0.7', now),
    url(`${BASE}/recruitment-status`, 'monthly', '0.6'),
    url(`${BASE}/contact`,             'monthly', '0.7', now),
    url(`${BASE}/privacy-policy`,     'yearly',  '0.3'),
    url(`${BASE}/terms-of-service`,   'yearly',  '0.3'),
  ].join('\n')

  const sectorUrls = SECTORS.map(slug =>
    url(`${BASE}/sectors/${slug}`, 'monthly', '0.7', now)
  ).join('\n')

  const jobUrls = jobs.map((j: any) =>
    url(`${BASE}/careers/${j.slug}`, 'weekly', '0.8', j.created_at)
  ).join('\n')

  const blogUrls = blogs.map((b: any) =>
    url(`${BASE}/blog/${b.slug}`, 'weekly', '0.7', b.created_at)
  ).join('\n')

  const newsUrls = news.map((n: any) =>
    url(`${BASE}/newsroom/${n.slug}`, 'weekly', '0.7', n.created_at)
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${sectorUrls}
${jobUrls}
${blogUrls}
${newsUrls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}
