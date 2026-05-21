const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function callEdgeFunction(payload: object) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-offer-email`, {
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
