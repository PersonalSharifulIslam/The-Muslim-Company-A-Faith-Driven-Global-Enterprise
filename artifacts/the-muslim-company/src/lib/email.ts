async function callEdgeFunction(payload: object) {
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

export async function sendInterviewEmail(data: {
  to: string
  name: string
  position: string
  reference: string
  interviewDatetime: string
  interviewType: string
  interviewLocation: string
}) {
  return callEdgeFunction({ type: 'interview', ...data })
}

export async function sendOfferEmail(data: {
  to: string
  name: string
  position: string
  reference: string
  expiresAt: string
}) {
  return callEdgeFunction({ type: 'offer', ...data })
}
