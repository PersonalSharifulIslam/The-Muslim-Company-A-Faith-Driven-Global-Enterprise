import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck } from "lucide-react"
import EmployeeLayout from "@/components/EmployeeLayout"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

interface Notif { id: number; title: string; message: string; type: string; is_read: boolean; created_at: string }

export default function EmployeeNotifications() {
  const { profile } = useAuth()
  const employee = profile?.employee_id ? profile : null
  const [notifs, setNotifs] = useState<Notif[]>([])

  useEffect(() => {
    if (profile?.employee_id) {
      api.getNotifications(employee.employee_id).then(d => setNotifs(d || [])).catch(() => {})
    }
  }, [profile])

  async function markRead(id: number) {
    await api.markNotificationRead(id)
    setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x))
  }

  async function markAllRead() {
    await Promise.all(notifs.filter(n => !n.is_read).map(n => api.markNotificationRead(n.id)))
    setNotifs(n => n.map(x => ({ ...x, is_read: true })))
  }

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2"><Bell size={24} /> Notifications</h1>
          <button onClick={markAllRead} className="flex items-center gap-1 text-sm text-emerald-600 hover:underline"><CheckCheck size={16} /> Mark all read</button>
        </div>
        <div className="space-y-3">
          {notifs.length === 0 && <p className="text-gray-500 text-center py-8">No notifications</p>}
          {notifs.map(n => (
            <div key={n.id} className={`p-4 rounded-lg border ${n.is_read ? 'bg-white border-gray-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleDateString()}</p>
                </div>
                {!n.is_read && <button onClick={() => markRead(n.id)} className="text-emerald-600 hover:text-emerald-800"><Check size={18} /></button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmployeeLayout>
  )
}
