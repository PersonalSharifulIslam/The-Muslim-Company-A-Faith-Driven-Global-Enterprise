import { serveStaticSEO } from "./_shared/serve-static-seo";

export async function onRequestGet(context: any) {
  return serveStaticSEO(context, "/about");
}
