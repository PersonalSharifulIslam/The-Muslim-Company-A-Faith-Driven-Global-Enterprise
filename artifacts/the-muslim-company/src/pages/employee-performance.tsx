import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import EmployeeLayout from "@/components/EmployeeLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

type Review = {
  id: number; review_period: string; overall_rating: number; strengths: string;
  areas_for_improvement: string; goals_next_period: string; employee_comments: string | null;
  status: string; created_at: string;
};

export default function EmployeePerformance() {
  const { profile, session, loading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState<number | null>(null);

  useEffect(() => {
    if (!session || !profile) return;
    api.get("/employee/performance").then(d => setReviews((d as Review[]) || [])).catch(() => {}).finally(() => setDataLoading(false));
  }, [session, profile]);

  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  async function acknowledge(id: number) {
    setSubmitting(id);
    try {
      await api.put(`/employee/performance/${id}/acknowledge`, { employee_comments: commentDrafts[id] || "" }, true);
      const d = await api.get("/employee/performance");
      setReviews((d as Review[]) || []);
    } catch {}
    setSubmitting(null);
  }

  return (
    <EmployeeLayout current="/employee/performance">
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="font-serif text-2xl text-white mb-1">Performance Reviews</h1>
        <p className="font-sans text-xs text-white/40 mb-6">Your performance review history and feedback.</p>

        {dataLoading ? (
          <div className="flex justify-center py-12"><div style={{ width: 28, height: 28, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>
        ) : reviews.length === 0 ? (
          <p className="text-white/30 text-center py-8 font-sans text-sm">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="bg-white/[0.02] border border-white/10 rounded p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-sans text-sm text-white font-medium">{r.review_period}</p>
                  <div className="flex">{[1,2,3,4,5].map(n => <Star key={n} className={`w-4 h-4 ${n <= r.overall_rating ? "fill-[#b08d57] text-[#b08d57]" : "text-white/15"}`} />)}</div>
                </div>
                {r.strengths && <p className="font-sans text-xs text-white/60 mb-1"><span className="text-white/30">Strengths: </span>{r.strengths}</p>}
                {r.areas_for_improvement && <p className="font-sans text-xs text-white/60 mb-1"><span className="text-white/30">Areas to grow: </span>{r.areas_for_improvement}</p>}
                {r.goals_next_period && <p className="font-sans text-xs text-white/60 mb-2"><span className="text-white/30">Goals: </span>{r.goals_next_period}</p>}

                {r.status === "submitted" ? (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <textarea placeholder="Add your comments (optional)" rows={2}
                      onChange={e => setCommentDrafts(d => ({ ...d, [r.id]: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 font-sans text-sm text-white focus:outline-none focus:border-[#b08d57] rounded resize-none" />
                    <button onClick={() => acknowledge(r.id)} disabled={submitting === r.id}
                      className="flex items-center gap-2 bg-[#b08d57] text-[#0a1a0e] font-sans text-xs uppercase tracking-widest h-9 px-4 rounded disabled:opacity-50">
                      <MessageSquare className="w-3.5 h-3.5" /> {submitting === r.id ? "Submitting..." : "Acknowledge & Comment"}
                    </button>
                  </div>
                ) : r.employee_comments ? (
                  <p className="font-sans text-xs text-[#b08d57]/80 italic mt-2">"{r.employee_comments}"</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
