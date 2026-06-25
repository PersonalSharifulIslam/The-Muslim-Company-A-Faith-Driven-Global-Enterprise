import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Clock, Calendar, CheckSquare, FileText, Bell, User, Settings, LogOut, Menu, X, ChevronRight, Wallet, Sparkles, Users, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { isAdminAreaRole } from "@/lib/supabase";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  executive: "Executive (C-Suite)",
  vp: "Vice President",
  director: "Director",
  hr_manager: "HR Manager",
  finance_manager: "Finance Manager",
  department_manager: "Department Manager",
  team_lead: "Team Lead",
  recruiter: "Recruiter",
  content_editor: "Content Editor",
  employee: "Staff",
};
import logo from "@/assets/images/logo.png";

const NAV = [
  { label: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/employee/attendance", icon: Clock },
  { label: "Leave", href: "/employee/leave", icon: Calendar },
  { label: "Tasks", href: "/employee/tasks", icon: CheckSquare },
  { label: "Payslip", href: "/employee/payslip", icon: Wallet },
  { label: "Documents", href: "/employee/documents", icon: FileText },
  { label: "Directory", href: "/employee/directory", icon: Users },
  { label: "Holidays", href: "/employee/holidays", icon: Sparkles },
  { label: "Performance", href: "/employee/performance", icon: Star },
  { label: "Notifications", href: "/employee/notifications", icon: Bell },
  { label: "Settings", href: "/employee/settings", icon: Settings },
];

export default function EmployeeLayout({ children, current }: { children: React.ReactNode; current: string }) {
  const { profile, role, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const api = (window as unknown as { empApiCall?: (p: string) => Promise<unknown> }).empApiCall;
    if (!api) return;
  }, []);

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-72" : "w-64"} bg-card border-r border-secondary/25`}>
      <div className="p-5 border-b border-secondary/25">
        <div className="flex items-center gap-3">
          <img src={logo} alt="TMC" className="w-8 h-8 opacity-80" />
          <div>
            <p className="font-serif text-sm font-bold text-primary tracking-widest">THE MUSLIM</p>
            <p className="font-serif text-sm font-bold text-secondary tracking-widest">COMPANY</p>
          </div>
        </div>
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-primary/45 mt-2">Employee Portal</p>
      </div>

      {isAdminAreaRole(role) && (
        <a href="/admin/dashboard"
          className="mx-3 mt-3 flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-sans uppercase tracking-widest text-secondary border border-secondary/30 hover:bg-secondary/10 transition-colors">
          Go to Admin Panel →
        </a>
      )}

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = current === href;
          return (
            <a key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-sans tracking-wide transition-all group ${active ? "bg-secondary/15 text-secondary border-l-2 border-secondary" : "text-primary/55 hover:text-primary hover:bg-primary/5 border-l-2 border-transparent"}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="uppercase tracking-widest">{label}</span>
              {label === "Notifications" && unread > 0 && (
                <span className="ml-auto bg-secondary text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>
              )}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary/8">
        <button onClick={signOut} className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-sans uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "tween", duration: 0.25 }} className="fixed inset-y-0 left-0 z-50 lg:hidden">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-primary/10 px-4 h-14 flex items-center justify-between">
          <button className="lg:hidden text-primary/60 hover:text-primary" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <p className="font-sans text-xs tracking-widest uppercase text-primary/45">
              {NAV.find((n) => n.href === current)?.label || "Employee Portal"}
            </p>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <a href="/employee/notifications" className="relative text-primary/50 hover:text-secondary transition-colors">
              <Bell className="w-4 h-4" />
              {unread > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{unread}</span>}
            </a>
            <a href="/employee/profile" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                <span className="font-sans text-[10px] font-bold text-secondary">{initials}</span>
              </div>
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>

        <footer className="px-6 py-3 border-t border-primary/8 text-center">
          <p className="font-sans text-[9px] tracking-widest uppercase text-primary/30">The Muslim Company — Employee Portal</p>
        </footer>
      </div>
    </div>
  );
}
