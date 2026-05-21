import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, name, position, reference, expiresAt } = await req.json()
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    const expiryDate = new Date(expiresAt).toLocaleString('en-GB', {
      dateStyle: 'long', timeStyle: 'short'
    })

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
        <tr><td style="background:#0f2214;padding:40px;text-align:center;border-bottom:3px solid #b08d57;">
          <p style="color:#b08d57;font-size:13px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">The Muslim Company</p>
          <h1 style="color:#e8d5a3;font-size:28px;margin:0;font-weight:400;letter-spacing:2px;">JOB OFFER LETTER</h1>
          <p style="color:#8aad8e;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:10px 0 0;">A Faith-Driven Global Enterprise</p>
        </td></tr>
        <tr><td style="background:#0f2214;padding:15px 40px;text-align:center;border-bottom:1px solid #b08d57;">
          <p style="color:#b08d57;font-size:14px;margin:0;">Bismillah ir-Rahman ir-Raheem</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 20px;">Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh,</p>
          <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 20px;">Dear <strong>${name}</strong>,</p>
          <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 25px;">Alhamdulillah, after careful review, we are pleased to extend this formal <strong>Job Offer</strong> for the position of:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;">
            <tr><td style="background:#0f2214;padding:20px 25px;border-left:4px solid #b08d57;">
              <p style="color:#b08d57;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 6px;">Position Offered</p>
              <p style="color:#e8d5a3;font-size:20px;font-weight:700;margin:0;">${position}</p>
              <p style="color:#8aad8e;font-size:12px;margin:8px 0 0;">The Muslim Company — Dhaka, Bangladesh</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;">
            <tr><td style="background:#f9f7f2;padding:15px 20px;border:1px solid #e8d5a3;">
              <p style="color:#8a6d40;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">Your Reference Number</p>
              <p style="color:#0f2214;font-size:16px;font-weight:700;font-family:monospace;margin:0;">${reference}</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;border:1px solid #e8d5a3;">
            <tr><td style="background:#b08d57;padding:12px 20px;">
              <p style="color:#0f2214;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin:0;">Next Steps</p>
            </td></tr>
            <tr><td style="padding:20px;">
              <p style="color:#1e3223;font-size:14px;line-height:1.8;margin:0 0 12px;"><strong>1. Digital Acceptance:</strong> To formally accept this position, please navigate to our Application Tracking Portal at <a href="https://www.themuslim.company/recruitment-status" style="color:#b08d57;">www.themuslim.company/recruitment-status</a> using your unique reference number.</p>
              <p style="color:#1e3223;font-size:14px;line-height:1.8;margin:0 0 12px;"><strong>2. Strict Timeframe:</strong> This offer is subject to an automated expiration window of <strong>72 hours (3 days)</strong>. You must click the <strong>'Accept Offer'</strong> button before the timer lapses.</p>
              <p style="color:#1e3223;font-size:14px;line-height:1.8;margin:0;"><strong>3. Offer Expires:</strong> <span style="color:#b08d57;font-weight:700;">${expiryDate}</span></p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;">
            <tr><td align="center">
              <a href="https://www.themuslim.company/recruitment-status" style="display:inline-block;background:#b08d57;color:#0f2214;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:16px 40px;">Accept Offer →</a>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;background:#f0f7f1;border-left:3px solid #4a7a50;">
            <tr><td style="padding:18px 20px;">
              <p style="color:#1e3223;font-size:13px;line-height:1.8;margin:0 0 8px;font-weight:700;">Post-Acceptance Onboarding Directive:</p>
              <p style="color:#3a5a3e;font-size:13px;line-height:1.8;margin:0 0 8px;">Upon clicking accept, you are allocated a maximum of <strong>7 days</strong> to report onsite to our corporate headquarters with your original academic and personal documents.</p>
              <p style="color:#3a5a3e;font-size:13px;line-height:1.8;margin:0;">Candidates who complete physical reporting within the first <strong>3 days</strong> will be accorded <strong>Special Commendation & High-Priority Onboarding Status</strong> by our leadership team.</p>
            </td></tr>
          </table>
          <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 10px;">We pray that this new professional journey serves as a source of immense blessings, provisioning, and fulfillment for you and your family, both in this world and the next. We await your valued response.</p>
          <p style="color:#1e3223;font-size:15px;margin:0 0 5px;">Warmest regards,</p>
          <p style="color:#0f2214;font-size:16px;font-weight:700;margin:0 0 3px;">Shariful Islam</p>
          <p style="color:#b08d57;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 3px;">Founder & CEO</p>
          <p style="color:#8a6d40;font-size:13px;margin:0;">The Muslim Company</p>
        </td></tr>
        <tr><td style="background:#0f2214;padding:25px 40px;text-align:center;border-top:2px solid #b08d57;">
          <p style="color:#b08d57;font-size:13px;font-weight:700;margin:0 0 5px;">Jazakallah Khair</p>
          <p style="color:#8aad8e;font-size:11px;margin:0 0 10px;">www.themuslim.company | careers@themuslim.company</p>
          <p style="color:#4a5a4a;font-size:10px;margin:0;">© 2025 The Muslim Company LTD. All rights reserved. | Dhaka, Bangladesh</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Muslim Company Careers <careers@themuslim.company>',
        to: [to],
        subject: `Job Offer — ${position} | The Muslim Company`,
        html,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to send email')

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
