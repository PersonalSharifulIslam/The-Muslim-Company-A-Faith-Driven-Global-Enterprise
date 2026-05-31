import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/images/logo.png";

const ALL_NAV = [
  { label: "Home", href: "/" },
  { label: "Mission", href: "/#mission" },
  { label: "Sectors", href: "/#sectors" },
  { label: "Vision", href: "/#vision" },
  { label: "Founder", href: "/#founder" },
  { label: "Careers", href: "/careers" },
  { label: "Newsroom & PR", href: "/newsroom" },
  { label: "Notice & Event", href: "/notices" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Transparency", href: "/transparency" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="TMC" className="w-7 h-7 opacity-90 flex-shrink-0" />
            <span className="font-serif text-sm font-bold tracking-widest uppercase text-primary-foreground whitespace-nowrap">
              The Muslim Company
            </span>
          </a>
          <button
            className="text-primary-foreground/70 hover:text-secondary transition-colors"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-primary border-t border-primary-foreground/10 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-5 grid grid-cols-2 gap-x-12">
                {/* Left column */}
                <div className="flex flex-col gap-3">
                  {NAV_LEFT.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setNavOpen(false)}
                      className="font-sans text-xs tracking-widest uppercase text-primary-foreground/60 hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                {/* Right column */}
                <div className="flex flex-col gap-3">
                  {NAV_RIGHT.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setNavOpen(false)}
                      className="font-sans text-xs tracking-widest uppercase text-primary-foreground/60 hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="/#contact"
                    onClick={() => setNavOpen(false)}
                    className="font-sans text-xs tracking-widest uppercase text-secondary hover:text-secondary/80 transition-colors font-bold"
                  >
                    Join Us →
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1 pt-14">{children}</main>

      <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10 py-10 px-6 lg:px-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-sans text-primary-foreground/35">
          <div>
            <p className="font-serif text-base text-primary-foreground/50 mb-1">The Muslim Company</p>
            <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            <a href="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</a>
            <a href="/get-involved" className="hover:text-primary-foreground transition-colors">Get Involved</a>
            <a href="/transparency" className="hover:text-primary-foreground transition-colors">Transparency</a>
            <a href="/careers" className="hover:text-primary-foreground transition-colors">Careers</a>
            <a href="/newsroom" className="hover:text-primary-foreground transition-colors">Newsroom</a>
            <a href="/notices" className="hover:text-primary-foreground transition-colors">Notices</a>
            <a href="/blog" className="hover:text-primary-foreground transition-colors">Blog</a>
            <a href="/recruitment-status" className="hover:text-primary-foreground transition-colors">Track Application</a>
            <a href="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {loginOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60"
              onClick={() => setLoginOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm mx-4"
            >
              <div className="bg-primary border border-primary-foreground/15 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-primary-foreground/10">
                  <div className="flex items-center gap-3">
                    <img src={logo} alt="TMC" className="w-6 h-6 opacity-80" />
                    <div>
                      <p className="font-serif text-sm text-primary-foreground">The Muslim Company</p>
                      <p className="font-sans text-[9px] tracking-widest uppercase text-secondary/60">Select Portal</p>
                    </div>
                  </div>
                  <button onClick={() => setLoginOpen(false)} className="text-primary-foreground/40 hover:text-primary-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  <a href="/admin"
                    className="flex items-center justify-between w-full p-4 border border-secondary/25 hover:border-secondary/60 bg-secondary/5 hover:bg-secondary/10 transition-all group">
                    <div>
                      <p className="font-sans text-xs font-bold tracking-widest uppercase text-primary-foreground group-hover:text-secondary transition-colors">Corporate Admin</p>
                      <p className="font-sans text-[10px] text-primary-foreground/35 mt-0.5">Management dashboard access</p>
                    </div>
                  </a>
                  <a href="/employee"
                    className="flex items-center justify-between w-full p-4 border border-primary-foreground/15 hover:border-secondary/40 bg-white/5 hover:bg-secondary/5 transition-all group">
                    <div>
                      <p className="font-sans text-xs font-bold tracking-widest uppercase text-primary-foreground group-hover:text-secondary transition-colors">Employee Portal</p>
                      <p className="font-sans text-[10px] text-primary-foreground/35 mt-0.5">Staff attendance, tasks & leave</p>
                    </div>
                  </a>
                </div>
                <div className="px-5 pb-5">
                  <p className="font-sans text-[9px] text-primary-foreground/20 text-center tracking-widest uppercase">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
