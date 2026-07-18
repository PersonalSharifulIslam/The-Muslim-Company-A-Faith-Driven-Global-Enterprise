function escapeHtml(s: string) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function onRequestGet(context: any) {
  const { request, env } = context
  const ua = request.headers.get('user-agent') || ''
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Googlebot|bingbot|DuckDuckBot|GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Google-Extended|Bytespider|Applebot|Amazonbot|Meta-ExternalAgent/i.test(ua)

  if (isCrawler) {
    const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL
    const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY
    let products: any[] = []
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/store_products?select=name,slug,description,price,currency,category,image_url&active=eq.true&order=created_at.desc`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      )
      if (res.ok) products = await res.json()
    } catch {
      products = []
    }

    const desc = "Browse and pre-order products from The Muslim Company's official online store. Submit a pre-order request and our team will confirm availability and delivery."

    const productsHtml = products.map((p) => `
      <article id="${escapeHtml(p.slug)}">
        <h2>${escapeHtml(p.name)}</h2>
        ${p.category ? `<p>Category: ${escapeHtml(p.category)}</p>` : ''}
        <p>${escapeHtml(p.description || `${p.name} — available for pre-order from The Muslim Company.`)}</p>
        <p>${p.price != null ? `Price: ${escapeHtml(p.currency || 'BDT')} ${p.price}` : 'Price on request'}</p>
      </article>`).join('\n')

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": products.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "url": `https://www.themuslim.company/e-store#${p.slug}`,
          "description": p.description || `${p.name} — available for pre-order from The Muslim Company.`,
          "image": p.image_url || "https://www.themuslim.company/opengraph.jpg",
          "brand": { "@type": "Brand", "name": "The Muslim Company" },
          ...(p.price != null ? {
            offers: {
              "@type": "Offer",
              "priceCurrency": p.currency || "BDT",
              "price": p.price,
              "availability": "https://schema.org/PreOrder",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "50",
                  "currency": "BDT"
                },
                "shippingDestination": {
                  "@type": "DefinedRegion",
                  "addressCountry": "BD"
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3,
                    "unitCode": "DAY"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 2,
                    "maxValue": 7,
                    "unitCode": "DAY"
                  }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 7,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/ReturnShippingFees",
                "returnShippingFeesAmount": {
                  "@type": "MonetaryAmount",
                  "value": "50",
                  "currency": "BDT"
                }
              },
            }
          } : {}),
        },
      })),
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>E-Store — Pre-Order Products | The Muslim Company</title>
  <meta name="description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="E-Store — Pre-Order Products | The Muslim Company" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="https://www.themuslim.company/opengraph.jpg" />
  <meta property="og:url" content="https://www.themuslim.company/e-store" />
  <meta property="og:site_name" content="The Muslim Company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="E-Store — Pre-Order Products | The Muslim Company" />
  <meta name="twitter:description" content="${desc}" />
  <link rel="canonical" href="https://www.themuslim.company/e-store" />
  <script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>
</head>
<body>
  <h1>Pre-Order Our Products</h1>
  <p>${desc}</p>
  ${productsHtml}
</body>
</html>`
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=1800' }
    })
  }
  return env.ASSETS.fetch(request)
}
