import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [mode,     setMode]     = useState<'login' | 'forgot'>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [info,     setInfo]     = useState('')
  const [busy,     setBusy]     = useState(false)
  const from = (location.state as any)?.from?.pathname

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setBusy(true)
    const { error: err } = await signIn(email, password)
    setBusy(false)
    if (err) { setError('Invalid email or password.'); return }
    setTimeout(() => navigate(from && from !== '/login' ? from : '/auth-redirect', { replace: true }), 100)
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setBusy(true)
    const { error: err } = await resetPassword(email)
    setBusy(false)
    if (err) { setError(err); return }
    setInfo('Password reset email sent! Check your inbox.')
  }

  const s: Record<string, React.CSSProperties> = {
    page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0a1a0e,#0d2211)', fontFamily:"'Segoe UI',sans-serif", padding:'1rem' },
    card:  { background:'#0f2214', border:'1px solid #1e3a22', borderRadius:12, padding:'2.5rem 2rem', width:'100%', maxWidth:420 },
    label: { color:'#8aad8e', fontSize:'0.82rem', fontWeight:500, display:'block', marginBottom:4 },
    input: { background:'#071510', border:'1px solid #1e3a22', borderRadius:8, color:'#e8d5a3', padding:'0.65rem 0.85rem', fontSize:'0.95rem', outline:'none', width:'100%', marginBottom:'0.75rem', boxSizing:'border-box' },
    btn:   { background:'linear-gradient(135deg,#b08d57,#8a6d40)', color:'#fff', border:'none', borderRadius:8, padding:'0.75rem', fontSize:'0.95rem', fontWeight:600, cursor:'pointer', width:'100%', marginTop:'0.5rem' },
    link:  { background:'none', border:'none', color:'#b08d57', cursor:'pointer', fontSize:'0.85rem', textAlign:'center', textDecoration:'underline', padding:'0.5rem', width:'100%', display:'block', marginTop:'0.5rem' },
    error: { background:'#3d1515', border:'1px solid #7a2020', color:'#f87171', borderRadius:7, padding:'0.6rem 0.85rem', fontSize:'0.85rem', marginBottom:'0.75rem' },
    info:  { background:'#0f2d1a', border:'1px solid #1e5c30', color:'#4ade80', borderRadius:7, padding:'0.6rem 0.85rem', fontSize:'0.85rem', marginBottom:'0.75rem' },
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.75rem' }}>
          <span style={{ fontSize:'2rem', color:'#b08d57' }}>☪</span>
          <div>
            <div style={{ color:'#e8d5a3', fontWeight:700, fontSize:'1.1rem' }}>The Muslim Company</div>
            <div style={{ color:'#8aad8e', fontSize:'0.75rem', letterSpacing:'0.08em', textTransform:'uppercase' }}>Staff Portal</div>
          </div>
        </div>
        <h2 style={{ color:'#e8d5a3', fontSize:'1.4rem', fontWeight:600, marginBottom:'1.25rem' }}>
          {mode === 'login' ? 'Sign In' : 'Reset Password'}
        </h2>
        {error && <div style={s.error}>{error}</div>}
        {info  && <div style={s.info}>{info}</div>}
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <label style={s.label}>Email Address</label>
            <input type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} style={s.input} placeholder="you@themuslim.company" />
            <label style={s.label}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={s.input} placeholder="••••••••" />
            <button type="submit" disabled={busy} style={{ ...s.btn, opacity: busy ? 0.7 : 1 }}>{busy ? 'Signing in…' : 'Sign In'}</button>
            <button type="button" style={s.link} onClick={() => { setMode('forgot'); setError(''); setInfo('') }}>Forgot password?</button>
          </form>
        ) : (
          <form onSubmit={handleForgot}>
            <label style={s.label}>Email Address</label>
            <input type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} style={s.input} placeholder="you@themuslim.company" />
            <button type="submit" disabled={busy} style={{ ...s.btn, opacity: busy ? 0.7 : 1 }}>{busy ? 'Sending…' : 'Send Reset Link'}</button>
            <button type="button" style={s.link} onClick={() => { setMode('login'); setError(''); setInfo('') }}>← Back to Sign In</button>
          </form>
        )}
        <p style={{ color:'#4a7a50', fontSize:'0.75rem', textAlign:'center', marginTop:'1.25rem' }}>Admin & Employee — role detected automatically</p>
      </div>
    </div>
  )
}
