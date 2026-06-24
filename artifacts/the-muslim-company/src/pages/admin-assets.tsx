import { useState, useEffect } from "react";
import { Plus, Package, AlertCircle, Check, Edit2, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { api } from "@/lib/api";

type Asset = {
  id: number; asset_name: string; asset_type: string; serial_number: string;
  assigned_to: string | null; assigned_date: string | null; returned_date: string | null;
  status: string; notes: string;
  employees?: { name: string; department: string };
};
type Employee = { employee_id: string; name: string; department: string };
type AssetItem = { asset_name: string; asset_type: string; serial_number: string; notes: string };

const STATUS_COLORS: Record<string, string> = {
  available: "bg-blue-400/10 text-blue-400",
  assigned: "bg-green-400/10 text-green-400",
  maintenance: "bg-yellow-400/10 text-yellow-400",
  retired: "bg-gray-400/10 text-gray-400",
};
const ASSET_TYPES = ["Laptop", "Desktop", "Phone", "ID Card", "Vehicle", "Office Equipment", "Software License", "Other"];
const BLANK_ITEM: AssetItem = { asset_name: "", asset_type: ASSET_TYPES[0], serial_number: "", notes: "" };

export default function AdminAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [filter, setFilter] = useState("all");

  // For editing a single existing asset
  const [editForm, setEditForm] = useState(BLANK_ITEM);

  // For adding — one person, multiple asset items at once
  const [assignedTo, setAssignedTo] = useState("");
  const [items, setItems] = useState<AssetItem[]>([{ ...BLANK_ITEM }]);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [a, e] = await Promise.all([api.get("/admin/assets"), api.get("/admin/employees")]);
      setAssets((a as Asset[]) || []);
      setEmployees((e as Employee[]) || []);
    } catch {}
    setLoading(false);
  }

  function addRow() {
    setItems((rows) => [...rows, { ...BLANK_ITEM }]);
  }

  function removeRow(index: number) {
    setItems((rows) => rows.filter((_, i) => i !== index));
  }

  function updateRow(index: number, key: keyof AssetItem, value: string) {
    setItems((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  async function handleSaveMultiple(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const validItems = items.filter((it) => it.asset_name.trim() !== "");
      if (validItems.length === 0) throw new Error("Add at least one asset with a name");

      for (const item of validItems) {
        await api.post("/admin/assets", { ...item, assigned_to: assignedTo || "" }, true);
      }

      setMsg({ type: "ok", text: `${validItems.length} asset${validItems.length > 1 ? "s" : ""} saved` });
      setShowForm(false);
      setAssignedTo("");
      setItems([{ ...BLANK_ITEM }]);
      await load();
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Error" });
    }
    setSaving(false);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMsg(null);
    try {
      await api.put(`/admin/assets/${editing.id}`, { ...editForm, assigned_to: editing.assigned_to || "" }, true);
      setMsg({ type: "ok", text: "Saved" });
      setEditing(null);
      await load();
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Error" });
    }
    setSaving(false);
  }

  function startEdit(a: Asset) {
    setEditing(a);
    setEditForm({ asset_name: a.asset_name, asset_type: a.asset_type, serial_number: a.serial_number || "", notes: a.notes || "" });
    setShowForm(false);
  }

  function openAddForm() {
    setEditing(null);
    setAssignedTo("");
    setItems([{ ...BLANK_ITEM }]);
    setShowForm(true);
  }

  const filtered = filter === "all" ? assets : assets.filter((a) => a.status === filter);
  const counts = { all: assets.length, available: assets.filter((a) => a.status === "available").length, assigned: assets.filter((a) => a.status === "assigned").length };

  return (
    <AdminLayout current="/admin/assets">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-primary flex items-center gap-2"><Package className="w-6 h-6 text-secondary" /> Asset Management</h1>
          <button onClick={openAddForm} className="flex items-center gap-2 bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-4">
            <Plus className="w-4 h-4" /> Add Assets
          </button>
        </div>

        {msg && (
          <div className={`mb-4 p-3 flex items-center gap-2 font-sans text-sm rounded ${msg.type === "ok" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
            {msg.type === "ok" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-6">
          {(["all", "available", "assigned"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`p-3 border rounded text-center transition-colors ${filter === s ? "border-secondary bg-secondary/5" : "border-primary/10"}`}>
              <p className="font-serif text-xl text-primary">{counts[s]}</p>
              <p className="font-sans text-[9px] uppercase tracking-widest text-primary/40 capitalize">{s}</p>
            </button>
          ))}
        </div>

        {/* MULTI-ITEM ADD FORM */}
        {showForm && (
          <form onSubmit={handleSaveMultiple} className="mb-6 p-6 border border-secondary/30 bg-card">
            <div className="mb-5">
              <label className="font-sans text-xs text-primary/50 mb-1 block">Assign To (Optional)</label>
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                <option value="">Unassigned</option>
                {employees.map((e) => <option key={e.employee_id} value={e.employee_id}>{e.name} — {e.department}</option>)}
              </select>
              <p className="font-sans text-[10px] text-primary/40 mt-1">All items below will be assigned to this person.</p>
            </div>

            <p className="font-sans text-xs uppercase tracking-widest text-primary/50 mb-3">Assets ({items.length})</p>

            <div className="space-y-4">
              {items.map((item, i) => (
                <div key={i} className="p-4 border border-primary/10 bg-background grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeRow(i)} className="absolute top-2 right-2 text-primary/30 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div>
                    <label className="font-sans text-[10px] text-primary/50 mb-1 block">Asset Name *</label>
                    <input required value={item.asset_name} onChange={(e) => updateRow(i, "asset_name", e.target.value)}
                      placeholder="e.g. MacBook Pro 16&quot;"
                      className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-primary/50 mb-1 block">Type *</label>
                    <select value={item.asset_type} onChange={(e) => updateRow(i, "asset_type", e.target.value)}
                      className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                      {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-primary/50 mb-1 block">Serial Number</label>
                    <input value={item.serial_number} onChange={(e) => updateRow(i, "serial_number", e.target.value)}
                      placeholder="Unique serial / plate / license no."
                      className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] text-primary/50 mb-1 block">Notes</label>
                    <input value={item.notes} onChange={(e) => updateRow(i, "notes", e.target.value)}
                      className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addRow} className="mt-4 flex items-center gap-2 border border-secondary/40 text-secondary font-sans text-xs uppercase tracking-widest h-9 px-4">
              <Plus className="w-3.5 h-3.5" /> Add Another Item
            </button>

            <div className="mt-6 flex gap-3">
              <button type="submit" disabled={saving} className="bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-6 disabled:opacity-50">
                {saving ? "Saving..." : `Save ${items.filter(it => it.asset_name.trim()).length || ""} Asset${items.length > 1 ? "s" : ""}`}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-6">Cancel</button>
            </div>
          </form>
        )}

        {/* SINGLE-ITEM EDIT FORM */}
        {editing && (
          <form onSubmit={handleSaveEdit} className="mb-6 p-6 border border-secondary/30 bg-card grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Asset Name *</label>
              <input required value={editForm.asset_name} onChange={(e) => setEditForm((f) => ({ ...f, asset_name: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Type *</label>
              <select value={editForm.asset_type} onChange={(e) => setEditForm((f) => ({ ...f, asset_type: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Serial Number</label>
              <input value={editForm.serial_number} onChange={(e) => setEditForm((f) => ({ ...f, serial_number: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div>
              <label className="font-sans text-xs text-primary/50 mb-1 block">Assign To</label>
              <select value={editing.assigned_to || ""} onChange={(e) => setEditing((ed) => ed ? { ...ed, assigned_to: e.target.value } : ed)}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary">
                <option value="">Unassigned</option>
                {employees.map((e) => <option key={e.employee_id} value={e.employee_id}>{e.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="font-sans text-xs text-primary/50 mb-1 block">Notes</label>
              <input value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full h-9 px-3 bg-background border border-primary/15 font-sans text-sm text-primary focus:outline-none focus:border-secondary" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="bg-secondary text-primary font-sans text-xs uppercase tracking-widest h-9 px-6 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
              <button type="button" onClick={() => setEditing(null)} className="border border-primary/20 text-primary font-sans text-xs uppercase tracking-widest h-9 px-6">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><div style={{ width: 32, height: 32, border: "2px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>
        ) : (
          <div className="space-y-2">
            {filtered.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 border border-primary/10 bg-card">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-sans text-sm text-primary">{a.asset_name}</p>
                    <span className={`font-sans text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                  </div>
                  <p className="font-sans text-xs text-primary/40">{a.asset_type} {a.serial_number && `· ${a.serial_number}`} {a.employees?.name && `· Assigned to ${a.employees.name}`}</p>
                </div>
                <button onClick={() => startEdit(a)} className="text-primary/40 hover:text-secondary"><Edit2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
