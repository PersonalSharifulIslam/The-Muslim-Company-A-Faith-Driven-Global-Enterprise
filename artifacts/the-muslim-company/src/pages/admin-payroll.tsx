import { useState, useEffect } from "react";
import { Plus, Check, X, Edit2, Trash2, AlertCircle, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Payroll = {
  id: number; employee_id: string; month: string;
  basic_salary: number; allowances: number; deductions: number; net_salary: number;
  status: string; payment_method: string; notes: string;
  employees?: { name: string; department: string; position: string };
};
type Employee = { employee_id: string; name: string; department: string };

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  paid: "bg-green-400/10 text-green-400 border-green-400/20",
  failed: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function AdminPayroll() {
  const [records, setRecords] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Payroll | null>(null);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const EMPTY = { employee_id: "", month: new Date().toISOString().slice(0, 7), basic_salary: "", allowances: "", deductions: "", payment_method: "bank_transfer", notes: "" };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [p, emps] = await Promise.all([
        api.get("/admin/payroll") as Promise<Payroll[]>,
        api.get("/admin/employees") as Promise<Employee[]>,
      ]);
      setRecords(p || []);
      setEmployees(emps || []);
    } catch { setMsg({ type: "err", text: "Failed to load" }); }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      if (editing) await api.put(`/admin/payroll/${editing.id}`, form, true);
      else await api.post("/admin/payroll", form, true);
      setMsg({ type: "ok", text: "Saved successfully" });
      setShowForm(false); setEditing(null); setForm(EMPTY);
      await load();
    } catch (err: unknown) { setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" }); }
    setSaving(false);
  }

  async function markPaid(p: Payroll) {
    try { await api.put(`/admin/payroll/${p.id}`, { status: "paid" }, true); await load(); } catch {}
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this payroll record?")) return;
    try { await api.delete(`/admin/payroll/${id}`, true); await load(); } catch {}
  }

  function startEdit(p: Payroll) {
    setEditing(p);
    setForm({
      employee_id: p.employee_id, month: p.month,
      basic_salary: String(p.basic_salary), allowances: String(p.allowances || 0), deductions: String(p.deductions || 0),
      payment_method: p.payment_method || "bank_transfer", notes: p.notes || "",
    });
    setShowForm(true);
  }

  const filtered = records.filter(r => r.month === filterMonth);
  const totals = {
    gross: filtered.reduce((s, r) => s + Number(r.basic_salary || 0) + Number(r.allowances || 0), 0),
    net: filtered.reduce((s, r) => s + Number(r.net_salary || 0), 0),
    paid: filtered.filter(r => r.status === "paid").length,
    pending: filtered.filter(r => r.status === "pending").length,
  };

  return (
    <AdminLayout current="/admin/payroll">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl text-primary">Payroll Management</h1>
            <p className="font-sans text-xs text-primary/50 mt-1">Manage employee salaries and payments</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportToCSV(`payroll-${filterMonth}`, filtered.map(r => ({
              Employee: r.employees?.name || r.employee_id,
              Department: r.employees?.department || "",
              Month: r.month,
              "Basic Salary": r.basic_salary,
              Allowances: r.allowances || 0,
              Deductions: r.deductions || 0,
              "Net Salary": r.net_salary,
              "Payment Method": r.payment_method,
              Status: r.status,
            })))}
              className="flex items-center gap-2 border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-4 hover:border-secondary transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={() => { setShowForm(true); setEditing(null); setForm(EMPTY); }}
              className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
              <Plus className="w-4 h-4" /> Add Payroll Entry
            </button>
          </div>
        </div>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            className="h-9 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[["Gross Total", `৳${totals.gross.toLocaleString()}`], ["Net Total", `৳${totals.net.toLocaleString()}`], ["Paid", totals.paid], ["Pending", totals.pending]].map(([label, val]) => (
            <div key={label as string} className="p-4 border border-primary/10 bg-card text-center">
              <p className="font-serif text-xl text-primary">{val}</p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40">{label}</p>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="mb-6 p-6 border border-secondary/30 bg-card">
            <h3 className="font-serif text-lg text-primary mb-4">{editing ? "Edit Payroll" : "Add Payroll Entry"}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Employee *</label>
                <select value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  <option value="">Select employee</option>
                  {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Month *</label>
                <input type="month" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Payment Method</label>
                <select value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="mobile_banking">Mobile Banking</option>
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Basic Salary *</label>
                <input type="number" value={form.basic_salary} onChange={e => setForm(f => ({ ...f, basic_salary: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Allowances</label>
                <input type="number" value={form.allowances} onChange={e => setForm(f => ({ ...f, allowances: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/50 mb-1 block">Deductions</label>
                <input type="number" value={form.deductions} onChange={e => setForm(f => ({ ...f, deductions: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div className="sm:col-span-3">
                <label className="font-sans text-xs text-primary/50 mb-1 block">Notes</label>
                <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div className="sm:col-span-3 flex gap-3">
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  {["Employee", "Basic", "Allowances", "Deductions", "Net Salary", "Method", "Status", ""].map(h => (
                    <th key={h} className="text-left py-3 px-3 font-sans text-[10px] uppercase tracking-widest text-primary/40">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-primary/40">No payroll records for this month</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="border-b border-primary/5 hover:bg-card transition-colors">
                    <td className="py-3 px-3">
                      <p className="text-primary font-medium">{p.employees?.name || p.employee_id}</p>
                      <p className="text-primary/40 text-xs">{p.employees?.department}</p>
                    </td>
                    <td className="py-3 px-3 text-primary/70">৳{Number(p.basic_salary).toLocaleString()}</td>
                    <td className="py-3 px-3 text-primary/70">৳{Number(p.allowances || 0).toLocaleString()}</td>
                    <td className="py-3 px-3 text-primary/70">৳{Number(p.deductions || 0).toLocaleString()}</td>
                    <td className="py-3 px-3 text-secondary font-medium">৳{Number(p.net_salary).toLocaleString()}</td>
                    <td className="py-3 px-3 text-primary/50 text-xs">{(p.payment_method || "").replace("_", " ")}</td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="py-3 px-3 flex items-center gap-2">
                      {p.status === "pending" && (
                        <button onClick={() => markPaid(p)} className="text-green-400 hover:text-green-300" title="Mark Paid"><Check className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => startEdit(p)} className="text-primary/40 hover:text-secondary"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-primary/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
