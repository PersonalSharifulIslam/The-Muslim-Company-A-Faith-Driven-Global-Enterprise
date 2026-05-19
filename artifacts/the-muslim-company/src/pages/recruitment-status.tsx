import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { api } from "@/lib/api";
import { STATUS_LABELS, STATUS_COLORS, type Application } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function RecruitmentStatus() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<Application | null | "not_found">(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim()) return;
    setSearching(true);
    setSearched(false);
    try {
      const data = await api.get(`/applications/lookup/${encodeURIComponent(ref.trim().toUpperCase())}`);
      setResult(data as Application);
    } catch {
      setResult("not_found");
    }
    setSearched(true);
    setSearching(false);
  };

  const app = result && result !== "not_found" ? result : null;

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Recruitment</p>
            <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">Application Status</h1>
            <p className="font-sans text-sm text-primary-foreground/55 max-w-xl">
              Enter your application reference number to check the current status of your application.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-background">
        <div className="container mx-auto max-w-3xl">
          <form onSubmit={handleSearch} className="mb-10">
            <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-3">Application Reference Number</label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                type="text"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. TMC/SI/10925/2026/ABC123"
                className="flex-1 h-12 px-4 bg-background border border-primary/15 font-mono text-sm text-primary placeholder:text-primary/25 focus:outline-none focus:border-secondary tracking-wider"
              />
              <Button type="submit" disabled={searching || !ref.trim()} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold disabled:opacity-50">
                {searching ? "Searching..." : <><Search className="w-4 h-4 mr-2" />Search</>}
              </Button>
            </div>
            <p className="font-sans text-xs text-primary/35 mt-2">Reference numbers are case-insensitive. Format: TMC/XX/XXXXX/XXXX/XXXXXX</p>
          </form>

          {searched && result === "not_found" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 p-6 border border-red-400/20 bg-red-50/50">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-base text-primary mb-1">Application reference number not found.</p>
                <p className="font-sans text-xs text-primary/50">Please check the reference number and try again. Ensure it matches exactly as provided in your confirmation.</p>
              </div>
            </motion.div>
          )}

          {app && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-primary text-primary-foreground p-8 mb-6">
                <p className="font-sans text-[10px] tracking-widest uppercase text-secondary/60 mb-6">Application Found</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {[
                    { l: "Applicant Name", v: app.name },
                    { l: "Applied Position", v: app.job_title },
                    { l: "Job ID", v: `#${app.job_id}` },
                    { l: "Reference Number", v: app.reference_number, mono: true },
                    { l: "Submission Date", v: new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                    { l: "Last Updated", v: new Date(app.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  ].map(({ l, v, mono }) => (
                    <div key={l}>
                      <p className="font-sans text-[10px] tracking-widests uppercase text-primary-foreground/35 mb-1">{l}</p>
                      <p className={`${mono ? "font-mono text-secondary" : "font-sans text-primary-foreground"} text-sm`}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-primary-foreground/10">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/35 mb-2">Current Status</p>
                  <span className={`inline-flex items-center px-4 py-2 font-sans text-sm font-semibold border ${STATUS_COLORS[app.status] || "text-primary-foreground"}`}>
                    {STATUS_LABELS[app.status] || app.status}
                  </span>
                </div>
              </div>

              <div className="p-5 border border-secondary/20 bg-secondary/5">
                <p className="font-sans text-xs text-primary/55 leading-relaxed">
                  Our recruitment team reviews all applications carefully. If you are shortlisted, we will contact you through the email or phone number provided. May Allah bless your efforts.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
