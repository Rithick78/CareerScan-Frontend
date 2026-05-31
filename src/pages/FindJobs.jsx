import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchMatchedJobs } from '../features/jobs/jobsSlice'
import { useJobs } from '../hooks/useAppSelector'
import { toast } from 'sonner'
import Spinner from '../components/Spinner'
import JobCard from '../components/JobCard'
import { Briefcase } from 'lucide-react'

function FindJobs() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { matchedJobs, matchSummary, totalFound, isLoading, error } = useJobs()

  useEffect(() => {
    dispatch(fetchMatchedJobs())
  }, [dispatch])

  useEffect(() => {
    if (error?.status === 404) {
      toast.error('Please upload your resume first')
      navigate('/dashboard')
    } else if (error?.message) {
      toast.error(error.message)
    }
  }, [error])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400">Finding jobs that match your skills...</p>
      </div>
    )
  }

  if (matchedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <Briefcase size={40} className="text-gray-300" />
        <p className="text-gray-500 font-medium">No jobs found</p>
        <p className="text-sm text-gray-400">Try uploading an updated resume</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Matching Jobs{' '}
          <span className="text-base font-normal text-gray-400">({totalFound} found)</span>
        </h2>
        {matchSummary && <p className="text-sm text-gray-500 mt-1">{matchSummary}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchedJobs.map((job) => (
          <JobCard key={job.jobId} job={job} showSave={true} />
        ))}
      </div>
    </div>
  )
}

export default FindJobs