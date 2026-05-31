import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSavedJobs, deleteJobThunk } from '../features/jobs/jobsSlice'
import { useJobs } from '../hooks/useAppSelector'
import { toast } from 'sonner'
import Spinner from '../components/Spinner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MapPin, Briefcase, ExternalLink, Trash2, Bookmark } from 'lucide-react'

function SavedJobs() {
  const dispatch = useDispatch()
  const { savedJobs, isLoading, error } = useJobs()

  const [deleteJobId, setDeleteJobId] = useState(null)
  const [isDeleting,  setIsDeleting]  = useState(false)

  useEffect(() => {
    dispatch(fetchSavedJobs())
  }, [dispatch])

  useEffect(() => {
    if (error) toast.error(typeof error === 'string' ? error : error.message || 'Something went wrong')
  }, [error])

  async function handleConfirmDelete() {
    setIsDeleting(true)
    const result = await dispatch(deleteJobThunk(deleteJobId))
    if (deleteJobThunk.fulfilled.match(result)) {
      toast.success('Job removed from saved list')
    } else {
      toast.error('Could not delete job.')
    }
    setIsDeleting(false)
    setDeleteJobId(null)
  }

  function getScoreColor(score) {
    if (score >= 75) return 'bg-green-100 text-green-700'
    if (score >= 50) return 'bg-yellow-100 text-yellow-700'
    if (score >= 25) return 'bg-orange-100 text-orange-600'
    return 'bg-red-100 text-red-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!savedJobs || savedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <Bookmark size={40} className="text-gray-300" />
        <p className="text-gray-500 font-medium">No saved jobs yet</p>
        <p className="text-sm text-gray-400">Go to Find Jobs and save the ones you like</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Saved Jobs{' '}
          <span className="text-base font-normal text-gray-400">
            ({savedJobs.length})
          </span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Jobs you saved — apply when you're ready
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedJobs
          // safety filter — skip any undefined or jobs without jobId
          .filter((job) => job && job.jobId)
          .map((job) => (
          <Card key={job.jobId} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5 space-y-3">

              {/* Title + score */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {job.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{job.company}</p>
                </div>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${getScoreColor(job.matchScore)}`}>
                  {job.matchScore}% {job.matchLabel}
                </span>
              </div>

              {/* Location + type */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {job.location}
                  </span>
                )}
                {job.employmentType && (
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} /> {job.employmentType}
                  </span>
                )}
              </div>

              {/* Skills */}
              {job.requiredSkills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.requiredSkills.length > 5 && (
                    <span className="text-xs text-gray-400">
                      +{job.requiredSkills.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* Apply + Remove */}
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1" asChild>
                  <a href={job.applyLink} target="_blank" rel="noreferrer">
                    <ExternalLink size={13} className="mr-1.5" />
                    Apply Now
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteJobId(job.jobId)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                >
                  <Trash2 size={17} className="m-1" />
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteJobId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This job will be removed from your saved list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteJobId(null)}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Removing...' : 'Yes, remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

export default SavedJobs