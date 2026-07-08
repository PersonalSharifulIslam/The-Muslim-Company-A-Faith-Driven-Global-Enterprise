// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// Submit this URL directly in Merchant Center: Products > Feeds > Add feed >
// Scheduled fetch, using https://www.themuslim.company/merchant-feed.xml
//
// Notes:
// - Only products with active=true AND a non-null price are included —
//   Merchant Center requires a fixed numeric price per item; "price on
//   request" products can't be represented and are skipped.
// - availability is always "preorder" since this storefront has no live
//   checkout, only pre-order requests confirmed manually afterward.
// - identifier_exists is set to "no" since products don't carry a GTIN/MPN —
//   omitting this would cause Merchant Center to flag missing identifiers.

function escapeXml(s: string) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function onRequestGet(context: any) {
  const { env } = context
  const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL
  const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY
  const BASE = 'https://www.themuslim.company'

  let products: any[] = []
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/store_products?select=id,name,slug,description,price,currency,image_url,category&active=eq.true&price=not.is.null&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )
    if (res.ok) products = await res.json()
  } catch {
    products = []
  }

  const items = products.map((p) => {
    const link = `${BASE}/e-store#${p.slug}`
    const description = p.description || `${p.name} — available for pre-order from The Muslim Company.`
    return `    <item>
      <g:id>${escapeXml(String(p.id))}</g:id>
      <title>${escapeXml(p.name)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(link)}</link>
      ${p.image_url ? `<g:image_link>${escapeXml(p.image_url)}</g:image_link>` : ''}
      <g:availability>preorder</g:availability>
      <g:price>${Number(p.price).toFixed(2)} ${escapeXml(p.currency || 'BDT')}</g:price>
      <g:brand>The Muslim Company</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      ${p.category ? `<g:product_type>${escapeXml(p.category)}</g:product_type>` : ''}
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>The Muslim Company — E-Store</title>
    <link>${BASE}/e-store</link>
    <description>Pre-order products from The Muslim Company</description>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
