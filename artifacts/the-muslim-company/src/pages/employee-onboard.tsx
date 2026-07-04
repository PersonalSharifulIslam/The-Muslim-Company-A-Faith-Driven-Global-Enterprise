import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import logo from "@/assets/images/logo.png";

const ACCESS_LEVEL_LABELS: Record<string, string> = {
  admin: "Administrator", executive: "Executive (C-Suite)", vp: "Vice President", director: "Director",
  hr_manager: "HR Manager", finance_manager: "Finance Manager", department_manager: "Department Manager",
  team_lead: "Team Lead", recruiter: "Recruiter", content_editor: "Content Editor", employee: "Employee (Staff)",
};

type InviteInfo = { department: string; position: string; access_level: string; status: string };

export default function EmployeeOnboard({ params }: { params: { token: string } }) {
  const token = params.token;
  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "", address: "", joining_date: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    document.title = "Join The Muslim Company — Onboarding";
    fetch(`/api/admin/onboard-info?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setInfo(data);
      })
      .catch(() => setError("Failed to load invite details"))
      .finally(() => setLoadingInfo(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/onboard-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token, name: form.name, email: form.email, password: form.password,
          phone: form.phone, address: form.address, joining_date: form.joining_date,
        }),
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || "Failed to submit");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
    setSubmitting(false);
  }

  if (loadingInfo) {
    return (
      <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  if (error && !info) {
    return (
      <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-white mb-2">Invalid Invite Link</h1>
          <p className="font-sans text-sm text-white/50">{error}</p>
        </div>
      </div>
    );
  }

  if (info?.status === "expired") {
    return (
      <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-white mb-2">This Link Has Expired</h1>
          <p className="font-sans text-sm text-white/50">Please contact HR to request a new invite link.</p>
        </div>
      </div>
    );
  }

  if (info?.status === "submitted" || info?.status === "approved" || info?.status === "rejected" || submitted) {
    const isApproved = info?.status === "approved";
    const isRejected = info?.status === "rejected";
    return (
      <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          {isRejected ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h1 className="font-serif text-2xl text-white mb-2">Application Not Approved</h1>
              <p className="font-sans text-sm text-white/50">Please contact HR for more information.</p>
            </>
          ) : isApproved ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h1 className="font-serif text-2xl text-white mb-2">Your Account Is Active!</h1>
              <p className="font-sans text-sm text-white/50 mb-4">You can now log in using the email and password you set.</p>
              <a href="/employee" className="inline-block bg-secondary text-[#0a1a0e] font-sans text-xs uppercase tracking-widest h-11 px-8 flex items-center justify-center">
                Go to Employee Login
              </a>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h1 className="font-serif text-2xl text-white mb-2">Request Submitted</h1>
              <p className="font-sans text-sm text-white/50">
                Jazakallah Khair! Your details have been sent to HR for review. You'll be able to log in once your account is approved — please check back or wait to be notified.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1a0e] py-12 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <img src={logo} alt="The Muslim Company" className="w-14 h-14 mx-auto mb-4 opacity-90" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-secondary mb-2">Welcome</p>
            <h1 className="font-serif text-2xl md:text-3xl text-white mb-2">Join The Muslim Company</h1>
            <p className="font-sans text-sm text-white/50">Complete your details below to request access.</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-white/30">Department</p>
              <p className="font-sans text-sm text-white">{info?.department}</p>
            </div>
            {info?.position && (
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-white/30">Position</p>
                <p className="font-sans text-sm text-white">{info.position}</p>
              </div>
            )}
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-white/30">Access Level</p>
              <p className="font-sans text-sm text-secondary">{ACCESS_LEVEL_LABELS[info?.access_level || "employee"]}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-400/10 text-red-400 font-sans text-sm rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">Full Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-secondary rounded" />
            </div>
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">Email Address *</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-secondary rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-sans text-xs text-white/50 mb-1 block">Password *</label>
                <input required type="password" minLength={8} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-secondary rounded" />
              </div>
              <div>
                <label className="font-sans text-xs text-white/50 mb-1 block">Confirm Password *</label>
                <input required type="password" minLength={8} value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-secondary rounded" />
              </div>
            </div>
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">Phone Number</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-secondary rounded" />
            </div>
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">Address</label>
              <textarea rows={2} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-secondary rounded resize-none" />
            </div>
            <div>
              <label className="font-sans text-xs text-white/50 mb-1 block">Preferred Joining Date</label>
              <input type="date" value={form.joining_date} onChange={e => setForm(f => ({ ...f, joining_date: e.target.value }))}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-secondary rounded" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-secondary text-[#0a1a0e] font-sans text-sm font-bold uppercase tracking-widest h-12 rounded disabled:opacity-50 mt-2">
              {submitting ? "Submitting..." : "Submit for Approval"}
            </button>
            <p className="font-sans text-xs text-white/30 text-center">
              Your request will be reviewed by HR before your account is activated.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
