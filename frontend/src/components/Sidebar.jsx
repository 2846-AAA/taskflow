import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuth, getAuth } from '../api'

const ADMIN_NAV = [
  { key: 'dashboard', icon: '▦', label: 'Dashboard' },
  { key: 'tasks', icon: '✦', label: 'Tasks' },
  { key: 'leaves', icon: '◈', label: 'Leave Requests' },
  { key: 'employees', icon: '◉', label: 'Employees' },
]
const EMP_NAV = [
  { key: 'dashboard', icon: '▦', label: 'My Dashboard' },
  { key: 'tasks', icon: '✦', label: 'My Tasks' },
  { key: 'leaves', icon: '◈', label: 'My Leaves' },
]

export default function Sidebar({ role, tab, setTab }) {
  const [collapsed, setCollapsed] = useState(false)
  const nav = useNavigate()
  const { name, dept } = getAuth()
  const links = role === 'admin' ? ADMIN_NAV : EMP_NAV
  const w = collapsed ? 68 : 240

  const logout = () => { clearAuth(); nav('/login') }

  return (
    <aside style={{
      width: w, minHeight: '100vh', background: 'var(--sidebar-bg)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      position: 'sticky', top: 0, transition: 'width 0.28s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden', borderRight: '1px solid var(--sidebar-border)', zIndex: 40
    }}>
      {/* Logo row */}
      <div style={{ padding: collapsed ? '18px 0' : '18px 16px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid var(--sidebar-border)', minHeight: 64 }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>⚡</div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>TaskFlow</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 18, padding: '4px', display: 'flex', flexShrink: 0 }}
          title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? '»' : '«'}
        </button>
      </div>

      {/* User info */}
      <div style={{ padding: collapsed ? '14px 0' : '14px 14px', borderBottom: '1px solid var(--sidebar-border)' }}>
        {collapsed ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white' }}>{name[0]?.toUpperCase()}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 10px' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white', flexShrink: 0 }}>{name[0]?.toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
              <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dept}</div>
            </div>
            <span style={{ flexShrink: 0, padding: '2px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700, background: role === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)', color: role === 'admin' ? '#fbbf24' : '#34d399', textTransform: 'uppercase', letterSpacing: 0.5 }}>{role}</span>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {links.map(link => {
          const active = tab === link.key
          return (
            <button key={link.key} onClick={() => setTab(link.key)} title={collapsed ? link.label : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 11,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '11px' : '10px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? 'var(--sidebar-active)' : 'transparent',
                color: active ? '#93c5fd' : 'var(--sidebar-text)',
                fontFamily: 'Inter,sans-serif', fontSize: 13.5, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s', width: '100%', textAlign: 'left',
                borderLeft: active ? '2px solid #3b82f6' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--sidebar-hover)'; e.currentTarget.style.color = '#e2e8f0' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)' } }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{link.icon}</span>
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid var(--sidebar-border)' }}>
        <button onClick={logout} title={collapsed ? 'Logout' : ''}
          style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 11, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '11px' : '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#64748b', fontFamily: 'Inter,sans-serif', fontSize: 13.5, width: '100%', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}>
          <span style={{ fontSize: 15 }}>⏏</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
