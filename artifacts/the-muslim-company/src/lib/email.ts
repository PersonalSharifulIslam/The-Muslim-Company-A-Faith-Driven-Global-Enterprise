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
  
  // datetime-local format: "2026-05-22T14:30"
  const dt = data.interviewDatetime.replace('T', ' ')
  const dateObj = new Date(dt)
  
  const interviewDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const interviewTime = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit'
  })

  return callInterviewEdgeFunction({
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
