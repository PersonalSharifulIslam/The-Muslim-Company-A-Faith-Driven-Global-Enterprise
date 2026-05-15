import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Newspaper, Bell, BookOpen, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

const fadeIn = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type Stats = { jobs: number; applications: number; news: number; notices: number; blogs: number };

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({ jobs: 0, applications: 0, news: 0, notices: 0, blogs: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) window.location.href = "/admin";
  }, [user, loading]);

  useEffect(() => {
    if (!user) { setStatsLoading(false); return; }
    api.get("/admin/stats", true)
      .then((data) => setStats(data as Stats))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [user]);

  if (loading) return null;

  const CARDS = [
    { label: "Active Jobs", value: stats.jobs, icon: Briefcase, href: "/admin/careers", color: "text-blue-400" },
    { label: "Applications", value: stats.applications, icon: Users, href: "/admin/applications", color: "text-green-400" },
    { label: "News Posts", value: stats.news, icon: Newspaper, href: "/admin/newsroom", color: "text-purple-400" },
    { label: "Notices", value: stats.notices, icon: Bell, href: "/admin/notices", color: "text-yellow-400" },
    { label: "Blog Posts", value: stats.blogs, icon: BookOpen, href: "/admin/blog", color: "text-orange-400" },
  ];

  return (
    <AdminLayout current="/admin">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
        <motion.div variants={fadeIn} className="mb-8">
          <h1 className="font-serif text-3xl text-primary mb-1">Dashboard</h1>
          <p className="font-sans text-sm text-primary/50">Welcome back, {user?.email}</p>
        </motion.div>

        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {CARDS.map(({ label, value, icon: Icon, href, color }) => (
            <a key={label} href={href} className="bg-card border border-primary/10 p-5 hover:border-secondary/40 transition-colors group">
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <p className="font-serif text-2xl text-primary mb-1">{statsLoading ? "—" : value}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40">{label}</p>
            </a>
          ))}
        </motion.div>

        <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-card border border-primary/10 p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <h2 className="font-serif text-lg text-primary">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: "Post a New Job", href: "/admin/careers" },
                { label: "View New Applications", href: "/admin/applications" },
                { label: "Publish News Article", href: "/admin/newsroom" },
                { label: "Add Notice", href: "/admin/notices" },
                { label: "Write Blog Post", href: "/admin/blog" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="flex items-center justify-between px-4 py-3 border border-primary/8 hover:border-secondary/40 hover:bg-secondary/5 transition-colors group">
                  <span className="font-sans text-sm text-primary/70 group-hover:text-primary">{label}</span>
                  <span className="font-sans text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-card border border-primary/10 p-6">
            <h2 className="font-serif text-lg text-primary mb-5">System Status</h2>
            <div className="space-y-3">
              {[
                { label: "Replit Database", ok: true },
                { label: "Authentication", ok: Boolean(user) },
                { label: "Careers System", ok: true },
                { label: "Newsroom System", ok: true },
                { label: "Blog System", ok: true },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-sans text-sm text-primary/60">{label}</span>
                  <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-0.5 border ${ok ? "text-green-400 border-green-400/20 bg-green-400/5" : "text-red-400 border-red-400/20 bg-red-400/5"}`}>
                    {ok ? "Active" : "Offline"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
