// Reusable UI primitives

export const Badge = ({ label, type = 'blue' }) => {
  const map = {
    pending:     { bg: 'var(--yellow-light)', color: '#92400e', border: '#fde68a' },
    in_progress: { bg: 'var(--blue-light)',   color: '#1e40af', border: '#bfdbfe' },
    completed:   { bg: 'var(--green-light)',  color: '#065f46', border: '#a7f3d0' },
    approved:    { bg: 'var(--green-light)',  color: '#065f46', border: '#a7f3d0' },
    rejected:    { bg: 'var(--red-light)',    color: '#991b1b', border: '#fecaca' },
    high:        { bg: 'var(--red-light)',    color: '#991b1b', border: '#fecaca' },
    medium:      { bg: 'var(--yellow-light)', color: '#92400e', border: '#fde68a' },
    low:         { bg: 'var(--green-light)',  color: '#065f46', border: '#a7f3d0' },
    admin:       { bg: 'var(--yellow-light)', color: '#92400e', border: '#fde68a' },
    employee:    { bg: 'var(--blue-light)',   color: '#1e40af', border: '#bfdbfe' },
    sick:        { bg: 'var(--red-light)',    color: '#991b1b', border: '#fecaca' },
    casual:      { bg: 'var(--blue-light)',   color: '#1e40af', border: '#bfdbfe' },
    earned:      { bg: 'var(--purple-light)', color: '#5b21b6', border: '#ddd6fe' },
  }
  const s = map[label] || map[type] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}`, textTransform: 'capitalize', whiteSpace: 'nowrap', display: 'inline-block' }}>
      {label?.replace('_', ' ')}
    </span>
  )
}

export const Card = ({ children, style = {} }) => (
  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', boxShadow: 'var(--card-shadow)', ...style }}>
    {children}
  </div>
)

export const StatCard = ({ label, value, icon, color, bg, delay = '' }) => (
  <div className={`fade-up${delay}`} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', gap: 16 }}>
    <div style={{ width: 50, height: 50, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  </div>
)

export const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(3px)', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="slide-in" style={{ width: '100%', maxWidth: 500, background: 'white', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)', padding: 4 }}>✕</button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
        {footer && <div style={{ padding: '14px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  )
}

export const Btn = ({ children, onClick, variant = 'primary', disabled = false, style = {} }) => {
  const variants = {
    primary: { background: 'var(--blue)', color: 'white', border: 'none' },
    secondary: { background: 'white', color: 'var(--text-primary)', border: '1px solid var(--card-border)' },
    danger: { background: 'var(--red-light)', color: 'var(--red)', border: '1px solid #fecaca' },
    success: { background: 'var(--green-light)', color: '#065f46', border: '1px solid #a7f3d0' },
  }
  const v = variants[variant]
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'opacity 0.15s', opacity: disabled ? 0.6 : 1, ...v, ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.85' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = '1' }}>
      {children}
    </button>
  )
}

export const Input = ({ label, type = 'text', value, onChange, placeholder = '', onKeyDown, style = {} }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}</label>}
    <input type={type} value={value} placeholder={placeholder} onChange={onChange} onKeyDown={onKeyDown}
      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'white', border: '1px solid var(--card-border)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter,sans-serif', transition: 'border-color 0.2s, box-shadow 0.2s', ...style }}
      onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
      onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }} />
  </div>
)

export const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}</label>}
    <select value={value} onChange={onChange}
      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'white', border: '1px solid var(--card-border)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter,sans-serif', cursor: 'pointer', transition: 'border-color 0.2s', ...style }}
      onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
      onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

export const Toast = ({ toast }) => {
  if (!toast) return null
  const s = toast.type === 'error'
    ? { bg: 'var(--red-light)', color: 'var(--red)', border: '#fecaca', icon: '⚠' }
    : { bg: 'var(--green-light)', color: '#065f46', border: '#a7f3d0', icon: '✓' }
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 18px', borderRadius: 10, fontWeight: 600, fontSize: 13, background: s.bg, color: s.color, border: `1px solid ${s.border}`, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', animation: 'fadeUp 0.3s ease', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 320 }}>
      <span>{s.icon}</span> {toast.msg}
    </div>
  )
}

export const THead = ({ cols }) => (
  <thead>
    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--card-border)' }}>
      {cols.map(c => <th key={c} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.7, whiteSpace: 'nowrap' }}>{c}</th>)}
    </tr>
  </thead>
)

export const EmptyRow = ({ cols, msg }) => (
  <tr><td colSpan={cols} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>{msg}</td></tr>
)
