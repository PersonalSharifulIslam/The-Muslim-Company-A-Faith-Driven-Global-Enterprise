import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 — Page Not Found — The Muslim Company";
    const _rob = document.querySelector('meta[name="robots"]');
    if (_rob) _rob.setAttribute('content', 'noindex, nofollow');
    else { const _rl = document.createElement('meta'); _rl.name = 'robots'; _rl.content = 'noindex, nofollow'; document.head.appendChild(_rl); }
    const _md = document.querySelector('meta[name="description"]');
    if (_md) _md.setAttribute('content', "The page you are looking for could not be found. Return to The Muslim Company homepage.");
    const _ogt = document.querySelector('meta[property="og:title"]');
    if (_ogt) _ogt.setAttribute('content', "404 Not Found — The Muslim Company");
    const _ogd = document.querySelector('meta[property="og:description"]');
    if (_ogd) _ogd.setAttribute('content', "The page you are looking for could not be found. Return to The Muslim Company homepage.");
    const _ogu = document.querySelector('meta[property="og:url"]');
    if (_ogu) _ogu.setAttribute('content', "https://www.themuslim.company/404");

    document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove());
    [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.themuslim.company/"}, {"@type": "ListItem", "position": 2, "name": "404", "item": "https://www.themuslim.company/404"}]}, {"@context": "https://schema.org", "@type": "WebPage", "name": "404 Not Found", "description": "The page you are looking for could not be found. Return to The Muslim Company homepage.", "url": "https://www.themuslim.company/404", "publisher": {"@type": "Organization", "name": "The Muslim Company", "url": "https://www.themuslim.company"}}].forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-page-schema', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });
    return () => { document.querySelectorAll('script[data-page-schema]').forEach(el => el.remove()); };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary px-6">
      <div className="w-full max-w-lg text-center">
        <p className="font-serif text-7xl md:text-8xl text-secondary/90 mb-4">404</p>
        <h1 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-4">
          This page could not be found
        </h1>
        <p className="font-sans text-sm text-primary-foreground/60 leading-relaxed mb-10">
          The page you're looking for may have been moved, renamed, or no longer exists.
          Here are some places to continue from:
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <a href="/" className="bg-secondary text-primary font-sans text-xs font-bold uppercase tracking-widest h-10 px-6 flex items-center hover:bg-secondary/90 transition-colors">
            Home
          </a>
          <a href="/about" className="border border-primary-foreground/20 text-primary-foreground font-sans text-xs font-bold uppercase tracking-widest h-10 px-6 flex items-center hover:border-secondary transition-colors">
            About Us
          </a>
          <a href="/contact" className="border border-primary-foreground/20 text-primary-foreground font-sans text-xs font-bold uppercase tracking-widest h-10 px-6 flex items-center hover:border-secondary transition-colors">
            Contact
          </a>
        </div>
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { label: "Sectors", href: "/sectors" },
            { label: "Careers", href: "/careers" },
            { label: "Blog", href: "/blog" },
            { label: "Newsroom", href: "/newsroom" },
          ].map(link => (
            <a key={link.href} href={link.href} className="font-sans text-xs tracking-widest uppercase text-primary-foreground/50 hover:text-secondary transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
