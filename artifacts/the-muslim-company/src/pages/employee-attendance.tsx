import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LogIn, LogOut, Clock, AlertCircle, CheckCircle } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

type AttRecord = { id: number; date: string; check_in: string | null; check_out: string | null; working_hours: number | null; status: string };

function fmt(dt: string) { return new Date(dt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }

export default function EmployeeAttendance() {
  const { profile, session, loading } = useAuth();
  const [records, setRecords] = useState<AttRecord[]>([]);
  const [today, setToday] = useState<AttRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [now, setNow] = useState(new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  

  useEffect(() => {
    if (!session || !profile) return;
    loadRecords();
  }, [session, profile]);

  const loadRecords = async () => {
    const d = await api.get("/employee/attendance") as AttRecord[];
    setRecords(d);
    const todayStr = new Date().toISOString().split("T")[0];
    setToday(d.find((r) => r.date.startsWith(todayStr)) || null);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handle = async (type: "checkin" | "checkout") => {
    setSubmitting(true); setError(""); setSuccess("");
    try {
      await api.post(`/employee/attendance/${type}`, {});
      setSuccess(type === "checkin" ? "Checked in successfully. Barakallahu Feekum!" : "Checked out. Jazakallah Khair for your work today!");
      await loadRecords();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    setSubmitting(false);
  };

  const elapsed = today?.check_in && !today?.check_out
    ? Math.floor((now.getTime() - new Date(today.check_in).getTime()) / 1000)
    : null;
  const elapsedStr = elapsed !== null
    ? `${String(Math.floor(elapsed / 3600)).padStart(2, "0")}:${String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`
    : null;

  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <EmployeeLayout current="/employee/attendance">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-4xl">
        <motion.div variants={fade}>
          <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
          <h1 className="font-serif text-3xl text-white">Attendance</h1>
          <p className="font-sans text-sm text-white/30 mt-1">{now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </motion.div>

        <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/20 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-white/30 mb-2">Current Time</p>
              <p className="font-mono text-5xl text-white font-bold tracking-wider">{now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
              {elapsedStr && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="font-mono text-sm text-green-400">Working: {elapsedStr}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {success && <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20"><CheckCircle className="w-4 h-4 text-green-400 shrink-0" /><p className="font-sans text-xs text-green-400">{success}</p></div>}
              {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20"><AlertCircle className="w-4 h-4 text-red-400 shrink-0" /><p className="font-sans text-xs text-red-400">{error}</p></div>}
              <div className="flex gap-3">
                <Button onClick={() => handle("checkin")} disabled={submitting || !!today?.check_in} className="h-11 px-6 bg-[#b08d57] hover:bg-[#c9a96e] text-black rounded-none font-sans text-xs font-bold tracking-widest uppercase gap-2 disabled:opacity-30">
                  <LogIn className="w-4 h-4" /> Check In
                </Button>
                <Button onClick={() => handle("checkout")} disabled={submitting || !today?.check_in || !!today?.check_out} variant="outline" className="h-11 px-6 border-[#b08d57]/30 text-[#b08d57] hover:bg-[#b08d57]/10 rounded-none font-sans text-xs font-bold tracking-widest uppercase gap-2 disabled:opacity-30">
                  <LogOut className="w-4 h-4" /> Check Out
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#b08d57]/10">
            {[["Check In", today?.check_in ? fmt(today.check_in) : "—:——"], ["Check Out", today?.check_out ? fmt(today.check_out) : "—:——"], ["Hours", today?.working_hours ? `${today.working_hours}h` : "—"]].map(([label, val]) => (
              <div key={label}>
                <p className="font-sans text-xs tracking-widest uppercase text-white/45 mb-1">{label}</p>
                <p className="font-mono text-xl text-white">{val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/15">
          <div className="px-5 py-4 border-b border-[#b08d57]/10">
            <p className="font-sans text-xs tracking-widest uppercase text-white/40 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Attendance History</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#b08d57]/10">
                  {["Date", "Check In", "Check Out", "Hours", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-sans text-xs tracking-widest uppercase text-white/45">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records?.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center font-sans text-sm text-white/45">No attendance records yet</td></tr>
                ) : records?.map((r) => (
                  <tr key={r.id} className="border-b border-[#b08d57]/5 hover:bg-[#b08d57]/3 transition-colors">
                    <td className="px-4 py-3 font-sans text-sm text-white/70">{fmtDate(r.date)}</td>
                    <td className="px-4 py-3 font-mono text-sm text-white">{r.check_in ? fmt(r.check_in) : "—"}</td>
                    <td className="px-4 py-3 font-mono text-sm text-white">{r.check_out ? fmt(r.check_out) : "—"}</td>
                    <td className="px-4 py-3 font-mono text-sm text-[#b08d57]">{r.working_hours ? `${r.working_hours}h` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-xs px-2 py-0.5 uppercase tracking-widest font-bold ${r.status === "present" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
