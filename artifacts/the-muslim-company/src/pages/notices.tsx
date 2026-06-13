import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Bell, FileText, Download, ExternalLink, Pin } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { api } from "@/lib/api";
import type { Notice } from "@/lib/supabase";

const CATEGORIES = ["All", "General Notice", "Important", "Circular", "Recruitment", "Event", "Announcement"];
const YEARS = ["All", "2026", "2025", "2024", "2023"];
const PER_PAGE = 10;

const fadeIn = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Notices() {
  useEffect(() => {
    document.title = "Notices & Events — The Muslim Company";
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "Official notices, announcements, and upcoming events from The Muslim Company. Stay informed on corporate updates, policy changes, and organizational milestones.");
    const _ogt_d = document.querySelector('meta[property="og:description"]');
    if (_ogt_d) _ogt_d.setAttribute('content', "Official notices, announcements, and upcoming events from The Muslim Company. Stay informed on corporate updates, policy changes, and organizational milestones.");
    const _can = document.querySelector('link[rel="canonical"]');
    if (_can) { _can.setAttribute('href', 'https://www.themuslim.company/notices'); } else { const _cl = document.createElement('link'); _cl.rel = 'canonical'; _cl.href = 'https://www.themuslim.company/notices'; document.head.appendChild(_cl); }
    const _ogu_c = document.querySelector('meta[property="og:url"]');
    if (_ogu_c) _ogu_c.setAttribute('content', 'https://www.themuslim.company/notices');
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) { _rob.setAttribute('content', 'index, follow'); } else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'index, follow'; document.head.appendChild(_rl); }
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "Notices & Events — The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "Official notices, announcements, and upcoming events from The Muslim Company.");
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) _ogi.setAttribute('content', 'https://www.themuslim.company/og-notices.png');
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) _twi.setAttribute('content', 'https://www.themuslim.company/og-notices.png');
        const _ogu = document.querySelector('meta[property="og:url"]');
        if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/notices");

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"}, {"@type": "ListItem", "position": 2, "name": "Notices & Events", "item": "https://www.themuslim.company/notices"}]}, {"@context": "https://schema.org", "@type": "WebPage", "name": "Notices & Events \u2014 The Muslim Company", "description": "Official notices, announcements, and upcoming events from The Muslim Company.", "url": "https://www.themuslim.company/notices", "publisher": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}}].forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-page-schema', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });
    return () => { document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove()); };
  }, []);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [year, setYear] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get("/notices").then((data) => setNotices(data as Notice[])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = notices.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || n.category === cat;
    const matchYear = year === "All" || new Date(n.created_at).getFullYear().toString() === year;
    return matchSearch && matchCat && matchYear;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Official</p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-4">Notice & Event</h1>
            <p className="font-sans text-sm text-primary-foreground/55 max-w-2xl">
              Official notices, circulars, announcements, and upcoming events from The Muslim Company.
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
              placeholder="Search notices..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 h-11 bg-background border border-primary/15 font-sans text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary"
            />
          </div>
          <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} className="h-11 px-4 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }} className="h-11 px-4 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-12 bg-background min-h-[40vh]">
        <div className="container mx-auto max-w-5xl">
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-primary/5 animate-pulse" />)}</div>
          ) : paged.length === 0 ? (
            <div className="text-center py-20">
              <Bell className="w-10 h-10 text-secondary/40 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-primary mb-3">No Notices Found</h3>
              <p className="font-sans text-sm text-primary/50">{notices.length === 0 ? "No notices published yet." : "No results match your search."}</p>
            </div>
          ) : (
            <>
              <div className="border border-primary/10 overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4 w-12">No.</th>
                      <th className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4 w-32">Date</th>
                      <th className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4">Title</th>
                      <th className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4 w-28">Category</th>
                      <th className="text-center font-sans text-[10px] tracking-widest uppercase px-5 py-4 w-32">PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((notice, idx) => (
                      <motion.tr
                        key={notice.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`border-t border-primary/8 hover:bg-secondary/5 transition-colors ${notice.pinned ? "bg-secondary/5" : ""}`}
                      >
                        <td className="px-5 py-4 font-sans text-sm text-primary/40">{(page - 1) * PER_PAGE + idx + 1}</td>
                        <td className="px-5 py-4 font-sans text-xs text-primary/55 whitespace-nowrap">
                          {new Date(notice.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {notice.pinned && <Pin className="w-3 h-3 text-secondary flex-shrink-0" />}
                            {notice.important && <span className="font-sans text-[9px] tracking-widest uppercase bg-red-400/10 text-red-400 border border-red-400/20 px-2 py-0.5">Important</span>}
                            <span className="font-sans text-sm text-primary">{notice.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-sans text-[10px] tracking-wide text-primary/50 border border-primary/10 px-2 py-0.5 whitespace-nowrap">{notice.category}</span>
                        </td>
                        <td className="px-5 py-4">
                          {notice.pdf_url ? (
                            <div className="flex items-center justify-center gap-3">
                              <a href={notice.pdf_url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary/70 transition-colors" title="View PDF">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <a href={notice.pdf_url} download className="text-primary/50 hover:text-secondary transition-colors" title="Download PDF">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          ) : (
                            <div className="flex justify-center"><FileText className="w-4 h-4 text-primary/20" /></div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 font-sans text-xs border transition-colors ${page === i + 1 ? "bg-secondary text-primary border-secondary" : "border-primary/15 text-primary/50 hover:border-secondary/50"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
