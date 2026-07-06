import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, Upload, ImageIcon, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number; name: string; slug: string; description: string | null;
  price: number | null; currency: string; image_url: string | null;
  category: string | null; min_qty: number; active: boolean; created_at: string;
};
type Form = { name: string; slug: string; description: string; price: string; currency: string; image_url: string; category: string; min_qty: number; active: boolean };
const BLANK: Form = { name: "", slug: "", description: "", price: "", currency: "BDT", image_url: "", category: "", min_qty: 1, active: true };

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function AdminStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("store_products").select("*").order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }

  function openNew() { setForm(BLANK); setEditingId(null); setModal(true); }
  function openEdit(p: Product) {
    setForm({
      name: p.name, slug: p.slug, description: p.description || "", price: p.price?.toString() || "",
      currency: p.currency, image_url: p.image_url || "", category: p.category || "", min_qty: p.min_qty, active: p.active,
    });
    setEditingId(p.id);
    setModal(true);
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      alert("Only JPG, PNG, WebP, or GIF images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `store/${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from("media").upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path);
      setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    } catch (err) {
      alert("Upload failed. Please try again.");
      console.error(err);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = () => setForm((f) => ({ ...f, image_url: "" }));

  async function save() {
    if (!form.name.trim()) { alert("Product name is required."); return; }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim() || null,
      price: form.price ? parseFloat(form.price) : null,
      currency: form.currency,
      image_url: form.image_url || null,
      category: form.category.trim() || null,
      min_qty: form.min_qty || 1,
      active: form.active,
      updated_at: new Date().toISOString(),
    };
    try {
      if (editingId) {
        const { error } = await supabase.from("store_products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("store_products").insert(payload);
        if (error) throw error;
      }
      setModal(false);
      await load();
    } catch (e: any) {
      alert(e.message || "Failed to save product.");
    }
    setSaving(false);
  }

  async function remove(p: Product) {
    if (!window.confirm(`Delete "${p.name}" from the store?`)) return;
    await supabase.from("store_products").delete().eq("id", p.id);
    await load();
  }

  return (
    <AdminLayout current="/admin/store">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-secondary" />
            <h1 className="font-serif text-2xl text-primary">E-Store Products</h1>
          </div>
          <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">
            <Plus className="w-4 h-4 mr-1.5" /> Add Product
          </Button>
        </div>
        <p className="font-sans text-xs text-primary/65 mb-6">
          Products listed here appear on the public <a href="/e-store" target="_blank" className="text-secondary hover:underline">/e-store</a> page.
          Customers submit pre-order requests — this is not a live checkout/payment system.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-secondary animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-primary/65 font-sans text-sm">No products yet. Click "Add Product" to create one.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border border-primary/10 bg-card overflow-hidden">
                <div className="h-40 bg-background flex items-center justify-center overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-primary/20" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-serif text-base text-primary truncate">{p.name}</p>
                    {!p.active && <span className="font-sans text-[10px] uppercase text-red-400 flex-shrink-0 ml-2">Hidden</span>}
                  </div>
                  <p className="font-sans text-xs text-primary/40 mb-2">{p.category || "Uncategorized"}</p>
                  {p.price != null && <p className="font-sans text-sm text-secondary mb-3">{p.currency} {p.price.toLocaleString()}</p>}
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(p)} className="text-primary/60 hover:text-secondary"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => remove(p)} className="text-red-500/60 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="bg-background max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 sticky top-0 bg-background">
              <h2 className="font-serif text-lg text-primary">{editingId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setModal(false)} className="text-primary/65 hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Image</label>
                <div className="h-40 bg-card border border-primary/15 flex items-center justify-center overflow-hidden mb-2">
                  {form.image_url ? (
                    <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-primary/20" />
                  )}
                </div>
                <div className="flex gap-2">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} className="hidden" id="product-image-upload" />
                  <label htmlFor="product-image-upload" className="flex-1 cursor-pointer border border-primary/20 text-center py-2 font-sans text-xs uppercase tracking-widest text-primary/70 hover:border-secondary transition-colors">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : <><Upload className="w-3.5 h-3.5 inline mr-1.5" />Upload Image</>}
                  </label>
                  {form.image_url && (
                    <button onClick={removeImage} className="px-4 border border-primary/20 text-red-500 hover:border-red-400 font-sans text-xs uppercase tracking-widest">Remove</button>
                  )}
                </div>
              </div>
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Category</label>
                  <input value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Min. Pre-Order Qty</label>
                  <input type="number" min={1} value={form.min_qty} onChange={(e) => setForm(f => ({ ...f, min_qty: parseInt(e.target.value) || 1 }))}
                    className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Price (optional)</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="Leave blank for 'Price on request'"
                    className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Currency</label>
                  <select value={form.currency} onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="w-full h-10 px-3 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    <option value="BDT">BDT</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
                  className="w-full px-3 py-2 bg-card border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm(f => ({ ...f, active: e.target.checked }))} />
                <span className="font-sans text-xs text-primary/70">Visible on the public store page</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-primary/10 flex justify-end gap-3 sticky bottom-0 bg-background">
              <Button onClick={() => setModal(false)} variant="outline" className="rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">Cancel</Button>
              <Button onClick={save} disabled={saving || uploading} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-6 disabled:opacity-40">
                {saving ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
