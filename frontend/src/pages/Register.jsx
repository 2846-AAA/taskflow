import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API, { setAuth } from '../api'

const DEPTS = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations', 'Design', 'General']

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}</label>
    {children}
  </div>
)

const inputSt = {
  width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 14,
  background: 'white', border: '1px solid var(--card-border)',
  color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter,sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s'
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', department: 'Engineering' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const f = (e) => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }
  const b = (e) => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }

  const register = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) { setError('Please fill all fields'); return }
    setLoading(true); setError('')
    try {
      const res = await API.post('/auth/register', { ...form, email: form.email.trim().toLowerCase(), name: form.name.trim() })
      setAuth(res.data)
      nav(res.data.role === 'admin' ? '/admin' : '/employee')
    } catch (e) {
      setError(e.response?.data?.detail || 'Registration failed. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
      <div className="fade-up" style={{ width: '100%', maxWidth: 460, background: 'white', borderRadius: 16, padding: '36px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--card-border)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>TaskFlow</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Create your account</div>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--red-light)', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: 'var(--red)', fontSize: 13 }}>
            ⚠ {error}
          </div>
        )}

        <Field label="Full Name">
          <input value={form.name} placeholder="Anuja Dhamdhere" onChange={e => setForm({ ...form, name: e.target.value })} style={inputSt} onFocus={f} onBlur={b} />
        </Field>
        <Field label="Email Address">
          <input type="email" value={form.email} placeholder="you@company.com" onChange={e => setForm({ ...form, email: e.target.value })} style={inputSt} onFocus={f} onBlur={b} />
        </Field>
        <Field label="Password">
          <input type="password" value={form.password} placeholder="Min. 6 characters" onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && register()} style={inputSt} onFocus={f} onBlur={b} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ ...inputSt, cursor: 'pointer', appearance: 'auto' }} onFocus={f} onBlur={b}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Department</label>
            <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ ...inputSt, cursor: 'pointer', appearance: 'auto' }} onFocus={f} onBlur={b}>
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button onClick={register} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 600, background: loading ? '#93c5fd' : 'var(--blue)', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--blue-dark)' }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--blue)' }}>
          {loading ? <><span className="spinner" />Creating account...</> : 'Create Account →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
