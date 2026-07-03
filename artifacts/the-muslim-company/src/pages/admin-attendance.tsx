import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Check, X, Edit2, AlertCircle, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type AttRecord = {
  id: number; employee_id: string; date: string;
  check_in: string | null; check_out: string | null;
  working_hours: number | null; status: string; note: string;
  employees?: { name: string; department: string; position: string };
};
type Employee = { employee_id: string; name: string; department: string };

const STATUS_COLORS: Record<string, string> = {
  present: "bg-green-400/10 text-green-400 border-green-400/20",
  absent: "bg-red-400/10 text-red-400 border-red-400/20",
  late: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  half_day: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  leave: "bg-purple-400/10 text-purple-400 border-purple-400/20",
};

function fmt(ts: string | null) {
  if (!ts) return "—";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AdminAttendance() {
  const [records, setRecords] = useState<AttRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AttRecord | null>(null);
  const [viewMode, setViewMode] = useState<"day" | "month">("day");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [filterEmp, setFilterEmp] = useState("all");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employee_id: "", date: new Date().toISOString().split("T")[0], check_in: "", check_out: "", status: "present", note: "" });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [att, emps] = await Promise.all([
        api.get("/admin/attendance") as Promise<AttRecord[]>,
        api.get("/admin/employees") as Promise<Employee[]>,
      ]);
      setRecords(att || []);
      setEmployees(emps || []);
    } catch { setMsg({ type: "err", text: "Failed to load" }); }
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      const payload = {
        ...form,
        check_in: form.check_in ? `${form.date}T${form.check_in}:00+00:00` : null,
        check_out: form.check_out ? `${form.date}T${form.check_out}:00+00:00` : null,
      };
      if (editing) await api.put(`/admin/attendance/${editing.id}`, payload, true);
      else await api.post("/admin/attendance", payload, true);
      setMsg({ type: "ok", text: "Saved successfully" });
      setShowForm(false); setEditing(null);
      setForm({ employee_id: "", date: new Date().toISOString().split("T")[0], check_in: "", check_out: "", status: "present", note: "" });
      await load();
    } catch (err: unknown) { setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" }); }
    setSaving(false);
  }

  function startEdit(r: AttRecord) {
    setEditing(r);
    setForm({
      employee_id: r.employee_id,
      date: r.date,
      check_in: r.check_in ? new Date(r.check_in).toTimeString().slice(0, 5) : "",
      check_out: r.check_out ? new Date(r.check_out).toTimeString().slice(0, 5) : "",
      status: r.status,
      note: r.note || "",
    });
    setShowForm(true);
  }

  const filtered = records.filter(r => {
    const dateMatch = viewMode === "day" ? r.date === filterDate : r.date.startsWith(filterMonth);
    const empMatch = filterEmp === "all" || r.employee_id === filterEmp;
    return dateMatch && empMatch;
  });

  const stats = {
    present: filtered.filter(r => r.status === "present").length,
    absent: filtered.filter(r => r.status === "absent").length,
    late: filtered.filter(r => r.status === "late").length,
  };

  return (
    <AdminLayout current="/admin/attendance">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl text-primary">Attendance Management</h1>
            <p className="font-sans text-xs text-primary/65 mt-1">Track and manage employee attendance</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportToCSV(`attendance-${viewMode === "day" ? filterDate : filterMonth}`, filtered.map(r => ({
              Employee: r.employees?.name || r.employee_id,
              Department: r.employees?.department || "",
              Date: r.date,
              "Check In": fmt(r.check_in),
              "Check Out": fmt(r.check_out),
              "Hours Worked": r.working_hours || "",
              Status: r.status,
              Note: r.note || "",
            })))}
              className="flex items-center gap-2 border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-4 hover:border-secondary transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={() => { setShowForm(true); setEditing(null); }}
              className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
              <Plus className="w-4 h-4" /> Add Entry
            </button>
          </div>
        </div>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[["Present", stats.present, "text-green-400"], ["Absent", stats.absent, "text-red-400"], ["Late", stats.late, "text-yellow-400"]].map(([label, count, color]) => (
            <div key={label as string} className="p-4 border border-primary/10 bg-card text-center">
              <p className={`font-serif text-3xl ${color}`}>{count}</p>
              <p className="font-sans text-xs uppercase tracking-widest text-primary/65">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-4 flex-wrap items-center">
          <div className="flex border border-primary/15 rounded overflow-hidden">
            <button onClick={() => setViewMode("day")}
              className={`h-9 px-4 font-sans text-xs uppercase tracking-widest transition-colors ${viewMode === "day" ? "bg-secondary text-primary" : "bg-card text-primary/65 hover:text-primary"}`}>
              By Day
            </button>
            <button onClick={() => setViewMode("month")}
              className={`h-9 px-4 font-sans text-xs uppercase tracking-widest transition-colors ${viewMode === "month" ? "bg-secondary text-primary" : "bg-card text-primary/65 hover:text-primary"}`}>
              By Month
            </button>
          </div>
          {viewMode === "day" ? (
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
              className="h-9 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
          ) : (
            <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              className="h-9 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
          )}
          <select value={filterEmp} onChange={e => setFilterEmp(e.target.value)}
            className="h-9 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
            <option value="all">All Employees</option>
            {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
          </select>
        </div>

        {showForm && (
          <div className="mb-6 p-6 border border-secondary/30 bg-card">
            <h3 className="font-serif text-lg text-primary mb-4">{editing ? "Edit Attendance" : "Add Attendance"}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Employee *</label>
                <select value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  <option value="">Select employee</option>
                  {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Check In</label>
                <input type="time" value={form.check_in} onChange={e => setForm(f => ({ ...f, check_in: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Check Out</label>
                <input type="time" value={form.check_out} onChange={e => setForm(f => ({ ...f, check_out: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Status *</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  {["present", "absent", "late", "half_day", "leave"].map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Note</label>
                <input type="text" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note"
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  {["Employee", "Date", "Check In", "Check Out", "Hours", "Status", "Note", ""].map(h => (
                    <th key={h} className="text-left py-3 px-3 font-sans text-xs uppercase tracking-widest text-primary/65">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-primary/65">No records found</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="border-b border-primary/5 hover:bg-card transition-colors">
                    <td className="py-3 px-3">
                      <p className="text-primary font-medium">{r.employees?.name || r.employee_id}</p>
                      <p className="text-primary/65 text-xs">{r.employees?.department}</p>
                    </td>
                    <td className="py-3 px-3 text-primary/70">{r.date}</td>
                    <td className="py-3 px-3 text-primary/70">{fmt(r.check_in)}</td>
                    <td className="py-3 px-3 text-primary/70">{fmt(r.check_out)}</td>
                    <td className="py-3 px-3 text-primary/70">{r.working_hours ? `${r.working_hours}h` : "—"}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs uppercase tracking-widest px-2 py-1 border rounded ${STATUS_COLORS[r.status] || "bg-primary/5 text-primary/60 border-primary/10"}`}>
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-primary/65 text-xs max-w-[120px] truncate">{r.note || "—"}</td>
                    <td className="py-3 px-3">
                      <button onClick={() => startEdit(r)} className="text-primary/65 hover:text-secondary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
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
