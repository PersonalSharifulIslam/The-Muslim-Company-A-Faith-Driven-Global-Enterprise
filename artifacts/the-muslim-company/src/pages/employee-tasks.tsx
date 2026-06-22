import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Calendar, AlertCircle, MessageSquare, Send } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
type Task = { id: number; title: string; description: string; priority: string; status: string; progress: number; deadline: string | null; assigned_by: string; created_at: string };
type Comment = { id: number; author_name: string; comment: string; created_at: string };
const PRIORITY: Record<string, string> = { high: "text-red-400 border-red-400/30 bg-red-400/5", urgent: "text-red-400 border-red-400/30 bg-red-400/5", medium: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5", low: "text-green-400 border-green-400/30 bg-green-400/5" };
const STATUS_TABS = ["all", "pending", "in_progress", "done"];
const STATUS_LABELS: Record<string, string> = { all: "all", pending: "pending", in_progress: "in progress", done: "completed" };

export default function EmployeeTasks() {
  const { profile, session, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentDraft, setCommentDraft] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (!session || !profile) return;
    api.get("/employee/tasks").then((d) => setTasks((d as Task[]) || [])).catch(() => {});
  }, [session, profile]);

  const update = async (id: number, status: string, progress: number) => {
    setUpdating(id);
    try {
      const d = await api.put(`/employee/tasks/${id}`, { status, progress }, true) as Task;
      setTasks((ts) => ts.map((t) => (t.id === id ? d : t)));
    } catch { /* noop */ }
    setUpdating(null);
  };

  async function toggleExpand(id: number) {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!comments[id]) {
      try {
        const c = await api.get(`/tasks/${id}/comments`) as Comment[];
        setComments((prev) => ({ ...prev, [id]: c || [] }));
      } catch {}
    }
  }

  async function postComment(taskId: number) {
    if (!commentDraft.trim()) return;
    setPostingComment(true);
    try {
      await api.post("/employee/task-comment", { task_id: taskId, comment: commentDraft }, true);
      const c = await api.get(`/tasks/${taskId}/comments`) as Comment[];
      setComments((prev) => ({ ...prev, [taskId]: c || [] }));
      setCommentDraft("");
    } catch {}
    setPostingComment(false);
  }

  const filtered = (filter === "all" ? tasks : tasks?.filter((t) => t.status === filter)) || [];
  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <EmployeeLayout current="/employee/tasks">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-4xl">
        <motion.div variants={fade}>
          <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
          <h1 className="font-serif text-3xl text-white">My Tasks</h1>
        </motion.div>

        <motion.div variants={fade} className="grid grid-cols-4 gap-3">
          {[["Total", tasks?.length, "text-white"], ["Pending", tasks?.filter((t) => t.status === "pending").length, "text-yellow-400"], ["In Progress", tasks?.filter((t) => t.status === "in_progress").length, "text-blue-400"], ["Completed", tasks?.filter((t) => t.status === "done").length, "text-green-400"]].map(([label, val, color]) => (
            <div key={label as string} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-4 text-center">
              <p className={`font-serif text-3xl font-bold ${color}`}>{val}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-white/30 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fade} className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className={`font-sans text-[10px] tracking-widest uppercase px-4 py-2 transition-all ${filter === tab ? "bg-[#b08d57] text-black font-bold" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
              {STATUS_LABELS[tab]}
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
                  onChange={(e) => update(t.id, e.target.value, e.target.value === "done" ? 100 : t.progress)}
                  className={`font-sans text-[10px] uppercase tracking-widest px-2 py-1.5 border focus:outline-none disabled:opacity-50 cursor-pointer ${t.status === "done" ? "bg-green-400/10 border-green-400/30 text-green-400" : t.status === "in_progress" ? "bg-blue-400/10 border-blue-400/30 text-blue-400" : "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"}`}
                >
                  <option value="pending" className="bg-[#0a1a0e] text-white">Pending</option>
                  <option value="in_progress" className="bg-[#0a1a0e] text-white">In Progress</option>
                  <option value="done" className="bg-[#0a1a0e] text-white">Completed</option>
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
                  disabled={updating === t.id || t.status === "done"}
                  onChange={(e) => update(t.id, t.status, parseInt(e.target.value))}
                  className="w-full accent-[#b08d57] disabled:opacity-30 cursor-pointer h-1"
                />
              </div>

              {t.status === "done" && (
                <div className="flex items-center gap-1.5 mt-2">
                  <AlertCircle className="w-3 h-3 text-green-400" />
                  <p className="font-sans text-[10px] text-green-400">Completed · Jazakallah Khair</p>
                </div>
              )}

              <button onClick={() => toggleExpand(t.id)} className="flex items-center gap-1.5 mt-3 font-sans text-[10px] uppercase tracking-widest text-[#b08d57]/70 hover:text-[#b08d57]">
                <MessageSquare className="w-3 h-3" /> {comments[t.id]?.length ? `${comments[t.id].length} comment${comments[t.id].length !== 1 ? "s" : ""}` : "Comments"}
              </button>

              {expanded === t.id && (
                <div className="mt-3 pt-3 border-t border-[#b08d57]/10 space-y-2">
                  {(comments[t.id] || []).map((c) => (
                    <div key={c.id} className="bg-white/[0.03] rounded p-2.5">
                      <p className="font-sans text-[10px] text-[#b08d57]/80 font-semibold">{c.author_name}</p>
                      <p className="font-sans text-xs text-white/70">{c.comment}</p>
                      <p className="font-sans text-[9px] text-white/20 mt-0.5">{new Date(c.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} placeholder="Add an update or comment..."
                      onKeyDown={(e) => e.key === "Enter" && postComment(t.id)}
                      className="flex-1 h-9 px-3 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-[#b08d57] rounded" />
                    <button onClick={() => postComment(t.id)} disabled={postingComment}
                      className="bg-[#b08d57] text-[#0a1a0e] px-3 rounded disabled:opacity-50"><Send className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
