import { useState, useEffect } from "react";
import { Plus, UserMinus, AlertCircle, Check } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Exit = {
  id: number; employee_id: string; exit_type: string; notice_date: string; last_working_date: string | null;
  reason: string; exit_interview_notes: string | null; status: string;
  employees?: { name: string; department: string; position: string };
};
type Employee = { employee_id: string; name: string; department: string };

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400",
  approved: "bg-blue-400/10 text-blue-400",
  completed: "bg-green-400/10 text-green-400",
};
const TYPE_LABELS: Record<string, string> = {
  resignation: "Resignation", termination: "Termination", retirement: "Retirement", contract_end: "Contract Ended",
};

export default function AdminExits() {
  const [exits, setExits] = useState<Exit[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<number, string>>({});
  const EMPTY = { employee_id: "", exit_type: "resignation", notice_date: new Date().toISOString().split("T")[0], last_working_date: "", reason: "" };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [x, e] = await Promise.all([api.get("/admin/exits"), api.get("/admin/employees")]);
      setExits((x as Exit[]) || []);
      setEmployees((e as Employee[]) || []);
    } catch {}
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      await api.post("/admin/exits", form, true);
      setMsg({ type: "ok", text: "Exit recorded" });
      setShowForm(false); setForm(EMPTY);
      await load();
    } catch (err: any) { setMsg({ type: "err", text: err.message || "Error" }); }
    setSaving(false);
  }

  async function updateStatus(ex: Exit, status: string) {
    try {
      await api.put(`/admin/exits/${ex.id}`, { status, exit_interview_notes: noteDrafts[ex.id] ?? ex.exit_interview_notes }, true);
      await load();
    } catch (err: any) { setMsg({ type: "err", text: err.message || "Error" }); }
  }

  return (
    <AdminLayout current="/admin/exits">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-primary flex items-center gap-2"><UserMinus className="w-6 h-6 text-secondary" /> Resignations & Terminations</h1>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
            <Plus className="w-4 h-4" /> Record Exit
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
              <label className="font-sans text-xs text-primary/50 mb-1 block">Exit Type *</label>
              <select value={form.exit_type} onChange={e => setForm(f => ({ ...f, exit_type: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Notice Date</label>
              <input type="date" value={form.notice_date} onChange={e => setForm(f => ({ ...f, notice_date: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Last Working Date</label>
              <input type="date" value={form.last_working_date} onChange={e => setForm(f => ({ ...f, last_working_date: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-xs text-primary/50 mb-1 block">Reason</label>
              <textarea rows={2} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-6 disabled:opacity-50">
                {saving ? "Saving..." : "Record Exit"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-6">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
        ) : exits.length === 0 ? (
          <p className="text-center py-12 text-primary/40 font-sans text-sm">No exits recorded</p>
        ) : (
          <div className="space-y-3">
            {exits.map(ex => (
              <div key={ex.id} className="border border-primary/10 bg-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-sans text-sm text-primary font-medium">{ex.employees?.name || ex.employee_id} — {TYPE_LABELS[ex.exit_type]}</p>
                    <p className="font-sans text-xs text-primary/40">{ex.employees?.department} · Notice: {ex.notice_date} {ex.last_working_date && `· Last day: ${ex.last_working_date}`}</p>
                  </div>
                  <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_COLORS[ex.status]}`}>{ex.status}</span>
                </div>
                {ex.reason && <p className="font-sans text-xs text-primary/60 mb-2">{ex.reason}</p>}
                {ex.status !== "completed" && (
                  <div className="mt-2 space-y-2">
                    <textarea placeholder="Exit interview notes" rows={2}
                      defaultValue={ex.exit_interview_notes || ""}
                      onChange={e => setNoteDrafts(d => ({ ...d, [ex.id]: e.target.value }))}
                      className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
                    <div className="flex gap-2">
                      {ex.status === "pending" && (
                        <button onClick={() => updateStatus(ex, "approved")} className="font-sans text-xs uppercase tracking-widest border border-blue-400/30 text-blue-400 px-4 h-8">Approve</button>
                      )}
                      <button onClick={() => updateStatus(ex, "completed")} className="font-sans text-xs uppercase tracking-widest border border-green-400/30 text-green-400 px-4 h-8">Mark Completed</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
