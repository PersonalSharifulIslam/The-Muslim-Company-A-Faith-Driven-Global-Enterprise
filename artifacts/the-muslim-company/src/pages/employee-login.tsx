import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import logo from "@/assets/images/logo.png";

export default function EmployeeLogin() {
  useEffect(() => {
    document.title = "The Muslim Company";
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, nofollow');
    return () => {
      const r = document.querySelector('meta[name="robots"]');
      if (r) r.setAttribute('content', 'index, follow');
    };
  }, []);

  const { employee, loading, login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  }, [employee, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(identifier, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
    setSubmitting(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0a1a0e] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#b08d57]/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#b08d57]/3 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 400 400">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#b08d57" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#b08d57]/10 border border-[#b08d57]/30 mb-4">
            <img src={logo} alt="TMC" className="w-8 h-8 opacity-80" />
          </div>
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#b08d57]/60 mb-1">Employee Portal</p>
          <h1 className="font-serif text-3xl text-white mb-1">Welcome Back</h1>
          <p className="font-sans text-xs text-white/30">As-salamu alaykum — sign in to continue</p>
        </div>

        <div className="bg-[#0f2314]/80 border border-[#b08d57]/20 p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#b08d57]/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#b08d57]" />
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/30">THE MUSLIM COMPANY</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-sans text-[10px] tracking-widest uppercase text-white/40 block mb-2">Employee ID or Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="TMC-2024-001 or email"
                  className="w-full h-11 pl-10 pr-4 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-[#b08d57]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-widest uppercase text-white/40 block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-white/5 border border-[#b08d57]/20 text-white font-sans text-sm placeholder:text-white/20 focus:outline-none focus:border-[#b08d57]/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="font-sans text-xs text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full h-11 bg-[#b08d57] hover:bg-[#c9a96e] text-black rounded-none font-sans text-xs font-bold tracking-widest uppercase mt-2 disabled:opacity-50">
              {submitting ? "Signing In..." : "Sign In to Portal"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#b08d57]/10 text-center">
            <p className="font-sans text-[10px] text-white/20">Contact HR for account access issues</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="font-sans text-[10px] tracking-widest uppercase text-white/20 hover:text-[#b08d57]/60 transition-colors">
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}
