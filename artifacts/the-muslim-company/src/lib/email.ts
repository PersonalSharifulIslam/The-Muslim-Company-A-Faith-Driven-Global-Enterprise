export async function sendOfferEmail(data: {
  to: string
  name: string
  position: string
  reference: string
  expiresAt: string
}) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY
  const expiryDate = new Date(data.expiresAt).toLocaleString('en-GB', {
    dateStyle: 'long', timeStyle: 'short'
  })

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Job Offer — The Muslim Company</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ee;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#0f2214;padding:40px 40px 30px;text-align:center;border-bottom:3px solid #b08d57;">
            <p style="color:#b08d57;font-size:13px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">The Muslim Company</p>
            <h1 style="color:#e8d5a3;font-size:28px;margin:0;font-weight:400;letter-spacing:2px;">JOB OFFER LETTER</h1>
            <p style="color:#8aad8e;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:10px 0 0;">A Faith-Driven Global Enterprise</p>
          </td>
        </tr>

        <!-- Bismillah -->
        <tr>
          <td style="background:#0f2214;padding:15px 40px;text-align:center;border-bottom:1px solid #b08d57;">
            <p style="color:#b08d57;font-size:14px;margin:0;">Bismillah ir-Rahman ir-Raheem</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 20px;">Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh,</p>
            <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 20px;">Dear <strong>${data.name}</strong>,</p>
            <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 25px;">
              Alhamdulillah, after a careful review of your application, we are pleased and honored to extend this formal <strong>Job Offer</strong> for the position of:
            </p>

            <!-- Position box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;">
              <tr>
                <td style="background:#0f2214;padding:20px 25px;border-left:4px solid #b08d57;">
                  <p style="color:#b08d57;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 6px;">Position Offered</p>
                  <p style="color:#e8d5a3;font-size:20px;font-weight:700;margin:0;">${data.position}</p>
                  <p style="color:#8aad8e;font-size:12px;margin:8px 0 0;">The Muslim Company — Dhaka, Bangladesh</p>
                </td>
              </tr>
            </table>

            <!-- Reference -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;">
              <tr>
                <td style="background:#f9f7f2;padding:15px 20px;border:1px solid #e8d5a3;">
                  <p style="color:#8a6d40;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">Your Reference Number</p>
                  <p style="color:#0f2214;font-size:16px;font-weight:700;font-family:monospace;margin:0;">${data.reference}</p>
                </td>
              </tr>
            </table>

            <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 20px;">
              We believe your skills, dedication, and values align with our mission of building a faith-driven, ethical global enterprise. We look forward to having you as part of The Muslim Company family, In Sha Allah.
            </p>

            <!-- Steps -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;border:1px solid #e8d5a3;">
              <tr><td style="background:#b08d57;padding:12px 20px;">
                <p style="color:#0f2214;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin:0;">Next Steps</p>
              </td></tr>
              <tr><td style="padding:20px;">
                <p style="color:#1e3223;font-size:14px;line-height:1.8;margin:0 0 12px;">
                  <strong>1. Digital Acceptance:</strong> To formally accept this position, please navigate to our Application Tracking Portal using your unique reference number above.
                </p>
                <p style="color:#1e3223;font-size:14px;line-height:1.8;margin:0 0 12px;">
                  <strong>2. Strict Timeframe:</strong> This offer is subject to an automated expiration window of <strong>72 hours (3 days)</strong> from the time of this email. You must click the <strong>'Accept Offer'</strong> button before the timer lapses.
                </p>
                <p style="color:#1e3223;font-size:14px;line-height:1.8;margin:0;">
                  <strong>3. Offer Expires:</strong> <span style="color:#b08d57;font-weight:700;">${expiryDate}</span>
                </p>
              </td></tr>
            </table>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;">
              <tr><td align="center">
                <a href="https://www.themuslim.company/recruitment-status" style="display:inline-block;background:#b08d57;color:#0f2214;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:16px 40px;">
                  Accept Offer →
                </a>
              </td></tr>
            </table>

            <!-- Onboarding note -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px;background:#f0f7f1;border-left:3px solid #4a7a50;">
              <tr><td style="padding:18px 20px;">
                <p style="color:#1e3223;font-size:13px;line-height:1.8;margin:0 0 8px;font-weight:700;">Post-Acceptance Onboarding:</p>
                <p style="color:#3a5a3e;font-size:13px;line-height:1.8;margin:0 0 8px;">Upon accepting, you have <strong>7 days</strong> to report onsite to our corporate headquarters with original academic and personal documents.</p>
                <p style="color:#3a5a3e;font-size:13px;line-height:1.8;margin:0;">Candidates who complete physical reporting within the first <strong>3 days</strong> will receive <strong>Special Commendation & High-Priority Onboarding Status</strong>.</p>
              </td></tr>
            </table>

            <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 10px;">
              We pray that this new professional journey serves as a source of immense blessings, provisioning, and fulfillment for you and your family, both in this world and the next.
            </p>
            <p style="color:#1e3223;font-size:15px;line-height:1.8;margin:0 0 30px;">We await your valued response.</p>

            <p style="color:#1e3223;font-size:15px;margin:0 0 5px;">Warmest regards,</p>
            <p style="color:#0f2214;font-size:16px;font-weight:700;margin:0 0 3px;">Shariful Islam</p>
            <p style="color:#b08d57;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 3px;">Founder & CEO</p>
            <p style="color:#8a6d40;font-size:13px;margin:0;">The Muslim Company</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f2214;padding:25px 40px;text-align:center;border-top:2px solid #b08d57;">
            <p style="color:#b08d57;font-size:13px;font-weight:700;margin:0 0 5px;">Jazakallah Khair</p>
            <p style="color:#8aad8e;font-size:11px;margin:0 0 10px;">www.themuslim.company | careers@themuslim.company</p>
            <p style="color:#4a5a4a;font-size:10px;margin:0;">© 2025 The Muslim Company LTD. All rights reserved. | Dhaka, Bangladesh</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'The Muslim Company Careers <careers@themuslim.company>',
      to: [data.to],
      subject: `Job Offer — ${data.position} | The Muslim Company`,
      html,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.message || 'Failed to send email')
  }
  return await response.json()
}
