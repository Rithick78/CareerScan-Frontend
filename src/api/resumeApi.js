import api from './axios'

export async function uploadResumeApi(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
  // returns: { message, fileName, fileSizeKb, parsedData }
}

export async function getParsedResumeApi() {
  const res = await api.get('/api/resume/parsed')
  return res.data
  // returns: { id, detectedRole, skills[], experience, city, summary }
}