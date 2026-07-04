import { useState, useEffect } from "react";
import { Network, ChevronDown, ChevronRight, Users } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Employee = {
  id: number; employee_id: string; name: string; department: string;
  position: string; access_level?: string;
};

const TIER_ORDER: Record<string, number> = {
  admin: 0, executive: 1, vp: 2, director: 2,
  hr_manager: 3, finance_manager: 3, department_manager: 3,
  team_lead: 4, recruiter: 5, content_editor: 5, employee: 6,
};

const TIER_LABELS: Record<string, string> = {
  admin: "Founder & CEO",
  executive: "Executive Leadership (C-Suite)",
  vp: "Vice Presidents",
  director: "Directors",
  hr_manager: "HR Management",
  finance_manager: "Finance Management",
  department_manager: "Department Managers",
  team_lead: "Team Leads",
  recruiter: "Recruitment",
  content_editor: "Content & Media",
  employee: "Staff",
};

const TIER_COLORS: Record<string, string> = {
  admin: "border-red-400/40 bg-red-400/5",
  executive: "border-rose-400/40 bg-rose-400/5",
  vp: "border-purple-400/40 bg-purple-400/5",
  director: "border-indigo-400/40 bg-indigo-400/5",
  hr_manager: "border-blue-400/40 bg-blue-400/5",
  finance_manager: "border-emerald-400/40 bg-emerald-400/5",
  department_manager: "border-amber-400/40 bg-amber-400/5",
  team_lead: "border-cyan-400/40 bg-cyan-400/5",
  recruiter: "border-pink-400/40 bg-pink-400/5",
  content_editor: "border-orange-400/40 bg-orange-400/5",
  employee: "border-white/10 bg-white/[0.02]",
};

export default function AdminOrgChart() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDept, setExpandedDept] = useState<Record<string, boolean>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get("/admin/employees") as Employee[];
      setEmployees(data || []);
    } catch {}
    setLoading(false);
  }

  // Group by tier first, then by department within each tier
  const byTier: Record<string, Employee[]> = {};
  for (const e of employees) {
    const lvl = e.access_level || "employee";
    if (!byTier[lvl]) byTier[lvl] = [];
    byTier[lvl].push(e);
  }

  const orderedTiers = Object.keys(byTier).sort((a, b) => (TIER_ORDER[a] ?? 9) - (TIER_ORDER[b] ?? 9));

  function toggleDept(key: string) {
    setExpandedDept(prev => ({ ...prev, [key]: !prev[key] }));
  }

  // Group the base "employee" tier by department, since it's usually the biggest bucket
  function groupByDept(emps: Employee[]) {
    const groups: Record<string, Employee[]> = {};
    for (const e of emps) {
      const dept = e.department || "Unassigned";
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(e);
    }
    return groups;
  }

  return (
    <AdminLayout current="/admin/org-chart">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-6 h-6 text-secondary" />
          <h1 className="font-serif text-2xl text-primary">Organization Chart</h1>
        </div>
        <p className="font-sans text-xs text-primary/65 mb-6">
          The Muslim Company's reporting hierarchy — grouped by corporate tier, then by department.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 text-primary/65 font-sans text-sm">No employees yet</div>
        ) : (
          <div className="space-y-6">
            {orderedTiers.map(tier => {
              const tierEmployees = byTier[tier];
              const isFlatTier = ["admin", "executive", "vp", "director", "hr_manager", "finance_manager"].includes(tier);

              return (
                <div key={tier} className={`border rounded-lg p-5 ${TIER_COLORS[tier] || "border-white/10"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-lg text-primary">{TIER_LABELS[tier] || tier}</h2>
                    <span className="font-sans text-xs uppercase tracking-widest text-primary/65 flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> {tierEmployees.length}
                    </span>
                  </div>

                  {isFlatTier ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {tierEmployees.map(e => (
                        <div key={e.id} className="bg-card border border-primary/10 rounded p-3">
                          <p className="font-sans text-sm text-primary font-medium">{e.name}</p>
                          <p className="font-sans text-xs text-primary/65">{e.position}</p>
                          <p className="font-sans text-xs text-primary/30 mt-1">{e.department}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(groupByDept(tierEmployees)).map(([dept, emps]) => {
                        const key = `${tier}-${dept}`;
                        const isOpen = expandedDept[key] !== false; // default open
                        return (
                          <div key={key} className="bg-card border border-primary/10 rounded">
                            <button onClick={() => toggleDept(key)}
                              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary/5 transition-colors">
                              <span className="font-sans text-sm text-primary">{dept}</span>
                              <span className="flex items-center gap-2">
                                <span className="font-sans text-xs text-primary/65">{emps.length}</span>
                                {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-primary/65" /> : <ChevronRight className="w-3.5 h-3.5 text-primary/65" />}
                              </span>
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {emps.map(e => (
                                  <div key={e.id} className="bg-background border border-primary/5 rounded p-2.5">
                                    <p className="font-sans text-xs text-primary font-medium">{e.name}</p>
                                    <p className="font-sans text-xs text-primary/65">{e.position}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
