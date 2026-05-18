import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, CheckCircle, AlertCircle, Edit3, Save, X } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useEmployeeAuth, empApi } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
type Profile = { id: number; employee_id: string; name: string; email: string; department: string; role: string; position: string; phone: string; address: string; emergency_contact: string; joining_date: string; status: string };

export default function EmployeeProfile() {
  const { employee, loading } = useEmployeeAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", emergency_contact: "" });
  const [pwForm, setPwForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [err, setErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const api = empApi();

  useEffect(() => { if (!loading && !employee) window.location.href = "/employee"; }, [employee, loading]);
  useEffect(() => {
    if (employee) api.get("/employee/profile").then((d) => {
      const p = d as Profile;
      setProfile(p);
      setForm({ name: p.name, phone: p.phone, address: p.address, emergency_contact: p.emergency_contact });
    }).catch(() => {});
  }, [employee]);

  const saveProfile = async () => {
    setSaving(true); setErr(""); setMsg("");
    try {
      const d = await api.put("/employee/profile", form) as Profile;
      setProfile((p) => p ? { ...p, ...d } : p);
      setMsg("Profile updated successfully. Jazakallah Khair!");
      setEditing(false);
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Error"); }
    setSaving(false);
  };

  const savePw = async (e: React.FormEvent) => {
    e.preventDefault(); setPwErr(""); setPwMsg("");
    if (pwForm.new_password !== pwForm.confirm) { setPwErr("New passwords do not match"); return; }
    setSavingPw(true);
    try {
      await api.put("/employee/profile/password", { current_password: pwForm.current_password, new_password: pwForm.new_password });
      setPwMsg("Password changed successfully. Please keep it safe.");
      setPwForm({ current_password: "", new_password: "", confirm: "" });
    } catch (e: unknown) { setPwErr(e instanceof Error ? e.message : "Error"); }
    setSavingPw(false);
  };

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
  if (loading || !employee || !profile) return null;

  return (
    <EmployeeLayout current="/employee/profile">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-3xl">
        <motion.div variants={fade}>
          <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
          <h1 className="font-serif text-3xl text-white">My Profile</h1>
        </motion.div>

        <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/20 p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#b08d57]/15 border-2 border-[#b08d57]/40 flex items-center justify-center">
              <span className="font-serif text-2xl font-bold text-[#b08d57]">{initials}</span>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-white">{profile.name}</h2>
              <p className="font-sans text-sm text-[#b08d57]">{profile.employee_id}</p>
              <p className="font-sans text-xs text-white/40">{profile.position || profile.role} · {profile.department}</p>
            </div>
            <button onClick={() => setEditing(!editing)} className="ml-auto flex items-center gap-1.5 font-sans text-[10px] tracking-widest uppercase text-white/30 hover:text-[#b08d57] transition-colors">
              {editing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[["Employee ID", profile.employee_id, false], ["Email Address", profile.email, false], ["Department", profile.department, false], ["Role", profile.role, false], ["Joining Date", profile.joining_date ? new Date(profile.joining_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—", false], ["Status", profile.status, false]].map(([label, val]) => (
              <div key={label as string} className="bg-white/3 p-3 border border-[#b08d57]/8">
                <p className="font-sans text-[9px] tracking-widest uppercase text-white/25 mb-1">{label}</p>
                <p className="font-sans text-sm text-white capitalize">{val}</p>
              </div>
            ))}
          </div>

          {editing && (
            <div className="border-t border-[#b08d57]/15 pt-5 space-y-4">
              <p className="font-sans text-[10px] tracking-widest uppercase text-[#b08d57]/50 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Edit Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["Full Name", "name", "text"], ["Phone Number", "phone", "tel"]].map(([label, field, type]) => (
                  <div key={field}>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-white/30 block mb-2">{label}</label>
                    <input type={type} value={form[field as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      className="w-full h-10 px-3 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm focus:outline-none focus:border-[#b08d57]/50" />
                  </div>
                ))}
              </div>
              {[["Address", "address"], ["Emergency Contact", "emergency_contact"]].map(([label, field]) => (
                <div key={field}>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-white/30 block mb-2">{label}</label>
                  <input type="text" value={form[field as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full h-10 px-3 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm focus:outline-none focus:border-[#b08d57]/50" />
                </div>
              ))}
              {err && <p className="font-sans text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{err}</p>}
              {msg && <p className="font-sans text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{msg}</p>}
              <Button onClick={saveProfile} disabled={saving} className="h-9 bg-[#b08d57] hover:bg-[#c9a96e] text-black rounded-none font-sans text-[10px] font-bold tracking-widest uppercase gap-2 disabled:opacity-50">
                <Save className="w-3.5 h-3.5" />{saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
          {!editing && msg && <p className="font-sans text-xs text-green-400 flex items-center gap-1 mt-2"><CheckCircle className="w-3.5 h-3.5" />{msg}</p>}
        </motion.div>

        <motion.div variants={fade} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-6">
          <p className="font-sans text-[10px] tracking-widest uppercase text-white/40 mb-5 flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> Change Password</p>
          <form onSubmit={savePw} className="space-y-4">
            {[["Current Password", "current_password"], ["New Password", "new_password"], ["Confirm New Password", "confirm"]].map(([label, field]) => (
              <div key={field}>
                <label className="font-sans text-[10px] tracking-widest uppercase text-white/30 block mb-2">{label}</label>
                <input type="password" required value={pwForm[field as keyof typeof pwForm]} onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full h-10 px-3 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm focus:outline-none focus:border-[#b08d57]/50" />
              </div>
            ))}
            {pwErr && <p className="font-sans text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{pwErr}</p>}
            {pwMsg && <p className="font-sans text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{pwMsg}</p>}
            <Button type="submit" disabled={savingPw} className="h-9 bg-[#b08d57]/20 hover:bg-[#b08d57]/30 text-[#b08d57] border border-[#b08d57]/30 rounded-none font-sans text-[10px] font-bold tracking-widest uppercase disabled:opacity-50">
              {savingPw ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
