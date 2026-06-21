import { useState, useEffect, useRef } from "react";
import { Search, X, User, Briefcase, FileText, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

type Result = { type: "employee" | "job" | "application"; id: string | number; title: string; subtitle: string; href: string };

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const [emps, jobs, apps] = await Promise.all([
          supabase.from("employees").select("id, employee_id, name, department, position").ilike("name", `%${query}%`).limit(5),
          supabase.from("jobs").select("id, title, department").ilike("title", `%${query}%`).limit(5),
          supabase.from("applications").select("id, name, job_title").ilike("name", `%${query}%`).limit(5),
        ]);
        const r: Result[] = [
          ...(emps.data || []).map((e: any) => ({ type: "employee" as const, id: e.id, title: e.name, subtitle: `${e.position || ""} · ${e.department || ""}`, href: "/admin/employees" })),
          ...(jobs.data || []).map((j: any) => ({ type: "job" as const, id: j.id, title: j.title, subtitle: j.department, href: "/admin/careers" })),
          ...(apps.data || []).map((a: any) => ({ type: "application" as const, id: a.id, title: a.name, subtitle: `Applied for ${a.job_title || "a role"}`, href: "/admin/applications" })),
        ];
        setResults(r);
      } catch {}
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const ICONS = { employee: User, job: Briefcase, application: FileText };

  return (
    <div ref={boxRef} className="relative flex-1 max-w-sm">
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-primary/30 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search employees, jobs, applications..."
          className="w-full h-9 pl-9 pr-8 bg-card border border-primary/10 font-sans text-xs text-primary focus:outline-none focus:border-secondary rounded"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/30 hover:text-primary">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-primary/10 rounded shadow-xl max-h-80 overflow-y-auto z-50">
          {searching ? (
            <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 text-secondary animate-spin" /></div>
          ) : results.length === 0 ? (
            <p className="p-4 font-sans text-xs text-primary/40 text-center">No results found</p>
          ) : (
            results.map((r, i) => {
              const Icon = ICONS[r.type];
              return (
                <Link key={`${r.type}-${r.id}-${i}`} href={r.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors border-b border-primary/5 last:border-b-0">
                  <Icon className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-sans text-xs text-primary truncate">{r.title}</p>
                    <p className="font-sans text-[10px] text-primary/40 truncate">{r.subtitle}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
