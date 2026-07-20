/**
 * Crawler / bot user-agent detection.
 *
 * Search engine and social crawlers (and Google Search Console's Live Test /
 * URL Inspection tool) don't scroll the page, so Framer Motion's
 * `whileInView` animations never fire for them and content gated behind
 * `initial: "hidden"` stays at `opacity: 0` forever in the rendered DOM/
 * screenshot.
 *
 * For these user agents we skip straight to the "visible" state so content
 * is present at first paint, while regular visitors still get the full
 * scroll-triggered fade-in experience.
 *
 * NOTE: `Google-InspectionTool` (used by Search Console's URL Inspection /
 * Live Test) does NOT contain the substring "bot", so it must be listed
 * explicitly rather than relying on a generic /bot/i match.
 */
export function isCrawlerUA(): boolean {
  if (typeof navigator === "undefined") return false;
  return /bot|googlebot|bingbot|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|applebot|petalbot|semrushbot|ahrefsbot|mj12bot|google-extended|gptbot|claudebot|perplexitybot|ccbot|crawler|spider|inspectiontool|google-inspectiontool|google-read-aloud|storebot-google|adsbot-google|mediapartners-google|google-safety|feedfetcher-google|lighthouse|pagespeed|headlesschrome/i.test(
    navigator.userAgent
  );
}
