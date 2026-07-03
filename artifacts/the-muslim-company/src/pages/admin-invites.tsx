import { useState, useEffect } from "react";
import { Plus, Copy, Check, X, Trash2, AlertCircle, Link2, Clock } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Invite = {
  id: number; token: string; department: string; position: string; access_level: string;
  status: string; submitted_name: string | null; submitted_email: string | null;
  submitted_phone: string | null; submitted_address: string | null; submitted_joining_date: string | null;
  submitted_at: string | null; review_note: string | null; resulting_employee_id: string | null;
  expires_at: string; created_at: string;
};

const DEPTS = [
  "Executive & Strategy", "Technology & Engineering", "Software Development", "Data & AI",
  "Cybersecurity & IT Infrastructure", "Product Management", "Operations", "Supply Chain & Logistics",
  "Manufacturing & Production", "Quality Assurance", "Finance & Accounting", "Investment & Treasury",
  "Islamic Finance & Shariah Compliance", "Marketing & Brand", "Sales & Business Development",
  "Customer Experience & Support", "Human Resources", "Talent Acquisition & Recruitment",
  "Learning & Development", "Research & Development", "Innovation Lab", "Media & Communications",
  "Public Relations", "Legal & Compliance", "Governance & Risk Management", "Procurement",
  "Real Estate & Facilities", "Healthcare Division", "Retail & E-commerce", "Education & Training",
  "Humanitarian & Social Welfare", "Sustainability & Environment", "International Affairs & Partnerships",
  "Administration", "Other",
];

const ACCESS_LEVELS = [
  "employee", "team_lead", "department_manager", "recruiter", "content_editor",
  "finance_manager", "hr_manager", "director", "vp", "executive", "admin",
];
const ACCESS_LEVEL_LABELS: Record<string, string> = {
  admin: "Administrator", executive: "Executive (C-Suite)", vp: "Vice President", director: "Director",
  hr_manager: "HR Manager", finance_manager: "Finance Manager", department_manager: "Department Manager",
  team_lead: "Team Lead", recruiter: "Recruiter", content_editor: "Content Editor", employee: "Employee (Staff)",
};

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  submitted: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  approved: "bg-green-400/10 text-green-400 border-green-400/20",
  rejected: "bg-red-400/10 text-red-400 border-red-400/20",
  expired: "bg-gray-400/10 text-gray-600 border-gray-400/20",
};

export default function AdminInvites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "submitted" | "approved" | "rejected">("all");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [reviewing, setReviewing] = useState<number | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [form, setForm] = useState({ department: DEPTS[0], position: "", access_level: "employee" });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get("/admin/invites") as Invite[];
      setInvites(data || []);
    } catch (e: any) { setMsg({ type: "err", text: e.message || "Failed to load" }); }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    try {
      await api.post("/admin/invites", form, true);
      setMsg({ type: "ok", text: "Invite link generated successfully" });
      setShowForm(false); setForm({ department: DEPTS[0], position: "", access_level: "employee" });
      await load();
    } catch (err: any) { setMsg({ type: "err", text: err.message || "Error" }); }
    setSaving(false);
  }

  async function handleReview(invite: Invite, action: "approve" | "reject") {
    setReviewing(invite.id);
    setMsg(null);
    try {
      const result = await api.post("/admin/invites/review", { invite_id: invite.id, action, review_note: reviewNote }, true) as any;
      setMsg({
        type: "ok",
        text: action === "approve" ? `Approved! Employee ID: ${result.employee_id}` : "Invite rejected",
      });
      setReviewNote("");
      await load();
    } catch (err: any) { setMsg({ type: "err", text: err.message || "Error" }); }
    setReviewing(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Revoke this invite link? This cannot be undone.")) return;
    try { await api.delete(`/admin/invites/${id}`, true); await load(); } catch {}
  }

  function copyLink(invite: Invite) {
    const url = `${window.location.origin}/employee/onboard/${invite.token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filtered = invites.filter(i => filter === "all" || i.status === filter);
  const counts = {
    all: invites.length,
    open: invites.filter(i => i.status === "open").length,
    submitted: invites.filter(i => i.status === "submitted").length,
    approved: invites.filter(i => i.status === "approved").length,
    rejected: invites.filter(i => i.status === "rejected").length,
  };

  return (
    <AdminLayout current="/admin/invites">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl text-primary flex items-center gap-2"><Link2 className="w-6 h-6 text-secondary" /> Employee Invite Links</h1>
            <p className="font-sans text-xs text-primary/65 mt-1">Generate a unique link, send it to a new hire — they fill their own details, you just approve.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
            <Plus className="w-4 h-4" /> Generate Invite
          </button>
        </div>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 mb-6">
          {(["all", "open", "submitted", "approved", "rejected"] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`p-3 border rounded text-center transition-colors ${filter === s ? "border-secondary bg-secondary/5" : "border-primary/10 hover:border-primary/30"}`}>
              <p className="font-serif text-xl text-primary">{counts[s]}</p>
              <p className="font-sans text-xs uppercase tracking-widest text-primary/65 capitalize">{s}</p>
            </button>
          ))}
        </div>

        {showForm && (
          <div className="mb-6 p-6 border border-secondary/30 bg-card">
            <h3 className="font-serif text-lg text-primary mb-4">Generate New Invite Link</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Department *</label>
                <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Suggested Position</label>
                <input type="text" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} placeholder="e.g. Software Engineer"
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="font-sans text-xs text-primary/65 mb-1 block">Access Level *</label>
                <select value={form.access_level} onChange={e => setForm(f => ({ ...f, access_level: e.target.value }))}
                  className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                  {ACCESS_LEVELS.map(a => <option key={a} value={a}>{ACCESS_LEVEL_LABELS[a]}</option>)}
                </select>
              </div>
              <div className="sm:col-span-3 flex gap-3">
                <button type="submit" disabled={saving}
                  className="bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-6 disabled:opacity-50">
                  {saving ? "Generating..." : "Generate Link"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-6">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-primary/65 font-sans text-sm">No invites found</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(inv => {
              const expired = new Date(inv.expires_at) < new Date() && inv.status === "open";
              const displayStatus = expired ? "expired" : inv.status;
              return (
                <div key={inv.id} className="border border-primary/10 bg-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-sans text-xs uppercase tracking-widest px-2 py-0.5 border rounded ${STATUS_COLORS[displayStatus]}`}>{displayStatus}</span>
                        <span className="font-sans text-sm text-primary">{inv.department}</span>
                        <span className="font-sans text-xs text-primary/65">· {ACCESS_LEVEL_LABELS[inv.access_level]}</span>
                      </div>
                      {inv.position && <p className="font-sans text-xs text-primary/65">{inv.position}</p>}
                      <p className="font-sans text-xs text-primary/30 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Expires {new Date(inv.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {inv.status === "open" && !expired && (
                        <button onClick={() => copyLink(inv)}
                          className="flex items-center gap-1.5 border border-primary/20 text-primary text-xs font-sans px-3 py-1.5 hover:border-secondary transition-colors">
                          {copiedId === inv.id ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                        </button>
                      )}
                      {(inv.status === "open" || inv.status === "rejected" || expired) && (
                        <button onClick={() => handleDelete(inv.id)} className="text-primary/65 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>

                  {inv.status === "submitted" && (
                    <div className="mt-3 pt-3 border-t border-primary/10 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div><p className="font-sans text-xs uppercase text-primary/65">Name</p><p className="font-sans text-sm text-primary">{inv.submitted_name}</p></div>
                        <div><p className="font-sans text-xs uppercase text-primary/65">Email</p><p className="font-sans text-sm text-primary">{inv.submitted_email}</p></div>
                        <div><p className="font-sans text-xs uppercase text-primary/65">Phone</p><p className="font-sans text-sm text-primary">{inv.submitted_phone || "—"}</p></div>
                        <div><p className="font-sans text-xs uppercase text-primary/65">Joining</p><p className="font-sans text-sm text-primary">{inv.submitted_joining_date}</p></div>
                      </div>
                      {inv.submitted_address && (
                        <div><p className="font-sans text-xs uppercase text-primary/65">Address</p><p className="font-sans text-sm text-primary/70">{inv.submitted_address}</p></div>
                      )}
                      <textarea value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder="Optional note (visible in audit log)"
                        rows={2} className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
                      <div className="flex gap-3">
                        <button onClick={() => handleReview(inv, "approve")} disabled={reviewing === inv.id}
                          className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-sans text-xs uppercase tracking-widest h-9 px-5 disabled:opacity-50">
                          <Check className="w-3.5 h-3.5" /> {reviewing === inv.id ? "Processing..." : "Approve & Create Account"}
                        </button>
                        <button onClick={() => handleReview(inv, "reject")} disabled={reviewing === inv.id}
                          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-sans text-xs uppercase tracking-widest h-9 px-5 disabled:opacity-50">
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {inv.status === "approved" && inv.resulting_employee_id && (
                    <p className="mt-2 font-sans text-xs text-green-400">✓ Account created — Employee ID: {inv.resulting_employee_id}</p>
                  )}
                  {inv.status === "rejected" && inv.review_note && (
                    <p className="mt-2 font-sans text-xs text-red-400/70">Rejected: {inv.review_note}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
