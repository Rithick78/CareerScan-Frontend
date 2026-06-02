import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchParsedResume, uploadResume } from '../features/resume/resumeSlice'
import { useAuth, useResume } from '../hooks/useAppSelector'
import { toast } from 'sonner'
import Spinner from '../components/Spinner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UploadCloud, Briefcase, MapPin, Clock, User, Sparkles, ArrowRight, FileText } from 'lucide-react'

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name } = useAuth()

  // All resume state from Redux — no local state for data
  const { data: parsedResume, isLoading, isUploading, error } = useResume()

  const [selectedFile, setSelectedFile] = useState(null)

  // Fetch existing resume on page load
  useEffect(() => {
    dispatch(fetchParsedResume())
  }, [dispatch])

  // Show errors from Redux as toast
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { toast.error('PDF files only'); return }
    setSelectedFile(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { toast.error('PDF files only'); return }
    setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile) { toast.error('Please select a file first'); return }

    // dispatch the async thunk — it handles pending/fulfilled/rejected
    const result = await dispatch(uploadResume(selectedFile))

    if (uploadResume.fulfilled.match(result)) {
      setSelectedFile(null)
      toast.success('Resume uploaded and parsed!')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── WELCOME BANNER ── colorful gradient, visually separate */}
      <div className="relative bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 overflow-hidden shadow-lg">
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 right-16 w-20 h-20 bg-white/5 rounded-full translate-y-6" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              🔍
              <span className="text-blue-200 text-xs font-medium uppercase tracking-wide">
                AI Job Matching
              </span>
              <Sparkles size={16} className="text-blue-200" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Hello, {name} 👋
            </h2>
            <p className="text-blue-200 text-sm">
              {parsedResume
                ? 'Your resume is ready. Find your perfect job below.'
                : 'Upload your resume to get started with AI-powered job matching.'
              }
            </p>
          </div>
          <div className="hidden sm:flex w-14 h-14 bg-white/20 rounded-2xl items-center justify-center">
            <Briefcase size={26} className="text-white" />
          </div>
        </div>

        {/* Stats row — only shown if resume exists */}
        {parsedResume && (
          <div className="relative mt-5 flex gap-4">
            <div className="bg-white/15 rounded-xl px-4 py-2.5">
              <p className="text-blue-200 text-xs">
                <span className="sm:hidden">Skills</span>
                <span className="hidden sm:inline">Skills Found</span>
              </p>
              <p className="text-white font-bold text-sm">{parsedResume.skills?.length || 0}</p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-2.5">
              <p className="text-blue-200 text-xs">Experience</p>
              <p className="text-white font-bold text-xs mt-0.5">{parsedResume.experience || '—'}</p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-2.5">
              <p className="text-blue-200 text-xs">Location</p>
              <p className="text-white font-bold text-xs mt-0.5">{parsedResume.city || '—'}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT — flex row on md+, col on mobile ── */}
      <div className="flex flex-col md:flex-row gap-5">

        {/* ── LEFT — Upload Card ── */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {parsedResume ? 'Update Resume' : 'Upload Resume'}
              </h3>
              <p className="text-xs text-gray-400">PDF only · Max 5MB</p>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-7 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UploadCloud size={22} className="text-gray-400" />
            </div>

            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-blue-600">{selectedFile.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024).toFixed(0)} KB · Ready to upload</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 font-medium">Drop your resume here</p>
                <p className="text-xs text-gray-400 mt-1">or click Browse to select</p>
              </div>
            )}

            <input type="file" accept=".pdf" onChange={handleFileChange}
              className="hidden" id="resume-input" />
            <label htmlFor="resume-input">
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <span className="cursor-pointer">Browse File</span>
              </Button>
            </label>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full mt-4"
          >
            {isUploading
              ? <><Spinner size="sm" /> Parsing with AI...</>
              : <><UploadCloud size={15} className="mr-2" /> Upload & Analyse</>
            }
          </Button>
        </div>

        {/* ── RIGHT — Parsed Resume Summary or Empty State ── */}
        {parsedResume ? (
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <User size={16} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Resume Summary</h3>
                <p className="text-xs text-gray-400">AI-extracted profile</p>
              </div>
            </div>

            {/* Role — highlighted */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">
                Detected Role
              </p>
              <p className="text-base font-bold text-gray-900">{parsedResume.detectedRole}</p>
            </div>

            {/* Skills */}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
                Skills ({parsedResume.skills?.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {parsedResume.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary"
                    className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience + Location */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Experience</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">{parsedResume.experience}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Location</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">{parsedResume.city}</p>
              </div>
            </div>

            {parsedResume.summary && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Summary</p>
                <p className="text-sm text-gray-600 leading-relaxed">{parsedResume.summary}</p>
              </div>
            )}

            {/* CTA */}
            <Button onClick={() => navigate('/jobs')} className="w-full bg-blue-600 hover:bg-blue-700">
              Find Matching Jobs
              <ArrowRight size={15} className="ml-2" />
            </Button>

          </div>
        ) : (
          // Empty right side
          <div className="flex-1 bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center min-h-48">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
              <Briefcase size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">No resume yet</p>
            <p className="text-xs text-gray-300 mt-1">Upload your PDF to see AI-parsed profile here</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Dashboard