import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      variants={fadeIn}
      onClick={() => { window.location.href = `/blog/${post.slug}`; }}
      className="block bg-card border border-primary/10 hover:border-secondary/40 transition-colors group overflow-hidden cursor-pointer"
    >
      {post.image_url && (
        <div className="h-48 overflow-hidden">
          <img src={post.image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <a
            href={`/blog/category/${encodeURIComponent(post.category)}`}
            onClick={(e) => e.stopPropagation()}
            className="font-sans text-[10px] tracking-widest uppercase text-secondary border border-secondary/30 px-2 py-0.5 hover:bg-secondary/10 transition-colors"
          >
            {post.category}
          </a>
          <span className="font-sans text-[10px] text-primary/40 flex items-center gap-1">
            <Calendar className="w-3 h-3" />{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="font-sans text-[10px] text-primary/40 flex items-center gap-1">
            <Clock className="w-3 h-3" />{post.reading_time} min read
          </span>
        </div>
        <h3 className="font-serif text-xl text-primary group-hover:text-secondary transition-colors leading-snug mb-2">{post.title}</h3>
        {post.excerpt && <p className="font-sans text-sm text-primary/55 leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>}
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs text-primary/40">{post.author}</span>
          <span className="flex items-center gap-1.5 font-sans text-xs tracking-widest uppercase text-secondary">
            Read More <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Blog({ params }: { params?: { category?: string } }) {
  const urlCategory = params?.category ? decodeURIComponent(params.category) : null;

  useEffect(() => {
    const catLabel = urlCategory ? ` — ${urlCategory}` : "";
    document.title = `Blog & Insights${catLabel} — The Muslim Company`;

    // Organization Schema — consistent across all pages
    document.querySelectorAll('script[data-org-schema]').forEach(el => el.remove());
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.themuslim.company/#organization",
      "name": "The Muslim Company",
      "legalName": "The Muslim Company LTD",
      "url": "https://www.themuslim.company",
      "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 },
      "foundingDate": "2025-01-09",
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": 10 },
      "address": { "@type": "PostalAddress", "streetAddress": "Niketon Bazaar", "addressLocality": "Dhaka", "postalCode": "1212", "addressCountry": "BD" },
      "sameAs": ["https://www.facebook.com/TheMuslimCompany", "https://www.instagram.com/officialTheMuslimCompany", "https://www.youtube.com/@TheMuslimCompany", "https://www.linkedin.com/company/themuslimcompany", "https://x.com/officialtmchq", "https://www.crunchbase.com/organization/the-muslim-company"]
    };
    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.setAttribute("data-org-schema", "true");
    orgScript.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgScript);
    const canonicalUrl = urlCategory ? `https://www.themuslim.company/blog/category/${encodeURIComponent(urlCategory)}` : 'https://www.themuslim.company/blog';
    const description = urlCategory
      ? `Articles in "${urlCategory}" — insights and thought leadership from The Muslim Company.`
      : "Insights, thought leadership, and articles from The Muslim Company — covering Islamic business, ethical innovation, and civilization-focused leadership.";
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', description);
    const _ogt_d = document.querySelector('meta[property="og:description"]');
    if (_ogt_d) _ogt_d.setAttribute('content', description);
    const _can = document.querySelector('link[rel="canonical"]');
    if (_can) { _can.setAttribute('href', canonicalUrl); } else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = canonicalUrl; document.head.appendChild(_cl); }
    const _ogu_c = document.querySelector('meta[property="og:url"]');
    if (_ogu_c) _ogu_c.setAttribute('content', canonicalUrl);
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', urlCategory ? `${urlCategory} Articles — The Muslim Company Blog` : "Read the latest insights, thought leadership, and in-depth articles from The Muslim Company — covering Islamic business, ethical innovation, and civilization-focused leadership.");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', description);
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) { _ogi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _il = document.createElement('meta'); _il.setAttribute('property', 'og:image'); _il.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_il); }
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) { _twi.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); }
    else { const _tl = document.createElement('meta'); _tl.setAttribute('name', 'twitter:image'); _tl.setAttribute('content', 'https://www.themuslim.company/opengraph.jpg'); document.head.appendChild(_tl); }
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', canonicalUrl);

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const breadcrumbItems = [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"},
      {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.themuslim.company/blog"},
    ];
    if (urlCategory) breadcrumbItems.push({"@type": "ListItem", "position": 3, "name": urlCategory, "item": canonicalUrl});
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": breadcrumbItems}, {"@context": "https://schema.org", "@type": "Blog", "name": urlCategory ? `The Muslim Company Blog — ${urlCategory}` : "The Muslim Company Blog", "description": description, "url": canonicalUrl, "publisher": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}}].forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-page-schema', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });
    return () => { document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove()); };
  }, [urlCategory]);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(urlCategory || "All");

  useEffect(() => { setCat(urlCategory || "All"); }, [urlCategory]);

  useEffect(() => {
    api.get("/blog").then((data) => setPosts(data as BlogPost[])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function handleCategoryChange(value: string) {
    setCat(value);
    window.location.href = value === "All" ? "/blog" : `/blog/category/${encodeURIComponent(value)}`;
  }

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || p.category === cat;
    return matchSearch && matchCat;
  });

  // Only show categories that actually have at least one published post
  const availableCategories = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Insights & Ideas</p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-4">
              {urlCategory ? urlCategory : "The TMC Blog"}
            </h1>
            <p className="font-sans text-sm text-primary-foreground/55 max-w-2xl">
              {urlCategory
                ? `All articles in "${urlCategory}".`
                : "Thoughts on ethics, technology, Islamic civilization, business, and the future of humanity — written with purpose."}
            </p>
            {urlCategory && (
              <a href="/blog" className="inline-block mt-4 font-sans text-xs tracking-widest uppercase text-secondary hover:underline">
                ← All Articles
              </a>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-6 lg:px-12 bg-background border-b border-primary/10">
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 h-11 bg-background border border-primary/15 font-sans text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary"
            />
          </div>
          <div className="relative sm:w-56">
            <select
              value={cat}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full h-11 px-4 bg-background border border-primary/15 font-sans text-[11px] tracking-widest uppercase text-primary/70 focus:outline-none focus:border-secondary appearance-none cursor-pointer"
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-background min-h-[40vh]">
        <div className="container mx-auto max-w-5xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-72 bg-primary/5 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-10 h-10 text-secondary/40 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-primary mb-3">No Articles Yet</h3>
              <p className="font-sans text-sm text-primary/50">{posts.length === 0 ? "No blog posts published yet." : "No results match your search."}</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((p) => <BlogCard key={p.id} post={p} />)}
            </motion.div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
