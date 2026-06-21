import { useState, useEffect } from "react";
import { FileText, Check, X, ExternalLink, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Doc = {
  id: number; employee_id: string; name: string; category: string; file_url: string;
  description: string; status: string; review_note: string | null; created_at: string;
  employees?: { name: string; department: string; position: string };
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  approved: "bg-green-400/10 text-green-400 border-green-400/20",
  rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function AdminDocuments() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [reviewing, setReviewing] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get("/admin/documents") as Doc[];
      setDocs(data || []);
    } catch (e: any) { setMsg({ type: "err", text: e.message || "Failed to load" }); }
    setLoading(false);
  }

  async function review(doc: Doc, status: "approved" | "rejected") {
    setReviewing(doc.id); setMsg(null);
    try {
      await api.put(`/admin/documents/${doc.id}`, { status, review_note: note }, true);
      setMsg({ type: "ok", text: `Document ${status}` });
      setNote(""); setActiveId(null);
      await load();
    } catch (e: any) { setMsg({ type: "err", text: e.message || "Error" }); }
    setReviewing(null);
  }

  const filtered = docs.filter(d => filter === "all" || d.status === filter);
  const counts = {
    all: docs.length,
    pending: docs.filter(d => d.status === "pending").length,
    approved: docs.filter(d => d.status === "approved").length,
    rejected: docs.filter(d => d.status === "rejected").length,
  };

  return (
    <AdminLayout current="/admin/documents">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-secondary" />
          <h1 className="font-serif text-2xl text-primary">Document Review</h1>
        </div>
        <p className="font-sans text-xs text-primary/50 mb-6">Review and approve documents submitted by employees (NID, contracts, certificates, etc.)</p>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`p-3 border rounded text-center transition-colors ${filter === s ? "border-secondary bg-secondary/5" : "border-primary/10 hover:border-primary/30"}`}>
              <p className="font-serif text-xl text-primary">{counts[s]}</p>
              <p className="font-sans text-[9px] uppercase tracking-widest text-primary/40 capitalize">{s}</p>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-primary/40 font-sans text-sm">No documents found</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(d => (
              <div key={d.id} className="border border-primary/10 bg-card p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-sm text-primary font-medium">{d.name}</span>
                      <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded ${STATUS_COLORS[d.status]}`}>{d.status}</span>
                    </div>
                    <p className="font-sans text-xs text-primary/50">
                      {d.employees?.name || d.employee_id} · {d.employees?.department} · {d.category}
                    </p>
                    {d.description && <p className="font-sans text-xs text-primary/40 mt-1">{d.description}</p>}
                  </div>
                  <a href={d.file_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-primary/20 text-primary text-xs font-sans px-3 py-1.5 hover:border-secondary transition-colors flex-shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" /> View File
                  </a>
                </div>

                {d.status === "pending" && (
                  <div className="mt-3 pt-3 border-t border-primary/10">
                    {activeId === d.id ? (
                      <div className="space-y-2">
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note"
                          rows={2} className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => review(d, "approved")} disabled={reviewing === d.id}
                            className="flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-sans text-xs uppercase tracking-widest h-8 px-4 disabled:opacity-50">
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => review(d, "rejected")} disabled={reviewing === d.id}
                            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-sans text-xs uppercase tracking-widest h-8 px-4 disabled:opacity-50">
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button onClick={() => { setActiveId(null); setNote(""); }} className="text-primary/40 font-sans text-xs px-3">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setActiveId(d.id)} className="font-sans text-xs text-secondary uppercase tracking-widest">Review →</button>
                    )}
                  </div>
                )}
                {d.status !== "pending" && d.review_note && (
                  <p className="mt-2 font-sans text-xs text-primary/40">Note: {d.review_note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
