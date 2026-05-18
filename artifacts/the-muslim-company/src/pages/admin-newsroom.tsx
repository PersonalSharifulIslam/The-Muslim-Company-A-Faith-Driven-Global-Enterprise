import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { NewsPost } from "@/lib/supabase";

const CATS = ["Press Release", "Company Update", "Partnership", "Media Coverage", "Announcement"];
type Form = { title: string; slug: string; category: string; excerpt: string; content: string; image_url: string; featured: boolean; published: boolean };
const BLANK: Form = { title: "", slug: "", category: CATS[0], excerpt: "", content: "", image_url: "", featured: false, published: false };

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now(); }

export default function AdminNewsroom() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [form, setForm] = useState<Form>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);


  const load = async () => {
    try {
      const data = await api.get("/admin/newsroom", true);
      setPosts(data as NewsPost[]);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (p: NewsPost) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, category: p.category, excerpt: p.excerpt || "", content: p.content, image_url: p.image_url || "", featured: p.featured, published: p.published });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    const data = { ...form, slug: form.slug || slugify(form.title) };
    try {
      if (editing) await api.put(`/admin/newsroom/${editing.id}`, data, true);
      else await api.post("/admin/newsroom", data, true);
      await load();
      setModal(false);
    } catch {}
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    setDeleting(id);
    try {
      await api.del(`/admin/newsroom/${id}`, true);
      await load();
    } catch {}
    setDeleting(null);
  };

  const setField = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));


  return (
    <AdminLayout current="/admin/newsroom">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Newsroom & PR</h1>
          <p className="font-sans text-sm text-primary/50">Manage press releases and news articles</p>
        </div>
        <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">
          <Plus className="w-3.5 h-3.5 mr-2" />New Article
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-card border border-primary/10">
          <p className="font-serif text-xl text-primary mb-4">No articles yet</p>
          <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5"><Plus className="w-3.5 h-3.5 mr-2" />Write First Article</Button>
        </div>
      ) : (
        <div className="border border-primary/10 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                {["Title", "Category", "Date", "Featured", "Published", "Actions"].map((h) => (
                  <th key={h} className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-primary/8 hover:bg-secondary/5 transition-colors">
                  <td className="px-5 py-4 font-sans text-sm text-primary max-w-xs truncate">{p.title}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{p.category}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/50">{new Date(p.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-4">{p.featured && <Star className="w-4 h-4 text-secondary" />}</td>
                  <td className="px-5 py-4">
                    <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-0.5 border ${p.published ? "text-green-400 border-green-400/20" : "text-gray-400 border-gray-400/20"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <a href={`/newsroom/${p.slug}`} target="_blank" className="text-primary/40 hover:text-secondary transition-colors"><Eye className="w-4 h-4" /></a>
                      <button onClick={() => openEdit(p)} className="text-primary/40 hover:text-secondary transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => del(p.id)} disabled={deleting === p.id} className="text-primary/40 hover:text-red-400 transition-colors disabled:opacity-30"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-background border border-primary/15 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10">
              <h2 className="font-serif text-xl text-primary">{editing ? "Edit Article" : "New Article"}</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5 text-primary/40" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Title *</label>
                <input value={form.title} onChange={setField("title")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Category</label>
                  <select value={form.category} onChange={setField("category")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                    {CATS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Image URL</label>
                  <input value={form.image_url} onChange={setField("image_url")} placeholder="https://..." className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Excerpt / Summary</label>
                <textarea rows={2} value={form.excerpt} onChange={setField("excerpt")} className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
              </div>
              <div>
                <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Content *</label>
                <textarea rows={10} value={form.content} onChange={setField("content")} className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={setField("featured")} className="accent-secondary" />
                  <span className="font-sans text-sm text-primary/70">Featured Article</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={setField("published")} className="accent-secondary" />
                  <span className="font-sans text-sm text-primary/70">Published</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-primary/10 flex gap-3">
              <Button onClick={save} disabled={saving || !form.title} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-6 disabled:opacity-40">
                {saving ? "Saving..." : editing ? "Save Changes" : "Publish"}
              </Button>
              <Button variant="outline" onClick={() => setModal(false)} className="border-primary/20 text-primary rounded-none font-sans text-xs h-9 px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
