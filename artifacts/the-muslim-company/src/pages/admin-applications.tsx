import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { STATUS_LABELS, STATUS_COLORS, type Application } from "@/lib/supabase";

const ALL_STATUSES = ["submitted", "under_review", "shortlisted", "interview_scheduled", "pending", "accepted", "rejected"];

export default function AdminApplications() {
  const { user, loading } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { if (!loading && !user) window.location.href = "/admin"; }, [user, loading]);

  const load = async () => {
    try {
      const data = await api.get("/admin/applications", true);
      setApps(data as Application[]);
    } catch {}
  };

  useEffect(() => { if (user) load(); }, [user]);

  const filtered = apps.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.reference_number.toLowerCase().includes(search.toLowerCase()) || a.job_title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: number, status: string) => {
    setUpdating(true);
    try {
      await api.put(`/admin/applications/${id}`, { status }, true);
      await load();
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: status as Application["status"] } : null);
    } catch {}
    setUpdating(false);
  };

  if (loading) return null;

  return (
    <AdminLayout current="/admin/applications">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Applications</h1>
          <p className="font-sans text-sm text-primary/50">{apps.length} total applications</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
          <input type="text" placeholder="Search by name, reference, or position..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 h-10 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card border border-primary/10">
          <p className="font-serif text-xl text-primary">{apps.length === 0 ? "No applications yet" : "No results found"}</p>
        </div>
      ) : (
        <div className="border border-primary/10 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                {["Name", "Position", "Reference", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-primary/8 hover:bg-secondary/5 transition-colors cursor-pointer" onClick={() => setSelected(a)}>
                  <td className="px-5 py-4 font-sans text-sm text-primary">{a.name}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{a.job_title}</td>
                  <td className="px-5 py-4 font-mono text-xs text-primary/50">{a.reference_number}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/50">{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-4">
                    <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-0.5 border ${STATUS_COLORS[a.status]}`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                      disabled={updating}
                      className="h-8 px-2 bg-background border border-primary/15 font-sans text-xs text-primary focus:outline-none focus:border-secondary"
                    >
                      {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="w-full max-w-lg bg-background h-full overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 sticky top-0 bg-background">
              <h2 className="font-serif text-lg text-primary">Application Details</h2>
              <button onClick={() => setSelected(null)} className="text-primary/40 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-primary text-primary-foreground p-5">
                <p className="font-mono text-sm text-secondary mb-1">{selected.reference_number}</p>
                <p className="font-sans text-[10px] text-primary-foreground/40 tracking-widest uppercase">Reference Number</p>
              </div>
              {[
                { l: "Full Name", v: selected.name },
                { l: "Email", v: selected.email },
                { l: "Phone", v: selected.phone },
                { l: "Address", v: selected.address },
                { l: "Position", v: selected.job_title },
                { l: "Job ID", v: `#${selected.job_id}` },
                { l: "Applied On", v: new Date(selected.created_at).toLocaleDateString("en-GB", { dateStyle: "long" }) },
              ].map(({ l, v }) => (
                <div key={l} className="border-b border-primary/8 pb-4">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-1">{l}</p>
                  <p className="font-sans text-sm text-primary">{v}</p>
                </div>
              ))}
              {[
                { l: "Education", v: selected.education },
                { l: "Experience", v: selected.experience },
                { l: "Skills", v: selected.skills },
                { l: "Cover Letter", v: selected.cover_letter },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-2">{l}</p>
                  <p className="font-sans text-sm text-primary/70 leading-relaxed whitespace-pre-line">{v}</p>
                </div>
              ))}
              {selected.portfolio && (
                <div>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-2">Portfolio / LinkedIn</p>
                  <a href={selected.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-sm text-secondary hover:underline">
                    {selected.portfolio} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
              {selected.cv_url && (
                <a href={selected.cv_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-10">Download CV</Button>
                </a>
              )}
              <div className="border-t border-primary/10 pt-5">
                <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={updating || selected.status === s}
                      className={`px-3 py-2 font-sans text-[10px] tracking-widest uppercase border transition-colors disabled:opacity-40 ${selected.status === s ? "bg-secondary text-primary border-secondary" : "border-primary/15 text-primary/50 hover:border-secondary/50"}`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
