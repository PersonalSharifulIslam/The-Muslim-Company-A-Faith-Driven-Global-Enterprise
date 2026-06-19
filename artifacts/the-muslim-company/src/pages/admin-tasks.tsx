import { useState, useEffect } from "react";
import { Plus, Check, X, Edit2, Trash2, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Task = {
  id: number; employee_id: string; title: string; description: string;
  priority: string; status: string; progress: number; deadline: string | null;
  assigned_by: string; created_at: string;
  employees?: { name: string; department: string; position: string };
};
type Employee = { employee_id: string; name: string; department: string };

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  medium: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  high: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  urgent: "bg-red-400/10 text-red-400 border-red-400/20",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-400/10 text-gray-400 border-gray-400/20",
  in_progress: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  done: "bg-green-400/10 text-green-400 border-green-400/20",
  cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const EMPTY = { employee_id: "", title: "", description: "", priority: "medium", deadline: "", assigned_by: "Admin" };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [t, emps] = await Promise.all([
        api.get("/admin/tasks") as Promise<Task[]>,
        api.get("/admin/employees") as Promise<Employee[]>,
      ]);
      setTasks(t || []);
      setEmployees(emps || []);
    } catch { setMsg({ type: "err", text: "Failed to load" }); }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      if (editing) await api.put(`/admin/tasks/${editing.id}`, form, true);
      else await api.post("/admin/tasks", form, true);
      setMsg({ type: "ok", text: "Saved successfully" });
      setShowForm(false); setEditing(null); setForm(EMPTY);
      await load();
    } catch (err: unknown) { setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" }); }
    setSaving(false);
  }

  async function updateStatus(task: Task, status: string) {
    try {
      await api.put(`/admin/tasks/${task.id}`, { status, progress: status === "done" ? 100 : task.progress }, true);
      await load();
    } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this task?")) return;
    try { await api.delete(`/admin/tasks/${id}`, true); await load(); } catch {}
  }

  function startEdit(t: Task) {
    setEditing(t);
    setForm({
      employee_id: t.employee_id, title: t.title, description: t.description || "",
      priority: t.priority, deadline: t.deadline ? t.deadline.split("T")[0] : "", assigned_by: t.assigned_by || "Admin",
    });
    setShowForm(true);
  }

  const filtered = tasks.filter(t => filterStatus === "all" || t.status === filterStatus);
  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  return (
    <AdminLayout current="/admin/tasks">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl text-primary">Task Management</h1>
            <p className="font-sans text-xs text-primary/50 mt-1">Assign and track employee tasks</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }}
            className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
            <Plus className="w-4 h-4" /> Assign Task
          </button>
        </div>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 mb-6">
          {(["all", "pending", "in_progress", "done"] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`p-4 border rounded text-center transition-colors ${filterStatus === s ? "border-secondary bg-secondary/5" : "border-primary/10 hover:border-primary/30"}`}>
              <p className="font-serif text-2xl text-primary">{counts[s]}</p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 capitalize">{s.replace("_", " ")}</p>
            </button>
          ))}
        </div>

        {showForm && (
          <div className="mb-6 p-6 border border-secondary/30 bg-card">
            <h3 className="font-serif text-lg text-primary mb-4">{editing ? "Edit Task" : "Assign New Task"}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Employee *</label>
                <select value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  <option value="">Select employee</option>
                  {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  {["low", "medium", "high", "urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="font-sans text-xs text-primary/50 mb-1 block">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div className="sm:col-span-2">
                <label className="font-sans text-xs text-primary/50 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Assigned By</label>
                <input type="text" value={form.assigned_by} onChange={e => setForm(f => ({ ...f, assigned_by: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={saving}
                  className="bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-6 disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-6">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-primary/40 font-sans text-sm">No tasks found</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(t => (
              <div key={t.id} className="border border-primary/10 bg-card p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-base text-primary">{t.title}</h3>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                    </div>
                    <p className="font-sans text-xs text-primary/50">
                      {t.employees?.name || t.employee_id} · {t.employees?.department}
                      {t.deadline && ` · Due ${new Date(t.deadline).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(t)} className="text-primary/40 hover:text-secondary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id)} className="text-primary/40 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {t.description && <p className="font-sans text-sm text-primary/60 mb-3">{t.description}</p>}
                <div className="flex items-center gap-3">
                  <select value={t.status} onChange={e => updateStatus(t, e.target.value)}
                    className={`text-[11px] uppercase tracking-widest px-3 py-1.5 border rounded font-sans ${STATUS_COLORS[t.status]}`}>
                    {["pending", "in_progress", "done", "cancelled"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
