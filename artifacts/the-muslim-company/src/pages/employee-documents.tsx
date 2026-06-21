import { useState, useEffect } from "react";
import { FileText, ExternalLink, Upload, AlertCircle, Check } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface Doc {
  id: number; name: string; category: string; file_url: string; description: string;
  status: string; review_note: string | null; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  approved: "bg-green-400/10 text-green-400 border-green-400/20",
  rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};
const CATEGORIES = ["NID/Passport", "Educational Certificate", "Employment Contract", "Resume/CV", "Other"];

export default function EmployeeDocuments() {
  const { profile, session, loading } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", category: CATEGORIES[0], description: "" });
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (session && profile?.employee_id) {
      api.get("/employee/documents").then(d => setDocs((d as Doc[]) || [])).catch(() => {});
    }
  }, [session, profile]);

  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !form.name.trim()) return;
    setUploading(true); setMsg(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `documents/${profile?.employee_id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("media").upload(path, file);
      if (uploadErr) throw uploadErr;
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      await api.post("/employee/documents", { name: form.name, category: form.category, file_url: pub.publicUrl, description: form.description }, true);
      setMsg({ type: "ok", text: "Document submitted for review" });
      setShowForm(false); setFile(null); setForm({ name: "", category: CATEGORIES[0], description: "" });
      const d = await api.get("/employee/documents");
      setDocs((d as Doc[]) || []);
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Upload failed" });
    }
    setUploading(false);
  }

  return (
    <EmployeeLayout current="/employee/documents">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-serif text-2xl text-white flex items-center gap-2"><FileText className="w-5 h-5 text-[#b08d57]" /> Documents</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#b08d57] text-[#0a1a0e] font-sans text-xs uppercase tracking-widest h-9 px-4 rounded">
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>
        <p className="font-sans text-xs text-white/40 mb-6">Submit your documents for HR review and approval.</p>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleUpload} className="mb-6 p-5 border border-[#b08d57]/30 bg-white/[0.03] rounded space-y-3">
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">Document Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full h-9 px-3 bg-[#0a1a0e] border border-white/15 font-sans text-sm text-white focus:outline-none focus:border-[#b08d57] rounded" />
            </div>
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full h-9 px-3 bg-[#0a1a0e] border border-white/15 font-sans text-sm text-white focus:outline-none focus:border-[#b08d57] rounded">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">File *</label>
              <input required type="file" onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-white/70 font-sans" />
            </div>
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                className="w-full px-3 py-2 bg-[#0a1a0e] border border-white/15 font-sans text-sm text-white focus:outline-none focus:border-[#b08d57] rounded resize-none" />
            </div>
            <button type="submit" disabled={uploading}
              className="bg-[#b08d57] text-[#0a1a0e] font-sans text-xs uppercase tracking-widest h-9 px-6 rounded disabled:opacity-50">
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {docs.length === 0 && <p className="text-white/30 text-center py-8 font-sans text-sm">No documents submitted yet</p>}
          {docs.map(d => (
            <div key={d.id} className="bg-white/[0.02] border border-white/10 rounded p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-sans text-sm text-white font-medium">{d.name}</p>
                    <span className={`font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 border rounded ${STATUS_COLORS[d.status] || STATUS_COLORS.pending}`}>{d.status}</span>
                  </div>
                  <p className="font-sans text-xs text-white/40">{d.category} · {new Date(d.created_at).toLocaleDateString()}</p>
                  {d.description && <p className="font-sans text-xs text-white/50 mt-1">{d.description}</p>}
                  {d.review_note && <p className="font-sans text-xs text-white/30 mt-1">Note: {d.review_note}</p>}
                </div>
                {d.file_url && (
                  <a href={d.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#b08d57] hover:underline text-xs font-sans flex-shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" /> View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmployeeLayout>
  );
}
