import { useState, useEffect } from "react";
import { Users, Search, Phone, Mail } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

type Person = { employee_id: string; name: string; department: string; position: string; phone: string; email: string };

export default function EmployeeDirectory() {
  const { profile, session, loading } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!session || !profile) return;
    api.get("/employee/directory").then(d => setPeople((d as Person[]) || [])).catch(() => {}).finally(() => setDataLoading(false));
  }, [session, profile]);

  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  const q = query.toLowerCase();
  const filtered = people.filter(p =>
    p.name?.toLowerCase().includes(q) || p.department?.toLowerCase().includes(q) || p.position?.toLowerCase().includes(q)
  );

  return (
    <EmployeeLayout current="/employee/directory">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-[#b08d57]" />
          <h1 className="font-serif text-2xl text-white">Company Directory</h1>
        </div>
        <p className="font-sans text-xs text-white/40 mb-4">Find and contact your colleagues across The Muslim Company.</p>

        <div className="relative mb-6">
          <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, department, or position..."
            className="w-full h-11 pl-10 pr-4 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-[#b08d57] rounded" />
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 28, height: 28, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-white/30 text-center py-8 font-sans text-sm">No matching colleagues found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(p => (
              <div key={p.employee_id} className="bg-white/[0.02] border border-white/10 rounded p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-[#b08d57]/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-sans text-xs font-bold text-[#b08d57]">{p.name?.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-sm text-white font-medium truncate">{p.name}</p>
                    <p className="font-sans text-xs text-white/40 truncate">{p.position}</p>
                  </div>
                </div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-white/30 mb-2">{p.department}</p>
                <div className="space-y-1">
                  {p.phone && (
                    <a href={`tel:${p.phone}`} className="flex items-center gap-1.5 font-sans text-xs text-white/60 hover:text-[#b08d57]">
                      <Phone className="w-3 h-3" /> {p.phone}
                    </a>
                  )}
                  {p.email && (
                    <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 font-sans text-xs text-white/60 hover:text-[#b08d57] truncate">
                      <Mail className="w-3 h-3" /> {p.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
