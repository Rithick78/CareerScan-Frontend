import api from './axios'

export async function loginUser(email, password) {
  const res = await api.post('/api/auth/login', { email, password })
  return res.data
  // returns: { token, email, name, message }
}

export async function registerUser(name, email, password) {
  const res = await api.post('/api/auth/register', { name, email, password })
  return res.data
  // returns: { message, email }
}