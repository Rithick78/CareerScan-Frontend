import { useDispatch } from 'react-redux'
import { saveJobThunk } from '../features/jobs/jobsSlice'
import { useJobs } from '../hooks/useAppSelector'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react'

function JobCard({ job, showSave = true }) {
  const dispatch = useDispatch()

  // Read savedJobIds from Redux
  const { savedJobIds, isSaving } = useJobs()
  const isSaved = savedJobIds.includes(job.jobId)

  function getScoreColor(score) {
    if (score >= 75) return 'bg-green-100 text-green-700'
    if (score >= 50) return 'bg-yellow-100 text-yellow-700'
    if (score >= 25) return 'bg-orange-100 text-orange-600'
    return 'bg-red-100 text-red-600'
  }

  async function handleSave() {
    async function handleSave() {
      console.log('job object:', job)        // check job.jobId is not null
      console.log('isSaved:', isSaved)
      if (isSaved) return
      const result = await dispatch(saveJobThunk(job))
      console.log('save result:', result)    // check if fulfilled or rejected
    }
    if (isSaved) return

    // Pass full job object — backend needs all fields to save
    const result = await dispatch(saveJobThunk(job))

    if (saveJobThunk.fulfilled.match(result)) {
      toast.success('Job saved!')
    } else {
      toast.error(result.payload || 'Could not save job.')
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-5 space-y-3">

        {/* Title + score badge */}
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

        {/* Required skills */}
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

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1" asChild>
            <a href={job.applyLink} target="_blank" rel="noreferrer">
              <ExternalLink size={13} className="mr-1.5" />
              Apply Now
            </a>
          </Button>

          {showSave && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              disabled={isSaved || isSaving}
            >
              {isSaved
                ? <><BookmarkCheck size={13} className="mr-1.5" /> Saved</>
                : <><Bookmark size={13} className="mr-1.5" /> Save</>
              }
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  )
}

export default JobCard