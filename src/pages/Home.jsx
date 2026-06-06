import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { guestLogin } from '../api/authApi'
import { toast } from 'sonner'
import { Briefcase, FileText, Star, Zap, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Spinner from '../components/Spinner'

function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isGuesting, setIsGuesting] = useState(false)

  useEffect(() => {
    fetch('https://your-render-app.onrender.com/api/auth/ping')
      .catch(() => { })
  }, [])

  async function handleGuestLogin() {
    setIsGuesting(true)
    try {
      const data = await guestLogin()

      dispatch(setCredentials({
        token: data.token,
        email: data.email,
        name: data.name,
      }))

      toast.success('Welcome! You are logged in as Guest.')
      navigate('/dashboard')

    } catch {
      toast.error('Guest login failed. Please try again.')
    } finally {
      setIsGuesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="border-b  border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">CareerScan</h1>
          <p className="text-xs text-gray-400">AI Job Matching</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-10 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Zap size={12} />
          Powered by Groq AI
        </div>
        <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          Upload your resume.<br />
          Find jobs that actually match.
        </h2>
        <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xl mx-auto">
          CareerScan reads your resume, extracts your skills using AI,
          searches live job listings, and scores each job based on how
          well it matches your profile.
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <Link to="/register">
            <Button className="px-2 sm:px-4 text-xs sm:text-sm">
              Start for free
            </Button>
          </Link>

          <Link to="/login">
            <Button
              variant="outline"
              className="px-2 sm:px-4 text-xs sm:text-sm"
            >
              Sign in
            </Button>
          </Link>

          <Button
            onClick={handleGuestLogin}
            disabled={isGuesting}
            className="px-2 sm:px-4 text-xs sm:text-sm"
          >
            {isGuesting ? (
              <>
                <Spinner size="sm" />
                <span className="hidden sm:inline">Logging in...</span>
              </>
            ) : (
              <>
                <UserCheck size={14} />
                <span className="sm:hidden">Guest</span>
                <span className="hidden sm:inline">Enter as Guest</span>
              </>
            )}
          </Button>
        </div>
      </section>
      <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-3 py-1.5 rounded-full mb-4">
        ⚡ Free hosting — first visit may take 30-60 seconds to load
      </div>

      {/* How it works */}
      <section className="bg-gray-50 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-10">
            How it works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText size={20} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Upload Resume</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Upload your PDF resume. AI extracts your role, skills, experience and location automatically.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase size={20} className="text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Search Jobs</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                We search live job listings from 20+ sources using your extracted skills and role.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star size={20} className="text-yellow-500" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Get Match Score</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every job gets a match score based on skill overlap. Apply only to jobs where you qualify.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 px-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Ready to find your perfect job?
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Free to use. No credit card needed.
        </p>
        <Link to="/register">
          <Button size="lg">Create free account</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-5 text-center">
        <p className="text-xs text-gray-400">
          Built by Rithick Jackson · CareerScan © 2026
        </p>
      </footer>

    </div>
  )
}

export default Home