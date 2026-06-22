import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, Star, Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { TransparencyReport } from "@/lib/supabase";

const TYPES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi_annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
];

type Form = { title: string; report_type: string; period_label: string; description: string; pdf_url: string; published_date: string; featured: boolean };
const today = new Date().toISOString().split("T")[0];
const BLANK: Form = { title: "", report_type: "monthly", period_label: "", description: "", pdf_url: "", published_date: today, featured: false };

export default function AdminTransparencyReports() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<TransparencyReport[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<TransparencyReport | null>(null);
  const [form, setForm] = useState<Form>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const data = await api.get("/admin/transparency-reports", true);
      setReports(data as TransparencyReport[]);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(BLANK);
    setUploadedFileName("");
    setModal(true);
  };

  const openEdit = (r: TransparencyReport) => {
    setEditing(r);
    setForm({
      title: r.title,
      report_type: r.report_type,
      period_label: r.period_label,
      description: r.description || "",
      pdf_url: r.pdf_url || "",
      published_date: r.published_date,
      featured: r.featured,
    });
    setUploadedFileName(r.pdf_url ? "Existing PDF" : "");
    setModal(true);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("File size must be under 20MB.");
      return;
    }

    setUploading(true);
    try {
      const fileName = `transparency/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(data.path);
      setForm((f) => ({ ...f, pdf_url: urlData.publicUrl }));
      setUploadedFileName(file.name);
    } catch (err) {
      alert("Upload failed. Please try again.");
      console.error(err);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePdf = () => {
    setForm((f) => ({ ...f, pdf_url: "" }));
    setUploadedFileName("");
  };

  const save = async () => {
    if (!form.pdf_url) {
      alert("Please upload a PDF file before publishing.");
      return;
    }
    setSaving(true);
    try {
      if (editing) await api.put(`/admin/transparency-reports/${editing.id}`, form, true);
      else await api.post("/admin/transparency-reports", form, true);
      await load();
      setModal(false);
    } catch {}
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this report?")) return;
    setDeleting(id);
    try {
      await api.del(`/admin/transparency-reports/${id}`, true);
      await load();
    } catch {}
    setDeleting(null);
  };

  const setField = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const typeLabel = (t: string) => TYPES.find((x) => x.value === t)?.label || t;

  return (
    <AdminLayout current="/admin/transparency-reports">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Transparency Reports</h1>
          <p className="font-sans text-sm text-primary/50">Upload monthly, quarterly, semi-annual, and annual reports</p>
        </div>
        <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">
          <Plus className="w-3.5 h-3.5 mr-2" />New Report
        </Button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-20 bg-card border border-primary/10">
          <p className="font-serif text-xl text-primary mb-4">No reports yet</p>
          <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">
            <Plus className="w-3.5 h-3.5 mr-2" />Add First Report
          </Button>
        </div>
      ) : (
        <div className="border border-primary/10 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                {["Title", "Type", "Period", "Published", "Featured", "PDF", "Actions"].map((h) => (
                  <th key={h} className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className={`border-t border-primary/8 hover:bg-secondary/5 transition-colors ${r.featured ? "bg-secondary/5" : ""}`}>
                  <td className="px-5 py-4 font-sans text-sm text-primary max-w-xs truncate">{r.title}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{typeLabel(r.report_type)}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{r.period_label}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/50">{new Date(r.published_date).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-4">{r.featured && <Star className="w-3.5 h-3.5 text-secondary" />}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/50">{r.pdf_url ? "✓" : "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(r)} className="text-primary/40 hover:text-secondary transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => del(r.id)} disabled={deleting === r.id} className="text-primary/40 hover:text-red-400 transition-colors disabled:opacity-30"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-background border border-primary/15 w-full max-w-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
              <h2 className="font-serif text-xl text-primary">{editing ? "Edit Report" : "New Report"}</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5 text-primary/40" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Title *</label>
                <input value={form.title} onChange={setField("title")} placeholder="e.g. Q2 2026 Transparency Report" className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Report Type</label>
                  <select value={form.report_type} onChange={setField("report_type")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Period Label *</label>
                  <input value={form.period_label} onChange={setField("period_label")} placeholder="e.g. April–June 2026" className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Published Date</label>
                  <input type="date" value={form.published_date} onChange={setField("published_date")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">PDF File *</label>
                  {form.pdf_url ? (
                    <div className="flex items-center gap-2 h-10 px-3 bg-secondary/10 border border-secondary/30">
                      <FileText className="w-4 h-4 text-secondary shrink-0" />
                      <span className="font-sans text-xs text-primary truncate flex-1">{uploadedFileName}</span>
                      <button onClick={removePdf} className="text-primary/40 hover:text-red-400 transition-colors shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full h-10 px-3 bg-background border border-primary/15 border-dashed font-sans text-xs text-primary/50 hover:border-secondary/50 hover:text-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {uploading ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload className="w-3.5 h-3.5" /> Upload PDF</>
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Description (Optional)</label>
                <textarea rows={4} value={form.description} onChange={setField("description")} placeholder="Brief summary of this report's contents" className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={setField("featured")} className="accent-secondary" />
                <span className="font-sans text-sm text-primary/70">Feature this report (shown first)</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-primary/10 flex gap-3">
              <Button onClick={save} disabled={saving || !form.title || !form.period_label || uploading} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-6 disabled:opacity-40">
                {saving ? "Saving..." : editing ? "Save Changes" : "Publish Report"}
              </Button>
              <Button variant="outline" onClick={() => setModal(false)} className="border-primary/20 text-primary rounded-none font-sans text-xs h-9 px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
