import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginThunk } from '../features/auth/authSlice'
import { useAuth } from '../hooks/useAppSelector'
import { toast } from 'sonner'
import Spinner from '../components/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Read loading + error from Redux — not local state
  const { isLoading, error, token } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // If already logged in → go to dashboard
  useEffect(() => {
    if (token) navigate('/dashboard')
  }, [token])

  // Show error from Redux as toast
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill in all fields'); return }

    // dispatch returns a promise — we can check if fulfilled
    const result = await dispatch(loginThunk({ email, password }))

    if (loginThunk.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    }
    // if rejected → error is in Redux state → useEffect shows toast
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <Link to="/">
        <Button
          className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2 bg-black text-white rounded-md hover:bg-gray-800">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">CareerScan</h1>
          <p className="text-sm text-gray-500 mt-1">Find jobs that match your skills</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Spinner size="sm" /> Signing in...</> : 'Sign in'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              No account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login