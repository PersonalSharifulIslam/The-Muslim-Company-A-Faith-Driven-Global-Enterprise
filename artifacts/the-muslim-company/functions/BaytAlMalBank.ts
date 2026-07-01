// Legacy mixed-case URL — permanently redirected to the canonical lowercase
// /baytalmalbank route to avoid duplicate-content / duplicate-URL issues in
// Google Search Console. Redirects for ALL requests, crawler or not.
export async function onRequestGet(context: any) {
  return Response.redirect('https://www.themuslim.company/baytalmalbank', 301)
}
