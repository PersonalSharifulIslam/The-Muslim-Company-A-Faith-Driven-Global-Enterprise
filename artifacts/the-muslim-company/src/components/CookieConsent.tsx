import { useEffect, useState } from "react";

const STORAGE_KEY = "tmc_cookie_notice_ack";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable — skip silently
    }
  }, []);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-primary border-t border-secondary/30 shadow-2xl"
    >
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <p className="font-sans text-xs text-primary-foreground/65 leading-relaxed flex-1">
          We use only essential cookies to keep your session secure and the site functioning properly.
          We do not use advertising, tracking, or behavioral-profiling cookies. See our{" "}
          <a href="/privacy-policy" className="text-secondary hover:underline">Privacy Policy</a> for details.
        </p>
        <button
          onClick={dismiss}
          className="flex-shrink-0 bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-9 px-6 hover:bg-secondary/90 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
