import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { supabase, isSupabaseConfigured, generateRefNumber, type Job } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

type FormData = {
  name: string; email: string; phone: string; address: string;
  education: string; experience: string; skills: string;
  portfolio: string; cover_letter: string;
};

const INITIAL: FormData = { name: "", email: "", phone: "", address: "", education: "", experience: "", skills: "", portfolio: "", cover_letter: "" };

export default function JobApply({ params }: { params: { slug: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ ref: string; date: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    supabase.from("jobs").select("*").eq("slug", params.slug).single().then(({ data }) => {
      if (data) setJob(data as Job);
      setLoading(false);
    });
  }, [params.slug]);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    setError("");

    const refNumber = generateRefNumber(form.name, job.job_id);
    let cvUrl = "";

    if (cvFile && isSupabaseConfigured) {
      const ext = cvFile.name.split(".").pop();
      const path = `cvs/${refNumber.replace(/\//g, "-")}.${ext}`;
      const { data: uploadData } = await supabase.storage.from("applications").upload(path, cvFile);
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("applications").getPublicUrl(path);
        cvUrl = urlData.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("applications").insert({
      reference_number: refNumber,
      job_id: job.job_id,
      job_title: job.title,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      education: form.education,
      experience: form.experience,
      skills: form.skills,
      portfolio: form.portfolio,
      cover_letter: form.cover_letter,
      cv_url: cvUrl,
      status: "submitted",
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      setError("Submission failed. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted({ ref: refNumber, date: new Date().toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" }) });
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex items-center justify-center py-20 px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-xl w-full text-center">
            <CheckCircle className="w-14 h-14 text-secondary mx-auto mb-6" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-secondary mb-3">Application Submitted</p>
            <h2 className="font-serif text-3xl text-primary mb-5">Jazakallah Khair</h2>
            <p className="font-sans text-sm text-primary/60 leading-relaxed mb-8">
              Your application for <strong>{job?.title}</strong> has been received. Our team will review it carefully, In Sha Allah.
            </p>
            <div className="bg-primary text-primary-foreground p-8 mb-8 text-left">
              <p className="font-sans text-[10px] tracking-widest uppercase text-secondary/60 mb-4">Application Details</p>
              <div className="space-y-3">
                <div>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/40">Reference Number</p>
                  <p className="font-mono text-base text-secondary font-bold">{submitted.ref}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/40">Job ID</p>
                  <p className="font-sans text-sm text-primary-foreground">#{job?.job_id}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/40">Submitted On</p>
                  <p className="font-sans text-sm text-primary-foreground">{submitted.date}</p>
                </div>
              </div>
            </div>
            <p className="font-sans text-xs text-primary/50 mb-6">
              Save your reference number to track your application status.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="/recruitment-status">
                <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-10 px-6 text-xs font-bold">
                  Track Status
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

          {!isSupabaseConfigured ? (
            <div className="text-center py-20">
              <AlertCircle className="w-10 h-10 text-secondary/40 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-primary mb-3">Setup Required</h3>
              <p className="font-sans text-sm text-primary/50">Connect Supabase to enable applications.</p>
            </div>
          ) : loading ? (
            <div className="h-96 bg-primary/5 animate-pulse" />
          ) : !job ? (
            <div className="text-center py-20">
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
                  const labels: Record<string, string> = { education: "Educational Background *", experience: "Work Experience *", skills: "Key Skills *", cover_letter: "Cover Letter *" };
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
