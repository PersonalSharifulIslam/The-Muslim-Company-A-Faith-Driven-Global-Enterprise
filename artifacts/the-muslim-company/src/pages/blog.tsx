import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { supabase, isSupabaseConfigured, type BlogPost } from "@/lib/supabase";

const CATEGORIES = ["All", "Technology", "Ethics", "Islamic Civilization", "Business", "Education", "Global Affairs"];
const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.a variants={fadeIn} href={`/blog/${post.slug}`} className="block bg-card border border-primary/10 hover:border-secondary/40 transition-colors group overflow-hidden">
      {post.image_url && (
        <div className="h-48 overflow-hidden">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="font-sans text-[10px] tracking-widest uppercase text-secondary border border-secondary/30 px-2 py-0.5">{post.category}</span>
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
    </motion.a>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setPosts(data as BlogPost[]);
      setLoading(false);
    });
  }, []);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || p.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Insights & Ideas</p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-4">The TMC Blog</h1>
            <p className="font-sans text-sm text-primary-foreground/55 max-w-2xl">
              Thoughts on ethics, technology, Islamic civilization, business, and the future of humanity — written with purpose.
            </p>
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
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 font-sans text-[10px] tracking-widest uppercase border transition-colors ${cat === c ? "bg-secondary text-primary border-secondary" : "border-primary/15 text-primary/50 hover:border-secondary/50"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-background min-h-[40vh]">
        <div className="container mx-auto max-w-5xl">
          {!isSupabaseConfigured ? (
            <div className="text-center py-20">
              <BookOpen className="w-10 h-10 text-secondary/40 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-primary mb-3">Setup Required</h3>
              <p className="font-sans text-sm text-primary/50 max-w-md mx-auto">Connect Supabase to manage and display blog posts.</p>
            </div>
          ) : loading ? (
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
