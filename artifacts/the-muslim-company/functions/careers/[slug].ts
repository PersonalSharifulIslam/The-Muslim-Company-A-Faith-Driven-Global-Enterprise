import { serveDynamicSEO } from "../_shared/serve-dynamic-seo";

export async function onRequestGet(context: any) {
  const slug = context.params?.slug as string;
  return serveDynamicSEO(context, "jobs", slug, "/careers", "");
}
