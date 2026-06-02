import api from './axios'

export async function getMatchedJobsApi() {
  const res = await api.get('/api/jobs')
  return res.data
}

export async function saveJobApi(job) {
  const res = await api.post(`/api/jobs/save/${job.jobId}`, job)
  return res.data
}

export async function getSavedJobsApi() {
  const res = await api.get('/api/jobs/saved')
  return res.data
}

export async function deleteSavedJobApi(jobId) {
  const res = await api.delete(`/api/jobs/saved/${jobId}`)
  return res.data
}