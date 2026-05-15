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
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="TMC" className="w-7 h-7 invert opacity-90 flex-shrink-0" />
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
              <div className="container mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
                {ALL_NAV.map((link) => (
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
                  href="/recruitment-status"
                  onClick={() => setNavOpen(false)}
                  className="font-sans text-xs tracking-widest uppercase text-secondary hover:text-secondary/80 transition-colors font-bold"
                >
                  Track Application →
                </a>
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
            <a href="/careers" className="hover:text-primary-foreground transition-colors">Careers</a>
            <a href="/newsroom" className="hover:text-primary-foreground transition-colors">Newsroom</a>
            <a href="/notices" className="hover:text-primary-foreground transition-colors">Notices</a>
            <a href="/blog" className="hover:text-primary-foreground transition-colors">Blog</a>
            <a href="/recruitment-status" className="hover:text-primary-foreground transition-colors">Track Application</a>
            <a href="/admin" className="hover:text-primary-foreground transition-colors">Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
