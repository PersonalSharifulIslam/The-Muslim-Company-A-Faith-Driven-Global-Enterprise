import { useState, useEffect } from "react";
import { Trash2, User, Calendar, ChevronDown } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";

type DeleteLog = {
  id: number;
  table_name: string;
  record_id: string;
  record_data: any;
  deleted_by: string | null;
  deleted_by_name: string | null;
  deleted_by_email: string | null;
  reason: string | null;
  created_at: string;
};

export default function AdminDeleteLogs() {
  const [logs, setLogs] = useState<DeleteLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTable, setFilterTable] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("delete_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setLogs((data as DeleteLog[]) || []);
    } catch (e: any) {
      setError(e.message || "Failed to load delete logs. This page is only accessible to the top Admin.");
    }
    setLoading(false);
  }

  const tables = Array.from(new Set(logs.map(l => l.table_name)));
  const filtered = filterTable === "all" ? logs : logs.filter(l => l.table_name === filterTable);

  return (
    <AdminLayout current="/admin/delete-logs">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Trash2 className="w-6 h-6 text-secondary" />
          <h1 className="font-serif text-2xl text-primary">Delete Logs</h1>
        </div>
        <p className="font-sans text-xs text-primary/65 mb-6">
          A permanent, read-only record of everything deleted across the system — full snapshot of the deleted record,
          who deleted it, and when. Visible only to the top Admin. Entries here cannot be edited or removed by anyone.
        </p>

        {error && <div className="mb-4 p-3 bg-red-400/10 text-red-400 font-sans text-sm rounded">{error}</div>}

        {!error && (
          <div className="flex gap-3 mb-4">
            <select value={filterTable} onChange={e => setFilterTable(e.target.value)}
              className="h-9 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
              <option value="all">All Records ({logs.length})</option>
              {tables.map(t => (
                <option key={t} value={t}>{t} ({logs.filter(l => l.table_name === t).length})</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : !error && filtered.length === 0 ? (
          <div className="text-center py-12 text-primary/65 font-sans text-sm">No deletions have been logged yet.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(log => (
              <div key={log.id} className="border border-primary/10 bg-card">
                <button
                  onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                  className="w-full flex items-start justify-between gap-4 p-4 text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-red-400/10 text-red-400">
                        Deleted
                      </span>
                      <span className="font-sans text-xs text-primary/40">
                        {log.table_name} · #{log.record_id}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-primary/60 flex items-center gap-1.5">
                      <User className="w-3 h-3" /> {log.deleted_by_name || "Unknown"}
                      {log.deleted_by_email && <span className="text-primary/30">({log.deleted_by_email})</span>}
                    </p>
                    {log.record_data?.name && (
                      <p className="font-sans text-sm text-primary mt-1">{log.record_data.name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="font-sans text-xs text-primary/65 flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar className="w-3 h-3" /> {new Date(log.created_at).toLocaleString()}
                    </p>
                    <ChevronDown className={`w-4 h-4 text-primary/40 transition-transform ${expanded === log.id ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {expanded === log.id && (
                  <div className="px-4 pb-4 border-t border-primary/10 pt-3">
                    <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-2">Full Record Snapshot</p>
                    <pre className="font-mono text-xs text-primary/70 bg-background p-3 overflow-x-auto whitespace-pre-wrap break-all">
                      {JSON.stringify(log.record_data, null, 2)}
                    </pre>
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
