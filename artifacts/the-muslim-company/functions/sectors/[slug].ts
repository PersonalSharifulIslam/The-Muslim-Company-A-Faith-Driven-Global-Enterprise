export async function onRequestGet(context: any) {
  const { request, env } = context
  return env.ASSETS.fetch(request)
}
