import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Users, Newspaper, Bell, BookOpen, TrendingUp, Clock, CheckSquare,
  Wallet, Building2, CalendarDays, Megaphone, X,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { Link } from "wouter";

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const GOLD = "#b08d57";
const PIE_COLORS = ["#b08d57", "#6b9080", "#a4c3b2", "#cce3de", "#eaf4f4", "#3d5a4f", "#8a6d40"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    jobs: 0, applications: 0, news: 0, notices: 0, blogs: 0, employees: 0,
    pendingLeaves: 0, todayAttendance: 0, pendingTasks: 0, monthPayroll: 0, departments: 0,
  });
  const [attendanceTrend, setAttendanceTrend] = useState<{ date: string; present: number }[]>([]);
  const [payrollTrend, setPayrollTrend] = useState<{ month: string; total: number }[]>([]);
  const [deptDistribution, setDeptDistribution] = useState<{ name: string; value: number }[]>([]);
  const [error, setError] = useState('');

  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [bcTitle, setBcTitle] = useState("");
  const [bcMessage, setBcMessage] = useState("");
  const [bcDept, setBcDept] = useState("all");
  const [bcSending, setBcSending] = useState(false);
  const [bcResult, setBcResult] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const monthStart = new Date().toISOString().slice(0, 7);
        const last14 = new Date(); last14.setDate(last14.getDate() - 13);
        const last14Str = last14.toISOString().split('T')[0];
        const last6mo = new Date(); last6mo.setMonth(last6mo.getMonth() - 5);
        const last6moStr = last6mo.toISOString().slice(0, 7);

        const [j, a, n, no, b, e, lv, att, tk, pr, dp, attTrend, payTrend, empAll] = await Promise.all([
          supabase.from('jobs').select('id'),
          supabase.from('applications').select('id'),
          supabase.from('newsroom_posts').select('id'),
          supabase.from('notices').select('id'),
          supabase.from('blog_posts').select('id'),
          supabase.from('employees').select('id'),
          supabase.from('leave_requests').select('id').eq('status', 'pending'),
          supabase.from('attendance').select('id').eq('date', today).eq('status', 'present'),
          supabase.from('tasks').select('id').neq('status', 'done'),
          supabase.from('payroll').select('net_salary').gte('month', monthStart),
          supabase.from('departments').select('id, name'),
          supabase.from('attendance').select('date, status').gte('date', last14Str),
          supabase.from('payroll').select('month, net_salary').gte('month', last6moStr),
          supabase.from('employees').select('department'),
        ]);

        setStats({
          jobs: j.data?.length ?? 0,
          applications: a.data?.length ?? 0,
          news: n.data?.length ?? 0,
          notices: no.data?.length ?? 0,
          blogs: b.data?.length ?? 0,
          employees: e.data?.length ?? 0,
          pendingLeaves: lv.data?.length ?? 0,
          todayAttendance: att.data?.length ?? 0,
          pendingTasks: tk.data?.length ?? 0,
          monthPayroll: pr.data?.reduce((s: number, r: any) => s + Number(r.net_salary || 0), 0) ?? 0,
          departments: dp.data?.length ?? 0,
        });
        setDepartments(dp.data || []);

        // Attendance trend — last 14 days, count of "present"
        const byDate: Record<string, number> = {};
        for (const row of (attTrend.data || [])) {
          if (row.status === 'present') byDate[row.date] = (byDate[row.date] || 0) + 1;
        }
        const trend: { date: string; present: number }[] = [];
        for (let i = 13; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const key = d.toISOString().split('T')[0];
          trend.push({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), present: byDate[key] || 0 });
        }
        setAttendanceTrend(trend);

        // Payroll trend — last 6 months net salary total
        const byMonth: Record<string, number> = {};
        for (const row of (payTrend.data || [])) {
          byMonth[row.month] = (byMonth[row.month] || 0) + Number(row.net_salary || 0);
        }
        const ptrend: { month: string; total: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(); d.setMonth(d.getMonth() - i);
          const key = d.toISOString().slice(0, 7);
          ptrend.push({ month: d.toLocaleDateString('en-US', { month: 'short' }), total: byMonth[key] || 0 });
        }
        setPayrollTrend(ptrend);

        // Department headcount distribution (top 7, only departments with at least 1 employee)
        const deptCounts: Record<string, number> = {};
        for (const row of (empAll.data || [])) {
          if (row.department) deptCounts[row.department] = (deptCounts[row.department] || 0) + 1;
        }
        const distribution = Object.entries(deptCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7)
          .map(([name, value]) => ({ name, value }));
        setDeptDistribution(distribution);

        if (j.error) setError('Jobs error: ' + j.error.message);
      } catch (err: any) {
        setError('Stats error: ' + err.message);
      }
    }
    load();
  }, []);

  async function sendBroadcast() {
    if (!bcTitle.trim() || !bcMessage.trim()) return;
    setBcSending(true);
    setBcResult(null);
    try {
      const res = await api.post("/admin/broadcast", { title: bcTitle, message: bcMessage, department: bcDept }, true) as any;
      setBcResult(`Sent to ${res.sent} employee${res.sent !== 1 ? "s" : ""}.`);
      setBcTitle(""); setBcMessage(""); setBcDept("all");
    } catch (e: any) {
      setBcResult("Failed: " + e.message);
    }
    setBcSending(false);
  }

  const CARDS = [
    { label: "Active Jobs",       value: stats.jobs,            icon: Briefcase,    href: "/admin/careers",      color: "text-blue-400" },
    { label: "Applications",      value: stats.applications,    icon: Users,        href: "/admin/applications", color: "text-green-400" },
    { label: "Employees",         value: stats.employees,       icon: TrendingUp,   href: "/admin/employees",    color: "text-pink-400" },
    { label: "Present Today",     value: stats.todayAttendance, icon: Clock,        href: "/admin/attendance",   color: "text-emerald-400" },
    { label: "Pending Leaves",    value: stats.pendingLeaves,   icon: CalendarDays, href: "/admin/leaves",       color: "text-amber-400" },
    { label: "Open Tasks",        value: stats.pendingTasks,    icon: CheckSquare,  href: "/admin/tasks",        color: "text-cyan-400" },
    { label: "Payroll (Month)",   value: `৳${stats.monthPayroll.toLocaleString()}`, icon: Wallet, href: "/admin/payroll", color: "text-lime-400" },
    { label: "Departments",       value: stats.departments,     icon: Building2,    href: "/admin/departments",  color: "text-indigo-400" },
    { label: "News Posts",        value: stats.news,            icon: Newspaper,    href: "/admin/newsroom",     color: "text-purple-400" },
    { label: "Notices",           value: stats.notices,         icon: Bell,         href: "/admin/notices",      color: "text-yellow-400" },
    { label: "Blog Posts",        value: stats.blogs,           icon: BookOpen,     href: "/admin/blog",         color: "text-orange-400" },
  ];

  return (
    <AdminLayout current="/admin/dashboard">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeIn} className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-primary mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to The Muslim Company Admin Panel</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button onClick={() => setBroadcastOpen(true)}
            className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-10 px-5 rounded-lg hover:bg-secondary/90 transition-colors">
            <Megaphone className="w-4 h-4" /> Broadcast Announcement
          </button>
        </motion.div>

        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {CARDS.map(({ label, value, icon: Icon, href, color }) => (
            <Link key={label} href={href} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
              <Icon className={`${color} mb-3`} size={22} />
              <p className="font-serif text-2xl text-primary mb-1">{value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            </Link>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="font-serif text-base text-primary mb-3">Attendance — Last 14 Days</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} />
                <YAxis tick={{ fontSize: 10, fill: "#888" }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#0f2214", border: "1px solid #b08d57", borderRadius: 6, fontSize: 12 }} />
                <Area type="monotone" dataKey="present" stroke={GOLD} fill="url(#attGrad)" strokeWidth={2} name="Present" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <p className="font-serif text-base text-primary mb-3">Payroll Outflow — Last 6 Months</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={payrollTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#888" }} />
                <YAxis tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => `৳${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#0f2214", border: "1px solid #b08d57", borderRadius: 6, fontSize: 12 }}
                  formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, "Net Payroll"]} />
                <Bar dataKey="total" fill={GOLD} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
            <p className="font-serif text-base text-primary mb-3">Headcount by Department (Top 7)</p>
            {deptDistribution.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No employee/department data yet</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={220} className="sm:w-1/2">
                  <PieChart>
                    <Pie data={deptDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ value }) => value}>
                      {deptDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0f2214", border: "1px solid #b08d57", borderRadius: 6, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 w-full">
                  {deptDistribution.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-primary/70 truncate">{d.name}</span>
                      <span className="text-primary/65 ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeIn}>
          <h2 className="font-serif text-xl text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Post New Job",       href: "/admin/careers" },
              { label: "View Applications",  href: "/admin/applications" },
              { label: "Manage Employees",   href: "/admin/employees" },
              { label: "Mark Attendance",    href: "/admin/attendance" },
              { label: "Review Leave Requests", href: "/admin/leaves" },
              { label: "Assign a Task",      href: "/admin/tasks" },
              { label: "Run Payroll",        href: "/admin/payroll" },
              { label: "Manage Departments", href: "/admin/departments" },
              { label: "Add News Post",      href: "/admin/newsroom" },
              { label: "Post Notice",        href: "/admin/notices" },
              { label: "Write Blog Post",    href: "/admin/blog" },
              { label: "View Audit Trail",   href: "/admin/audit-log" },
              { label: "Performance Reviews", href: "/admin/performance" },
              { label: "Leave Balances",     href: "/admin/leave-balances" },
              { label: "Manage Assets",      href: "/admin/assets" },
              { label: "Resignations/Exits", href: "/admin/exits" },
              { label: "Invite an Employee", href: "/admin/invites" },
              { label: "Review Documents",   href: "/admin/documents" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-center hover:border-primary/40 hover:text-primary transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Broadcast modal */}
      {broadcastOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setBroadcastOpen(false)}>
          <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-serif text-lg text-primary flex items-center gap-2"><Megaphone className="w-5 h-5 text-secondary" /> Broadcast Announcement</h3>
              <button onClick={() => setBroadcastOpen(false)} className="text-primary/65 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {bcResult ? (
                <div className="p-3 bg-green-400/10 text-green-400 rounded font-sans text-sm">{bcResult}</div>
              ) : null}
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Send To</label>
                <select value={bcDept} onChange={(e) => setBcDept(e.target.value)}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  <option value="all">All Employees</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name} Department Only</option>)}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Title *</label>
                <input value={bcTitle} onChange={(e) => setBcTitle(e.target.value)} placeholder="e.g. Office closed for Eid"
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Message *</label>
                <textarea value={bcMessage} onChange={(e) => setBcMessage(e.target.value)} rows={4}
                  className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
              </div>
              <button onClick={sendBroadcast} disabled={bcSending || !bcTitle.trim() || !bcMessage.trim()}
                className="w-full bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-10 rounded disabled:opacity-50">
                {bcSending ? "Sending..." : "Send Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
