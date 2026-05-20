import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/lib/supabase";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setExpired(true); setTimeLeft("Expired"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);
  return (
    <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${expired ? "text-red-500" : "text-secondary"}`}>
      <Clock className="w-6 h-6" />{timeLeft}
    </div>
  );
}

export default function RecruitmentStatus() {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<any | null | "not_found">(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim()) return;
    setSearching(true); setSearched(false); setAccepted(false);
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("reference_number", ref.trim().toUpperCase())
        .single();
      if (error || !data) setResult("not_found");
      else setResult(data);
    } catch { setResult("not_found"); }
    setSearched(true); setSearching(false);
  };

  const handleAcceptOffer = async () => {
    if (!app) return;
    setAccepting(true);
    try {
      await supabase.from("applications").update({
        status: "hired",
        offer_accepted_at: new Date().toISOString(),
        offer_status: "accepted",
        onboarding_status: "pending",
      }).eq("id", app.id);
      setAccepted(true);
      setResult({ ...app, status: "hired", offer_status: "accepted" });
    } catch { alert("Failed to accept offer. Please try again."); }
    setAccepting(false);
  };

  const app = result && result !== "not_found" ? result : null;
  const isOffered = app?.status === "offered" && app?.offer_expires_at;
  const isOfferExpired = isOffered && new Date(app.offer_expires_at).getTime() < Date.now();
  const isAccepted = accepted || app?.offer_status === "accepted";

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
              <input type="text" value={ref} onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. TMC/SI/10925/2026/ABC123"
                className="flex-1 h-12 px-4 bg-background border border-primary/15 font-mono text-sm text-primary placeholder:text-primary/25 focus:outline-none focus:border-secondary tracking-wider" />
              <Button type="submit" disabled={searching || !ref.trim()}
                className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold disabled:opacity-50">
                {searching ? "Searching..." : <><Search className="w-4 h-4 mr-2" />Search</>}
              </Button>
            </div>
            <p className="font-sans text-xs text-primary/35 mt-2">Format: TMC/XX/XXXXX/XXXX/XXXXXX</p>
          </form>

          {searched && result === "not_found" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4 p-6 border border-red-400/20 bg-red-50/50">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-base text-primary mb-1">Application reference number not found.</p>
                <p className="font-sans text-xs text-primary/50">Please check and try again.</p>
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
                      <p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/35 mb-1">{l}</p>
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

              {/* Offer Section */}
              {isOffered && !isAccepted && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-secondary bg-secondary/5 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <p className="font-serif text-xl text-primary">Congratulations! You have received a Job Offer</p>
                  </div>
                  <p className="font-sans text-sm text-primary/70 mb-5 leading-relaxed">
                    Alhamdulillah! The Muslim Company is pleased to offer you the position of <strong>{app.job_title}</strong>. Please accept within the timeframe below.
                  </p>

                  {!isOfferExpired ? (
                    <div className="bg-primary text-primary-foreground p-4 mb-5">
                      <p className="font-sans text-[10px] tracking-widest uppercase text-primary-foreground/40 mb-2">Offer Expires In</p>
                      <CountdownTimer expiresAt={app.offer_expires_at} />
                      <p className="font-sans text-xs text-primary-foreground/40 mt-2">
                        Expires: {new Date(app.offer_expires_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-4 mb-5">
                      <p className="font-sans text-sm text-red-600 font-semibold flex items-center gap-2">
                        <XCircle className="w-4 h-4" /> This offer has expired.
                      </p>
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 p-4 mb-5">
                    <p className="font-sans text-xs text-green-800 font-semibold mb-2">Post-Acceptance Onboarding:</p>
                    <p className="font-sans text-xs text-green-700 leading-relaxed mb-1">
                      Upon accepting, you have <strong>7 days</strong> to report onsite with original documents.
                    </p>
                    <p className="font-sans text-xs text-green-700 leading-relaxed">
                      Reporting within <strong>3 days</strong> earns <strong>Special Commendation & High-Priority Onboarding Status</strong>.
                    </p>
                  </div>

                  {!isOfferExpired && (
                    <Button onClick={handleAcceptOffer} disabled={accepting}
                      className="w-full bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 text-xs font-bold disabled:opacity-50">
                      {accepting ? "Processing..." : "✓ Accept Offer"}
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Accepted */}
              {isAccepted && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="border border-green-400/30 bg-green-50 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p className="font-serif text-xl text-green-800">Offer Accepted — Alhamdulillah!</p>
                  </div>
                  <p className="font-sans text-sm text-green-700 leading-relaxed mb-3">
                    Jazakallah Khair for accepting. You have <strong>7 days</strong> to report onsite with your original documents.
                  </p>
                  <p className="font-sans text-xs text-green-600 leading-relaxed">
                    Reporting within <strong>3 days</strong> grants <strong>Special Commendation & High-Priority Onboarding Status</strong>. We look forward to welcoming you!
                  </p>
                </motion.div>
              )}

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
