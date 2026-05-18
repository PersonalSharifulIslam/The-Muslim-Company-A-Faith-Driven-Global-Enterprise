import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Newspaper, Bell, BookOpen, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type Stats = { jobs: number; applications: number; news: number; notices: number; blogs: number; employees: number };

export default function AdminDashboard() {
  const { session, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({ jobs: 0, applications: 0, news: 0, notices: 0, blogs: 0, employees: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!session) return;
    api.getStats()
      .then((data) => setStats(data as Stats))
      .catch((e) => console.error("Stats error:", e))
      .finally(() => setStatsLoading(false));
  }, [session, loading]);

  const CARDS = [
    { label: "Active Jobs",    value: stats.jobs,         icon: Briefcase, href: "/admin/careers",      color: "text-blue-400" },
    { label: "Applications",   value: stats.applications, icon: Users,     href: "/admin/applications",  color: "text-green-400" },
    { label: "News Posts",     value: stats.news,         icon: Newspaper, href: "/admin/newsroom",      color: "text-purple-400" },
    { label: "Notices",        value: stats.notices,      icon: Bell,      href: "/admin/notices",       color: "text-yellow-400" },
    { label: "Blog Posts",     value: stats.blogs,        icon: BookOpen,  href: "/admin/blog",          color: "text-orange-400" },
    { label: "Employees",      value: stats.employees,    icon: TrendingUp,href: "/admin/employees",     color: "text-pink-400" },
  ];

  const QUICK_LINKS = [
    { label: "Post New Job",          href: "/admin/careers" },
    { label: "View New Applications", href: "/admin/applications" },
    { label: "Add News Post",         href: "/admin/newsroom" },
    { label: "Post Notice",           href: "/admin/notices" },
    { label: "Write Blog Post",       href: "/admin/blog" },
    { label: "Manage Employees",      href: "/admin/employees" },
  ];

  return (
    <AdminLayout current="/admin/dashboard">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeIn} className="mb-8">
          <h1 className="font-serif text-3xl text-primary mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.email}</p>
        </motion.div>

        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {CARDS.map(({ label, value, icon: Icon, href, color }) => (
            <a key={label} href={href} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
              <Icon className={`${color} mb-3`} size={22} />
              <p className="font-serif text-2xl text-primary mb-1">{statsLoading ? "—" : value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            </a>
          ))}
        </motion.div>

        <motion.div variants={fadeIn}>
          <h2 className="font-serif text-xl text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-center hover:border-primary/40 hover:text-primary transition-colors">
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
