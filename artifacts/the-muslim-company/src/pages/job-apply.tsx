import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle, Upload, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { api } from "@/lib/api";
import type { Job } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

type FormData = {
  name: string; email: string; phone: string; address: string;
  education: string; experience: string; skills: string;
  portfolio: string; cover_letter: string;
};

const INITIAL: FormData = {
  name: "", email: "", phone: "", address: "",
  education: "", experience: "", skills: "",
  portfolio: "", cover_letter: "",
};

type SubmittedState = {
  ref: string;
  date: string;
  form: FormData;
  job: Job;
};

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const avgCharWidth = fontSize * 0.5;
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    if ((currentLine + " " + word).trim().length > charsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

async function generatePDF(submitted: SubmittedState) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const DARK = [15, 35, 20] as [number, number, number];
  const GOLD = [176, 141, 87] as [number, number, number];
  const LIGHT_GOLD = [220, 196, 150] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];
  const CREAM = [250, 247, 240] as [number, number, number];
  const LIGHT_GREY = [240, 238, 233] as [number, number, number];
  const TEXT_DARK = [30, 50, 35] as [number, number, number];
  const TEXT_MID = [90, 100, 90] as [number, number, number];

  let y = 0;

  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, 60, "F");

  doc.setFillColor(...GOLD);
  doc.rect(0, 58, W, 2, "F");

  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("\u0628\u0650\u0633\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0645\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650", W / 2, 14, { align: "center" });

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("THE MUSLIM COMPANY", W / 2, 30, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...LIGHT_GOLD);
  doc.text("A FAITH-DRIVEN PROFESSIONAL ENTERPRISE", W / 2, 38, { align: "center" });

  doc.setFontSize(7);
  doc.setTextColor(...GOLD);
  doc.text("www.themuslim.company", W / 2, 46, { align: "center" });

  y = 70;

  doc.setFillColor(...CREAM);
  doc.rect(15, y - 5, W - 30, 24, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.rect(15, y - 5, W - 30, 24, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...DARK);
  doc.text("APPLICATION CONFIRMATION", W / 2, y + 6, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MID);
  doc.text("Your application has been received successfully — In Sha Allah", W / 2, y + 13, { align: "center" });

  y += 28;

  doc.setFillColor(...DARK);
  doc.rect(15, y, W - 30, 20, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text("REFERENCE NUMBER", 25, y + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.text(submitted.ref, 25, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...LIGHT_GOLD);
  doc.text(`Submitted: ${submitted.date}`, W - 25, y + 16, { align: "right" });

  y += 28;

  const sectionHeader = (title: string) => {
    doc.setFillColor(...GOLD);
    doc.rect(15, y, 3, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(title, 22, y + 5.5);
    doc.setDrawColor(...LIGHT_GREY);
    doc.setLineWidth(0.3);
    doc.line(22, y + 8, W - 15, y + 8);
    y += 14;
  };

  const fieldRow = (label: string, value: string, x = 15, colW = W - 30) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text(label.toUpperCase(), x + 2, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_DARK);
    const lines = wrapText(value || "—", colW - 10, 9);
    for (const line of lines) {
      if (y > 270) {
        doc.addPage();
        doc.setFillColor(...CREAM);
        doc.rect(0, 0, W, 12, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...TEXT_MID);
        doc.text("THE MUSLIM COMPANY — Application Confirmation", W / 2, 8, { align: "center" });
        y = 20;
      }
      doc.text(line, x + 2, y);
      y += 5.5;
    }
    y += 3;
  };

  const twoColRow = (l1: string, v1: string, l2: string, v2: string) => {
    const half = (W - 30) / 2;
    const startY = y;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text(l1.toUpperCase(), 15 + 2, y);
    doc.text(l2.toUpperCase(), 15 + half + 5, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_DARK);
    doc.text(v1 || "—", 15 + 2, y);
    doc.text(v2 || "—", 15 + half + 5, y);
    y += 8;
    void startY;
  };

  sectionHeader("JOB DETAILS");
  twoColRow("Position", submitted.job.title, "Job ID", `#${submitted.job.job_id}`);
  twoColRow("Department", submitted.job.department, "Location", submitted.job.location);
  twoColRow("Employment Type", submitted.job.employment_type, "Status", "Applied");

  sectionHeader("APPLICANT INFORMATION");
  twoColRow("Full Name", submitted.form.name, "Phone Number", submitted.form.phone);
  twoColRow("Email Address", submitted.form.email, "Address", submitted.form.address);

  sectionHeader("QUALIFICATIONS");
  fieldRow("Educational Background", submitted.form.education);
  fieldRow("Work Experience", submitted.form.experience);
  fieldRow("Key Skills", submitted.form.skills);
  if (submitted.form.portfolio) {
    fieldRow("Portfolio / LinkedIn", submitted.form.portfolio);
  }

  sectionHeader("COVER LETTER");
  fieldRow("", submitted.form.cover_letter);

  const remainingSpace = 297 - y;
  const footerHeight = 30;
  if (remainingSpace < footerHeight + 5) {
    doc.addPage();
    y = 20;
  }

  y = Math.max(y, 265);

  doc.setFillColor(...DARK);
  doc.rect(0, y, W, 297 - y, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, y, W, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...GOLD);
  doc.text("Jazakallah Khair", W / 2, y + 10, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...LIGHT_GOLD);
  doc.text("Thank you for applying. Our team will review your application carefully, In Sha Allah.", W / 2, y + 17, { align: "center" });

  doc.setFontSize(7);
  doc.setTextColor(...GOLD);
  doc.text("THE MUSLIM COMPANY  |  www.themuslim.company  |  careers@themuslim.company", W / 2, y + 24, { align: "center" });

  const filename = `TMC_Application_${submitted.ref.replace(/\//g, "-")}.pdf`;
  doc.save(filename);
}

export default function JobApply({ params }: { params: { slug: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedState | null>(null);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${params.slug}`)
      .then((data) => setJob(data as Job))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.slug]);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append("job_db_id", String(job.id));
      if (cvFile) formData.append("cv", cvFile);

      const token = api.getToken();
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        let msg = "Submission failed. Please try again.";
        try { const j = await res.json(); msg = j.error || msg; } catch { }
        throw new Error(msg);
      }

      const data = await res.json() as { reference_number: string };
      setSubmitted({
        ref: data.reference_number,
        date: new Date().toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" }),
        form,
        job,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
    setSubmitting(false);
  };

  const handleDownloadPDF = async () => {
    if (!submitted) return;
    setPdfLoading(true);
    try {
      await generatePDF(submitted);
    } catch {
      // fallback silent
    }
    setPdfLoading(false);
  };

  if (submitted) {
    return (
      <SiteLayout>
        <div className="py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>

              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 border-2 border-secondary mb-5">
                  <CheckCircle className="w-10 h-10 text-secondary" />
                </div>
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-secondary mb-2">Alhamdulillah</p>
                <h2 className="font-serif text-4xl text-primary mb-3">Application Submitted</h2>
                <p className="font-sans text-sm text-primary/55 max-w-md mx-auto">
                  Jazakallah Khair for applying. Our team will review your application carefully, In Sha Allah.
                </p>
              </div>

              <div className="bg-primary text-primary-foreground overflow-hidden mb-6">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-secondary/60 mb-1">Reference Number</p>
                    <p className="font-mono text-xl text-secondary font-bold tracking-wider">{submitted.ref}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-primary-foreground/40 mb-1">Submitted On</p>
                    <p className="font-sans text-sm text-primary-foreground/80">{submitted.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-px bg-white/10">
                  {[
                    ["Position", submitted.job.title],
                    ["Job ID", `#${submitted.job.job_id}`],
                    ["Department", submitted.job.department],
                    ["Location", submitted.job.location],
                    ["Applicant", submitted.form.name],
                    ["Email", submitted.form.email],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-primary px-6 py-3">
                      <p className="font-sans text-[9px] tracking-widest uppercase text-primary-foreground/40 mb-0.5">{label}</p>
                      <p className="font-sans text-sm text-primary-foreground truncate">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-secondary/30 bg-secondary/5 p-5 mb-8">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-primary mb-1">Download Your Application Confirmation</p>
                    <p className="font-sans text-xs text-primary/55 mb-4">
                      A complete PDF summary of your application — including your reference number, job details, and all submitted information — for your records.
                    </p>
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={pdfLoading}
                      className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-10 px-6 text-xs font-bold gap-2 disabled:opacity-60"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {pdfLoading ? "Generating PDF..." : "Download PDF Confirmation"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-primary/4 border border-primary/10 p-5 mb-8">
                <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40 mb-3">What Happens Next</p>
                <div className="space-y-3">
                  {[
                    ["1", "Application Review", "Our HR team will review your application within 5–7 working days."],
                    ["2", "Shortlisting", "Shortlisted candidates will be contacted for an initial interview, In Sha Allah."],
                    ["3", "Track Your Status", "Use your reference number to check your application status anytime."],
                  ].map(([num, title, desc]) => (
                    <div key={num} className="flex gap-4">
                      <div className="w-6 h-6 bg-secondary/15 text-secondary text-xs font-bold font-sans flex items-center justify-center shrink-0 mt-0.5">{num}</div>
                      <div>
                        <p className="font-sans text-sm font-semibold text-primary">{title}</p>
                        <p className="font-sans text-xs text-primary/50">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <a href="/recruitment-status">
                  <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-10 px-6 text-xs font-bold">
                    Track Application Status
                  </Button>
                </a>
                <a href="/careers">
                  <Button variant="outline" className="border-primary/20 text-primary hover:border-secondary rounded-none font-sans text-xs tracking-widest uppercase h-10 px-5">
                    Back to Careers
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="py-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
          <a href={`/careers/${params.slug}`} className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-primary/50 hover:text-secondary transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Details
          </a>

          {loading ? (
            <div className="h-96 bg-primary/5 animate-pulse" />
          ) : !job ? (
            <div className="text-center py-20">
              <AlertCircle className="w-10 h-10 text-secondary/40 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-primary">Position Not Found</h3>
            </div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="mb-8 pb-6 border-b border-primary/10">
                <p className="font-sans text-xs tracking-widest uppercase text-secondary mb-2">Apply Now</p>
                <h1 className="font-serif text-3xl text-primary">{job.title}</h1>
                <p className="font-sans text-sm text-primary/50 mt-1">Job ID: #{job.job_id} · {job.department} · {job.location}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {([["name", "Full Name", true], ["email", "Email Address", true], ["phone", "Phone Number", true], ["address", "Current Address", true]] as const).map(([field, label, req]) => (
                    <div key={field}>
                      <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">{label}{req && " *"}</label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        required={req}
                        value={form[field]}
                        onChange={set(field)}
                        className="w-full h-11 px-4 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary"
                      />
                    </div>
                  ))}
                </div>

                {(["education", "experience", "skills", "cover_letter"] as const).map((field) => {
                  const labels: Record<string, string> = {
                    education: "Educational Background *",
                    experience: "Work Experience *",
                    skills: "Key Skills *",
                    cover_letter: "Cover Letter *",
                  };
                  return (
                    <div key={field}>
                      <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">{labels[field]}</label>
                      <textarea
                        required
                        rows={field === "cover_letter" ? 6 : 3}
                        value={form[field]}
                        onChange={set(field)}
                        className="w-full px-4 py-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none"
                      />
                    </div>
                  );
                })}

                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Portfolio / LinkedIn (Optional)</label>
                  <input
                    type="text"
                    value={form.portfolio}
                    onChange={set("portfolio")}
                    className="w-full h-11 px-4 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Upload CV (PDF or DOC)</label>
                  <label className="flex items-center gap-3 h-11 px-4 border border-dashed border-primary/20 cursor-pointer hover:border-secondary transition-colors">
                    <Upload className="w-4 h-4 text-primary/40" />
                    <span className="font-sans text-sm text-primary/40">{cvFile ? cvFile.name : "Click to upload..."}</span>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="font-sans text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-primary/10 flex flex-wrap gap-4">
                  <Button type="submit" disabled={submitting} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-11 px-8 text-xs font-bold disabled:opacity-50">
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>
                  <p className="font-sans text-xs text-primary/40 self-center">Your information is kept confidential.</p>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
