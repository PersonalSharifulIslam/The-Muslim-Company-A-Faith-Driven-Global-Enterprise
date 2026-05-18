import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Key, UserCheck, UserX, X, AlertCircle, CheckCircle, Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const ROLES = ["employee", "hr", "accountant", "manager", "moderator", "support"];
const DEPTS = ["Human Resources", "Finance", "Operations", "Marketing", "Technology", "Sales", "Admin", "Management"];

type Employee = { id: number; employee_id: string; name: string; email: string; department: string; role: string; position: string; phone: string; joining_date: string; status: string };
type FormState = { name: string; email: string; password: string; department: string; role: string; position: string; phone: string; address: string; joining_date: string };

const EMPTY: FormState = { name: "", email: "", password: "", department: DEPTS[0], role: "employee", position: "", phone: "", address: "", joining_date: new Date().toISOString().split("T")[0] };

const ROLE_COLORS: Record<string, string> = {
  manager: "bg-purple-400/10 text-purple-400",
  hr: "bg-blue-400/10 text-blue-400",
  accountant: "bg-green-400/10 text-green-400",
  moderator: "bg-yellow-400/10 text-yellow-400",
  support: "bg-orange-400/10 text-orange-400",
  employee: "bg-white/5 text-white/40",
};

export default function AdminEmployees() {
  const { user, loading } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [resetId, setResetId] = useState<number | null>(null);
  const [resetPw, setResetPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [search, setSearch] = useState("");


  const load = async () => {
    setFetching(true);
    api.get("/admin/employees", true).then((d) => setEmployees(d as Employee[])).catch(() => {}).finally(() => setFetching(false));
  };

  useEffect(() => { if (user) load(); }, [user]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowForm(true); setMsg(null); };
  const openEdit = (e: Employee) => { setEditing(e); setForm({ name: e.name, email: e.email, password: "", department: e.department, role: e.role, position: e.position || "", phone: e.phone || "", address: "", joining_date: e.joining_date?.split("T")[0] || "" }); setShowForm(true); setMsg(null); };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaving(true); setMsg(null);
    try {
      if (editing) {
        await api.put(`/admin/employees/${editing.id}`, form, true);
        setMsg({ type: "ok", text: "Employee updated successfully" });
      } else {
        await api.post("/admin/employees", form, true);
        setMsg({ type: "ok", text: "Employee created successfully" });
      }
      setShowForm(false); await load();
    } catch (e: unknown) { setMsg({ type: "err", text: e instanceof Error ? e.message : "Error" }); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this employee? This action cannot be undone.")) return;
    setDeleting(id);
    await api.del(`/admin/employees/${id}`, true).catch(() => {});
    setDeleting(null); await load();
  };

  const handleToggleStatus = async (e: Employee) => {
    await api.put(`/admin/employees/${e.id}`, { status: e.status === "active" ? "inactive" : "active" }, true).catch(() => {});
    await load();
  };

  const handleResetPw = async (id: number) => {
    if (!resetPw || resetPw.length < 8) { setMsg({ type: "err", text: "Min 8 char password required" }); return; }
    setSaving(true);
    try {
      await api.post(`/admin/employees/${id}/reset-password`, { new_password: resetPw }, true);
      setMsg({ type: "ok", text: "Password reset successfully" });
      setResetId(null); setResetPw("");
    } catch (e: unknown) { setMsg({ type: "err", text: e instanceof Error ? e.message : "Error" }); }
    setSaving(false);
  };

  const filtered = employees.filter((e) =>
    search === "" || e.name.toLowerCase().includes(search.toLowerCase()) || e.employee_id.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <AdminLayout current="/admin/employees">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
        <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl text-primary mb-1">Employee Management</h1>
            <p className="font-sans text-sm text-primary/50">{employees.length} employee{employees.length !== 1 ? "s" : ""} registered</p>
          </div>
          <Button onClick={openCreate} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none font-sans text-xs font-bold tracking-widest uppercase h-9 px-5 gap-2">
            <Plus className="w-3.5 h-3.5" /> Add Employee
          </Button>
        </motion.div>

        {msg && (
          <motion.div variants={fade} className={`flex items-center gap-2 p-4 mb-6 border ${msg.type === "ok" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            {msg.type === "ok" ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
            <p className={`font-sans text-sm ${msg.type === "ok" ? "text-green-700" : "text-red-600"}`}>{msg.text}</p>
            <button onClick={() => setMsg(null)} className="ml-auto text-primary/30 hover:text-primary"><X className="w-4 h-4" /></button>
          </motion.div>
        )}

        <motion.div variants={fade} className="grid grid-cols-3 gap-4 mb-6">
          {[["Total", employees.length, "text-primary"], ["Active", employees.filter((e) => e.status === "active").length, "text-green-600"], ["Inactive", employees.filter((e) => e.status !== "active").length, "text-red-500"]].map(([label, val, color]) => (
            <div key={label as string} className="bg-card border border-primary/10 p-5 text-center">
              <p className={`font-serif text-3xl font-bold ${color}`}>{val}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fade} className="mb-4">
          <input type="text" placeholder="Search by name, ID, department..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 h-10 px-4 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary placeholder:text-primary/30" />
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/15 p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-sans text-xs tracking-widest uppercase text-primary/50 flex items-center gap-2"><Users className="w-3.5 h-3.5" />{editing ? "Edit Employee" : "New Employee"}</p>
              <button onClick={() => setShowForm(false)} className="text-primary/30 hover:text-primary"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([["Full Name", "name", "text", true], ["Email Address", "email", "email", true], ["Password", "password", "password", !editing], ["Phone Number", "phone", "tel", false], ["Position / Title", "position", "text", false]] as const).map(([label, field, type, req]) => (
                  <div key={field}>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-primary/40 block mb-1.5">{label}{req ? " *" : ""}</label>
                    <input type={type} required={req} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      placeholder={field === "password" && editing ? "Leave blank to keep current" : ""}
                      className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary placeholder:text-primary/25" />
                  </div>
                ))}
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/40 block mb-1.5">Department *</label>
                  <select value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    {DEPTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/40 block mb-1.5">Role *</label>
                  <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    {ROLES.map((r) => <option key={r} className="capitalize">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/40 block mb-1.5">Joining Date</label>
                  <input type="date" value={form.joining_date} onChange={(e) => setForm((f) => ({ ...f, joining_date: e.target.value }))}
                    className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving} className="h-9 bg-secondary text-primary hover:bg-secondary/90 rounded-none font-sans text-xs font-bold tracking-widest uppercase disabled:opacity-50">
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create Employee"}
                </Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="h-9 border-primary/20 text-primary/50 rounded-none font-sans text-xs tracking-widest uppercase">Cancel</Button>
              </div>
            </form>
          </motion.div>
        )}

        {resetId !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-secondary/30 p-5 mb-6">
            <p className="font-sans text-xs tracking-widest uppercase text-primary/50 mb-3 flex items-center gap-2"><Key className="w-3.5 h-3.5" /> Reset Password</p>
            <div className="flex gap-3">
              <input type="password" placeholder="New password (min 8 chars)" value={resetPw} onChange={(e) => setResetPw(e.target.value)}
                className="flex-1 h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              <Button onClick={() => handleResetPw(resetId)} disabled={saving} className="h-10 bg-secondary text-primary rounded-none font-sans text-xs font-bold tracking-widest uppercase px-5 disabled:opacity-50">
                {saving ? "..." : "Reset"}
              </Button>
              <Button onClick={() => { setResetId(null); setResetPw(""); }} variant="outline" className="h-10 border-primary/20 text-primary/50 rounded-none font-sans text-xs tracking-widest uppercase">Cancel</Button>
            </div>
          </motion.div>
        )}

        <motion.div variants={fade} className="bg-card border border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/10 bg-primary/3">
                  {["Employee ID", "Name", "Department", "Role", "Phone", "Joined", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-sans text-[9px] tracking-widest uppercase text-primary/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center"><div className="h-4 bg-primary/5 animate-pulse mx-auto w-32" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center font-sans text-sm text-primary/30">No employees found</td></tr>
                ) : filtered.map((e) => (
                  <tr key={e.id} className="border-b border-primary/5 hover:bg-secondary/3 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-secondary font-bold">{e.employee_id}</td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm text-primary font-medium">{e.name}</p>
                      <p className="font-sans text-[10px] text-primary/40">{e.email}</p>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-primary/60">{e.department}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[9px] px-2 py-0.5 font-bold uppercase tracking-wide ${ROLE_COLORS[e.role] || "bg-white/5 text-white/40"}`}>{e.role}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-primary/50">{e.phone || "—"}</td>
                    <td className="px-4 py-3 font-sans text-xs text-primary/50">{e.joining_date ? new Date(e.joining_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest ${e.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{e.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(e)} title="Edit" className="text-primary/30 hover:text-secondary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleToggleStatus(e)} title={e.status === "active" ? "Deactivate" : "Activate"} className="text-primary/30 hover:text-secondary transition-colors">
                          {e.status === "active" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => { setResetId(e.id); setResetPw(""); setMsg(null); }} title="Reset Password" className="text-primary/30 hover:text-secondary transition-colors"><Key className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(e.id)} disabled={deleting === e.id} title="Delete" className="text-primary/30 hover:text-red-500 transition-colors disabled:opacity-30"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
