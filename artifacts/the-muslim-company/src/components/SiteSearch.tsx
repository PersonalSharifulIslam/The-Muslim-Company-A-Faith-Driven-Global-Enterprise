import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { SITE_SEARCH_INDEX } from "@/lib/site-search-index";

export default function SiteSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SITE_SEARCH_INDEX.slice(0, 8);
    return SITE_SEARCH_INDEX.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.keywords?.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-primary/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[8vh] left-1/2 -translate-x-1/2 z-[201] w-[92vw] max-w-xl bg-background border border-secondary/30 shadow-2xl"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-primary/10">
              <Search className="w-5 h-5 text-secondary flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the site — pages, careers, sectors..."
                className="flex-1 bg-transparent font-sans text-sm text-primary placeholder:text-primary/35 focus:outline-none"
              />
              <button onClick={onClose} aria-label="Close search" className="text-primary/40 hover:text-primary transition-colors flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <p className="px-5 py-8 text-center font-sans text-sm text-primary/40">No pages match "{query}"</p>
              ) : (
                <div className="py-2">
                  {results.map((r) => (
                    <a
                      key={r.href}
                      href={r.href}
                      onClick={onClose}
                      className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-card transition-colors group"
                    >
                      <div>
                        <p className="font-serif text-base text-primary group-hover:text-secondary transition-colors">{r.title}</p>
                        <p className="font-sans text-[10px] tracking-widest uppercase text-primary/35 mt-0.5">{r.category}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary/20 group-hover:text-secondary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 py-2.5 border-t border-primary/10 bg-card/50">
              <p className="font-sans text-[10px] text-primary/35">Press <kbd className="px-1 py-0.5 bg-primary/5 border border-primary/15 rounded text-[9px]">Esc</kbd> to close</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
