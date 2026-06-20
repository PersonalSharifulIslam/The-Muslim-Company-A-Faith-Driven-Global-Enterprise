import { useState, useEffect } from "react"
import { User, Save } from "lucide-react"
import EmployeeLayout from "@/components/EmployeeLayout"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

export default function EmployeeProfile() {
  const { profile, session, loading, refreshProfile } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', address: '', emergency_contact: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (session && profile?.employee_id) {
      api.get("/employee/profile").then(e => {
        if (e) setForm({ name: e.name || '', phone: e.phone || '', address: e.address || '', emergency_contact: e.emergency_contact || '' })
      }).catch(() => {})
    }
  }, [session, profile])

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault()
    setSaving(true)
    try {
      await api.updateEmployee(profile?.id as any, form)
      await refreshProfile()
      setMsg('Profile updated!')
    } catch { setMsg('Failed to update') }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading || !session || !profile) return (
    <div className="min-h-screen bg-[#0a1a0e] flex items-center justify-center">
      <div style={{ width: 36, height: 36, border: "3px solid #b08d57", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <EmployeeLayout>
      <div className="p-6 max-w-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><User size={24} /> My Profile</h1>
        {msg && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded">{msg}</div>}
        <form onSubmit={handleSave} className="space-y-4">
          {[['Name', 'name'], ['Phone', 'phone'], ['Address', 'address'], ['Emergency Contact', 'emergency_contact']].map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </EmployeeLayout>
  )
}
