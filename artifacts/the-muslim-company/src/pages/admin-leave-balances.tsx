import { useState, useEffect } from "react";
import { Edit2, Check, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Balance = { employee_id: string; name: string; department: string; quota: number; used: number; remaining: number };

export default function AdminLeaveBalances() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [newQuota, setNewQuota] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setBalances((await api.get("/admin/leave-balances")) as Balance[] || []); } catch {}
    setLoading(false);
  }

  async function saveQuota(employee_id: string) {
    try {
      await api.post("/admin/leave-balances", { employee_id, annual_quota: Number(newQuota) }, true);
      setMsg({ type: "ok", text: "Quota updated" });
      setEditing(null);
      await load();
    } catch (e: any) { setMsg({ type: "err", text: e.message || "Error" }); }
  }

  return (
    <AdminLayout current="/admin/leave-balances">
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="font-serif text-2xl text-primary mb-1">Leave Balances</h1>
        <p className="font-sans text-xs text-primary/50 mb-6">Annual leave quotas and usage for {new Date().getFullYear()}.</p>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  {["Employee", "Department", "Quota", "Used", "Remaining", ""].map(h => <th key={h} className="text-left py-3 px-3 font-sans text-[10px] uppercase tracking-widest text-primary/40">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {balances.map(b => (
                  <tr key={b.employee_id} className="border-b border-primary/5">
                    <td className="py-3 px-3 text-primary">{b.name}</td>
                    <td className="py-3 px-3 text-primary/50">{b.department}</td>
                    <td className="py-3 px-3 text-primary/70">
                      {editing === b.employee_id ? (
                        <input type="number" value={newQuota} onChange={e => setNewQuota(e.target.value)} className="w-16 h-7 px-2 bg-background border border-primary/15 text-primary text-sm" />
                      ) : b.quota}
                    </td>
                    <td className="py-3 px-3 text-primary/70">{b.used}</td>
                    <td className={`py-3 px-3 font-medium ${b.remaining <= 3 ? "text-red-400" : "text-green-400"}`}>{b.remaining}</td>
                    <td className="py-3 px-3">
                      {editing === b.employee_id ? (
                        <button onClick={() => saveQuota(b.employee_id)} className="text-green-400 text-xs font-sans uppercase">Save</button>
                      ) : (
                        <button onClick={() => { setEditing(b.employee_id); setNewQuota(String(b.quota)); }} className="text-primary/40 hover:text-secondary"><Edit2 className="w-3.5 h-3.5" /></button>
                      )}
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
