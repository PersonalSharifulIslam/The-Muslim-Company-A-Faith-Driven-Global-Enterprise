import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, AlertCircle, Clock, CheckCircle, XCircle, Download, MapPin, Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function CountdownTimer({ expiresAt, label }: { expiresAt: string; label?: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setExpired(true); setTimeLeft("Expired"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);
  return (
    <div className={`flex items-center gap-2 font-mono text-xl font-bold ${expired ? "text-red-500" : "text-secondary"}`}>
      <Clock className="w-5 h-5" />
      <span>{timeLeft}</span>
      {label && <span className="font-sans text-xs font-normal text-primary/65 ml-2">{label}</span>}
    </div>
  );
}

export default function RecruitmentStatus() {
  useEffect(() => {
    document.title = "Recruitment Status — The Muslim Company";

    // Organization Schema — consistent across all pages
    document.querySelectorAll('script[data-org-schema]').forEach(el => el.remove());
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://www.themuslim.company/#organization",
      "name": "The Muslim Company",
      "legalName": "The Muslim Company LTD",
      "url": "https://www.themuslim.company",
      "logo": { "@type": "ImageObject", "url": "https://www.themuslim.company/favicon.png", "width": 512, "height": 512 },
      "foundingDate": "2025-01-09",
      "numberOfEmployees": { "@type": "QuantitativeValue", "value": 10 },
      "address": { "@type": "PostalAddress", "streetAddress": "Niketon Bazaar", "addressLocality": "Dhaka", "postalCode": "1212", "addressCountry": "BD" },
      "sameAs": ["https://www.facebook.com/TheMuslimCompany", "https://www.instagram.com/officialTheMuslimCompany", "https://www.youtube.com/@TheMuslimCompany", "https://www.linkedin.com/company/themuslimcompany", "https://x.com/officialtmchq", "https://www.crunchbase.com/organization/the-muslim-company"]
    };
    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.setAttribute("data-org-schema", "true");
    orgScript.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgScript);
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "Track the status of your job application at The Muslim Company. Enter your reference number to check where you are in our recruitment process.");
    const _ogt_d = document.querySelector('meta[property="og:description"]');
    if (_ogt_d) _ogt_d.setAttribute('content', "Track the status of your job application at The Muslim Company. Enter your reference number to check where you are in our recruitment process.");
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', 'Track your job application status at The Muslim Company using your reference number.');
    const ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute('content', 'Recruitment Status — The Muslim Company');
    const _twt_fix = document.querySelector('meta[name="twitter:title"]');
    if (_twt_fix) _twt_fix.setAttribute('content', 'Recruitment Status — The Muslim Company');
    const _twd_fix = document.querySelector('meta[name="twitter:description"]');
    if (_twd_fix) _twd_fix.setAttribute('content', "Track the status of your job application at The Muslim Company. Enter your reference number to check where you are in our recruitment process.");
    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    const s = document.createElement('script'); s.type = 'application/ld+json';
    s.setAttribute('data-page-schema', 'true');
    s.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "name": "Breadcrumb", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/" },
      { "@type": "ListItem", "position": 2, "name": "Careers", "item": "https://www.themuslim.company/careers" },
      { "@type": "ListItem", "position": 3, "name": "Recruitment Status", "item": "https://www.themuslim.company/recruitment-status" }
    ]});
    document.head.appendChild(s);
    return () => { document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove()); };
  }, []);

  const [ref, setRef] = useState("");
  const [result, setResult] = useState<any | null | "not_found">(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("cf-turnstile-script")) {
      // @ts-ignore
      if (window.turnstile) setTurnstileReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!turnstileReady) return;
    const container = document.getElementById("recruitment-turnstile-container");
    if (!container || container.childElementCount > 0) return;
    // @ts-ignore
    if (window.turnstile) {
      // @ts-ignore
      window.turnstile.render(container, {
        sitekey: "0x4AAAAAADsybnAg1p4qZ5qL",
        theme: "light",
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    }
  }, [turnstileReady]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim() || !turnstileToken) return;
    setSearching(true); setSearched(false);
    try {
      const verifyRes = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        setResult("not_found");
        setSearched(true); setSearching(false);
        return;
      }
    } catch {
      setResult("not_found");
      setSearched(true); setSearching(false);
      return;
    }
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .ilike("reference_number", ref.trim())
      .single();
    setResult(error || !data ? "not_found" : data);
    setSearched(true); setSearching(false);
  };

  const handleAcceptOffer = async () => {
    if (!app) return;
    setAccepting(true);
    const joiningDeadline = new Date(Date.now() + 7 * 24 * 3600000).toISOString();
    const { data, error } = await supabase.from("applications").update({
      status: "offer_accepted",
      offer_accepted_at: new Date().toISOString(),
      offer_status: "accepted",
      onboarding_status: "pending",
      joining_deadline: joiningDeadline,
    }).eq("id", app.id).select().single();
    if (!error && data) setResult(data);
    setAccepting(false);
  };

  const app = result && result !== "not_found" ? result : null;
  const status = app?.status;

  const isSubmittedOrReview = ["submitted", "reviewing", "shortlisted"].includes(status);
  const isInterview = status === "interview";
  const isOffered = status === "offered";
  const isOfferExpired = isOffered && app?.offer_expires_at && new Date(app.offer_expires_at).getTime() < Date.now();
  const isAccepted = status === "offer_accepted";
  const isHired = status === "hired";
  const isRejected = status === "rejected";

  const statusLabels: Record<string, string> = {
    submitted: "Submitted",
    reviewing: "Under Review",
    shortlisted: "Shortlisted",
    interview: "Interview Scheduled",
    offered: "Job Offer Extended",
    offer_accepted: "Offer Accepted — Onboarding",
    hired: "Hired",
    rejected: "Not Selected",
  };

  const statusColors: Record<string, string> = {
    submitted: "border-blue-400 text-blue-700 bg-blue-50",
    reviewing: "border-yellow-400 text-yellow-700 bg-yellow-50",
    shortlisted: "border-purple-400 text-purple-700 bg-purple-50",
    interview: "border-orange-400 text-orange-700 bg-orange-50",
    offered: "border-green-400 text-green-700 bg-green-50",
    offer_accepted: "border-emerald-400 text-emerald-700 bg-emerald-50",
    hired: "border-emerald-600 text-emerald-800 bg-emerald-100",
    rejected: "border-red-400 text-red-700 bg-red-50",
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Recruitment Portal</p>
            <h1 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-4">Application Status</h1>
            <p className="font-sans text-sm text-primary-foreground/55 max-w-xl">
              Enter your unique reference number to track your application pipeline at The Muslim Company.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-background">
        <div className="container mx-auto max-w-3xl">

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-10">
            <label className="font-sans text-xs tracking-widest uppercase text-primary/65 block mb-3">Application Reference Number</label>
            <div className="flex gap-3 flex-col sm:flex-row">
              <input type="text" value={ref} onChange={e => setRef(e.target.value)}
                placeholder="e.g. TMC/SI/10925/2026/ABC123"
                className="flex-1 h-12 px-4 bg-background border border-primary/15 font-mono text-sm text-primary placeholder:text-primary/25 focus:outline-none focus:border-secondary tracking-wider" />
              <Button type="submit" disabled={searching || !ref.trim() || !turnstileToken}
                className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 px-8 text-xs font-bold disabled:opacity-50">
                {searching ? "Searching..." : <><Search className="w-4 h-4 mr-2" />Search</>}
              </Button>
            </div>
            <div id="recruitment-turnstile-container" className="mt-4" />
            <p className="font-sans text-xs text-primary/35 mt-2">Reference numbers are case-insensitive. Format: TMC/XX/XXXXX/XXXX/XXXXXX</p>
          </form>

          {/* Not Found */}
          {searched && result === "not_found" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-start gap-4 p-6 border border-red-400/20 bg-red-50/50">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-base text-primary mb-1">Application reference number not found.</p>
                <p className="font-sans text-xs text-primary/65">Please check the reference number and try again. Ensure it matches exactly as provided in your confirmation.</p>
              </div>
            </motion.div>
          )}

          {/* Result */}
          {app && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Application Card */}
              <div className="bg-primary text-primary-foreground p-8">
                <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mb-6">Application Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  {[
                    { l: "Applicant Name", v: app.name },
                    { l: "Applied Position", v: app.job_title },
                    { l: "Job ID", v: `#${app.job_id}` },
                    { l: "Reference Number", v: app.reference_number, mono: true },
                    { l: "Submission Date", v: new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                    { l: "Last Updated", v: new Date(app.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  ].map(({ l, v, mono }) => (
                    <div key={l}>
                      <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 mb-1">{l}</p>
                      <p className={`${mono ? "font-mono text-secondary text-xs" : "font-sans text-sm"} text-primary-foreground`}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-5 border-t border-primary-foreground/10">
                  <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 mb-2">Current Status</p>
                  <span className={`inline-flex items-center px-4 py-2 font-sans text-sm font-semibold border ${statusColors[status] || "border-primary-foreground/20 text-primary-foreground"}`}>
                    {statusLabels[status] || status}
                  </span>
                </div>
              </div>

              {/* ── STATE: Submitted / Under Review / Shortlisted ── */}
              {isSubmittedOrReview && (
                <div className="border border-primary/10 bg-card p-6">
                  <p className="font-sans text-xs tracking-widest uppercase text-secondary font-bold mb-1">Current Status: {statusLabels[status]}</p>
                  <p className="font-serif text-lg text-primary mb-3">As-salamu alaykum.</p>
                  <p className="font-sans text-sm text-primary/70 leading-relaxed">
                    Please be informed that your application has been safely received and is currently being thoroughly evaluated by our Talent Acquisition team. We deeply value the time and effort you have invested in choosing The Muslim Company. Please bookmark this tracking portal or monitor your inbox for upcoming updates.
                  </p>
                </div>
              )}

              {/* ── STATE: Interview Scheduled ── */}
              {isInterview && (
                <div className="border-2 border-orange-400/40 bg-orange-50/30 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <p className="font-serif text-xl text-primary">Interview Scheduled</p>
                  </div>
                  <p className="font-serif text-base text-primary mb-2">As-salamu alaykum.</p>
                  <p className="font-sans text-sm text-primary/70 leading-relaxed mb-5">
                    Based on your commendable qualifications and professional background, we are pleased to invite you to the next phase of our selection process for a formal interview.
                  </p>
                  <div className="bg-primary text-primary-foreground p-5 space-y-4 mb-5">
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 mb-1">Date & Time</p>
                      <p className="font-sans text-sm text-primary-foreground">
                        {app.interview_datetime
                          ? new Date(app.interview_datetime).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })
                          : "To be confirmed — check your email"}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 mb-1">Interview Type</p>
                      <div className="flex items-center gap-2">
                        {app.interview_type?.toLowerCase().includes("online")
                          ? <><Video className="w-4 h-4 text-secondary" /><span className="font-sans text-sm text-primary-foreground">Online (Google Meet)</span></>
                          : <><MapPin className="w-4 h-4 text-secondary" /><span className="font-sans text-sm text-primary-foreground">In-Person (Office)</span></>
                        }
                      </div>
                    </div>
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 mb-1">Venue / Access Link</p>
                      {app.interview_location?.startsWith("http")
                        ? <a href={app.interview_location} target="_blank" rel="noreferrer"
                            className="font-sans text-sm text-secondary underline break-all">{app.interview_location}</a>
                        : <p className="font-sans text-sm text-primary-foreground">
                            {app.interview_location || (app.interview_type?.toLowerCase().includes("online")
                              ? "Meeting link will be sent to your email before the interview"
                              : "Details sent to your email")}
                          </p>
                      }
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 p-4">
                    <p className="font-sans text-xs font-bold text-yellow-800 mb-2">⚠ Crucial Notice — Rescheduling Protocols</p>
                    <p className="font-sans text-xs text-yellow-700 leading-relaxed">
                      Punctuality is a profound trust (Amanah) in our values. Please ensure you connect or arrive <strong>10 minutes prior</strong> to your scheduled slot. If an unavoidable emergency arises, you are strictly required to contact our HR department via email (<strong>hr@themuslim.company</strong>) at least <strong>24 hours in advance</strong>. Management will review valid constraints to determine if a single rescheduling window can be granted.<br /><br />
                      <em>May your journey with us be blessed and successful.</em>
                    </p>
                  </div>
                </div>
              )}

              {/* ── STATE: Offered ── */}
              {isOffered && (
                <div className="border-2 border-secondary bg-secondary/5 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <p className="font-serif text-xl text-primary">Job Offer Extended</p>
                  </div>
                  <p className="font-sans text-sm text-primary/70 leading-relaxed mb-5">
                    <strong>Alhamdulillah!</strong> We are delighted to inform you that you have been officially selected to join our organization. Your expertise and values align perfectly with our vision. Please review your formal contract below:
                  </p>

                  {/* Download Offer Letter */}
                  {app.offer_pdf_url && (
                    <a href={app.offer_pdf_url} target="_blank" rel="noreferrer" download>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest font-sans h-12 text-xs font-bold mb-5 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Download Official Offer Letter (PDF)
                      </Button>
                    </a>
                  )}

                  {/* Countdown */}
                  {!isOfferExpired ? (
                    <div className="bg-primary text-primary-foreground p-5 mb-5">
                      <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 mb-3">Offer Expiration Remaining</p>
                      <CountdownTimer expiresAt={app.offer_expires_at} />
                      <p className="font-sans text-xs text-primary-foreground/55 mt-3">
                        This offer expires: {new Date(app.offer_expires_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-4 mb-5">
                      <p className="font-sans text-sm text-red-600 font-semibold flex items-center gap-2">
                        <XCircle className="w-4 h-4" /> This offer has expired and has been automatically cancelled.
                      </p>
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 p-4 mb-5">
                    <p className="font-sans text-xs font-bold text-green-800 mb-2">Action Required — 72-Hour Window</p>
                    <p className="font-sans text-xs text-green-700 leading-relaxed">
                      This employment offer remains active for a strict duration of <strong>72 hours (3 days)</strong> from the time of issuance. If you accept our terms, please click the 'Accept Offer' button below. Failure to do so within the designated timeframe will result in the automated expiration and cancellation of this offer.<br /><br />
                      <em>Note: No reject option is provided. If you do not wish to proceed, simply allow the timer to expire.</em>
                    </p>
                  </div>

                  {!isOfferExpired && (
                    <Button onClick={handleAcceptOffer} disabled={accepting}
                      className="w-full bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-12 text-xs font-bold disabled:opacity-50">
                      {accepting ? "Processing..." : "✓ Accept Offer"}
                    </Button>
                  )}
                </div>
              )}

              {/* ── STATE: Offer Accepted / Onboarding ── */}
              {isAccepted && (
                <div className="border-2 border-emerald-400 bg-emerald-50/30 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    <p className="font-serif text-xl text-primary">Offer Accepted — Onboarding</p>
                  </div>
                  <p className="font-sans text-sm text-primary/70 leading-relaxed mb-5">
                    <strong>Ma sha Allah!</strong> We offer you our heartiest congratulations on accepting our employment offer. We are deeply honored to welcome you into The Muslim Company family.
                  </p>

                  {/* Download remains visible */}
                  {app.offer_pdf_url && (
                    <a href={app.offer_pdf_url} target="_blank" rel="noreferrer" download>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest font-sans h-12 text-xs font-bold mb-5 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Download Official Offer Letter (PDF)
                      </Button>
                    </a>
                  )}

                  {/* 7-day onboarding countdown */}
                  {app.joining_deadline && (
                    <div className="bg-primary text-primary-foreground p-5 mb-5">
                      <p className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 mb-3">Maximum Time Remaining to Report Onsite</p>
                      <CountdownTimer expiresAt={app.joining_deadline} />
                      <p className="font-sans text-xs text-primary-foreground/55 mt-3">
                        Deadline: {new Date(app.joining_deadline).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 p-5 mb-5">
                    <p className="font-sans text-xs font-bold text-blue-800 mb-3">⭐ High-Priority Preference</p>
                    <p className="font-sans text-xs text-blue-700 leading-relaxed mb-3">
                      Candidates who complete their onsite reporting within the first <strong>3 days</strong> will be granted <strong>Special Priority & Commendation</strong> by our executive management.
                    </p>
                    <p className="font-sans text-xs font-bold text-blue-800 mb-2">Onsite Checklist — Please bring original physical copies:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {[
                        "All Academic Certificates, Transcripts, and Marksheets",
                        "National Identification Card (NID) or Valid Passport",
                        "Two (2) recent passport-sized photographs (Lab print)",
                      ].map((item, i) => (
                        <li key={i} className="font-sans text-xs text-blue-700">{item}</li>
                      ))}
                    </ol>
                  </div>
                  <p className="font-sans text-xs text-primary/65 italic">
                    "Prophet Muhammad (PBUH) stated: 'Muslims must abide by their agreements and covenants.' We look forward to your timely arrival."
                  </p>
                </div>
              )}

              {/* ── STATE: Hired ── */}
              {isHired && (
                <div className="border border-emerald-400/30 bg-emerald-50 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    <p className="font-serif text-xl text-emerald-800">Welcome to The Muslim Company!</p>
                  </div>
                  <p className="font-sans text-sm text-emerald-700 leading-relaxed">
                    Alhamdulillah! Your onboarding has been completed. Welcome to the family. May Allah bless your journey with us.
                  </p>
                </div>
              )}

              {/* ── STATE: Rejected ── */}
              {isRejected && (
                <div className="border border-red-400/20 bg-red-50/50 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <p className="font-serif text-lg text-primary">Application Update</p>
                  </div>
                  <p className="font-sans text-sm text-primary/70 leading-relaxed">
                    As-salamu alaykum. After careful review, we regret to inform you that we will not be moving forward with your application at this time. We sincerely appreciate the time and effort you invested. May Allah open better doors for you. Jazakallah Khair.
                  </p>
                </div>
              )}

              {/* Footer note */}
              {!isRejected && !isHired && (
                <div className="p-5 border border-secondary/20 bg-secondary/5">
                  <p className="font-sans text-xs text-primary/65 leading-relaxed">
                    Our recruitment team reviews all applications carefully. If you have any questions, contact us at <strong>hr@themuslim.company</strong>. May Allah bless your efforts.
                  </p>
                </div>
              )}

            </motion.div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
