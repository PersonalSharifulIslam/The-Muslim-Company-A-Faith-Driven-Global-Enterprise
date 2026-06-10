import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Calendar, ArrowRight, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import { api } from "@/lib/api";
import type { Job } from "@/lib/supabase";

const DEPARTMENTS = ["All", "Technology", "Engineering", "Operations", "Finance", "Marketing", "HR", "Research", "Media"];
const TYPES = ["All", "Full-time", "Part-time", "Remote", "Contract", "Internship"];

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function JobCard({ job }: { job: Job }) {
  const isExpired = new Date(job.deadline) < new Date();
  return (
    <motion.div variants={fadeIn} className="bg-card border border-primary/10 p-6 hover:border-secondary/40 transition-colors group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-serif text-xl text-primary group-hover:text-secondary transition-colors">{job.title}</h3>
          <p className="font-sans text-xs text-primary/50 mt-1">Job ID: #{job.job_id}</p>
        </div>
        <span className={`self-start px-3 py-1 font-sans text-[10px] tracking-widest uppercase border ${isExpired ? "border-red-400/30 text-red-400/70" : "border-secondary/30 text-secondary"}`}>
          {isExpired ? "Expired" : "Open"}
        </span>
      </div>
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex items-center gap-1.5 font-sans text-xs text-primary/55"><Briefcase className="w-3.5 h-3.5" />{job.department}</div>
        <div className="flex items-center gap-1.5 font-sans text-xs text-primary/55"><MapPin className="w-3.5 h-3.5" />{job.location}</div>
        <div className="flex items-center gap-1.5 font-sans text-xs text-primary/55"><Clock className="w-3.5 h-3.5" />{job.employment_type}</div>
        <div className="flex items-center gap-1.5 font-sans text-xs text-primary/55">
          <Calendar className="w-3.5 h-3.5" />Deadline: {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
      <a href={`/careers/${job.slug}`}>
        <Button variant="outline" className="border-primary/20 text-primary hover:border-secondary hover:text-secondary rounded-none font-sans text-xs tracking-widest uppercase h-9 px-5">
          View Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </a>
    </motion.div>
  );
}

export default function Careers() {
  useEffect(() => {
    document.title = "Careers — The Muslim Company";
    else {
      const _m = document.createElement('meta'); _m.setAttribute('property', 'og:image');
      _m.setAttribute('content', 'https://www.themuslim.company/og-careers.png'); document.head.appendChild(_m);
    }
    else {
      const _t = document.createElement('meta'); _t.setAttribute('name', 'twitter:image');
      _t.setAttribute('content', 'https://www.themuslim.company/og-careers.png'); document.head.appendChild(_t);
    }
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "Join The Muslim Company — explore career opportunities in a faith-driven, ethical, and civilization-focused global enterprise. Open positions in technology, research, media, and more.");
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "Careers — The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "Join The Muslim Company — explore career opportunities in a faith-driven, ethical, and civilization-focused global enterprise. Open positions in technology, research, media, and more.");
    const _ogi = document.querySelector('meta[property="og:image"]');
    if (_ogi) _ogi.setAttribute('content', 'https://www.themuslim.company/og-careers.png');
    const _twi = document.querySelector('meta[name="twitter:image"]');
    if (_twi) _twi.setAttribute('content', 'https://www.themuslim.company/og-careers.png');
        const _ogu = document.querySelector('meta[property="og:url"]');
        if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/careers");

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"}, {"@type": "ListItem", "position": 2, "name": "Careers", "item": "https://www.themuslim.company/careers"}]}, {"@context": "https://schema.org", "@type": "WebPage", "name": "Careers at The Muslim Company", "description": "Join The Muslim Company \u2014 explore career opportunities in a faith-driven, ethical, and civilization-focused global enterprise. Open positions in technology, research, media, and more.", "url": "https://www.themuslim.company/careers", "publisher": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}}].forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-page-schema', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });
    return () => { document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove()); };
  }, []);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [type, setType] = useState("All");

  useEffect(() => {
    api.get("/jobs").then((data) => setJobs(data as Job[])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === "All" || j.department === dept;
    const matchType = type === "All" || j.employment_type === type;
    return matchSearch && matchDept && matchType;
  });

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground py-20 lg:py-28 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-secondary font-bold mb-3">Join the Mission</p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary-foreground mb-5">Careers at<br />The Muslim Company</h1>
            <p className="font-sans text-sm text-primary-foreground/55 max-w-2xl leading-relaxed mb-8">
              We are building a faith-driven global enterprise. Every role here is an opportunity to contribute to something greater — a civilization-scale mission guided by ethics, knowledge, and justice.
            </p>
            <a href="/recruitment-status">
              <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-10 px-6 text-xs font-bold">
                Track Application Status <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-12 bg-background border-b border-primary/10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
              <input type="text" placeholder="Search positions..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 h-11 bg-background border border-primary/15 font-sans text-sm text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary" />
            </div>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="h-11 px-4 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-11 px-4 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-background min-h-[40vh]">
        <div className="container mx-auto max-w-5xl">
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-40 bg-primary/5 animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-10 h-10 text-secondary/40 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-primary mb-3">No Positions Found</h3>
              <p className="font-sans text-sm text-primary/50">
                {jobs.length === 0 ? "No openings at the moment. Check back soon, In Sha Allah." : "No results match your search. Try different filters."}
              </p>
            </div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="space-y-4">
              <p className="font-sans text-xs text-primary/40 mb-6">{filtered.length} position{filtered.length !== 1 ? "s" : ""} found</p>
              {filtered.map((job) => <JobCard key={job.id} job={job} />)}
            </motion.div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
