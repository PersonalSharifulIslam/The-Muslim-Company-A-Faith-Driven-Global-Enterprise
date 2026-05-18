import { useState, useEffect } from "react"
import { FileText, Download } from "lucide-react"
import EmployeeLayout from "@/components/EmployeeLayout"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"

interface Doc { id: number; name: string; category: string; file_url: string; description: string; created_at: string }

export default function EmployeeDocuments() {
  const { profile } = useAuth()
  const [docs, setDocs] = useState<Doc[]>([])

  useEffect(() => {
    if (profile?.employee_id) {
      api.getDocuments(profile.employee_id).then(d => setDocs(d || [])).catch(() => {})
    }
  }, [profile])

  return (
    <EmployeeLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FileText size={24} /> Documents</h1>
        <div className="grid gap-4">
          {docs.length === 0 && <p className="text-gray-500 text-center py-8">No documents available</p>}
          {docs.map(d => (
            <div key={d.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-gray-500">{d.category} • {new Date(d.created_at).toLocaleDateString()}</p>
                {d.description && <p className="text-sm text-gray-600 mt-1">{d.description}</p>}
              </div>
              {d.file_url && (
                <a href={d.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-600 hover:underline text-sm">
                  <Download size={16} /> Download
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </EmployeeLayout>
  )
}
