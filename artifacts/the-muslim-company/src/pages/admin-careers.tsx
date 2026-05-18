import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { Job } from "@/lib/supabase";

const DEPTS = ["Technology", "Engineering", "Operations", "Finance", "Marketing", "HR", "Research", "Media", "Legal"];
const TYPES = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];

type JobForm = { title: string; department: string; employment_type: string; location: string; description: string; responsibilities: string; requirements: string; preferred: string; benefits: string; salary: string; deadline: string; status: string };
const BLANK: JobForm = { title: "", department: DEPTS[0], employment_type: TYPES[0], location: "", description: "", responsibilities: "", requirements: "", preferred: "", benefits: "", salary: "", deadline: "", status: "active" };

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function AdminCareers() {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);


  const load = async () => {
    try {
      const data = await api.getJobs();
      setJobs(data as Job[]);
    } catch {}
  };

  useEffect(() => { if (user) load(); }, [user]);

  const openNew = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (j: Job) => {
    setEditing(j);
    setForm({ title: j.title, department: j.department, employment_type: j.employment_type, location: j.location, description: j.description, responsibilities: j.responsibilities, requirements: j.requirements, preferred: j.preferred || "", benefits: j.benefits || "", salary: j.salary || "", deadline: j.deadline.split("T")[0], status: j.status });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    const data = { ...form, slug: editing ? slugify(form.title) : `${slugify(form.title)}-${Date.now()}` };
    try {
      if (editing) await api.updateJob(editing.id, data);
      else await api.createJob(data);
      await load();
      setModal(false);
    } catch {}
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this job posting?")) return;
    setDeleting(id);
    try {
      await api.deleteJob(id);
      await load();
    } catch {}
    setDeleting(null);
  };

  const setField = (k: keyof JobForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (loading) return null;

  return (
    <AdminLayout current="/admin/careers">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Careers</h1>
          <p className="font-sans text-sm text-primary/50">Manage job postings</p>
        </div>
        <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">
          <Plus className="w-3.5 h-3.5 mr-2" />New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-card border border-primary/10">
          <p className="font-serif text-xl text-primary mb-4">No job postings yet</p>
          <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">
            <Plus className="w-3.5 h-3.5 mr-2" />Post First Job
          </Button>
        </div>
      ) : (
        <div className="border border-primary/10 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                {["Job ID", "Title", "Department", "Type", "Deadline", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-t border-primary/8 hover:bg-secondary/5 transition-colors">
                  <td className="px-5 py-4 font-sans text-xs text-primary/50">#{j.job_id}</td>
                  <td className="px-5 py-4 font-sans text-sm text-primary font-medium">{j.title}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{j.department}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{j.employment_type}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{new Date(j.deadline).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-4">
                    <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-0.5 border ${j.status === "active" ? "text-green-400 border-green-400/20 bg-green-400/5" : "text-gray-400 border-gray-400/20"}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <a href={`/careers/${j.slug}`} target="_blank" className="text-primary/40 hover:text-secondary transition-colors" title="Preview">
                        <Eye className="w-4 h-4" />
                      </a>
                      <button onClick={() => openEdit(j)} className="text-primary/40 hover:text-secondary transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => del(j.id)} disabled={deleting === j.id} className="text-primary/40 hover:text-red-400 transition-colors disabled:opacity-30" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-background border border-primary/15 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
              <h2 className="font-serif text-xl text-primary">{editing ? "Edit Job" : "New Job Posting"}</h2>
              <button onClick={() => setModal(false)} className="text-primary/40 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([["title", "Job Title"], ["location", "Location"]] as const).map(([k, l]) => (
                  <div key={k}>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">{l} *</label>
                    <input required value={form[k]} onChange={setField(k)} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                  </div>
                ))}
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Department</label>
                  <select value={form.department} onChange={setField("department")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    {DEPTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Employment Type</label>
                  <select value={form.employment_type} onChange={setField("employment_type")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Deadline *</label>
                  <input type="date" value={form.deadline} onChange={setField("deadline")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Salary (Optional)</label>
                  <input value={form.salary} onChange={setField("salary")} placeholder="e.g. Competitive / $X per month" className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Status</label>
                  <select value={form.status} onChange={setField("status")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              {(["description", "responsibilities", "requirements", "preferred", "benefits"] as const).map((k) => {
                const labels: Record<string, string> = { description: "Job Description", responsibilities: "Responsibilities (one per line)", requirements: "Requirements (one per line)", preferred: "Preferred Qualifications", benefits: "Benefits" };
                return (
                  <div key={k}>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">{labels[k]}</label>
                    <textarea rows={4} value={form[k]} onChange={setField(k)} className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
                  </div>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-primary/10 flex gap-3">
              <Button onClick={save} disabled={saving || !form.title || !form.deadline} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-6 disabled:opacity-40">
                {saving ? "Saving..." : editing ? "Save Changes" : "Post Job"}
              </Button>
              <Button variant="outline" onClick={() => setModal(false)} className="border-primary/20 text-primary rounded-none font-sans text-xs h-9 px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
