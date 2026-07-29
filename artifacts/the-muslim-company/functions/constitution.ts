import { serveSectionSEO } from "./_shared/section-seo";

export async function onRequestGet(context: any) {
  return serveSectionSEO(context, "/constitution");
}
