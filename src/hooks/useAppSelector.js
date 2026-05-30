import { useSelector, useDispatch } from 'react-redux'

export function useAuth() {
  return useSelector((state) => state.auth)
}

export function useResume() {
  return useSelector((state) => state.resume)
}

export function useJobs() {
  return useSelector((state) => state.jobs)
}

export function useAppDispatch() {
  return useDispatch()
}