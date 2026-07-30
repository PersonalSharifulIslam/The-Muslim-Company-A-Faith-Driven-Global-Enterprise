// Central bot/crawler detection. Keep this list in sync across the site —
// every Function that needs to decide "prerendered HTML vs SPA shell" should
// import isBotRequest from here instead of maintaining its own regex.
const BOT_UA_PATTERNS: RegExp[] = [
  // Search engines
  /Googlebot/i,
  /Google-Extended/i,
  /Bingbot/i,
  /Applebot/i,
  /DuckDuckBot/i,
  /YandexBot/i,
  /Baiduspider/i,
  // Social / link-preview crawlers
  /facebookexternalhit/i,
  /Facebot/i,
  /Twitterbot/i,
  /LinkedInBot/i,
  /Slackbot/i,
  /WhatsApp/i,
  /TelegramBot/i,
  /Discordbot/i,
  /Pinterestbot/i,
  // AI / LLM crawlers & assistants
  /ClaudeBot/i,
  /Claude-Web/i,
  /anthropic-ai/i,
  /GPTBot/i,
  /ChatGPT-User/i,
  /OAI-SearchBot/i,
  /PerplexityBot/i,
  /Perplexity-User/i,
  /CCBot/i,
  /Bytespider/i,
  /Amazonbot/i,
  /Meta-ExternalAgent/i,
  /Diffbot/i,
  // Generic
  /bot\b/i,
  /crawler/i,
  /spider/i,
];

export function isBotRequest(request: Request): boolean {
  const ua = request.headers.get("user-agent") || "";
  if (!ua) return false;
  return BOT_UA_PATTERNS.some((re) => re.test(ua));
}
