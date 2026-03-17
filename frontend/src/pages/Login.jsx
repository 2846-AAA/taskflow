import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API, { setAuth } from '../api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const login = async () => {
    if (!form.email.trim() || !form.password.trim()) { setError('Please fill all fields'); return }
    setLoading(true); setError('')
    try {
      const res = await API.post('/auth/login', { email: form.email.trim().toLowerCase(), password: form.password })
      setAuth(res.data)
      nav(res.data.role === 'admin' ? '/admin' : '/employee')
    } catch (e) {
      setError(e.response?.data?.detail || 'Login failed. Check your credentials.')
    }
    setLoading(false)
  }

  const fill = (role) => {
    if (role === 'admin') setForm({ email: 'admin@taskflow.com', password: 'Admin@123' })
    else setForm({ email: 'emp@taskflow.com', password: 'Emp@123' })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* LEFT — dark brand panel */}
      <div style={{
        width: 480, background: 'var(--sidebar-bg)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 48px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', top: -100, left: -100, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bottom: -50, right: -50, background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="fade-up">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚡</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>TaskFlow</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, marginBottom: 14, letterSpacing: '-1px' }}>
            Manage tasks &<br />leaves smarter.
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 48 }}>
            A full-stack enterprise portal for teams — assign tasks, track progress, and manage leave requests in one place.
          </p>

          {/* Features */}
          {[
            { icon: '✅', label: 'Assign & track tasks in real-time' },
            { icon: '📋', label: 'Leave request approval workflow' },
            { icon: '📊', label: 'Analytics dashboard for admins' },
            { icon: '🔐', label: 'JWT + Role-Based Access Control' },
          ].map((f, i) => (
            <div key={i} className={`fade-up-${i + 1}`} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{f.icon}</span>
              <span style={{ color: '#94a3b8', fontSize: 14 }}>{f.label}</span>
            </div>
          ))}

          {/* Tech stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40 }}>
            {['FastAPI', 'React.js', 'MongoDB', 'JWT', 'PyMongo', 'RBAC'].map(t => (
              <span key={t} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.15)', fontFamily: 'monospace' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 32 }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: 420 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.5px' }}>Welcome back 👋</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Sign in to your workspace</p>

          {/* Demo buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {[{ label: '⚡ Admin Demo', role: 'admin', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
              { label: '👤 Employee Demo', role: 'emp', bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' }].map(b => (
              <button key={b.role} onClick={() => fill(b.role)} style={{ flex: 1, padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: b.bg, color: b.color, border: `1px solid ${b.border}`, cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                {b.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or sign in manually</span>
            <div style={{ flex: 1, height: 1, background: 'var(--card-border)' }} />
          </div>

          {error && (
            <div style={{ background: 'var(--red-light)', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: 'var(--red)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>Email Address</label>
            <input type="email" value={form.email} placeholder="you@company.com"
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && login()}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 14, background: 'white', border: '1px solid var(--card-border)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter,sans-serif', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>Password</label>
            <input type={show ? 'text' : 'password'} value={form.password} placeholder="••••••••"
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && login()}
              style={{ width: '100%', padding: '11px 42px 11px 14px', borderRadius: 8, fontSize: 14, background: 'white', border: '1px solid var(--card-border)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter,sans-serif', transition: 'border-color 0.2s, box-shadow 0.2s' }}
              onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }} />
            <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>{show ? '🙈' : '👁'}</button>
          </div>

          <button onClick={login} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 600, background: loading ? '#93c5fd' : 'var(--blue)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', boxShadow: '0 1px 3px rgba(59,130,246,0.4)' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--blue-dark)' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--blue)' }}>
            {loading ? <><span className="spinner" />Signing in...</> : 'Sign In →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
