import api from './axios'

export async function loginUser(email, password) {
  const res = await api.post('/api/auth/login', { email, password })
  return res.data
}

export async function registerUser(name, email, password) {
  const res = await api.post('/api/auth/register', { name, email, password })
  return res.data
}

export async function guestLogin() {
  const res = await api.post('/api/auth/guest')
  return res.data
}