import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Calendar, AlertCircle } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
type Task = { id: number; title: string; description: string; priority: string; status: string; progress: number; deadline: string | null; assigned_by: string; created_at: string };
const PRIORITY: Record<string, string> = { high: "text-red-400 border-red-400/30 bg-red-400/5", medium: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5", low: "text-green-400 border-green-400/30 bg-green-400/5" };
const STATUS_TABS = ["all", "pending", "in-progress", "completed"];

export default function EmployeeTasks() {
  const { employee, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const api = empApi();

  useEffect(() => { if (employee) api.get("/employee/tasks").then((d) => setTasks(d as Task[])).catch(() => {}); }, [employee]);

  const update = async (id: number, status: string, progress: number) => {
    setUpdating(id);
    try {
      const d = await api.put(`/employee/tasks/${id}`, { status, progress }) as Task;
      setTasks((ts) => ts.map((t) => (t.id === id ? d : t)));
    } catch { /* noop */ }
    setUpdating(null);
  };

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  if (loading || !employee) return null;

  return (
    <EmployeeLayout current="/employee/tasks">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-4xl">
        <motion.div variants={fade}>
          <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
          <h1 className="font-serif text-3xl text-white">My Tasks</h1>
        </motion.div>

        <motion.div variants={fade} className="grid grid-cols-4 gap-3">
          {[["Total", tasks.length, "text-white"], ["Pending", tasks.filter((t) => t.status === "pending").length, "text-yellow-400"], ["In Progress", tasks.filter((t) => t.status === "in-progress").length, "text-blue-400"], ["Completed", tasks.filter((t) => t.status === "completed").length, "text-green-400"]].map(([label, val, color]) => (
            <div key={label as string} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-4 text-center">
              <p className={`font-serif text-3xl font-bold ${color}`}>{val}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-white/30 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fade} className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className={`font-sans text-[10px] tracking-widest uppercase px-4 py-2 transition-all ${filter === tab ? "bg-[#b08d57] text-black font-bold" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
              {tab}
            </button>
          ))}
        </motion.div>

        <motion.div variants={fade} className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-[#0f2314]/60 border border-[#b08d57]/15 py-16 text-center">
              <CheckSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="font-sans text-sm text-white/20">No tasks found</p>
            </div>
          ) : filtered.map((t) => (
            <div key={t.id} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-5 hover:border-[#b08d57]/30 transition-all">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-sans text-sm font-semibold text-white">{t.title}</h3>
                    <span className={`font-sans text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${PRIORITY[t.priority] || "text-white/30 border-white/10"}`}>{t.priority}</span>
                  </div>
                  {t.description && <p className="font-sans text-xs text-white/40">{t.description}</p>}
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-sans text-white/25">
                    {t.deadline && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {new Date(t.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    <span>Assigned by: {t.assigned_by}</span>
                  </div>
                </div>
                <select
                  value={t.status}
                  disabled={updating === t.id}
                  onChange={(e) => update(t.id, e.target.value, e.target.value === "completed" ? 100 : t.progress)}
                  className={`font-sans text-[10px] uppercase tracking-widest px-2 py-1.5 border focus:outline-none disabled:opacity-50 cursor-pointer ${t.status === "completed" ? "bg-green-400/10 border-green-400/30 text-green-400" : t.status === "in-progress" ? "bg-blue-400/10 border-blue-400/30 text-blue-400" : "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"}`}
                >
                  <option value="pending" className="bg-[#0a1a0e] text-white">Pending</option>
                  <option value="in-progress" className="bg-[#0a1a0e] text-white">In Progress</option>
                  <option value="completed" className="bg-[#0a1a0e] text-white">Completed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-[9px] tracking-widest uppercase text-white/25">Progress</p>
                  <p className="font-mono text-[10px] text-[#b08d57]">{t.progress}%</p>
                </div>
                <div className="h-1.5 bg-white/10 w-full">
                  <div className="h-full bg-[#b08d57] transition-all" style={{ width: `${t.progress}%` }} />
                </div>
                <input
                  type="range" min={0} max={100} step={5} value={t.progress}
                  disabled={updating === t.id || t.status === "completed"}
                  onChange={(e) => update(t.id, t.status, parseInt(e.target.value))}
                  className="w-full accent-[#b08d57] disabled:opacity-30 cursor-pointer h-1"
                />
              </div>

              {t.status === "completed" && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle className="w-3 h-3 text-green-400" />
                  <p className="font-sans text-[10px] text-green-400">Completed · Jazakallah Khair</p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
