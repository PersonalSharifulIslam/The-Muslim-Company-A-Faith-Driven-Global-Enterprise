// Map of old/legacy slugs to their corrected canonical slugs.
// Add an entry here whenever a published blog slug is changed,
// so old shared links / indexed URLs 301-redirect instead of 404ing.
const SLUG_REDIRECTS: Record<string, string> = {
  'digital-twin-earth-the-ai-civilization-model-that-could-predict-the-future-by-2040-1779284040790':
    'digital-twin-earth-the-ai-civilization-model-that-could-predict-the-future-by-2040',
  'the-future-of-ethical-business-how-the-muslim-company-is-redefining-modern-entrepreneurship-in-2026-1779282794815':
    'the-future-of-ethical-business-how-the-muslim-company-is-redefining-modern-entrepreneurship-in-2026',
  'the-future-of-green-energy-how-smart-energy-transfer-systems-could-transform-the-world-in-2030-1779283745042':
    'the-future-of-green-energy-how-smart-energy-transfer-systems-could-transform-the-world-in-2030',
  'the-man-who-was-damascus-s-wealthiest-merchant-then-changed-the-course-of-history-1779449001405':
    'the-man-who-was-damascus-s-wealthiest-merchant-then-changed-the-course-of-history',
  'the-future-world-needs-spiritual-intelligence-why-humanity-may-return-to-ethical-values-1779331468021':
    'the-future-world-needs-spiritual-intelligence-why-humanity-may-return-to-ethical-values',
  'the-rise-of-ethical-entrepreneurship-in-the-digital-age-1781331350434':
    'the-rise-of-ethical-entrepreneurship-in-the-digital-age',
  'navigating-a-multipolar-world-opportunities-risks-and-the-future-of-global-cooperation-1781350615399':
    'navigating-a-multipolar-world-opportunities-risks-and-the-future-of-global-cooperation',
}

import { serveDynamicSEO } from "../_shared/serve-dynamic-seo";

export async function onRequestGet(context: any) {
  const { params } = context
  const slug = params.slug as string

  // 301 redirect legacy slugs to their new canonical URL
  if (SLUG_REDIRECTS[slug]) {
    return Response.redirect(`https://www.themuslim.company/blog/${SLUG_REDIRECTS[slug]}`, 301)
  }

  return serveDynamicSEO(context, "blog_posts", slug, "/blog", "The Muslim Company Blog")
}
