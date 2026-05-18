import { useState, useEffect } from "react"
import { User, Save } from "lucide-react"
import EmployeeLayout from "@/components/EmployeeLayout"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

export default function EmployeeProfile() {
  const { profile, refreshProfile } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', address: '', emergency_contact: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (profile?.employee_id) {
      api.getEmployee(profile.employee_id).then(e => {
        if (e) setForm({ name: e.name || '', phone: e.phone || '', address: e.address || '', emergency_contact: e.emergency_contact || '' })
      }).catch(() => {})
    }
  }, [profile])

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
