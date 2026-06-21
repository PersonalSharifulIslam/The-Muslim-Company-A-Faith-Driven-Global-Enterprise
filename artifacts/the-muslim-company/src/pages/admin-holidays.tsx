import { useState, useEffect } from "react";
import { Plus, Trash2, Sparkles, Building2, AlertCircle, Check } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Holiday = { id: number; title: string; date: string; description: string; is_company_event: boolean };

export default function AdminHolidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState({ title: "", date: "", description: "", is_company_event: false });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setHolidays((await api.get("/admin/holidays")) as Holiday[] || []); } catch {}
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      await api.post("/admin/holidays", form, true);
      setMsg({ type: "ok", text: "Added successfully" });
      setShowForm(false); setForm({ title: "", date: "", description: "", is_company_event: false });
      await load();
    } catch (err: any) { setMsg({ type: "err", text: err.message || "Error" }); }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this holiday/event?")) return;
    try { await api.delete(`/admin/holidays/${id}`, true); await load(); } catch {}
  }

  return (
    <AdminLayout current="/admin/holidays">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-primary">Holidays & Company Events</h1>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
            <Plus className="w-4 h-4" /> Add Date
          </button>
        </div>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSave} className="mb-6 p-6 border border-secondary/30 bg-card grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Date *</label>
              <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-xs text-primary/50 mb-1 block">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={form.is_company_event} onChange={e => setForm(f => ({ ...f, is_company_event: e.target.checked }))} />
              <span className="font-sans text-xs text-primary/60">This is an internal company event (not a public/religious holiday)</span>
            </label>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-6 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-6">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <div className="space-y-2">
            {holidays.map(h => (
              <div key={h.id} className="flex items-center justify-between p-4 border border-primary/10 bg-card">
                <div className="flex items-center gap-3">
                  {h.is_company_event ? <Building2 className="w-4 h-4 text-primary/40" /> : <Sparkles className="w-4 h-4 text-secondary/60" />}
                  <div>
                    <p className="font-sans text-sm text-primary">{h.title}</p>
                    <p className="font-sans text-xs text-primary/40">{new Date(h.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(h.id)} className="text-primary/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
