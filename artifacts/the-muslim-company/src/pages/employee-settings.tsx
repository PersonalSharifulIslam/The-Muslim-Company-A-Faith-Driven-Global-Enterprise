import { motion } from "framer-motion";
import { Settings, Shield, Globe, Bell } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { useEffect } from "react";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function EmployeeSettings() {
  const { employee, loading, logout } = useAuth();
  if (loading || !session || !profile) return null;
  return (
    <EmployeeLayout current="/employee/settings">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-3xl">
        <motion.div variants={fade}>
          <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
          <h1 className="font-serif text-3xl text-white">Settings</h1>
        </motion.div>
        {[
          { icon: Bell, title: "Notifications", desc: "Manage notification preferences", items: ["Email notifications", "Portal notifications", "Leave status updates", "Task reminders"] },
          { icon: Shield, title: "Security", desc: "Account security settings", items: ["Two-factor authentication (coming soon)", "Active sessions", "Login history"] },
          { icon: Globe, title: "Preferences", desc: "Portal display preferences", items: ["Language (English)", "Timezone (UTC+6 — Dhaka)", "Date format (DD/MM/YYYY)"] },
        ].map(({ icon: Icon, title, desc, items }) => (
          <motion.div key={title} variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#b08d57]/10 flex items-center justify-center"><Icon className="w-4 h-4 text-[#b08d57]" /></div>
              <div><p className="font-sans text-sm font-semibold text-white">{title}</p><p className="font-sans text-xs text-white/30">{desc}</p></div>
            </div>
            <div className="space-y-2 pl-11">
              {items.map((item) => (
                <div key={item} className="flex items-center justify-between py-2 border-b border-[#b08d57]/8">
                  <p className="font-sans text-xs text-white/50">{item}</p>
                  <span className="font-sans text-[9px] tracking-widest uppercase text-white/20">Default</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
        <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-400/10 flex items-center justify-center"><Settings className="w-4 h-4 text-red-400" /></div>
            <div><p className="font-sans text-sm font-semibold text-white">Account</p><p className="font-sans text-xs text-white/30">Session and account management</p></div>
          </div>
          <div className="pl-11">
            <button onClick={logout} className="font-sans text-xs text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-widest">Sign Out of Portal →</button>
          </div>
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
