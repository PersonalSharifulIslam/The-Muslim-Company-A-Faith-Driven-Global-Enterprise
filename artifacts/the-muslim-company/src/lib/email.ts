async function callOfferEdgeFunction(payload: object) {
  const res = await fetch('https://zutzpbwxvpricifpcgaj.supabase.co/functions/v1/send-offer-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dHpwYnd4dnByaWNpZnBjZ2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDE4MjMsImV4cCI6MjA5NDYxNzgyM30.pP1l6dyBcJFMA41VA_Rwy_unzV2RitUGXvUmDnil3BI`,
    },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to send email')
  return data
}

async function callInterviewEdgeFunction(payload: object) {
  const res = await fetch('https://zutzpbwxvpricifpcgaj.supabase.co/functions/v1/send-interview-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dHpwYnd4dnByaWNpZnBjZ2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDE4MjMsImV4cCI6MjA5NDYxNzgyM30.pP1l6dyBcJFMA41VA_Rwy_unzV2RitUGXvUmDnil3BI`,
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
  return callInterviewEdgeFunction({
    to: data.to,
    name: data.name,
    position: data.position,
    reference: data.reference,
    interviewDate: data.interviewDatetime,
    interviewTime: new Date(data.interviewDatetime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
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
  return callOfferEdgeFunction(data)
}
