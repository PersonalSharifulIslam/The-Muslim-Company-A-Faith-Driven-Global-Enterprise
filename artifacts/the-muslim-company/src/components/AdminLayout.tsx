import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Briefcase, Users, Newspaper, Bell, BookOpen, LogOut, Menu, X, UserSquare2,
  CalendarDays, Clock, CheckSquare, Wallet, Building2, ShieldAlert, Network, Link2, FileText, Sparkles, ShieldCheck,
  Star, PieChart, UserMinus, Package, Trash2,
} from "lucide-react";
import logo from "@/assets/images/logo.png";
import GlobalSearch from "@/components/GlobalSearch";

// Each nav item declares which roles may see it.
// "admin" and "executive" implicitly see everything (full company-wide visibility).
const ADMIN_NAV = [
  { label: "Dashboard",       href: "/admin/dashboard",    icon: LayoutDashboard, roles: ["all"] },
  { label: "Careers",         href: "/admin/careers",      icon: Briefcase,       roles: ["admin", "executive", "hr_manager", "recruiter"] },
  { label: "Applications",    href: "/admin/applications", icon: Users,           roles: ["admin", "executive", "hr_manager", "recruiter"] },
  { label: "Employees",       href: "/admin/employees",    icon: UserSquare2,     roles: ["admin", "executive", "vp", "director", "hr_manager", "department_manager", "team_lead"] },
  { label: "Attendance",      href: "/admin/attendance",   icon: Clock,           roles: ["admin", "executive", "vp", "director", "hr_manager", "department_manager", "team_lead"] },
  { label: "Leave Requests",  href: "/admin/leaves",       icon: CalendarDays,    roles: ["admin", "executive", "vp", "director", "hr_manager", "department_manager"] },
  { label: "Tasks",           href: "/admin/tasks",        icon: CheckSquare,     roles: ["admin", "executive", "vp", "director", "hr_manager", "department_manager", "team_lead"] },
  { label: "Payroll",         href: "/admin/payroll",      icon: Wallet,          roles: ["admin", "executive", "hr_manager", "finance_manager"] },
  { label: "Departments",     href: "/admin/departments",  icon: Building2,       roles: ["admin", "executive", "vp", "director", "hr_manager"] },
  { label: "Newsroom & PR",   href: "/admin/newsroom",     icon: Newspaper,       roles: ["admin", "executive", "content_editor"] },
  { label: "Notice & Event",  href: "/admin/notices",      icon: Bell,            roles: ["admin", "executive", "content_editor"] },
  { label: "Blog",            href: "/admin/blog",         icon: BookOpen,        roles: ["admin", "executive", "content_editor"] },
  { label: "Transparency Reports", href: "/admin/transparency-reports", icon: ShieldCheck, roles: ["admin", "executive", "content_editor"] },
  { label: "Audit Trail",     href: "/admin/audit-log",    icon: ShieldAlert,     roles: ["admin", "executive", "vp", "director"] },
  { label: "Delete Logs",     href: "/admin/delete-logs",  icon: Trash2,          roles: ["admin"] },
  { label: "Org Chart",       href: "/admin/org-chart",    icon: Network,         roles: ["admin", "executive", "vp", "director", "hr_manager"] },
  { label: "Invite Links",     href: "/admin/invites",      icon: Link2,           roles: ["admin", "executive", "hr_manager"] },
  { label: "Documents",       href: "/admin/documents",    icon: FileText,        roles: ["admin", "executive", "hr_manager"] },
  { label: "Holidays",        href: "/admin/holidays",     icon: Sparkles,        roles: ["admin", "executive", "hr_manager"] },
  { label: "Performance",     href: "/admin/performance",  icon: Star,            roles: ["admin", "executive", "vp", "director", "hr_manager", "department_manager"] },
  { label: "Leave Balances",  href: "/admin/leave-balances", icon: PieChart,       roles: ["admin", "executive", "hr_manager"] },
  { label: "Exits",           href: "/admin/exits",        icon: UserMinus,       roles: ["admin", "executive", "hr_manager"] },
  { label: "Assets",          href: "/admin/assets",       icon: Package,         roles: ["admin", "executive", "hr_manager", "department_manager"] },
];

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
  employee: "Employee",
};

function visibleNav(role: string | null) {
  if (!role) return [];
  return ADMIN_NAV.filter(item => item.roles.includes("all") || item.roles.includes(role));
}

export default function AdminLayout({ children, current }: { children: React.ReactNode; current: string }) {
  const { signOut, user, role } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = visibleNav(role ?? null);

  const handleSignOut = async () => {
    await signOut();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-primary-foreground/10">
          <img src={logo} alt="TMC" className="w-7 h-7 opacity-90 flex-shrink-0" />
          <div>
            <p className="font-serif text-xs font-bold tracking-widest uppercase text-primary-foreground leading-tight">
              The Muslim Company
            </p>
            <p className="font-sans text-xs tracking-widest uppercase text-secondary mt-0.5">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = current === item.href;
            return (
              <Link
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
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-primary-foreground/10">
          <p className="font-sans text-xs text-primary-foreground/55 mb-1 px-4">{user?.email}</p>
          {role && (
            <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mb-3 px-4">
              {ROLE_LABELS[role] || role}
            </p>
          )}
          <button
            onClick={handleSignOut}
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
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
        <header className="bg-background border-b border-primary/10 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden text-primary/60 hover:text-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <p className="font-sans text-xs tracking-widest uppercase text-primary/65 hidden sm:block flex-shrink-0">
            {ADMIN_NAV.find(n => n.href === current)?.label || "Admin"}
          </p>
          <GlobalSearch />
        </header>
        <main className="flex-1 p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
