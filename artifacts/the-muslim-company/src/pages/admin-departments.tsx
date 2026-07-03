import { useState, useEffect } from "react";
import { Plus, Check, X, Edit2, Trash2, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Department = { id: number; name: string; description: string; head_employee_id: string | null };
type Employee = { employee_id: string; name: string; department: string };

export default function AdminDepartments() {
  const [depts, setDepts] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const EMPTY = { name: "", description: "", head_employee_id: "" };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [d, emps] = await Promise.all([
        api.get("/admin/departments") as Promise<Department[]>,
        api.get("/admin/employees") as Promise<Employee[]>,
      ]);
      setDepts(d || []);
      setEmployees(emps || []);
    } catch { setMsg({ type: "err", text: "Failed to load" }); }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      if (editing) await api.put(`/admin/departments/${editing.id}`, form, true);
      else await api.post("/admin/departments", form, true);
      setMsg({ type: "ok", text: "Saved successfully" });
      setShowForm(false); setEditing(null); setForm(EMPTY);
      await load();
    } catch (err: unknown) { setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" }); }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this department?")) return;
    try { await api.delete(`/admin/departments/${id}`, true); await load(); } catch {}
  }

  function startEdit(d: Department) {
    setEditing(d);
    setForm({ name: d.name, description: d.description || "", head_employee_id: d.head_employee_id || "" });
    setShowForm(true);
  }

  function employeeCount(deptName: string) {
    return employees.filter(e => e.department === deptName).length;
  }

  return (
    <AdminLayout current="/admin/departments">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl text-primary">Department Management</h1>
            <p className="font-sans text-xs text-primary/65 mt-1">Manage organizational departments</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }}
            className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        {showForm && (
          <div className="mb-6 p-6 border border-secondary/30 bg-card">
            <h3 className="font-serif text-lg text-primary mb-4">{editing ? "Edit Department" : "Add Department"}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Department Head</label>
                <select value={form.head_employee_id} onChange={e => setForm(f => ({ ...f, head_employee_id: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  <option value="">None</option>
                  {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="font-sans text-xs text-primary/65 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
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
        ) : depts.length === 0 ? (
          <div className="text-center py-12 text-primary/65 font-sans text-sm">No departments yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {depts.map(d => {
              const head = employees.find(e => e.employee_id === d.head_employee_id);
              return (
                <div key={d.id} className="border border-primary/10 bg-card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg text-primary">{d.name}</h3>
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(d)} className="text-primary/65 hover:text-secondary"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(d.id)} className="text-primary/65 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {d.description && <p className="font-sans text-sm text-primary/60 mb-3">{d.description}</p>}
                  <div className="flex items-center justify-between text-xs font-sans text-primary/65">
                    <span>{employeeCount(d.name)} employee{employeeCount(d.name) !== 1 ? "s" : ""}</span>
                    {head && <span>Head: {head.name}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
