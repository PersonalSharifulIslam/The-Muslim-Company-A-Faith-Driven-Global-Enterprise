import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/supabase";

const CATS = ["Technology", "Ethics", "Islamic Civilization", "Business", "Education", "Global Affairs"];
type Form = { title: string; slug: string; category: string; excerpt: string; content: string; image_url: string; author: string; reading_time: string; seo_title: string; meta_description: string; published: boolean };
const BLANK: Form = { title: "", slug: "", category: CATS[0], excerpt: "", content: "", image_url: "", author: "The Muslim Company", reading_time: "5", seo_title: "", meta_description: "", published: false };

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now(); }

export default function AdminBlog() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Form>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);


  const load = async () => {
    try {
      const data = await api.get("/admin/blog", true);
      setPosts(data as BlogPost[]);
    } catch {}
  };

  useEffect(() => { if (user) load(); }, [user]);

  const openNew = () => { setEditing(null); setForm(BLANK); setModal(true); };
  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug, category: p.category, excerpt: p.excerpt || "", content: p.content, image_url: p.image_url || "", author: p.author, reading_time: String(p.reading_time), seo_title: p.seo_title || "", meta_description: p.meta_description || "", published: p.published });
    setModal(true);
  };

  const save = async () => {
    setSaving(true);
    const data = { ...form, slug: form.slug || slugify(form.title), reading_time: parseInt(form.reading_time) || 5 };
    try {
      if (editing) await api.put(`/admin/blog/${editing.id}`, data, true);
      else await api.post("/admin/blog", data, true);
      await load();
      setModal(false);
    } catch {}
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this blog post?")) return;
    setDeleting(id);
    try {
      await api.del(`/admin/blog/${id}`, true);
      await load();
    } catch {}
    setDeleting(null);
  };

  const setField = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  if (loading) return null;

  return (
    <AdminLayout current="/admin/blog">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-1">Blog</h1>
          <p className="font-sans text-sm text-primary/50">Manage blog articles and posts</p>
        </div>
        <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5">
          <Plus className="w-3.5 h-3.5 mr-2" />New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-card border border-primary/10">
          <p className="font-serif text-xl text-primary mb-4">No blog posts yet</p>
          <Button onClick={openNew} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-5"><Plus className="w-3.5 h-3.5 mr-2" />Write First Post</Button>
        </div>
      ) : (
        <div className="border border-primary/10 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                {["Title", "Category", "Author", "Date", "Published", "Actions"].map((h) => (
                  <th key={h} className="text-left font-sans text-[10px] tracking-widest uppercase px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-primary/8 hover:bg-secondary/5 transition-colors">
                  <td className="px-5 py-4 font-sans text-sm text-primary max-w-xs truncate">{p.title}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{p.category}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/60">{p.author}</td>
                  <td className="px-5 py-4 font-sans text-xs text-primary/50">{new Date(p.created_at).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-4">
                    <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-0.5 border ${p.published ? "text-green-400 border-green-400/20" : "text-gray-400 border-gray-400/20"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <a href={`/blog/${p.slug}`} target="_blank" className="text-primary/40 hover:text-secondary transition-colors"><Eye className="w-4 h-4" /></a>
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
              <h2 className="font-serif text-xl text-primary">{editing ? "Edit Post" : "New Blog Post"}</h2>
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
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Author</label>
                  <input value={form.author} onChange={setField("author")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Reading Time (mins)</label>
                  <input type="number" value={form.reading_time} onChange={setField("reading_time")} min="1" className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
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
                <textarea rows={12} value={form.content} onChange={setField("content")} className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
              </div>
              <div className="grid grid-cols-1 gap-4 pt-2 border-t border-primary/10">
                <p className="font-sans text-[10px] tracking-widest uppercase text-primary/40">SEO (Optional)</p>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">SEO Title</label>
                  <input value={form.seo_title} onChange={setField("seo_title")} className="w-full h-10 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-primary/50 block mb-2">Meta Description</label>
                  <textarea rows={2} value={form.meta_description} onChange={setField("meta_description")} className="w-full px-3 py-2 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary resize-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={setField("published")} className="accent-secondary" />
                <span className="font-sans text-sm text-primary/70">Publish immediately</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-primary/10 flex gap-3">
              <Button onClick={save} disabled={saving || !form.title} className="bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans text-xs h-9 px-6 disabled:opacity-40">
                {saving ? "Saving..." : editing ? "Save Changes" : "Create Post"}
              </Button>
              <Button variant="outline" onClick={() => setModal(false)} className="border-primary/20 text-primary rounded-none font-sans text-xs h-9 px-5">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
