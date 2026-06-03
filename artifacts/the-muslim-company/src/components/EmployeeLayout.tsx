import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Clock, Calendar, CheckSquare, FileText, Bell, User, Settings, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import logo from "@/assets/images/logo.png";

const NAV = [
  { label: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
  { label: "Attendance", href: "/employee/attendance", icon: Clock },
  { label: "Leave", href: "/employee/leave", icon: Calendar },
  { label: "Tasks", href: "/employee/tasks", icon: CheckSquare },
  { label: "Documents", href: "/employee/documents", icon: FileText },
  { label: "Notifications", href: "/employee/notifications", icon: Bell },
  { label: "Profile", href: "/employee/profile", icon: User },
  { label: "Settings", href: "/employee/settings", icon: Settings },
];

export default function EmployeeLayout({ children, current }: { children: React.ReactNode; current: string }) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const api = (window as unknown as { empApiCall?: (p: string) => Promise<unknown> }).empApiCall;
    if (!api) return;
  }, []);

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-72" : "w-64"} bg-[#0a1a0e] border-r border-[#b08d57]/20`}>
      <div className="p-5 border-b border-[#b08d57]/20">
        <div className="flex items-center gap-3">
          <img src={logo} alt="TMC" className="w-8 h-8 opacity-80" />
          <div>
            <p className="font-serif text-sm font-bold text-white tracking-widest">THE MUSLIM</p>
            <p className="font-serif text-sm font-bold text-[#b08d57] tracking-widest">COMPANY</p>
          </div>
        </div>
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30 mt-2">Employee Portal</p>
      </div>

      <div className="p-4 border-b border-[#b08d57]/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#b08d57]/20 border border-[#b08d57]/40 flex items-center justify-center">
            <span className="font-sans text-xs font-bold text-[#b08d57]">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm font-semibold text-white truncate">{profile?.name}</p>
            <p className="font-sans text-[10px] text-white/40 truncate">{profile?.employee_id}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = current === href;
          return (
            <a key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs font-sans tracking-wide transition-all group ${active ? "bg-[#b08d57]/15 text-[#b08d57] border-l-2 border-[#b08d57]" : "text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent"}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="uppercase tracking-widest">{label}</span>
              {label === "Notifications" && unread > 0 && (
                <span className="ml-auto bg-[#b08d57] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>
              )}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#b08d57]/10">
        <button onClick={signOut} className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-sans uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1f10] flex">
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
        <header className="sticky top-0 z-30 bg-[#0a1a0e]/95 backdrop-blur border-b border-[#b08d57]/15 px-4 h-14 flex items-center justify-between">
          <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <p className="font-sans text-xs tracking-widest uppercase text-white/30">
              {NAV.find((n) => n.href === current)?.label || "Employee Portal"}
            </p>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <a href="/employee/notifications" className="relative text-white/40 hover:text-[#b08d57] transition-colors">
              <Bell className="w-4 h-4" />
              {unread > 0 && <span className="absolute -top-1 -right-1 bg-[#b08d57] text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{unread}</span>}
            </a>
            <a href="/employee/profile" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#b08d57]/20 border border-[#b08d57]/40 flex items-center justify-center">
                <span className="font-sans text-[10px] font-bold text-[#b08d57]">{initials}</span>
              </div>
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>

        <footer className="px-6 py-3 border-t border-[#b08d57]/10 text-center">
          <p className="font-sans text-[9px] tracking-widest uppercase text-white/15">The Muslim Company — Employee Portal</p>
        </footer>
      </div>
    </div>
  );
}
