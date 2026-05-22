const SUPABASE_URL = 'https://zutzpbwxvpricifpcgaj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dHpwYnd4dnByaWNpZnBjZ2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDE4MjMsImV4cCI6MjA5NDYxNzgyM30.pP1l6dyBcJFMA41VA_Rwy_unzV2RitUGXvUmDnil3BI'

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
  const isOnline = data.interviewType === 'Online (Google Meet)'

  const dateObj = new Date(data.interviewDatetime)
  const interviewDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const interviewTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit'
  })

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
