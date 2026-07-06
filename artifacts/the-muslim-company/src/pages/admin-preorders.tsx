import { useState, useEffect } from "react";
import { ShoppingBag, Phone, Mail, Calendar, Package } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";

type Preorder = {
  id: number; product_id: number | null; product_name: string; customer_name: string;
  phone: string; email: string | null; quantity: number; notes: string | null;
  status: string; created_at: string;
};

const STATUSES = ["pending", "contacted", "confirmed", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-500",
  contacted: "bg-blue-400/10 text-blue-500",
  confirmed: "bg-green-400/10 text-green-500",
  cancelled: "bg-red-400/10 text-red-400",
};

export default function AdminPreorders() {
  const [orders, setOrders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("preorders").select("*").order("created_at", { ascending: false });
    setOrders((data as Preorder[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    await supabase.from("preorders").update({ status }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout current="/admin/preorders">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-6 h-6 text-secondary" />
          <h1 className="font-serif text-2xl text-primary">Pre-Order Requests</h1>
        </div>
        <p className="font-sans text-xs text-primary/65 mb-6">
          Requests submitted from the public <a href="/e-store" target="_blank" className="text-secondary hover:underline">/e-store</a> page.
          Contact each customer directly to confirm quantity, price, and delivery.
        </p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 h-8 font-sans text-xs uppercase tracking-widest border ${filter === s ? "border-secondary text-secondary" : "border-primary/15 text-primary/60"}`}>
              {s} {s !== "all" && `(${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-primary/65 font-sans text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-primary/65 font-sans text-sm">No pre-orders {filter !== "all" ? `with status "${filter}"` : "yet"}.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(o => (
              <div key={o.id} className="border border-primary/10 bg-card p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-3.5 h-3.5 text-secondary" />
                      <p className="font-serif text-base text-primary">{o.product_name}</p>
                      <span className="font-sans text-xs text-primary/40">× {o.quantity}</span>
                    </div>
                    <p className="font-sans text-sm text-primary/70">{o.customer_name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <a href={`tel:${o.phone}`} className="font-sans text-xs text-primary/60 hover:text-secondary flex items-center gap-1"><Phone className="w-3 h-3" />{o.phone}</a>
                      {o.email && <a href={`mailto:${o.email}`} className="font-sans text-xs text-primary/60 hover:text-secondary flex items-center gap-1"><Mail className="w-3 h-3" />{o.email}</a>}
                    </div>
                    {o.notes && <p className="font-sans text-xs text-primary/50 mt-2 italic">"{o.notes}"</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-sans text-[10px] text-primary/40 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(o.created_at).toLocaleDateString()}</p>
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`h-8 px-2 border-0 font-sans text-xs uppercase tracking-widest ${STATUS_COLORS[o.status] || ""}`}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
