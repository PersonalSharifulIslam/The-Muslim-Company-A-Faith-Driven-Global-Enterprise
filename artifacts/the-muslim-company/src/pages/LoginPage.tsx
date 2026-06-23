import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import loginLogo from "@/assets/images/login-logo.webp";

export default function LoginPage() {
  useEffect(() => {
    document.title = "Staff Sign In — The Muslim Company";
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute("content", "noindex, nofollow");
    return () => {
      const r = document.querySelector('meta[name="robots"]');
      if (r) r.setAttribute("content", "index, follow");
    };
  }, []);

  const { signIn, resetPassword } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) { setError("Invalid email or password."); return; }
    setTimeout(() => setLocation("/auth-redirect"), 100);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    const { error: err } = await resetPassword(email);
    setBusy(false);
    if (err) { setError(err); return; }
    setInfo("Password reset email sent. Please check your inbox.");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a1a0e] relative overflow-hidden px-4 py-10">
      {/* Subtle Islamic geometric pattern backdrop */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23b08d57' stroke-width='1'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3Ccircle cx='40' cy='40' r='28'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Soft radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#b08d57]/[0.06] rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Card */}
        <div className="bg-[#0f1f15]/90 backdrop-blur-sm border border-[#b08d57]/20 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] px-8 sm:px-10 py-10">
          {/* Brand mark */}
          <div className="flex flex-col items-center text-center mb-8">
            <img src={loginLogo} alt="The Muslim Company" className="w-20 h-20 object-contain mb-4" />
            <p className="font-serif text-lg text-[#e8d5a3] tracking-wide">The Muslim Company</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="h-px w-6 bg-[#b08d57]/40" />
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#8aad8e]">Staff Portal</p>
              <span className="h-px w-6 bg-[#b08d57]/40" />
            </div>
          </div>

          <h1 className="font-serif text-2xl text-[#f1e6c8] mb-1.5 text-center">
            {mode === "login" ? "Welcome Back" : "Reset Password"}
          </h1>
          <p className="font-sans text-xs text-[#8aad8e]/80 text-center mb-7">
            {mode === "login"
              ? "Sign in to access your dashboard"
              : "Enter your email to receive a reset link"}
          </p>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-950/40 border border-red-800/40 text-red-300 rounded-lg px-4 py-3 text-xs font-sans mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {info && (
            <div className="flex items-start gap-2.5 bg-green-950/40 border border-green-800/40 text-green-300 rounded-lg px-4 py-3 text-xs font-sans mb-5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{info}</span>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="font-sans text-[11px] tracking-wider uppercase text-[#8aad8e]/90 mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5a7a5e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email" required autoFocus value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@themuslim.company"
                    className="w-full h-11 pl-10 pr-4 bg-[#071510] border border-[#1e3a22] rounded-lg text-sm text-[#e8d5a3] placeholder:text-[#4a6a4e] focus:outline-none focus:border-[#b08d57]/60 focus:ring-1 focus:ring-[#b08d57]/30 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="font-sans text-[11px] tracking-wider uppercase text-[#8aad8e]/90 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5a7a5e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-4 bg-[#071510] border border-[#1e3a22] rounded-lg text-sm text-[#e8d5a3] placeholder:text-[#4a6a4e] focus:outline-none focus:border-[#b08d57]/60 focus:ring-1 focus:ring-[#b08d57]/30 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={busy}
                className="w-full h-11 mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#b08d57] to-[#8a6d40] hover:from-[#c19c63] hover:to-[#9a7b48] text-[#0a1a0e] font-sans text-sm font-bold uppercase tracking-wide rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? "Signing In..." : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setMode("forgot"); setError(""); setInfo(""); }}
                className="w-full text-center font-sans text-xs text-[#b08d57]/80 hover:text-[#b08d57] transition-colors pt-1"
              >
                Forgot your password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="font-sans text-[11px] tracking-wider uppercase text-[#8aad8e]/90 mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5a7a5e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email" required autoFocus value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@themuslim.company"
                    className="w-full h-11 pl-10 pr-4 bg-[#071510] border border-[#1e3a22] rounded-lg text-sm text-[#e8d5a3] placeholder:text-[#4a6a4e] focus:outline-none focus:border-[#b08d57]/60 focus:ring-1 focus:ring-[#b08d57]/30 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit" disabled={busy}
                className="w-full h-11 mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#b08d57] to-[#8a6d40] hover:from-[#c19c63] hover:to-[#9a7b48] text-[#0a1a0e] font-sans text-sm font-bold uppercase tracking-wide rounded-lg transition-all disabled:opacity-60"
              >
                {busy ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setInfo(""); }}
                className="w-full text-center font-sans text-xs text-[#b08d57]/80 hover:text-[#b08d57] transition-colors pt-1"
              >
                ← Back to Sign In
              </button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#4a7a50]" />
          <p className="font-sans text-[11px] text-[#4a7a50]">
            Secure access · Role detected automatically
          </p>
        </div>
      </motion.div>
    </div>
  );
}
