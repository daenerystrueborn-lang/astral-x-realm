// src/components/AuthModal.tsx  — replace your existing file with this
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { forgotPassword } from '@/lib/api'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function PwdField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input type={show ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 38px 10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }} />
        <button type="button" onClick={() => setShow(s => !s)}
          style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0, display: 'flex' }}>
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  )
}

function TextField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      <input type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }} />
    </div>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  if (!msg) return null
  return <p style={{ color: '#ff6b6b', fontSize: '0.78rem', margin: 0, padding: '8px 12px', background: 'rgba(255,107,107,0.08)', borderRadius: 8, border: '0.5px solid rgba(255,107,107,0.2)' }}>{msg}</p>
}

function SuccessMsg({ msg }: { msg: string }) {
  if (!msg) return null
  return <p style={{ color: '#6bffb8', fontSize: '0.78rem', margin: 0, padding: '8px 12px', background: 'rgba(107,255,184,0.08)', borderRadius: 8, border: '0.5px solid rgba(107,255,184,0.2)' }}>{msg}</p>
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading}
      style={{ background: loading ? 'rgba(255,255,255,0.5)' : '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '11px', fontSize: '0.88rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'opacity 0.15s' }}>
      {loading ? 'Please wait...' : label}
    </button>
  )
}

// ─── LOGIN FORM ───────────────────────────────────────────────────────────────
function LoginForm({ onForgot }: { onForgot: () => void }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password.trim()) { setError('Fill in both fields.'); return }
    setError(''); setLoading(true)
    try {
      await login(username.trim(), password)
    } catch (err: any) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={{ marginBottom: 2 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: 3 }}>Welcome back</h2>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>Log in with your portal username and password</p>
      </div>
      <TextField label="Username" placeholder="WarriorKing99" value={username} onChange={setUsername} />
      <PwdField label="Password" placeholder="Your password" value={password} onChange={setPassword} />
      <button type="button" onClick={onForgot}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.73rem', cursor: 'pointer', textAlign: 'right', fontFamily: 'Outfit, sans-serif', padding: 0, marginTop: -4 }}>
        Forgot password?
      </button>
      <ErrorMsg msg={error} />
      <SubmitBtn loading={loading} label="Log in" />
      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: 0 }}>
        Don't have a username? Type <strong style={{ color: 'rgba(255,255,255,0.45)' }}>!register</strong> in WhatsApp
      </p>
    </form>
  )
}

// ─── FORGOT PASSWORD FORM ─────────────────────────────────────────────────────
function ForgotForm({ onBack }: { onBack: () => void }) {
  const [username, setUsername]   = useState('')
  const [code, setCode]           = useState('')
  const [newPass, setNewPass]     = useState('')
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !code || !newPass) { setError('Fill in all fields.'); return }
    if (newPass.length < 6) { setError('Password must be at least 6 characters.'); return }
    setError(''); setLoading(true)
    try {
      await forgotPassword(username.trim(), code.trim(), newPass)
      setSuccess('Password updated! You can now log in.')
    } catch (err: any) {
      setError(err.message || 'Reset failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={{ marginBottom: 2 }}>
        <button type="button" onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', padding: 0, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Back to login
        </button>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: 3 }}>Reset Password</h2>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
          Type <strong style={{ color: 'rgba(255,255,255,0.6)' }}>!resetportal</strong> in WhatsApp first to get your 6-digit code
        </p>
      </div>
      <TextField label="Username" placeholder="WarriorKing99" value={username} onChange={setUsername} />
      <TextField label="Reset Code (from WhatsApp)" placeholder="123456" value={code} onChange={setCode} />
      <PwdField label="New Password" placeholder="At least 6 characters" value={newPass} onChange={setNewPass} />
      <ErrorMsg msg={error} />
      <SuccessMsg msg={success} />
      {!success && <SubmitBtn loading={loading} label="Reset Password" />}
      {success && (
        <button type="button" onClick={onBack}
          style={{ background: '#fff', color: '#000', border: 'none', borderRadius: 12, padding: '11px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          Go to Login
        </button>
      )}
    </form>
  )
}

// ─── SIGNUP INFO (no real signup — players register in WhatsApp) ───────────────
function SignupInfo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: 3 }}>Join the Realm</h2>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>Accounts are created in WhatsApp</p>
      </div>
      {[
        { n: '1', text: 'Open WhatsApp and message the bot' },
        { n: '2', text: 'Type !register and follow the steps' },
        { n: '3', text: 'Choose a username and password when prompted' },
        { n: '4', text: 'Come back here and log in!' },
      ].map(step => (
        <div key={step.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {step.n}
          </div>
          <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.65)', margin: 0, paddingTop: 2 }}>{step.text}</p>
        </div>
      ))}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 14px', marginTop: 4 }}>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          Already registered? Switch to the <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Log in</strong> tab.
        </p>
      </div>
    </div>
  )
}

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────
export default function AuthModal() {
  const { modal, openLogin, openSignup, closeModal } = useAuth()
  const [tab, setTab]       = useState<'login' | 'signup'>('login')
  const [forgot, setForgot] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [show, setShow]     = useState(false)

  useEffect(() => {
    if (modal) {
      setTab(modal); setForgot(false); setMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    } else {
      setShow(false)
      const t = setTimeout(() => setMounted(false), 280)
      return () => clearTimeout(t)
    }
  }, [modal])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [closeModal])

  if (!mounted) return null

  return (
    <div onClick={e => { if (e.target === e.currentTarget) closeModal() }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        background: show ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0)', backdropFilter: show ? 'blur(10px)' : 'blur(0px)',
        transition: 'background 0.28s ease, backdrop-filter 0.28s ease' }}>
      <div style={{ background: '#080808', border: '0.5px solid rgba(255,255,255,0.13)', borderRadius: 24, width: '100%', maxWidth: 400,
        padding: '28px 28px 24px', boxShadow: '0 32px 96px rgba(0,0,0,0.85)',
        opacity: show ? 1 : 0, transform: show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: 'opacity 0.28s ease, transform 0.36s cubic-bezier(0.22, 1, 0.36, 1)', position: 'relative' }}>

        {/* Close button */}
        <button onClick={closeModal} style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="13" y1="1" x2="1" y2="13" /><line x1="1" y1="1" x2="13" y2="13" />
          </svg>
        </button>

        {/* Tab switcher — only show when not in forgot flow */}
        {!forgot && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 3, display: 'flex', marginBottom: 24 }}>
            {(['login', 'signup'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); t === 'login' ? openLogin() : openSignup() }}
                style={{ flex: 1, borderRadius: 9, padding: '8px 0', background: tab === t ? '#fff' : 'transparent',
                  color: tab === t ? '#000' : 'rgba(255,255,255,0.4)', border: 'none', fontSize: '0.82rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.22s' }}>
                {t === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>
        )}

        {forgot
          ? <ForgotForm onBack={() => setForgot(false)} />
          : tab === 'login'
            ? <LoginForm onForgot={() => setForgot(true)} />
            : <SignupInfo />
        }
      </div>
    </div>
  )
}
