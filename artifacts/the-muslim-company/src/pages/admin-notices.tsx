import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Notice } from "@/lib/supabase";

const CATS = ["General Notice", "Important", "Circular", "Recruitment", "Event", "Announcement"];
type Form = { title: string; category: string; content: string; pdf_url: string; important: boolean; pinned: boolean };
const BLANK: Form = { title: "", category: CATS[0], content: "", pdf_url: "", important: false, pinned: false };

export default function AdminNotices() {
  const { user, loading } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState<Form>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);


  const load = async () => {
    try {
      const data = await api.get("/admin/notices", true);
      setNotices(data as Notice[]);
    } catch {}
  };

  useEffect(() => { if (user) load(); }, [user]);

  const openNew = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (n: Notice) => {
    setEditing(n);
    setForm({ title: n.title, category: n.category, content: n.content || "", pdf_url: n.pdf_url || "", important: n.important, pinned: n.pinned });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/notices/${editing.id}`, form, true);
      else await api.post("/admin/notices", form, true);
      await load();
      setModal(false);
    } catch {}
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this notice?")) return;
    setDeleting(id);
    try {
      await api.del(`/admin/notices/${id}`, true);
      await load();
    } catch {}
    setDeleting(null);
  };

  const setField = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));


  return (
    <AdminLayout current="/admin/notices">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Notice & Event</h1>
          <p className="font-sans text-sm text-primary/50">Manage official notices and announcements</p>
        </div>
        <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">
          <Plus className="w-3.5 h-3.5 mr-2" />New Notice
        </Button>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-20 bg-card border border-primary/10">
          <p className="font-serif text-xl text-primary mb-4">No notices yet</p>
          <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5"><Plus className="w-3.5 h-3.5 mr-2" />Add First Notice</Button>
        </div>
      ) : (
        <div className="border border-primary/10 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                {["Title", "Category", "Date", "Flags", "PDF", "Actions"].map((h) => (
                  <th key={h} className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id} className={`border-t border-primary/8 hover:bg-secondary/5 transition-colors ${n.pinned ? "bg-secondary/5" : ""}`}>
                  <td className="px-5 py-4 font-sans text-sm text-primary max-w-xs truncate">{n.title}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{n.category}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/50">{new Date(n.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {n.pinned && <Pin className="w-3.5 h-3.5 text-secondary" />}
                      {n.important && <span className="font-sans text-[9px] tracking-widest uppercase text-red-400 border border-red-400/20 px-1.5 py-0.5">Important</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/50">{n.pdf_url ? "✓" : "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(n)} className="text-primary/40 hover:text-secondary transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => del(n.id)} disabled={deleting === n.id} className="text-primary/40 hover:text-red-400 transition-colors disabled:opacity-30"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-background border border-primary/15 w-full max-w-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
              <h2 className="font-serif text-xl text-primary">{editing ? "Edit Notice" : "New Notice"}</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5 text-primary/40" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Title *</label>
                <input value={form.title} onChange={setField("title")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Category</label>
                  <select value={form.category} onChange={setField("category")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    {CATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">PDF URL (Optional)</label>
                  <input value={form.pdf_url} onChange={setField("pdf_url")} placeholder="https://..." className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Content (Optional)</label>
                <textarea rows={5} value={form.content} onChange={setField("content")} className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.important} onChange={setField("important")} className="accent-secondary" />
                  <span className="font-sans text-sm text-primary/70">Mark as Important</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.pinned} onChange={setField("pinned")} className="accent-secondary" />
                  <span className="font-sans text-sm text-primary/70">Pin to Top</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-primary/10 flex gap-3">
              <Button onClick={save} disabled={saving || !form.title} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-6 disabled:opacity-40">
                {saving ? "Saving..." : editing ? "Save Changes" : "Publish Notice"}
              </Button>
              <Button variant="outline" onClick={() => setModal(false)} className="border-primary/20 text-primary rounded-none font-sans text-xs h-9 px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
