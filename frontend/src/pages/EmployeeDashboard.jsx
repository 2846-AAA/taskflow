import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { Badge, StatCard, Modal, Btn, Input, Select, Toast, THead, EmptyRow, Card } from '../components/UI'
import API, { getAuth } from '../api'

const LEAVE_TYPES = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'earned', label: 'Earned Leave' },
]
const STATUS_OPTS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]
const BLANK_LEAVE = { leave_type: 'sick', from_date: '', to_date: '', reason: '', days: 1 }

export default function EmployeeDashboard() {
  const [tab, setTab] = useState('dashboard')
  const [tasks, setTasks] = useState([])
  const [leaves, setLeaves] = useState([])
  const [modal, setModal] = useState(false)
  const [leaveForm, setLeaveForm] = useState(BLANK_LEAVE)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const nav = useNavigate()
  const { name } = getAuth()

  const notify = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    try {
      const [t, l] = await Promise.all([API.get('/tasks/'), API.get('/leaves/')])
      setTasks(t.data); setLeaves(l.data)
    } catch { nav('/login') }
  }, [nav])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    try { await API.patch(`/tasks/${id}`, { status }); notify('Status updated!'); load() }
    catch { notify('Update failed', 'error') }
  }

  const applyLeave = async () => {
    if (!leaveForm.from_date || !leaveForm.to_date || !leaveForm.reason.trim()) { notify('Please fill all fields', 'error'); return }
    const days = Math.max(1, Math.ceil((new Date(leaveForm.to_date) - new Date(leaveForm.from_date)) / 86400000) + 1)
    setSaving(true)
    try {
      await API.post('/leaves/', { ...leaveForm, days })
      notify('Leave application submitted!')
      setModal(false); setLeaveForm(BLANK_LEAVE); load()
    } catch { notify('Failed to submit', 'error') }
    setSaving(false)
  }

  const completed = tasks.filter(t => t.status === 'completed').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const pending = tasks.filter(t => t.status === 'pending').length
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length
  const pct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--content-bg)' }}>
      <Sidebar role="employee" tab={tab} setTab={setTab} />
      <Toast toast={toast} />

      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
            {tab === 'dashboard' && '▦ My Dashboard'}
            {tab === 'tasks' && '✦ My Tasks'}
            {tab === 'leaves' && '◈ My Leaves'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Welcome back, {name} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
              <StatCard label="Total Tasks" value={tasks.length} icon="📋" color="var(--blue)" bg="var(--blue-light)" delay="-1" />
              <StatCard label="Completed" value={completed} icon="✅" color="var(--green)" bg="var(--green-light)" delay="-2" />
              <StatCard label="In Progress" value={inProgress} icon="⏳" color="var(--yellow)" bg="var(--yellow-light)" delay="-3" />
              <StatCard label="Leaves Approved" value={approvedLeaves} icon="🏖" color="var(--purple)" bg="var(--purple-light)" delay="-4" />
            </div>

            {/* Progress */}
            <Card style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>My Task Progress</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--green)' }}>{pct}%</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: 10, transition: 'width 1.2s ease' }} />
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[{ l: 'Pending', v: pending, c: '#f59e0b' }, { l: 'In Progress', v: inProgress, c: '#3b82f6' }, { l: 'Completed', v: completed, c: '#10b981' }].map(s => (
                  <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.c }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.l}: <b style={{ color: 'var(--text-primary)' }}>{s.v}</b></span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent tasks */}
            <Card>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Recent Tasks</div>
              {tasks.slice(0, 6).map(t => (
                <div key={t._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Due: {t.due_date || 'No due date'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Badge label={t.priority} />
                    <Badge label={t.status} />
                  </div>
                </div>
              ))}
              {tasks.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No tasks assigned yet.</p>}
            </Card>
          </div>
        )}

        {/* ── TASKS ── */}
        {tab === 'tasks' && (
          <div className="fade-up">
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <THead cols={['Task', 'Priority', 'Due Date', 'Current Status', 'Update Status']} />
                <tbody>
                  {tasks.map(t => (
                    <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                        {t.description && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t.description.substring(0, 50)}</div>}
                      </td>
                      <td style={{ padding: '14px 16px' }}><Badge label={t.priority} /></td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{t.due_date || '—'}</td>
                      <td style={{ padding: '14px 16px' }}><Badge label={t.status} /></td>
                      <td style={{ padding: '14px 16px' }}>
                        <select value={t.status} onChange={e => updateStatus(t._id, e.target.value)}
                          style={{ padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: 'white', border: '1px solid var(--card-border)', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none', fontFamily: 'Inter,sans-serif' }}>
                          {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && <EmptyRow cols={5} msg="No tasks assigned to you yet." />}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── LEAVES ── */}
        {tab === 'leaves' && (
          <div className="fade-up">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Btn onClick={() => setModal(true)}>+ Apply for Leave</Btn>
            </div>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <THead cols={['Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Remarks']} />
                <tbody>
                  {leaves.map(l => (
                    <tr key={l._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '14px 16px' }}><Badge label={l.leave_type} /></td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{l.from_date}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{l.to_date}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 13 }}>{l.days}d</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)', maxWidth: 180 }}>{l.reason}</td>
                      <td style={{ padding: '14px 16px' }}><Badge label={l.status} /></td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{l.remarks || '—'}</td>
                    </tr>
                  ))}
                  {leaves.length === 0 && <EmptyRow cols={7} msg="No leave applications yet." />}
                </tbody>
              </table>
            </Card>

            <Modal open={modal} onClose={() => { setModal(false); setLeaveForm(BLANK_LEAVE) }} title="Apply for Leave"
              footer={<><Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn><Btn onClick={applyLeave} disabled={saving}>{saving ? <><span className="spinner spinner-dark" />Submitting...</> : 'Submit Application'}</Btn></>}>
              <Select label="Leave Type" value={leaveForm.leave_type} onChange={e => setLeaveForm({ ...leaveForm, leave_type: e.target.value })} options={LEAVE_TYPES} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label="From Date" type="date" value={leaveForm.from_date} onChange={e => setLeaveForm({ ...leaveForm, from_date: e.target.value })} />
                <Input label="To Date" type="date" value={leaveForm.to_date} onChange={e => setLeaveForm({ ...leaveForm, to_date: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Reason</label>
                <textarea value={leaveForm.reason} placeholder="Brief reason for leave..." onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'white', border: '1px solid var(--card-border)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter,sans-serif', resize: 'vertical' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }} />
              </div>
            </Modal>
          </div>
        )}
      </main>
    </div>
  )
}
