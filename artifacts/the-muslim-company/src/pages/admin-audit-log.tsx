import { useState, useEffect } from "react";
import { ShieldAlert, User, Calendar } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type AuditEntry = {
  id: number; actor_id: string; actor_email: string; actor_role: string;
  action: string; target_table: string; target_id: string; details: any;
  created_at: string;
};

const ACTION_COLORS: Record<string, string> = {
  employee_created: "bg-blue-400/10 text-blue-400",
  leave_approved: "bg-green-400/10 text-green-400",
  leave_rejected: "bg-red-400/10 text-red-400",
  payroll_created: "bg-lime-400/10 text-lime-400",
  task_assigned: "bg-cyan-400/10 text-cyan-400",
};

function actionLabel(action: string) {
  return action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default function AdminAuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get("/admin/audit-log") as AuditEntry[];
      setEntries(data || []);
    } catch (e: any) {
      setError(e.message || "Failed to load audit log");
    }
    setLoading(false);
  }

  const actions = Array.from(new Set(entries.map(e => e.action)));
  const filtered = filterAction === "all" ? entries : entries.filter(e => e.action === filterAction);

  return (
    <AdminLayout current="/admin/audit-log">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="w-6 h-6 text-secondary" />
          <h1 className="font-serif text-2xl text-primary">Audit Trail</h1>
        </div>
        <p className="font-sans text-xs text-primary/50 mb-6">
          A read-only, append-only record of significant admin actions across the organization. Visible only to Admin, Executive, VP and Director roles.
        </p>

        {error && <div className="mb-4 p-3 bg-red-400/10 text-red-400 font-sans text-sm rounded">{error}</div>}

        <div className="flex gap-3 mb-4">
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
            className="h-9 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
            <option value="all">All Actions ({entries.length})</option>
            {actions.map(a => (
              <option key={a} value={a}>{actionLabel(a)} ({entries.filter(e => e.action === a).length})</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-primary/40 font-sans text-sm">No audit entries found</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(e => (
              <div key={e.id} className="border border-primary/10 bg-card p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${ACTION_COLORS[e.action] || "bg-primary/5 text-primary/60"}`}>
                      {actionLabel(e.action)}
                    </span>
                    {e.target_table && (
                      <span className="font-sans text-[10px] text-primary/30">{e.target_table}{e.target_id ? ` · #${e.target_id}` : ""}</span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-primary/60 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> {e.actor_email} <span className="text-primary/30">({e.actor_role})</span>
                  </p>
                  {e.details && (
                    <p className="font-sans text-[11px] text-primary/40 mt-1.5 font-mono">
                      {Object.entries(e.details).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </p>
                  )}
                </div>
                <p className="font-sans text-[11px] text-primary/40 flex items-center gap-1.5 whitespace-nowrap">
                  <Calendar className="w-3 h-3" /> {new Date(e.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
