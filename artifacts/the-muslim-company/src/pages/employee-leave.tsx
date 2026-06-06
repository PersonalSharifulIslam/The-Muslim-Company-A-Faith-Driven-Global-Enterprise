import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const LEAVE_TYPES = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity/Paternity Leave", "Hajj Leave", "Unpaid Leave", "Other"];
type LeaveReq = { id: number; leave_type: string; reason: string; start_date: string; end_date: string; days: number; status: string; admin_note: string; created_at: string };
const STATUS_MAP: Record<string, { color: string; bg: string; icon: React.FC<{ className?: string }> }> = {
  pending: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: Clock },
  approved: { color: "text-green-400", bg: "bg-green-400/10", icon: CheckCircle },
  rejected: { color: "text-red-400", bg: "bg-red-400/10", icon: AlertCircle },
};

export default function EmployeeLeave() {
  const { profile, session, loading } = useAuth();
  const [leaves, setLeaves] = useState<LeaveReq[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ leave_type: LEAVE_TYPES[0], reason: "", start_date: "", end_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  

  useEffect(() => {
    if (!session || !profile) return;
    api.get("/employee/leave").then((d) => setLeaves(d as LeaveReq[])).catch(() => {});
  }, [session, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError(""); setSuccess("");
    try {
      await api.post("/employee/leave", form);
      setSuccess("Leave request submitted successfully. In Sha Allah it will be reviewed shortly.");
      setShowForm(false);
      setForm({ leave_type: LEAVE_TYPES[0], reason: "", start_date: "", end_date: "" });
      const d = await api.get("/employee/leave");
      setLeaves(d as LeaveReq[]);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    setSubmitting(false);
  };

  const stats = { total: leaves?.length, pending: leaves?.filter((l) => l.status === "pending").length, approved: leaves?.filter((l) => l.status === "approved").length };
  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <EmployeeLayout current="/employee/leave">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-4xl">
        <motion.div variants={fade} className="flex items-start justify-between">
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
            <h1 className="font-serif text-3xl text-white">Leave Management</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="h-9 bg-[#b08d57] hover:bg-[#c9a96e] text-black rounded-none font-sans text-[10px] font-bold tracking-widest uppercase gap-2">
            <Plus className="w-3.5 h-3.5" /> Request Leave
          </Button>
        </motion.div>

        <motion.div variants={fade} className="grid grid-cols-3 gap-3">
          {[["Total Requests", stats.total, "text-white"], ["Pending", stats.pending, "text-yellow-400"], ["Approved", stats.approved, "text-green-400"]].map(([label, val, color]) => (
            <div key={label as string} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-4 text-center">
              <p className={`font-serif text-3xl font-bold ${color}`}>{val}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-white/30 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {success && (
          <motion.div variants={fade} className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20">
            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            <p className="font-sans text-sm text-green-400">{success}</p>
          </motion.div>
        )}

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f2314]/80 border border-[#b08d57]/30 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-sans text-[10px] tracking-widest uppercase text-white/50 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> New Leave Request</p>
              <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-white/30 block mb-2">Leave Type *</label>
                  <select value={form.leave_type} onChange={(e) => setForm((f) => ({ ...f, leave_type: e.target.value }))} className="w-full h-10 px-3 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm focus:outline-none focus:border-[#b08d57]/50">
                    {LEAVE_TYPES.map((t) => <option key={t} value={t} className="bg-[#0a1a0e]">{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-white/30 block mb-2">Start Date *</label>
                    <input type="date" required value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} className="w-full h-10 px-3 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm focus:outline-none focus:border-[#b08d57]/50 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-white/30 block mb-2">End Date *</label>
                    <input type="date" required value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} className="w-full h-10 px-3 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm focus:outline-none focus:border-[#b08d57]/50 [color-scheme:dark]" />
                  </div>
                </div>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-white/30 block mb-2">Reason *</label>
                <textarea required rows={3} value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} className="w-full px-3 py-2.5 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm focus:outline-none focus:border-[#b08d57]/50 resize-none" />
              </div>
              {error && <p className="font-sans text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="h-9 bg-[#b08d57] hover:bg-[#c9a96e] text-black rounded-none font-sans text-[10px] font-bold tracking-widest uppercase disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="h-9 border-[#b08d57]/20 text-white/50 hover:text-white rounded-none font-sans text-[10px] tracking-widest uppercase">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/15">
          <div className="px-5 py-4 border-b border-[#b08d57]/10">
            <p className="font-sans text-[10px] tracking-widest uppercase text-white/40">Leave History</p>
          </div>
          {leaves?.length === 0 ? (
            <p className="font-sans text-sm text-white/20 text-center py-12">No leave requests submitted yet</p>
          ) : (
            <div className="divide-y divide-[#b08d57]/8">
              {leaves?.map((l) => {
                const s = STATUS_MAP[l.status] || STATUS_MAP.pending;
                const Icon = s.icon;
                return (
                  <div key={l.id} className="p-4 hover:bg-[#b08d57]/3 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans text-xs font-bold text-white">{l.leave_type}</span>
                          <span className="font-sans text-[9px] text-white/30">· {l.days} day{l.days !== 1 ? "s" : ""}</span>
                        </div>
                        <p className="font-sans text-sm text-white/50">{l.reason}</p>
                        <p className="font-sans text-[10px] text-white/25 mt-1">
                          {new Date(l.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} → {new Date(l.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        {l.admin_note && <p className="font-sans text-xs text-[#b08d57]/60 mt-1 italic">Note: {l.admin_note}</p>}
                      </div>
                      <span className={`inline-flex items-center gap-1 font-sans text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${s.bg} ${s.color}`}>
                        <Icon className="w-3 h-3" />{l.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
