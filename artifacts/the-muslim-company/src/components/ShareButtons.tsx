import { Facebook, Linkedin, MessageCircle, Link2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

// Simple X (Twitter) glyph — lucide's Twitter icon was removed upstream,
// so we draw the current X logo directly to stay visually current.
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.9l-5.4-6.6L4.8 22H1.6l8-9.2L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4h-2l12.3 16Z" />
    </svg>
  );
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: "X", icon: XIcon, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="font-sans text-xs tracking-widest uppercase text-primary/65">Share</span>
      {links.map(({ name, icon: Icon, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${name}`}
          className="w-8 h-8 flex items-center justify-center border border-primary/15 text-primary/65 hover:text-secondary hover:border-secondary/40 transition-colors"
        >
          <Icon className="w-3.5 h-3.5" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="w-8 h-8 flex items-center justify-center border border-primary/15 text-primary/65 hover:text-secondary hover:border-secondary/40 transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
