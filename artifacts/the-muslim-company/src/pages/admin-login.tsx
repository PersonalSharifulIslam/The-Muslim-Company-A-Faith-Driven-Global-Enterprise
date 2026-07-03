import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import logo from "@/assets/images/logo.png";

export default function AdminLogin() {
  useEffect(() => {
    document.title = "The Muslim Company";
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, nofollow');
    return () => {
      const r = document.querySelector('meta[name="robots"]');
      if (r) r.setAttribute('content', 'index, follow');
    };
  }, []);

  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [noAdmin, setNoAdmin] = useState(false);

  useEffect(() => {
  }, [user, loading]);

  useEffect(() => {
    fetch("/api/auth/setup", { method: "HEAD" })
      .then((r) => {
        if (r.status === 405) setNoAdmin(false);
        else setNoAdmin(false);
      })
      .catch(() => setNoAdmin(false))
      .finally(() => setCheckingSetup(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (setupMode) {
      try {
        const data = await api.post("/auth/setup", { email, password }) as { token: string; email: string };
        api.setToken(data.token);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Setup failed");
        setSubmitting(false);
      }
      return;
    }

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError("Invalid email or password. Please try again.");
      setSubmitting(false);
    } else {
    }
  };


  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <img src={logo} alt="TMC" className="w-12 h-12 opacity-80 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-primary-foreground mb-1">
            {setupMode ? "Create Admin Account" : "Admin Access"}
          </h1>
          <p className="font-sans text-xs text-primary-foreground/55 tracking-widest uppercase">The Muslim Company</p>
        </div>

        {noAdmin && !setupMode && (
          <div className="mb-6 p-4 border border-yellow-400/30 bg-yellow-400/5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-xs text-yellow-400 font-semibold mb-1">First Time Setup</p>
                <p className="font-sans text-xs text-primary-foreground/55 leading-relaxed">
                  No admin account found.{" "}
                  <button onClick={() => setSetupMode(true)} className="text-secondary underline">Create one now.</button>
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 block mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 bg-primary-foreground/5 border border-primary-foreground/15 font-sans text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:outline-none focus:border-secondary"
              placeholder="admin@themuslim.company"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-widest uppercase text-primary-foreground/55 block mb-2">Password{setupMode && " (min 8 chars)"}</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                minLength={setupMode ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 pr-12 bg-primary-foreground/5 border border-primary-foreground/15 font-sans text-sm text-primary-foreground placeholder:text-primary-foreground/20 focus:outline-none focus:border-secondary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/55 hover:text-primary-foreground/60"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-400/10 border border-red-400/20">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="font-sans text-xs text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-secondary text-primary hover:bg-secondary/90 rounded-none uppercase tracking-widest font-sans h-11 text-xs font-bold disabled:opacity-40 mt-2"
          >
            <Lock className="w-3.5 h-3.5 mr-2" />
            {submitting ? (setupMode ? "Creating..." : "Signing in...") : (setupMode ? "Create Account" : "Sign In")}
          </Button>
        </form>

        {setupMode && (
          <button onClick={() => setSetupMode(false)} className="w-full text-center font-sans text-xs text-primary-foreground/55 hover:text-secondary mt-4 transition-colors">
            ← Back to Login
          </button>
        )}

        {!setupMode && (
          <p className="text-center font-sans text-xs text-primary-foreground/20 mt-8">
            Restricted access. Authorised personnel only.
          </p>
        )}
        <div className="text-center mt-4">
          <a href="/" className="font-sans text-xs tracking-widest uppercase text-primary-foreground/25 hover:text-secondary transition-colors">
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}
