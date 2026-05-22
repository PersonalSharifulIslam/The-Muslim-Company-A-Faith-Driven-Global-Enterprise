export async function onRequestGet(context: any) {
  const { env } = context
  const SUPABASE_URL  = env.VITE_SUPABASE_URL  || env.SUPABASE_URL
  const SUPABASE_KEY  = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY
  const BASE          = 'https://www.themuslim.company'

  async function fetchTable(table: string, select: string) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?${select}&order=created_at.desc`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    )
    if (!res.ok) return []
    return res.json() as Promise<any[]>
  }

  const [jobs, blogs, news, notices] = await Promise.all([
    fetchTable('jobs',           'select=slug,created_at&status=eq.active'),
    fetchTable('blog_posts',     'select=slug,created_at&published=eq.true'),
    fetchTable('newsroom_posts', 'select=slug,created_at&published=eq.true'),
    fetchTable('notices',        'select=id,created_at'),
  ])

  function url(loc: string, changefreq: string, priority: string, lastmod?: string) {
    return `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod.split('T')[0]}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  }

  const now = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url(`${BASE}/`,                    'daily',   '1.0', now)}
${url(`${BASE}/mission`,             'monthly', '0.9')}
${url(`${BASE}/vision`,              'monthly', '0.9')}
${url(`${BASE}/founder`,             'monthly', '0.9')}
${url(`${BASE}/careers`,             'weekly',  '0.9', now)}
${url(`${BASE}/newsroom`,            'weekly',  '0.8', now)}
${url(`${BASE}/blog`,                'weekly',  '0.8', now)}
${url(`${BASE}/notices`,             'weekly',  '0.7', now)}
${url(`${BASE}/recruitment-status`,  'monthly', '0.6')}
${url(`${BASE}/privacy-policy`,      'yearly',  '0.5')}
${url(`${BASE}/terms-of-service`,    'yearly',  '0.5')}
${url(`${BASE}/#mission`,            'monthly', '0.5')}
${url(`${BASE}/#vision`,             'monthly', '0.5')}
${url(`${BASE}/#foundation`,         'monthly', '0.5')}
${url(`${BASE}/#sectors`,            'monthly', '0.5')}
${url(`${BASE}/#governance`,         'monthly', '0.5')}
${url(`${BASE}/#people`,             'monthly', '0.5')}
${url(`${BASE}/#environment`,        'monthly', '0.5')}
${url(`${BASE}/#humanitarian`,       'monthly', '0.5')}
${url(`${BASE}/#technology`,         'monthly', '0.5')}
${url(`${BASE}/#constitution`,       'monthly', '0.5')}
${url(`${BASE}/#founder`,            'monthly', '0.5')}
${url(`${BASE}/#contact`,            'monthly', '0.4')}
${jobs.map(j => url(`${BASE}/careers/${j.slug}`, 'weekly', '0.8', j.created_at)).join('')}
${blogs.map(b => url(`${BASE}/blog/${b.slug}`, 'weekly', '0.7', b.created_at)).join('')}
${news.map(n => url(`${BASE}/newsroom/${n.slug}`, 'weekly', '0.7', n.created_at)).join('')}
</urlset>`

  return new Response(xml.trim(), {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
