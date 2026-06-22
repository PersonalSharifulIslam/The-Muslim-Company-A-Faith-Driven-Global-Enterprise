import { useState, useEffect } from "react";
import { CalendarDays, Sparkles, Building2 } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

type Holiday = { id: number; title: string; date: string; end_date: string; description: string; is_company_event: boolean };

export default function EmployeeHolidays() {
  const { profile, session, loading } = useAuth();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!session || !profile) return;
    api.get("/employee/holidays").then(d => setHolidays((d as Holiday[]) || [])).catch(() => {}).finally(() => setDataLoading(false));
  }, [session, profile]);

  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  const today = new Date().toISOString().split("T")[0];
  const upcoming = holidays.filter(h => (h.end_date || h.date) >= today);
  const past = holidays.filter(h => (h.end_date || h.date) < today);

  function HolidayCard({ h }: { h: Holiday }) {
    const date = new Date(h.date);
    const isRange = h.end_date && h.end_date !== h.date;
    const dayCount = isRange ? Math.round((new Date(h.end_date).getTime() - date.getTime()) / 86400000) + 1 : 1;
    const isOngoing = h.date <= today && (h.end_date || h.date) >= today;
    return (
      <div className={`flex items-center gap-4 p-4 bg-white/[0.02] border rounded ${isOngoing ? "border-[#b08d57]/50" : "border-white/10"}`}>
        <div className="flex-shrink-0 w-14 h-14 bg-[#b08d57]/10 border border-[#b08d57]/30 rounded flex flex-col items-center justify-center">
          <p className="font-serif text-lg text-[#b08d57] leading-none">{date.getDate()}</p>
          <p className="font-sans text-[9px] uppercase text-[#b08d57]/70">{date.toLocaleDateString("en-US", { month: "short" })}</p>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-sans text-sm text-white font-medium">{h.title}</p>
            {h.is_company_event ? <Building2 className="w-3.5 h-3.5 text-white/30" /> : <Sparkles className="w-3.5 h-3.5 text-[#b08d57]/50" />}
            {isOngoing && <span className="font-sans text-[9px] uppercase tracking-widest bg-[#b08d57]/20 text-[#b08d57] px-1.5 py-0.5 rounded">Ongoing</span>}
          </div>
          <p className="font-sans text-xs text-white/40 mt-0.5">
            {isRange
              ? `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(h.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${dayCount} days)`
              : date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          {h.description && <p className="font-sans text-xs text-white/40 mt-0.5">{h.description}</p>}
        </div>
      </div>
    );
  }

  return (
    <EmployeeLayout current="/employee/holidays">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="w-5 h-5 text-[#b08d57]" />
          <h1 className="font-serif text-2xl text-white">Holidays & Events</h1>
        </div>
        <p className="font-sans text-xs text-white/40 mb-6">Public holidays and company events.</p>

        {dataLoading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 28, height: 28, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : (
          <>
            <p className="font-sans text-[10px] uppercase tracking-widest text-white/30 mb-3">Upcoming</p>
            <div className="space-y-2 mb-8">
              {upcoming.length === 0 ? <p className="text-white/30 font-sans text-sm">No upcoming holidays</p> : upcoming.map(h => <HolidayCard key={h.id} h={h} />)}
            </div>
            {past.length > 0 && (
              <>
                <p className="font-sans text-[10px] uppercase tracking-widest text-white/30 mb-3">Past</p>
                <div className="space-y-2 opacity-50">
                  {past.map(h => <HolidayCard key={h.id} h={h} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
