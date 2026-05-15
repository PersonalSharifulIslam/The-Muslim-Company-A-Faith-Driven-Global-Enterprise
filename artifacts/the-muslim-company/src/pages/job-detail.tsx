import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, Briefcase, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { api } from "@/lib/api";
import type { Job } from "@/lib/supabase";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function JobDetail({ params }: { params: { slug: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/jobs/${params.slug}`)
      .then((data) => setJob(data as Job))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.slug]);

  const isExpired = job ? new Date(job.deadline) < new Date() : false;

  return (
    <SiteLayout>
      <div className="py-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <a href="/careers" className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-primary/50 hover:text-secondary transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Careers
          </a>

          {loading ? (
            <div className="space-y-4">
              <div className="h-10 bg-primary/5 animate-pulse w-2/3" />
              <div className="h-6 bg-primary/5 animate-pulse w-1/3" />
            </div>
          ) : !job ? (
            <div className="text-center py-20">
              <h3 className="font-serif text-2xl text-primary mb-3">Job Not Found</h3>
              <p className="font-sans text-sm text-primary/50">This position may no longer be available.</p>
            </div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                  <p className="font-sans text-xs text-primary/40 mb-1">Job ID: #{job.job_id}</p>
                  <h1 className="font-serif text-3xl md:text-4xl text-primary">{job.title}</h1>
                </div>
                <span className={`self-start px-3 py-1 font-sans text-[10px] tracking-widest uppercase border ${isExpired ? "border-red-400/30 text-red-400/70" : "border-secondary/30 text-secondary"}`}>
                  {isExpired ? "Expired" : "Open"}
                </span>
              </div>

              <div className="flex flex-wrap gap-6 mb-10 pb-8 border-b border-primary/10">
                {[
                  { icon: Briefcase, label: job.department },
                  { icon: MapPin, label: job.location },
                  { icon: Clock, label: job.employment_type },
                  { icon: Calendar, label: `Deadline: ${new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` },
                ].map(({ icon: Icon, label }, i) => (
                  <div key={i} className="flex items-center gap-2 font-sans text-sm text-primary/60">
                    <Icon className="w-4 h-4 text-secondary" />{label}
                  </div>
                ))}
              </div>

              {job.description && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl text-primary mb-4">About the Role</h2>
                  <p className="font-sans text-sm text-primary/65 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>
              )}

              {job.responsibilities && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl text-primary mb-4">Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.split("\n").filter(Boolean).map((r, i) => (
                      <li key={i} className="flex items-start gap-3 font-sans text-sm text-primary/65">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span>{r.replace(/^[-•]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requirements && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl text-primary mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.split("\n").filter(Boolean).map((r, i) => (
                      <li key={i} className="flex items-start gap-3 font-sans text-sm text-primary/65">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span>{r.replace(/^[-•]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.preferred && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl text-primary mb-4">Preferred Qualifications</h2>
                  <ul className="space-y-2">
                    {job.preferred.split("\n").filter(Boolean).map((r, i) => (
                      <li key={i} className="flex items-start gap-3 font-sans text-sm text-primary/65">
                        <div className="w-1.5 h-1.5 bg-secondary/50 rounded-full mt-2 flex-shrink-0" />
                        <span>{r.replace(/^[-•]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.benefits && (
                <div className="mb-8">
                  <h2 className="font-serif text-xl text-primary mb-4">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits.split("\n").filter(Boolean).map((r, i) => (
                      <li key={i} className="flex items-start gap-3 font-sans text-sm text-primary/65">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span>{r.replace(/^[-•]\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.salary && (
                <div className="mb-10 p-5 border border-secondary/20 bg-secondary/5">
                  <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mb-1">Salary</p>
                  <p className="font-serif text-lg text-primary">{job.salary}</p>
                </div>
              )}

              <div className="border-t border-primary/10 pt-8 flex flex-wrap gap-4">
                {!isExpired ? (
                  <a href={`/careers/${job.slug}/apply`}>
                    <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-11 px-8 text-xs font-bold">
                      Apply Now <ArrowRight className="ml-2 w-3.5 h-3.5" />
                    </Button>
                  </a>
                ) : (
                  <p className="font-sans text-sm text-red-400/70">This position is no longer accepting applications.</p>
                )}
                <a href="/careers">
                  <Button variant="outline" className="border-primary/20 text-primary hover:border-secondary rounded-none font-sans text-xs tracking-widest uppercase h-11 px-6">
                    View All Positions
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
