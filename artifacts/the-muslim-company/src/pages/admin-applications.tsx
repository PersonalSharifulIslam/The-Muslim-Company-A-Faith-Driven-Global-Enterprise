import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, ExternalLink, Send, Clock, Calendar, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";
import { sendInterviewEmail, sendOfferEmail } from "@/lib/email";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase";

const ALL_STATUSES = ["submitted", "reviewing", "shortlisted", "interview", "offered", "hired", "rejected"];

type App = {
  id: number; name: string; email: string; phone: string; address: string;
  job_id: number; job_title: string; reference_number: string; status: string;
  education: string; experience: string; skills: string; cover_letter: string;
  portfolio: string; cv_url: string; created_at: string; updated_at: string;
  offer_sent_at?: string; offer_expires_at?: string; offer_status?: string;
  interview_datetime?: string; interview_type?: string; interview_location?: string;
}

export default function AdminApplications() {
  const [apps, setApps] = useState<App[]>([]);
  const [jobs, setJobs] = useState<{id: number, job_id: number, title: string}[]>([]);
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<App | null>(null);
  const [updating, setUpdating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [interviewDatetime, setInterviewDatetime] = useState("");
  const [interviewType, setInterviewType] = useState("In-Person (Office Address)");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [schedulingInterview, setSchedulingInterview] = useState(false);

  const load = async () => {
    try {
      const { data } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
      setApps(data as App[] || []);
      const { data: jobData } = await supabase.from('jobs').select('id, job_id, title');
      setJobs(jobData || []);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const filtered = apps.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.reference_number.toLowerCase().includes(search.toLowerCase()) ||
      a.job_title.toLowerCase().includes(search.toLowerCase());
    const matchJob = jobFilter === "all" || a.job_id.toString() === jobFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchJob && matchStatus;
  });

  const updateStatus = async (id: number, status: string) => {
    setUpdating(true);
    try {
      await supabase.from('applications').update({ status }).eq('id', id);
      await load();
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    } catch {}
    setUpdating(false);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map(a => a.id));
  };

  const openInterviewModal = (app?: App) => {
    if (app) setSelectedIds([app.id]);
    setInterviewDatetime("");
    setInterviewType("In-Person (Office Address)");
    setInterviewLocation("");
    setShowInterviewModal(true);
  };

  const scheduleInterview = async () => {
    if (!interviewDatetime) return;
    setSchedulingInterview(true);
    try {
      const location = interviewType === 'Online (Google Meet)'
        ? interviewLocation
        : 'The Muslim Company HQ, Dhaka, Bangladesh';
      const targets = apps.filter(a => selectedIds.includes(a.id));
      for (const app of targets) {
        await supabase.from('applications').update({
          status: 'interview',
          interview_datetime: interviewDatetime,
          interview_type: interviewType,
          interview_location: location,
          interview_scheduled_at: new Date().toISOString(),
        }).eq('id', app.id);
        await sendInterviewEmail({
          to: app.email, name: app.name, position: app.job_title,
          reference: app.reference_number,
          interviewDatetime: new Date(interviewDatetime).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' }),
          interviewType: interviewType, interviewLocation: location,
        });
      }
      await load();
      setShowInterviewModal(false);
      setSelectedIds([]);
      if (selected) setSelected(prev => prev ? { ...prev, status: 'interview', interview_datetime: interviewDatetime, interview_type: interviewType, interview_location: location } : null);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
    setSchedulingInterview(false);
  };

  const sendOffer = async (app: App) => {
    setSendingOffer(true);
    setOfferSent(false);
    try {
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
      await supabase.from('applications').update({
        status: 'offered', offer_sent_at: new Date().toISOString(),
        offer_expires_at: expiresAt, offer_status: 'pending',
      }).eq('id', app.id);
      await sendOfferEmail({
        to: app.email, name: app.name, position: app.job_title,
        reference: app.reference_number, expiresAt,
      });
      await load();
      setOfferSent(true);
      setSelected(prev => prev ? { ...prev, status: 'offered', offer_expires_at: expiresAt } : null);
    } catch (err: any) {
      alert('Failed: ' + err.message);
    }
    setSendingOffer(false);
  };

  return (
    <AdminLayout current="/admin/applications">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Applications</h1>
          <p className="font-sans text-sm text-primary/50">{apps.length} total applications</p>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => openInterviewModal()}
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-4 gap-2">
              <Calendar className="w-3.5 h-3.5" /> Schedule Interview ({selectedIds.length})
            </Button>
            <Button onClick={async () => {
              const targets = apps.filter(a => selectedIds.includes(a.id));
              setSendingOffer(true);
              for (const app of targets) {
                try {
                  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
                  await supabase.from('applications').update({ status: 'offered', offer_sent_at: new Date().toISOString(), offer_expires_at: expiresAt, offer_status: 'pending' }).eq('id', app.id);
                  await sendOfferEmail({ to: app.email, name: app.name, position: app.job_title, reference: app.reference_number, expiresAt });
                } catch {}
              }
              await load(); setSelectedIds([]); setSendingOffer(false);
              alert(`Offer sent to ${targets.length} candidate(s)!`);
            }} disabled={sendingOffer}
              className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-4 gap-2">
              <Send className="w-3.5 h-3.5" /> Send Offer ({selectedIds.length})
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
          <input type="text" placeholder="Search by name, reference, position..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 h-10 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
        </div>
        <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}
          className="h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
          <option value="all">All Job IDs</option>
          {jobs.map(j => <option key={j.id} value={j.job_id.toString()}>#{j.job_id} — {j.title}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
          <option value="all">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-card border border-primary/10">
          <p className="font-serif text-xl text-primary">{apps.length === 0 ? "No applications yet" : "No results found"}</p>
        </div>
      ) : (
        <div className="border border-primary/10 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-4">
                  <button onClick={toggleSelectAll}>
                    {selectedIds.length === filtered.length && filtered.length > 0
                      ? <CheckSquare className="w-4 h-4 text-secondary" />
                      : <Square className="w-4 h-4 text-primary-foreground/40" />}
                  </button>
                </th>
                {["Name", "Position", "Job ID", "Reference", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left font-sans text-[10px] tracking-widest uppercase px-4 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-primary/8 hover:bg-secondary/5 transition-colors cursor-pointer"
                  onClick={() => { setSelected(a); setOfferSent(false); }}>
                  <td className="px-4 py-4" onClick={(e) => { e.stopPropagation(); toggleSelect(a.id); }}>
                    {selectedIds.includes(a.id) ? <CheckSquare className="w-4 h-4 text-secondary" /> : <Square className="w-4 h-4 text-primary/30" />}
                  </td>
                  <td className="px-4 py-4 font-sans text-sm text-primary">{a.name}</td>
                  <td className="px-4 py-4 font-sans text-xs text-primary/60">{a.job_title}</td>
                  <td className="px-4 py-4 font-sans text-xs text-primary/50">#{a.job_id}</td>
                  <td className="px-4 py-4 font-mono text-xs text-primary/50">{a.reference_number}</td>
                  <td className="px-4 py-4 font-sans text-xs text-primary/50">{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-4">
                    <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-0.5 border ${STATUS_COLORS[a.status] || ''}`}>
                      {STATUS_LABELS[a.status] || a.status}
                    </span>
                  </td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} disabled={updating}
                      className="h-8 px-2 bg-background border border-primary/15 font-sans text-xs text-primary focus:outline-none focus:border-secondary">
                      {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowInterviewModal(false)}>
          <div className="bg-white border border-gray-200 w-full max-w-md shadow-2xl rounded-lg"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-serif text-lg text-gray-900">Schedule Interview</h2>
              <button onClick={() => setShowInterviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="font-sans text-xs text-gray-500">Scheduling for {selectedIds.length} candidate(s)</p>
              <div>
                <label className="font-sans text-xs font-semibold text-gray-700 block mb-2">Date & Time *</label>
                <input
                  type="datetime-local"
                  value={interviewDatetime}
                  onChange={(e) => setInterviewDatetime(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded font-sans text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-sans text-xs font-semibold text-gray-700 block mb-2">Interview Type *</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded font-sans text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                >
                  <option>In-Person (Office Address)</option>
                  <option>Online (Google Meet)</option>
                </select>
              </div>
              {interviewType === 'Online (Google Meet)' && (
                <div>
                  <label className="font-sans text-xs font-semibold text-gray-700 block mb-2">Google Meet Link *</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={interviewLocation}
                    onChange={(e) => setInterviewLocation(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded font-sans text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={scheduleInterview}
                  disabled={schedulingInterview || !interviewDatetime || (interviewType === 'Online (Google Meet)' && !interviewLocation)}
                  className="flex-1 bg-blue-600 text-white rounded font-sans text-sm font-semibold h-10 disabled:opacity-50 hover:bg-blue-700">
                  {schedulingInterview ? "Scheduling..." : "Schedule & Send Email"}
                </button>
                <button onClick={() => setShowInterviewModal(false)}
                  className="px-5 border border-gray-300 rounded font-sans text-sm text-gray-600 h-10 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50">
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }}
            className="w-full max-w-lg bg-background h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 sticky top-0 bg-background">
              <h2 className="font-serif text-lg text-primary">Application Details</h2>
              <button onClick={() => setSelected(null)} className="text-primary/40 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-primary text-primary-foreground p-5">
                <p className="font-mono text-sm text-secondary mb-1">{selected.reference_number}</p>
                <p className="font-sans text-[10px] text-primary-foreground/40 tracking-widest uppercase">Reference Number</p>
              </div>
              {[
                { l: "Full Name", v: selected.name },
                { l: "Email", v: selected.email },
                { l: "Phone", v: selected.phone },
                { l: "Address", v: selected.address },
                { l: "Position", v: selected.job_title },
                { l: "Job ID", v: `#${selected.job_id}` },
                { l: "Applied On", v: new Date(selected.created_at).toLocaleDateString("en-GB", { dateStyle: "long" }) },
              ].map(({ l, v }) => (
                <div key={l} className="border-b border-primary/8 pb-4">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-1">{l}</p>
                  <p className="font-sans text-sm text-primary">{v}</p>
                </div>
              ))}
              {[
                { l: "Education", v: selected.education },
                { l: "Experience", v: selected.experience },
                { l: "Skills", v: selected.skills },
                { l: "Cover Letter", v: selected.cover_letter },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-2">{l}</p>
                  <p className="font-sans text-sm text-primary/70 leading-relaxed whitespace-pre-line">{v}</p>
                </div>
              ))}
              {selected.portfolio && (
                <div>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-2">Portfolio</p>
                  <a href={selected.portfolio} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 font-sans text-sm text-secondary hover:underline">
                    {selected.portfolio} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
              {selected.cv_url && (
                <a href={selected.cv_url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-10">Download CV</Button>
                </a>
              )}
              {selected.status === 'interview' && selected.interview_datetime && (
                <div className="border border-blue-400/30 bg-blue-50/50 p-4">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-blue-600 mb-3 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Interview Scheduled
                  </p>
                  <p className="font-sans text-xs text-primary/70 mb-1"><strong>Date & Time:</strong> {new Date(selected.interview_datetime).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
                  <p className="font-sans text-xs text-primary/70 mb-1"><strong>Type:</strong> {selected.interview_type}</p>
                  <p className="font-sans text-xs text-primary/70 mb-3"><strong>Location:</strong> {selected.interview_location}</p>
                  <Button onClick={() => openInterviewModal(selected)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-none uppercase tracking-widest font-sans text-xs h-9">
                    Reschedule Interview
                  </Button>
                </div>
              )}
              {['shortlisted', 'reviewing', 'submitted'].includes(selected.status) && (
                <div className="border border-blue-400/20 bg-blue-50/30 p-4">
                  <Button onClick={() => openInterviewModal(selected)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-none uppercase tracking-widest font-sans text-xs h-10 gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Schedule Interview & Send Email
                  </Button>
                </div>
              )}
              {['interview', 'shortlisted'].includes(selected.status) && (
                <div className="border border-secondary/30 bg-secondary/5 p-5">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-3 flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" /> Send Job Offer
                  </p>
                  {offerSent ? (
                    <div className="bg-green-50 border border-green-200 p-3">
                      <p className="font-sans text-sm text-green-700 font-semibold">✓ Offer sent!</p>
                      <p className="font-sans text-xs text-green-600 mt-1">72-hour timer started. Notified at {selected.email}</p>
                    </div>
                  ) : (
                    <>
                      <p className="font-sans text-xs text-primary/60 mb-3">Sends formal offer to <strong>{selected.email}</strong> with 72-hour window.</p>
                      <div className="flex items-center gap-2 mb-4 text-primary/50">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-sans text-xs">Auto-expires after 72 hours</span>
                      </div>
                      <Button onClick={() => sendOffer(selected)} disabled={sendingOffer}
                        className="w-full bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-10 gap-2 disabled:opacity-50">
                        <Send className="w-3.5 h-3.5" />
                        {sendingOffer ? "Sending..." : "Send Job Offer Email"}
                      </Button>
                    </>
                  )}
                </div>
              )}
              <div className="border-t border-primary/10 pt-5">
                <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_STATUSES.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)}
                      disabled={updating || selected.status === s}
                      className={`px-3 py-2 font-sans text-[10px] tracking-widest uppercase border transition-colors disabled:opacity-40 ${selected.status === s ? "bg-secondary text-primary border-secondary" : "border-primary/15 text-primary/50 hover:border-secondary/50"}`}>
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
ENDOFFILE
echo "Done"
