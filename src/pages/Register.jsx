import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerThunk } from '../features/auth/authSlice'
import { useAuth } from '../hooks/useAppSelector'
import { toast } from 'sonner'
import Spinner from '../components/Spinner'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Label }    from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAuth()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [errors,   setErrors]   = useState({})

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  function validate() {
    const e = {}
    if (!name.trim())         e.name     = 'Name is required'
    if (!email.trim())        e.email    = 'Email is required'
    if (!password)            e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Minimum 6 characters'
    return e
  }

  async function handleRegister(e) {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length > 0) { setErrors(found); return }
    setErrors({})

    const result = await dispatch(registerThunk({ name, email, password }))

    if (registerThunk.fulfilled.match(result)) {
      toast.success('Account created! Please sign in.')
      navigate('/login')
    }
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
          <p className="text-sm text-gray-500 mt-1">Create your account to get started</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create account</CardTitle>
            <CardDescription>Fill in your details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input type="text" placeholder="Rithick Jackson"
                  value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Input type="password" placeholder="Min. 6 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Spinner size="sm" /> Creating...</> : 'Create account'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register