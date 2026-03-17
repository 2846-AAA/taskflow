import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import { getAuth } from './api'

function Guard({ children, role }) {
  const auth = getAuth()
  if (!auth.token) return <Navigate to="/login" replace />
  if (role && auth.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Guard role="admin"><AdminDashboard /></Guard>} />
        <Route path="/employee" element={<Guard role="employee"><EmployeeDashboard /></Guard>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
