import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Briefcase, Users, Newspaper, Bell, BookOpen, LogOut, Menu, X,
} from "lucide-react";
import logo from "@/assets/images/logo.png";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Careers", href: "/admin/careers", icon: Briefcase },
  { label: "Applications", href: "/admin/applications", icon: Users },
  { label: "Newsroom & PR", href: "/admin/newsroom", icon: Newspaper },
  { label: "Notice & Event", href: "/admin/notices", icon: Bell },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
];

export default function AdminLayout({ children, current }: { children: React.ReactNode; current: string }) {
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-foreground/10">
          <img src={logo} alt="TMC" className="w-7 h-7 invert opacity-90 flex-shrink-0" />
          <div>
            <p className="font-serif text-xs font-bold tracking-widest uppercase text-primary-foreground leading-tight">
              The Muslim Company
            </p>
            <p className="font-sans text-[9px] tracking-widest uppercase text-secondary mt-0.5">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = current === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 font-sans text-xs tracking-wide rounded-sm transition-colors ${
                  active
                    ? "bg-secondary text-primary font-semibold"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-primary-foreground/10">
          <p className="font-sans text-[10px] text-primary-foreground/30 mb-3 px-4">{user?.email}</p>
          <button
            onClick={() => { signOut(); window.location.href = "/admin"; }}
            className="flex items-center gap-3 px-4 py-3 w-full font-sans text-xs tracking-wide text-primary-foreground/50 hover:text-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-background border-b border-primary/10 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden text-primary/60 hover:text-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <p className="font-sans text-xs tracking-widest uppercase text-primary/40">
            {ADMIN_NAV.find(n => n.href === current)?.label || "Admin"}
          </p>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
