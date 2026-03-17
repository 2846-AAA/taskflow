import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem('tf_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const setAuth = (data) => {
  localStorage.setItem('tf_token', data.token)
  localStorage.setItem('tf_name', data.name)
  localStorage.setItem('tf_role', data.role)
  localStorage.setItem('tf_dept', data.department || 'General')
}

export const clearAuth = () => {
  ['tf_token','tf_name','tf_role','tf_dept'].forEach(k => localStorage.removeItem(k))
}

export const getAuth = () => ({
  token: localStorage.getItem('tf_token'),
  name: localStorage.getItem('tf_name') || 'User',
  role: localStorage.getItem('tf_role'),
  dept: localStorage.getItem('tf_dept') || 'General',
})

export default API
