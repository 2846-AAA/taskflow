import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import Sidebar from '../components/Sidebar'
import { Badge, StatCard, Modal, Btn, Input, Select, Toast, THead, EmptyRow, Card } from '../components/UI'
import API, { getAuth } from '../api'

const DEPTS = ['Engineering','Finance','HR','Marketing','Operations','Design','General'].map(d => ({ value: d, label: d }))
const PRIORITIES = [{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]

const BLANK_TASK = { title: '', description: '', assigned_to: '', priority: 'medium', due_date: '', department: 'Engineering' }

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [tasks, setTasks] = useState([])
  const [leaves, setLeaves] = useState([])
  const [emps, setEmps] = useState([])
  const [modal, setModal] = useState(false)
  const [taskForm, setTaskForm] = useState(BLANK_TASK)
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
      const [s, t, l, e] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/tasks/'),
        API.get('/leaves/'),
        API.get('/admin/employees'),
      ])
      setStats(s.data); setTasks(t.data); setLeaves(l.data); setEmps(e.data)
    } catch { nav('/login') }
  }, [nav])

  useEffect(() => { load() }, [load])

  const createTask = async () => {
    if (!taskForm.title.trim() || !taskForm.assigned_to) { notify('Please fill title and assignee', 'error'); return }
    setSaving(true)
    try {
      const emp = emps.find(e => e._id === taskForm.assigned_to)
      await API.post('/tasks/', { ...taskForm, assigned_name: emp?.name || '' })
      notify('Task assigned successfully!')
      setModal(false); setTaskForm(BLANK_TASK); load()
    } catch { notify('Failed to create task', 'error') }
    setSaving(false)
  }

  const deleteTask = async (id) => {
    try { await API.delete(`/tasks/${id}`); notify('Task deleted'); load() }
    catch { notify('Delete failed', 'error') }
  }

  const actionLeave = async (id, status) => {
    try { await API.patch(`/leaves/${id}`, { status, remarks: `${status} by admin` }); notify(`Leave ${status}`); load() }
    catch { notify('Action failed', 'error') }
  }

  const pieData = [
    { name: 'Pending', value: stats.pending_tasks || 0 },
    { name: 'In Progress', value: stats.inprogress_tasks || 0 },
    { name: 'Completed', value: stats.completed_tasks || 0 },
  ]
  const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981']

  const empOptions = [{ value: '', label: 'Select employee...' }, ...emps.map(e => ({ value: e._id, label: `${e.name} — ${e.department}` }))]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--content-bg)' }}>
      <Sidebar role="admin" tab={tab} setTab={setTab} />
      <Toast toast={toast} />

      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto' }}>
        {/* Page header */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
            {tab === 'dashboard' && '📊 Dashboard'}
            {tab === 'tasks' && '✦ Task Management'}
            {tab === 'leaves' && '◈ Leave Requests'}
            {tab === 'employees' && '◉ Employees'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Welcome back, {name} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
              <StatCard label="Total Employees" value={stats.total_employees || 0} icon="👥" color="var(--blue)" bg="var(--blue-light)" delay="-1" />
              <StatCard label="Total Tasks" value={stats.total_tasks || 0} icon="📋" color="#7c3aed" bg="var(--purple-light)" delay="-2" />
              <StatCard label="Pending Leaves" value={stats.pending_leaves || 0} icon="🕐" color="var(--yellow)" bg="var(--yellow-light)" delay="-3" />
              <StatCard label="Completion Rate" value={`${stats.completion_rate || 0}%`} icon="✅" color="var(--green)" bg="var(--green-light)" delay="-4" />
            </div>

            {/* Progress bar */}
            <Card style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Overall Task Progress</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--green)' }}>{stats.completion_rate || 0}%</span>
              </div>
              <div style={{ height: 8, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ height: '100%', width: `${stats.completion_rate || 0}%`, background: 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: 10, transition: 'width 1.2s ease' }} />
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[{ l: 'Pending', v: stats.pending_tasks || 0, c: '#f59e0b' }, { l: 'In Progress', v: stats.inprogress_tasks || 0, c: '#3b82f6' }, { l: 'Completed', v: stats.completed_tasks || 0, c: '#10b981' }].map(s => (
                  <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.c }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.l}: <b style={{ color: 'var(--text-primary)' }}>{s.v}</b></span>
                  </div>
                ))}
              </div>
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
              <Card>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Task Breakdown</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => value > 0 ? `${value}` : ''} labelLine={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--card-border)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {pieData.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i] }} />
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{d.name}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Recent Tasks</div>
                {tasks.slice(0, 6).map(t => (
                  <div key={t._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>→ {t.assigned_name}</div>
                    </div>
                    <Badge label={t.status} />
                  </div>
                ))}
                {tasks.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No tasks yet.</p>}
              </Card>
            </div>
          </div>
        )}

        {/* ── TASKS ── */}
        {tab === 'tasks' && (
          <div className="fade-up">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Btn onClick={() => setModal(true)}>+ Assign Task</Btn>
            </div>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <THead cols={['Task', 'Assigned To', 'Priority', 'Due Date', 'Status', '']} />
                <tbody>
                  {tasks.map(t => (
                    <tr key={t._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                        {t.description && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t.description.substring(0, 45)}{t.description.length > 45 ? '...' : ''}</div>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}>{t.assigned_name?.[0]?.toUpperCase()}</div>
                          <span style={{ fontSize: 13 }}>{t.assigned_name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}><Badge label={t.priority} /></td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{t.due_date || '—'}</td>
                      <td style={{ padding: '14px 16px' }}><Badge label={t.status} /></td>
                      <td style={{ padding: '14px 16px' }}>
                        <Btn variant="danger" onClick={() => deleteTask(t._id)} style={{ padding: '5px 12px', fontSize: 11 }}>Delete</Btn>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && <EmptyRow cols={6} msg="No tasks yet. Click '+ Assign Task' to get started!" />}
                </tbody>
              </table>
            </Card>

            {/* Assign Task Modal */}
            <Modal open={modal} onClose={() => { setModal(false); setTaskForm(BLANK_TASK) }} title="Assign New Task"
              footer={<><Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn><Btn onClick={createTask} disabled={saving}>{saving ? <><span className="spinner spinner-dark" />Saving...</> : 'Assign Task'}</Btn></>}>
              <Input label="Task Title *" value={taskForm.title} placeholder="e.g. Fix payment module" onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Description</label>
                <textarea value={taskForm.description} placeholder="Task details..." onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} rows={2}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 13, background: 'white', border: '1px solid var(--card-border)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter,sans-serif', resize: 'vertical' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; e.target.style.boxShadow = 'none' }} />
              </div>
              <Select label="Assign To *" value={taskForm.assigned_to} onChange={e => setTaskForm({ ...taskForm, assigned_to: e.target.value })} options={empOptions} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Select label="Priority" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} options={PRIORITIES} />
                <Input label="Due Date" type="date" value={taskForm.due_date} onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} />
                <Select label="Department" value={taskForm.department} onChange={e => setTaskForm({ ...taskForm, department: e.target.value })} options={DEPTS} />
              </div>
            </Modal>
          </div>
        )}

        {/* ── LEAVES ── */}
        {tab === 'leaves' && (
          <div className="fade-up">
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <THead cols={['Employee', 'Type', 'Period', 'Days', 'Reason', 'Status', 'Actions']} />
                <tbody>
                  {leaves.map(l => (
                    <tr key={l._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--purple)' }}>{l.employee_name?.[0]?.toUpperCase()}</div>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{l.employee_name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}><Badge label={l.leave_type} /></td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{l.from_date} → {l.to_date}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: 13 }}>{l.days}d</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)', maxWidth: 160 }}>{l.reason}</td>
                      <td style={{ padding: '14px 16px' }}><Badge label={l.status} /></td>
                      <td style={{ padding: '14px 16px' }}>
                        {l.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Btn variant="success" onClick={() => actionLeave(l._id, 'approved')} style={{ padding: '5px 10px', fontSize: 11 }}>✓ Approve</Btn>
                            <Btn variant="danger" onClick={() => actionLeave(l._id, 'rejected')} style={{ padding: '5px 10px', fontSize: 11 }}>✕ Reject</Btn>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {leaves.length === 0 && <EmptyRow cols={7} msg="No leave requests yet." />}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── EMPLOYEES ── */}
        {tab === 'employees' && (
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px,1fr))', gap: 16 }}>
            {emps.map(emp => (
              <Card key={emp._id} style={{ transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--card-shadow)'; e.currentTarget.style.transform = 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, color: 'white' }}>{emp.name?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{emp.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{emp.department}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Badge label={`${emp.task_count} Tasks`} type="blue" />
                  <Badge label={`${emp.completed_tasks} Done`} type="green" />
                  {emp.pending_leaves > 0 && <Badge label={`${emp.pending_leaves} Leave`} type="yellow" />}
                </div>
              </Card>
            ))}
            {emps.length === 0 && (
              <Card style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                No employees yet. Share the register link with your team!
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
