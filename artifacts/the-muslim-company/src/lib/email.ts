const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

async function callEdgeFunction(functionName: string, payload: object) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to send email')
  return data
}

export async function sendInterviewEmail(data: {
  to: string
  name: string
  position: string
  reference: string
  interviewDatetime: string
  interviewType: string
  interviewLocation: string
}) {
  const isOnline = data.interviewType?.toLowerCase().includes('online')

  const [datePart, timePart] = data.interviewDatetime.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const dayName = dayNames[new Date(year, month - 1, day).getDay()]
  const interviewDate = `${dayName}, ${day} ${monthNames[month - 1]} ${year}`

  const [h, m] = timePart.substring(0, 5).split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const interviewTime = `${hour12}:${m.toString().padStart(2, '0')} ${ampm} (BST)`

  return callEdgeFunction('send-interview-email', {
    to: data.to,
    name: data.name,
    position: data.position,
    reference: data.reference,
    interviewDate,
    interviewTime,
    interviewType: isOnline ? 'online' : 'in-person',
    interviewLink: isOnline ? data.interviewLocation : undefined,
    interviewVenue: isOnline ? undefined : data.interviewLocation,
  })
}

export async function sendOfferEmail(data: {
  to: string
  name: string
  position: string
  reference: string
  expiresAt: string
}) {
  return callEdgeFunction('send-offer-email', data)
}

export async function sendApplicationConfirmation(data: {
  to: string
  name: string
  reference: string
  position: string
  jobId: number
  department: string
  location: string
  submittedDate: string
}) {
  return callEdgeFunction('send-application-confirmation', data)
}
export async function sendCustomMessage(data: {
  to: string
  name: string
  position?: string
  reference?: string
  subject: string
  message: string
}) {
  return callEdgeFunction('send-custom-message', data)
}
