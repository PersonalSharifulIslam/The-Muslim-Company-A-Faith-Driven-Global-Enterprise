import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
type Notif = { id: number; title: string; message: string; type: string; is_read: boolean; broadcast: boolean; created_at: string };
const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  info: { icon: "🔵", color: "text-blue-400", bg: "bg-blue-400/5 border-blue-400/15" },
  warning: { icon: "🟡", color: "text-yellow-400", bg: "bg-yellow-400/5 border-yellow-400/15" },
  success: { icon: "🟢", color: "text-green-400", bg: "bg-green-400/5 border-green-400/15" },
  urgent: { icon: "🔴", color: "text-red-400", bg: "bg-red-400/5 border-red-400/15" },
  announcement: { icon: "📢", color: "text-[#b08d57]", bg: "bg-[#b08d57]/5 border-[#b08d57]/20" },
};

export default function EmployeeNotifications() {
  const { employee, loading } = useAuth();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const api = empApi();

  const load = async () => { if (employee) setNotifs(await api.get("/employee/notifications") as Notif[]); };
  useEffect(() => { load(); }, [employee]);

  const markRead = async (id: number) => {
    await api.put(`/employee/notifications/${id}/read`, {});
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAll = async () => {
    await api.put("/employee/notifications/read-all", {});
    setNotifs((ns) => ns.map((n) => ({ ...n, is_read: true })));
  };

  const unread = notifs.filter((n) => !n.is_read).length;
  const filtered = filter === "unread" ? notifs.filter((n) => !n.is_read) : notifs;
  if (loading || !employee) return null;

  return (
    <EmployeeLayout current="/employee/notifications">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-3xl">
        <motion.div variants={fade} className="flex items-start justify-between">
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
            <h1 className="font-serif text-3xl text-white">Notifications</h1>
            {unread > 0 && <p className="font-sans text-sm text-[#b08d57] mt-1">{unread} unread</p>}
          </div>
          {unread > 0 && (
            <Button onClick={markAll} variant="outline" className="h-8 border-[#b08d57]/20 text-white/40 hover:text-white rounded-none font-sans text-[10px] tracking-widest uppercase gap-1.5">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </Button>
          )}
        </motion.div>

        <motion.div variants={fade} className="flex gap-1">
          {(["all", "unread"] as const).map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className={`font-sans text-[10px] tracking-widest uppercase px-4 py-2 transition-all ${filter === tab ? "bg-[#b08d57] text-black font-bold" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
              {tab} {tab === "unread" && unread > 0 && `(${unread})`}
            </button>
          ))}
        </motion.div>

        <motion.div variants={fade} className="space-y-2">
          {filtered.length === 0 ? (
            <div className="bg-[#0f2314]/60 border border-[#b08d57]/15 py-16 text-center">
              <Bell className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="font-sans text-sm text-white/20">{filter === "unread" ? "No unread notifications" : "No notifications yet"}</p>
            </div>
          ) : filtered.map((n) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            return (
              <div
                key={n.id}
                onClick={() => !n.is_read && markRead(n.id)}
                className={`flex items-start gap-4 p-4 border transition-all cursor-pointer ${n.is_read ? "bg-[#0f2314]/40 border-[#b08d57]/8 opacity-60" : `${cfg.bg} border`}`}
              >
                <span className="text-xl mt-0.5 shrink-0">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`font-sans text-sm font-bold ${n.is_read ? "text-white/60" : "text-white"}`}>{n.title}</p>
                    {n.broadcast && <span className="font-sans text-[8px] tracking-widest uppercase px-1.5 py-0.5 bg-[#b08d57]/15 text-[#b08d57]">Broadcast</span>}
                  </div>
                  <p className="font-sans text-xs text-white/50">{n.message}</p>
                  <p className="font-sans text-[10px] text-white/25 mt-1.5">{new Date(n.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {new Date(n.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                {!n.is_read && <div className="w-2 h-2 rounded-full bg-[#b08d57] mt-1.5 shrink-0" />}
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
