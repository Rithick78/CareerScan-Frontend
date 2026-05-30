import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

import store from './store/store'
import ProtectedRoute from './router/ProtectedRoute'
import Layout   from './components/Layout'
import Home     from './pages/Home'
import Login    from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FindJobs  from './pages/FindJobs'
import SavedJobs from './pages/SavedJobs'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/jobs"      element={<ProtectedRoute><Layout><FindJobs /></Layout></ProtectedRoute>} />
          <Route path="/saved"     element={<ProtectedRoute><Layout><SavedJobs /></Layout></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)