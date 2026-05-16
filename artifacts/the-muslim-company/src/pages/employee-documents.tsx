import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, FolderOpen } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useEmployeeAuth, empApi } from "@/lib/employee-auth";

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
type Doc = { id: number; name: string; category: string; file_url: string; description: string; is_public: boolean; created_at: string };
const CAT_ICONS: Record<string, string> = { appointment: "📋", offer: "📄", salary: "💰", certificate: "🎓", general: "📁", policy: "📜", training: "📚" };

export default function EmployeeDocuments() {
  const { employee, loading } = useEmployeeAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [filter, setFilter] = useState("all");
  const api = empApi();

  useEffect(() => { if (!loading && !employee) window.location.href = "/employee"; }, [employee, loading]);
  useEffect(() => { if (employee) api.get("/employee/documents").then((d) => setDocs(d as Doc[])).catch(() => {}); }, [employee]);

  const categories = ["all", ...Array.from(new Set(docs.map((d) => d.category)))];
  const filtered = filter === "all" ? docs : docs.filter((d) => d.category === filter);
  if (loading || !employee) return null;

  return (
    <EmployeeLayout current="/employee/documents">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }} className="space-y-6 max-w-4xl">
        <motion.div variants={fade}>
          <p className="font-sans text-xs tracking-widest uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
          <h1 className="font-serif text-3xl text-white">Documents</h1>
          <p className="font-sans text-sm text-white/30 mt-1">Your personal and company documents</p>
        </motion.div>

        {categories.length > 1 && (
          <motion.div variants={fade} className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`font-sans text-[10px] tracking-widest uppercase px-4 py-2 transition-all ${filter === cat ? "bg-[#b08d57] text-black font-bold" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        <motion.div variants={fade}>
          {filtered.length === 0 ? (
            <div className="bg-[#0f2314]/60 border border-[#b08d57]/15 py-20 text-center">
              <FolderOpen className="w-10 h-10 text-white/10 mx-auto mb-4" />
              <p className="font-sans text-sm text-white/20">No documents available</p>
              <p className="font-sans text-xs text-white/15 mt-1">Contact HR to upload your documents</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((doc) => (
                <div key={doc.id} className="bg-[#0f2314]/60 border border-[#b08d57]/15 p-5 hover:border-[#b08d57]/35 transition-all group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl mt-0.5 shrink-0">{CAT_ICONS[doc.category] || "📄"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-semibold text-white truncate">{doc.name}</p>
                        <p className="font-sans text-[10px] tracking-widest uppercase text-[#b08d57]/50 mt-0.5">{doc.category}</p>
                        {doc.description && <p className="font-sans text-xs text-white/35 mt-1">{doc.description}</p>}
                        <p className="font-sans text-[10px] text-white/20 mt-2">{new Date(doc.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                    </div>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-1.5 h-8 px-3 bg-[#b08d57]/10 hover:bg-[#b08d57]/20 border border-[#b08d57]/20 text-[#b08d57] font-sans text-[10px] font-bold uppercase tracking-widest transition-all shrink-0">
                        <Download className="w-3.5 h-3.5" /> Get
                      </a>
                    )}
                  </div>
                  {doc.is_public && (
                    <div className="mt-3 pt-3 border-t border-[#b08d57]/8">
                      <span className="font-sans text-[9px] tracking-widest uppercase text-white/20 flex items-center gap-1"><FileText className="w-3 h-3" /> Company Document</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </EmployeeLayout>
  );
}
