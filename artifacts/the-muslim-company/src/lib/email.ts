<<<<<<< HEAD
// ✅ এভাবে বদলান
=======
>>>>>>> 349b40772b6977e7b75786b0226cd761d841be72
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
  return callInterviewEdgeFunction(data)  // type field লাগবে না
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
