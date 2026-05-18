import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, CheckSquare, Bell, LogIn, LogOut, TrendingUp, AlertCircle } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useEmployeeAuth, empApi } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

type DashData = {
  employee: { name: string; employee_id: string; department: string; role: string; position: string; joining_date: string };
  today_attendance: { check_in: string; check_out: string; working_hours: number } | null;
  leave_stats: { status: string; count: string }[];
  task_stats: { status: string; count: string }[];
  unread_notifications: number;
  recent_tasks: { id: number; title: string; priority: string; status: string; deadline: string }[];
  recent_notifications: { id: number; title: string; message: string; type: string; created_at: string; is_read: boolean }[];
};

const PRIORITY_COLOR: Record<string, string> = { high: "text-red-400 bg-red-400/10", medium: "text-yellow-400 bg-yellow-400/10", low: "text-green-400 bg-green-400/10" };
const STATUS_COLOR: Record<string, string> = { pending: "text-yellow-400", "in-progress": "text-blue-400", completed: "text-green-400" };
const NOTIF_ICON: Record<string, string> = { info: "🔵", warning: "🟡", success: "🟢", urgent: "🔴" };

function fmt(dt: string) { return new Date(dt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
function fmtDate(dt: string) { return new Date(dt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }

export default function EmployeeDashboard() {
  const { employee, loading } = useEmployeeAuth();
  const [data, setData] = useState<DashData | null>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [error, setError] = useState("");
  const api = empApi();

  useEffect(() => {
    if (!loading && !employee) window.location.href = "/employee";
  }, [employee, loading]);

  useEffect(() => {
    if (!employee) return;
    api.get("/employee/dashboard").then((d) => setData(d as DashData)).catch(() => {});
  }, [employee]);

  const handleAttendance = async (type: "checkin" | "checkout") => {
    setCheckinLoading(true); setError("");
    try {
      await api.post(`/employee/attendance/${type}`, {});
      const d = await api.get("/employee/dashboard");
      setData(d as DashData);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    setCheckinLoading(false);
  };

  if (loading || !employee) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Assalamu Alaikum" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const pendingLeaves = data?.leave_stats.find((s) => s.status === "pending")?.count || "0";
  const completedTasks = data?.task_stats.find((s) => s.status === "completed")?.count || "0";
  const pendingTasks = data?.task_stats.find((s) => s.status === "pending")?.count || "0";

  return (
    <EmployeeLayout current="/employee/dashboard">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-5xl">
        <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">{greeting}</p>
            <h1 className="font-serif text-3xl text-white">{employee.name}</h1>
            <p className="font-sans text-sm text-white/30 mt-0.5">{data?.employee.position || data?.employee.role} · {data?.employee.department}</p>
          </div>
          <div className="text-right">
            <p className="font-sans text-[10px] tracking-widest uppercase text-white/20">Employee ID</p>
            <p className="font-mono text-base text-[#b08d57] font-bold">{employee.employee_id}</p>
          </div>
        </motion.div>

        <motion.div variants={fade} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Unread Alerts", value: data?.unread_notifications ?? "—", icon: Bell, color: "text-[#b08d57]", bg: "bg-[#b08d57]/10" },
            { label: "Pending Tasks", value: pendingTasks, icon: CheckSquare, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Tasks Done", value: completedTasks, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
            { label: "Leave Pending", value: pendingLeaves, icon: Calendar, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-4">
              <div className={`inline-flex items-center justify-center w-8 h-8 ${bg} mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="font-serif text-2xl text-white font-bold">{value}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans text-[10px] tracking-widest uppercase text-white/40 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Today's Attendance</p>
              <span className={`font-sans text-[9px] px-2 py-0.5 ${data?.today_attendance?.check_out ? "bg-green-400/10 text-green-400" : data?.today_attendance?.check_in ? "bg-blue-400/10 text-blue-400" : "bg-white/5 text-white/30"}`}>
                {data?.today_attendance?.check_out ? "Completed" : data?.today_attendance?.check_in ? "Checked In" : "Not Started"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="font-sans text-[9px] tracking-widest uppercase text-white/25 mb-1">Check In</p>
                <p className="font-mono text-lg text-white">{data?.today_attendance?.check_in ? fmt(data.today_attendance.check_in) : "—:——"}</p>
              </div>
              <div>
                <p className="font-sans text-[9px] tracking-widest uppercase text-white/25 mb-1">Check Out</p>
                <p className="font-mono text-lg text-white">{data?.today_attendance?.check_out ? fmt(data.today_attendance.check_out) : "—:——"}</p>
              </div>
              <div>
                <p className="font-sans text-[9px] tracking-widest uppercase text-white/25 mb-1">Hours Worked</p>
                <p className="font-mono text-lg text-[#b08d57]">{data?.today_attendance?.working_hours ? `${data.today_attendance.working_hours}h` : "—"}</p>
              </div>
            </div>
            {error && <p className="font-sans text-xs text-red-400 mb-3 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
            <div className="flex gap-2">
              <Button onClick={() => handleAttendance("checkin")} disabled={checkinLoading || !!data?.today_attendance?.check_in} className="flex-1 h-9 bg-[#b08d57] hover:bg-[#c9a96e] text-black rounded-none font-sans text-[10px] font-bold tracking-widest uppercase gap-1.5 disabled:opacity-30">
                <LogIn className="w-3.5 h-3.5" /> Check In
              </Button>
              <Button onClick={() => handleAttendance("checkout")} disabled={checkinLoading || !data?.today_attendance?.check_in || !!data?.today_attendance?.check_out} variant="outline" className="flex-1 h-9 border-[#b08d57]/30 text-[#b08d57] hover:bg-[#b08d57]/10 rounded-none font-sans text-[10px] font-bold tracking-widest uppercase gap-1.5 disabled:opacity-30">
                <LogOut className="w-3.5 h-3.5" /> Check Out
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-5">
            <p className="font-sans text-[10px] tracking-widest uppercase text-white/40 mb-4 flex items-center gap-2"><CheckSquare className="w-3.5 h-3.5" /> Recent Tasks</p>
            {!data?.recent_tasks?.length ? (
              <p className="font-sans text-sm text-white/20 text-center py-6">No tasks assigned yet</p>
            ) : (
              <div className="space-y-2">
                {data.recent_tasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-[#b08d57]/8">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-white truncate">{t.title}</p>
                      {t.deadline && <p className="font-sans text-[10px] text-white/30">Due: {fmtDate(t.deadline)}</p>}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`font-sans text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wide ${PRIORITY_COLOR[t.priority] || "text-white/30 bg-white/5"}`}>{t.priority}</span>
                      <span className={`font-sans text-[9px] uppercase tracking-wide ${STATUS_COLOR[t.status] || "text-white/30"}`}>{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <a href="/employee/tasks" className="font-sans text-[10px] tracking-widest uppercase text-[#b08d57]/50 hover:text-[#b08d57] mt-3 block transition-colors">View all tasks →</a>
          </motion.div>
        </div>

        <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-5">
          <p className="font-sans text-[10px] tracking-widest uppercase text-white/40 mb-4 flex items-center gap-2"><Bell className="w-3.5 h-3.5" /> Recent Notifications</p>
          {!data?.recent_notifications?.length ? (
            <p className="font-sans text-sm text-white/20 text-center py-4">No notifications</p>
          ) : (
            <div className="space-y-3">
              {data.recent_notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 p-3 border ${n.is_read ? "border-[#b08d57]/8 bg-white/2" : "border-[#b08d57]/20 bg-[#b08d57]/5"}`}>
                  <span className="text-base mt-0.5">{NOTIF_ICON[n.type] || "🔵"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-white font-semibold">{n.title}</p>
                    <p className="font-sans text-xs text-white/50 truncate">{n.message}</p>
                    <p className="font-sans text-[9px] text-white/25 mt-1">{fmtDate(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-[#b08d57] mt-1.5 shrink-0" />}
                </div>
              ))}
            </div>
          )}
          <a href="/employee/notifications" className="font-sans text-[10px] tracking-widest uppercase text-[#b08d57]/50 hover:text-[#b08d57] mt-3 block transition-colors">View all →</a>
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
