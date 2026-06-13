import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { api } from "@/lib/api";
import type { NewsPost } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function NewsDetail({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/newsroom/${params.slug}`)
      .then((data) => setPost(data as NewsPost))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.slug]);

  useEffect(() => {
    if (!post) return;
    const pageUrl = `https://www.themuslim.company/newsroom/${params.slug}`;
    const ogImage = post.image_url || post.thumbnail || "https://www.themuslim.company/og-image.png";
    const desc = post.excerpt || post.title;

    document.title = `${post.title} — The Muslim Company Newsroom`;
    // NewsArticle Schema for Google News
    document.querySelectorAll('script[data-news-schema]').forEach(el => el.remove());
    const newsArticleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": post.title,
      "description": post.excerpt || post.summary || post.title,
      "datePublished": post.created_at || post.published_at || new Date().toISOString(),
      "dateModified": post.updated_at || post.created_at || new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "The Muslim Company",
        "url": "https://www.themuslim.company"
      },
      "publisher": {
        "@type": "Organization",
        "name": "The Muslim Company",
        "url": "https://www.themuslim.company",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.themuslim.company/favicon.png",
          "width": 512,
          "height": 512
        }
      },
      "image": {
        "@type": "ImageObject",
        "url": post.image || "https://www.themuslim.company/opengraph.jpg",
        "width": 1200,
        "height": 630
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.themuslim.company/newsroom/" + post.slug
      },
      "url": "https://www.themuslim.company/newsroom/" + post.slug,
      "articleSection": "Corporate News",
      "keywords": "The Muslim Company, Islamic Business, Corporate News, Bangladesh"
    };
    const newsScript = document.createElement("script");
    newsScript.type = "application/ld+json";
    newsScript.setAttribute("data-news-schema", "true");
    newsScript.textContent = JSON.stringify(newsArticleSchema);
    document.head.appendChild(newsScript);

    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) _rob.setAttribute('content', 'index, follow');
    else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }

    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', pageUrl);

    const ogTags: Record<string, string> = {
      'og:title': `${post.title} — The Muslim Company`,
      'og:description': desc,
      'og:url': pageUrl,
      'og:image': ogImage,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:type': 'article',
      'article:published_time': post.created_at,
    };
    Object.entries(ogTags).forEach(([prop, val]) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.setAttribute('content', val);
    });

    const twTags: Record<string, string> = {
      'twitter:title': `${post.title} — The Muslim Company`,
      'twitter:description': desc,
      'twitter:image': ogImage,
      'twitter:card': 'summary_large_image',
    };
    Object.entries(twTags).forEach(([name, val]) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', val);
    });

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const schemas = [
      { "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "Newsroom", "item": "https://www.themuslim.company/newsroom" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": pageUrl }
        ]
      },
      { "@context": "https://schema.org", "@type": "NewsArticle",
        "headline": post.title, "description": desc,
        "image": ogImage, "url": pageUrl,
        "datePublished": post.created_at,
        "publisher": { "@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company", "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png" } },
        "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl }
      },
      ...(post.excerpt ? [{ "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{ "@type": "Question", "name": "What is this news about?",
          "acceptedAnswer": { "@type": "Answer", "text": post.excerpt } }]
      }] : [])
    ];
    schemas.forEach(schema => {
      const s = document.createElement('script'); s.type = 'application/ld+json';
      s.setAttribute('data-page-schema', 'true'); s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });
    return () => {
      document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
      const c = document.querySelector('link[rel="canonical"]');
      if (c) c.setAttribute('href', 'https://www.themuslim.company/');
    };
  }, [post, params.slug]);

  return (
    <SiteLayout>
      <div className="py-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
          <a href="/newsroom" className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-primary/50 hover:text-secondary transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Newsroom
          </a>

          {loading ? (
            <div className="space-y-4">
              <div className="h-8 bg-primary/5 animate-pulse w-3/4" />
              <div className="h-64 bg-primary/5 animate-pulse" />
            </div>
          ) : !post ? (
            <div className="text-center py-20">
              <h3 className="font-serif text-2xl text-primary">Article Not Found</h3>
            </div>
          ) : (
            <motion.article initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="font-sans text-[10px] tracking-widest uppercase text-secondary border border-secondary/30 px-2 py-0.5">{post.category}</span>
                <span className="font-sans text-[10px] text-primary/40 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-primary leading-tight mb-6">{post.title}</h1>
              {post.image_url && (
                <div className="mb-8 overflow-hidden">
                  <img src={post.image_url} alt={post.title} className="w-full h-72 object-cover" />
                </div>
              )}
              {post.excerpt && (
                <p className="font-sans text-base text-primary/70 leading-relaxed mb-8 pb-8 border-b border-primary/10 italic">{post.excerpt}</p>
              )}
              <div className="prose prose-sm max-w-none font-sans text-primary/70 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
