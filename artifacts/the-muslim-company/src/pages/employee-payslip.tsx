import { useState, useEffect } from "react";
import { Wallet, Download, ChevronDown, ChevronUp } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { exportToCSV } from "@/lib/csv-export";

type Payslip = {
  id: number; month: string; basic_salary: number; allowances: number; deductions: number;
  net_salary: number; status: string; payment_method: string; notes: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  paid: "bg-green-400/10 text-green-400 border-green-400/20",
};

export default function EmployeePayslip() {
  const { profile, session, loading } = useAuth();
  const [slips, setSlips] = useState<Payslip[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!session || !profile) return;
    api.get("/employee/payroll").then(d => setSlips((d as Payslip[]) || [])).catch(() => {}).finally(() => setDataLoading(false));
  }, [session, profile]);

  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  function downloadPayslip(s: Payslip) {
    exportToCSV(`payslip-${profile?.name?.replace(/\s+/g, "-")}-${s.month}`, [{
      Employee: profile?.name,
      "Employee ID": profile?.employee_id,
      Department: profile?.department,
      Month: s.month,
      "Basic Salary": s.basic_salary,
      Allowances: s.allowances || 0,
      Deductions: s.deductions || 0,
      "Net Salary": s.net_salary,
      "Payment Method": (s.payment_method || "").replace(/_/g, " "),
      Status: s.status,
    }]);
  }

  const totalEarnedYTD = slips.filter(s => s.status === "paid").reduce((sum, s) => sum + Number(s.net_salary), 0);

  return (
    <EmployeeLayout current="/employee/payslip">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-[#b08d57]" />
          <h1 className="font-serif text-2xl text-white">My Payslips</h1>
        </div>
        <p className="font-sans text-xs text-white/40 mb-6">Your salary history and payslip records.</p>

        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-5 mb-6">
          <p className="font-sans text-xs uppercase tracking-widest text-white/30">Total Paid (All Time)</p>
          <p className="font-serif text-3xl text-[#b08d57] mt-1">৳{totalEarnedYTD.toLocaleString()}</p>
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-12">
            <div style={{ width: 28, height: 28, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : slips.length === 0 ? (
          <div className="text-center py-12 text-white/30 font-sans text-sm">No payslips have been issued yet.</div>
        ) : (
          <div className="space-y-2">
            {slips.map(s => (
              <div key={s.id} className="border border-white/10 bg-white/[0.02] rounded">
                <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors">
                  <div className="text-left">
                    <p className="font-sans text-sm text-white">{new Date(s.month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                    <p className="font-sans text-xs text-white/40">Net: ৳{Number(s.net_salary).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-sans text-xs uppercase tracking-widest px-2 py-1 border rounded ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                    {expanded === s.id ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </div>
                </button>
                {expanded === s.id && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><p className="font-sans text-xs uppercase text-white/30">Basic Salary</p><p className="font-sans text-sm text-white">৳{Number(s.basic_salary).toLocaleString()}</p></div>
                      <div><p className="font-sans text-xs uppercase text-white/30">Allowances</p><p className="font-sans text-sm text-green-400">+৳{Number(s.allowances || 0).toLocaleString()}</p></div>
                      <div><p className="font-sans text-xs uppercase text-white/30">Deductions</p><p className="font-sans text-sm text-red-400">-৳{Number(s.deductions || 0).toLocaleString()}</p></div>
                      <div><p className="font-sans text-xs uppercase text-white/30">Payment Method</p><p className="font-sans text-sm text-white capitalize">{(s.payment_method || "").replace(/_/g, " ")}</p></div>
                    </div>
                    {s.notes && <p className="font-sans text-xs text-white/40 mb-3">{s.notes}</p>}
                    <button onClick={() => downloadPayslip(s)}
                      className="flex items-center gap-2 text-[#b08d57] font-sans text-xs uppercase tracking-widest border border-[#b08d57]/30 px-3 py-1.5 hover:bg-[#b08d57]/10 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
