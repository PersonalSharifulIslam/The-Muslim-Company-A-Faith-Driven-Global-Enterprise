// Verifies a Cloudflare Turnstile token server-side before a job application
// is written to the database. Prevents spam/bot submissions.
export async function onRequestPost(context: any) {
  const { request, env } = context
  const SECRET_KEY = env.TURNSTILE_SECRET_KEY

  if (!SECRET_KEY) {
    return Response.json({ success: false, error: 'Server misconfigured: missing secret key' }, { status: 500 })
  }

  let token = ''
  try {
    const body = await request.json() as { token?: string }
    token = body.token || ''
  } catch {
    return Response.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }

  if (!token) {
    return Response.json({ success: false, error: 'Missing token' }, { status: 400 })
  }

  const ip = request.headers.get('CF-Connecting-IP') || ''

  const formData = new FormData()
  formData.append('secret', SECRET_KEY)
  formData.append('response', token)
  if (ip) formData.append('remoteip', ip)

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })
  const outcome = await verifyRes.json() as { success: boolean; [key: string]: any }

  if (!outcome.success) {
    return Response.json({ success: false, error: 'Verification failed', details: outcome['error-codes'] || [] }, { status: 200 })
  }

  return Response.json({ success: true })
}
