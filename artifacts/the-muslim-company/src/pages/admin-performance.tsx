import { useState, useEffect } from "react";
import { Plus, Star, AlertCircle, Check } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Review = {
  id: number; employee_id: string; review_period: string; overall_rating: number;
  strengths: string; areas_for_improvement: string; goals_next_period: string;
  employee_comments: string; status: string; created_at: string;
  employees?: { name: string; department: string; position: string };
};
type Employee = { employee_id: string; name: string; department: string };

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-400/10 text-gray-400",
  submitted: "bg-yellow-400/10 text-yellow-400",
  acknowledged: "bg-green-400/10 text-green-400",
};

export default function AdminPerformance() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const EMPTY = { employee_id: "", review_period: "", overall_rating: 3, strengths: "", areas_for_improvement: "", goals_next_period: "" };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [r, e] = await Promise.all([api.get("/admin/performance"), api.get("/admin/employees")]);
      setReviews((r as Review[]) || []);
      setEmployees((e as Employee[]) || []);
    } catch {}
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      await api.post("/admin/performance", form, true);
      setMsg({ type: "ok", text: "Review submitted" });
      setShowForm(false); setForm(EMPTY);
      await load();
    } catch (err: any) { setMsg({ type: "err", text: err.message || "Error" }); }
    setSaving(false);
  }

  return (
    <AdminLayout current="/admin/performance">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-primary">Performance Reviews</h1>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
            <Plus className="w-4 h-4" /> New Review
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
              <label className="font-sans text-xs text-primary/50 mb-1 block">Employee *</label>
              <select required value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                <option value="">Select employee</option>
                {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Review Period *</label>
              <input required placeholder="e.g. 2026-Q2" value={form.review_period} onChange={e => setForm(f => ({ ...f, review_period: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-xs text-primary/50 mb-1 block">Overall Rating (1–5)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(f => ({ ...f, overall_rating: n }))}>
                    <Star className={`w-6 h-6 ${n <= form.overall_rating ? "fill-secondary text-secondary" : "text-primary/20"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-xs text-primary/50 mb-1 block">Strengths</label>
              <textarea rows={2} value={form.strengths} onChange={e => setForm(f => ({ ...f, strengths: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-xs text-primary/50 mb-1 block">Areas for Improvement</label>
              <textarea rows={2} value={form.areas_for_improvement} onChange={e => setForm(f => ({ ...f, areas_for_improvement: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-xs text-primary/50 mb-1 block">Goals for Next Period</label>
              <textarea rows={2} value={form.goals_next_period} onChange={e => setForm(f => ({ ...f, goals_next_period: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-6 disabled:opacity-50">
                {saving ? "Saving..." : "Submit Review"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-6">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
        ) : reviews.length === 0 ? (
          <p className="text-center py-12 text-primary/40 font-sans text-sm">No performance reviews yet</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="border border-primary/10 bg-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-sans text-sm text-primary font-medium">{r.employees?.name || r.employee_id} — {r.review_period}</p>
                    <p className="font-sans text-xs text-primary/40">{r.employees?.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3.5 h-3.5 ${n <= r.overall_rating ? "fill-secondary text-secondary" : "text-primary/15"}`} />)}</div>
                    <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                  </div>
                </div>
                {r.strengths && <p className="font-sans text-xs text-primary/60 mt-2"><span className="text-primary/40">Strengths: </span>{r.strengths}</p>}
                {r.areas_for_improvement && <p className="font-sans text-xs text-primary/60 mt-1"><span className="text-primary/40">Improve: </span>{r.areas_for_improvement}</p>}
                {r.employee_comments && <p className="font-sans text-xs text-secondary/80 mt-2 italic">"{r.employee_comments}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
