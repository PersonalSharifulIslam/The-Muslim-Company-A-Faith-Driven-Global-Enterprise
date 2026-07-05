import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import ShareButtons from "@/components/ShareButtons";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function BlogDetail({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blog/${params.slug}`)
      .then((data) => setPost(data as BlogPost))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.slug]);

  useEffect(() => {
    if (loading || post) return;
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) _rob.setAttribute('content', 'noindex, nofollow');
    else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'noindex, nofollow'; document.head.appendChild(_rl); }
  }, [loading, post]);

  useEffect(() => {
    if (!post) return;
    const pageUrl = `https://www.themuslim.company/blog/${params.slug}`;
    const ogImage = post.image_url || "https://www.themuslim.company/og-image.png";
    const desc = post.excerpt || post.title;

    document.title = `${post.title} — The Muslim Company Blog`;
    // Article Schema for Google Rich Results
    document.querySelectorAll('script[data-article-schema]').forEach(el => el.remove());
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt || post.summary || "",
      "datePublished": post.created_at || post.published_at || new Date().toISOString(),
      "dateModified": post.updated_at || post.created_at || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": post.author || "The Muslim Company",
        "url": "https://www.themuslim.company/founder"
      },
      "publisher": {
        "@type": "Organization",
        "name": "The Muslim Company",
        "url": "https://www.themuslim.company",
        "logo": {
          "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.themuslim.company/blog/" + post.slug,
        "name": post.title
      },
      "url": "https://www.themuslim.company/blog/" + post.slug,
      "image": post.image || "https://www.themuslim.company/opengraph.jpg",
      "keywords": post.tags ? post.tags.join(", ") : "The Muslim Company, Islamic Business"
    };
    const articleScript = document.createElement("script");
    articleScript.type = "application/ld+json";
    articleScript.setAttribute("data-article-schema", "true");
    articleScript.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(articleScript);

    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) _rob.setAttribute('content', 'index, follow');
    else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }

    // Meta description
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', desc);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', pageUrl);

    // OG tags
    const ogTags: Record<string, string> = {
      'og:title': `${post.title} — The Muslim Company`,
      'og:description': desc,
      'og:url': pageUrl,
      'og:image': ogImage,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:type': 'article',
      'article:author': post.author || 'The Muslim Company',
      'article:published_time': post.created_at,
    };
    Object.entries(ogTags).forEach(([prop, val]) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.setAttribute('content', val);
    });

    // Twitter
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

    // Schemas
    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const schemas = [
      { "@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.themuslim.company/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": pageUrl }
        ]
      },
      { "@context": "https://schema.org", "@type": "BlogPosting",
        "headline": post.title, "description": desc,
        "image": ogImage,
        "url": pageUrl,
        "datePublished": post.created_at,
        "author": { "@type": "Person", "name": post.author || "The Muslim Company", "url": "https://sharifulislam.engineer" },
        "publisher": { "@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company", "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 } },
        "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl }
      },
      ...(post.excerpt ? [{ "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{ "@type": "Question", "name": `What is this article about?`,
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
          <Link href="/blog" className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-primary/65 hover:text-secondary transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
          </Link>

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
                <span className="font-sans text-xs tracking-widest uppercase text-secondary border border-secondary/30 px-2 py-0.5">{post.category}</span>
                <span className="font-sans text-xs text-primary/65 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="font-sans text-xs text-primary/65 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{post.reading_time} min read
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-primary leading-tight mb-4">{post.title}</h1>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-primary/10">
                <p className="font-sans text-xs text-primary/65">By {post.author}</p>
                <ShareButtons url={`https://www.themuslim.company/blog/${params.slug}`} title={post.title} />
              </div>
              {post.image_url && (
                <div className="mb-8 overflow-hidden">
                  <img src={post.image_url} alt={post.title} loading="lazy" className="w-full h-72 object-cover" />
                </div>
              )}
              {post.excerpt && (
                <p className="font-sans text-base text-primary/70 leading-relaxed mb-8 italic border-l-4 border-secondary pl-5">{post.excerpt}</p>
              )}
              <div className="font-sans text-sm text-primary/70 leading-relaxed whitespace-pre-line space-y-4">
                {post.content}
              </div>
              <div className="mt-10 pt-8 border-t border-primary/10">
                <ShareButtons url={`https://www.themuslim.company/blog/${params.slug}`} title={post.title} />
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
