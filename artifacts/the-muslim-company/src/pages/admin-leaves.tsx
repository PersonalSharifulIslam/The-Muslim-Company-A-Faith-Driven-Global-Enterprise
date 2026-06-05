import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Clock, Calendar, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Leave = {
  id: number;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
  employees?: { name: string; department: string; position: string };
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  approved: "bg-green-400/10 text-green-400 border-green-400/20",
  rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [editDates, setEditDates] = useState<{ start: string; end: string } | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get("/admin/leaves") as Leave[];
      setLeaves(data || []);
    } catch (e) {
      setMsg({ type: "err", text: "Failed to load leave requests" });
    }
    setLoading(false);
  }

  async function handleAction(id: number, status: "approved" | "rejected", leave: Leave) {
    setProcessing(id);
    setMsg(null);
    try {
      await api.put(`/admin/leaves/${id}`, {
        status,
        admin_note: note || null,
        start_date: editDates?.start || leave.start_date,
        end_date: editDates?.end || leave.end_date,
      }, true);
      setMsg({ type: "ok", text: `Leave ${status} successfully` });
      setExpanded(null);
      setNote("");
      setEditDates(null);
      await load();
    } catch (e: unknown) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Error" });
    }
    setProcessing(null);
  }

  const filtered = leaves.filter(l => filter === "all" || l.status === filter);
  const counts = {
    all: leaves.length,
    pending: leaves.filter(l => l.status === "pending").length,
    approved: leaves.filter(l => l.status === "approved").length,
    rejected: leaves.filter(l => l.status === "rejected").length,
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl text-primary mb-1">Leave Requests</h1>
          <p className="font-sans text-xs text-primary/50">Review, approve, or reject employee leave requests.</p>
        </div>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {msg.text}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`p-4 border rounded text-center transition-colors ${filter === s ? "border-secondary bg-secondary/5" : "border-primary/10 hover:border-primary/30"}`}>
              <p className="font-serif text-2xl text-primary">{counts[s]}</p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 capitalize">{s}</p>
            </button>
          ))}
        </div>

        {/* Leave List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-primary/40 font-sans text-sm">No {filter} leave requests</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(leave => (
              <motion.div key={leave.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="border border-primary/10 bg-card">

                {/* Row */}
                <button className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-primary/5 transition-colors"
                  onClick={() => { setExpanded(expanded === leave.id ? null : leave.id); setNote(""); setEditDates(null); }}>
                  <div className="flex items-center gap-4 flex-1 min-w-0 text-left">
                    <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-sans text-xs font-bold text-secondary">
                        {leave.employees?.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium text-primary truncate">
                        {leave.employees?.name || leave.employee_id}
                      </p>
                      <p className="font-sans text-xs text-primary/40 truncate">
                        {leave.employees?.department} · {leave.leave_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-sans text-xs text-primary/60">
                        {new Date(leave.start_date).toLocaleDateString()} – {new Date(leave.end_date).toLocaleDateString()}
                      </p>
                      <p className="font-sans text-[10px] text-primary/40">{leave.days} day{leave.days !== 1 ? "s" : ""}</p>
                    </div>
                    <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-1 border rounded ${STATUS_COLORS[leave.status]}`}>
                      {leave.status}
                    </span>
                    {expanded === leave.id ? <ChevronUp className="w-4 h-4 text-primary/40" /> : <ChevronDown className="w-4 h-4 text-primary/40" />}
                  </div>
                </button>

                {/* Expanded */}
                {expanded === leave.id && (
                  <div className="px-5 pb-5 border-t border-primary/10 pt-4 space-y-4">

                    {/* Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 mb-1">Leave Type</p>
                        <p className="font-sans text-sm text-primary">{leave.leave_type}</p>
                      </div>
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 mb-1">Duration</p>
                        <p className="font-sans text-sm text-primary">{leave.days} day{leave.days !== 1 ? "s" : ""}</p>
                      </div>
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 mb-1">Applied</p>
                        <p className="font-sans text-sm text-primary">{new Date(leave.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 mb-1">Status</p>
                        <p className={`font-sans text-sm capitalize ${leave.status === "approved" ? "text-green-400" : leave.status === "rejected" ? "text-red-400" : "text-yellow-400"}`}>
                          {leave.status}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 mb-1">Reason</p>
                      <p className="font-sans text-sm text-primary/70 bg-background border border-primary/10 p-3">{leave.reason}</p>
                    </div>

                    {/* Edit Dates */}
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 mb-2">Adjust Dates (optional)</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-sans text-xs text-primary/50 mb-1 block">Start Date</label>
                          <input type="date" defaultValue={leave.start_date}
                            onChange={e => setEditDates(prev => ({ start: e.target.value, end: prev?.end || leave.end_date }))}
                            className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                        </div>
                        <div>
                          <label className="font-sans text-xs text-primary/50 mb-1 block">End Date</label>
                          <input type="date" defaultValue={leave.end_date}
                            onChange={e => setEditDates(prev => ({ start: prev?.start || leave.start_date, end: e.target.value }))}
                            className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                        </div>
                      </div>
                    </div>

                    {/* Admin Note */}
                    <div>
                      <label className="font-sans text-[10px] uppercase tracking-widest text-primary/40 mb-2 block">Admin Note (optional)</label>
                      <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                        placeholder="Add a note for the employee..."
                        className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
                    </div>

                    {leave.admin_note && (
                      <div className="p-3 bg-primary/5 border border-primary/10">
                        <p className="font-sans text-[10px] uppercase tracking-widest text-primary/40 mb-1">Previous Admin Note</p>
                        <p className="font-sans text-sm text-primary/70">{leave.admin_note}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {leave.status === "pending" && (
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => handleAction(leave.id, "approved", leave)}
                          disabled={processing === leave.id}
                          className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-sans text-xs uppercase tracking-widest h-9 px-5 transition-colors disabled:opacity-50">
                          <Check className="w-3.5 h-3.5" />
                          {processing === leave.id ? "Processing..." : "Approve"}
                        </button>
                        <button onClick={() => handleAction(leave.id, "rejected", leave)}
                          disabled={processing === leave.id}
                          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-sans text-xs uppercase tracking-widest h-9 px-5 transition-colors disabled:opacity-50">
                          <X className="w-3.5 h-3.5" />
                          {processing === leave.id ? "Processing..." : "Reject"}
                        </button>
                      </div>
                    )}

                    {leave.status !== "pending" && (
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => handleAction(leave.id, "approved", leave)}
                          disabled={processing === leave.id || leave.status === "approved"}
                          className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-sans text-xs uppercase tracking-widest h-9 px-5 transition-colors disabled:opacity-50">
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleAction(leave.id, "rejected", leave)}
                          disabled={processing === leave.id || leave.status === "rejected"}
                          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-sans text-xs uppercase tracking-widest h-9 px-5 transition-colors disabled:opacity-50">
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
