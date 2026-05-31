import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useAuth } from '../hooks/useAppSelector'
import { LayoutDashboard, Briefcase, Bookmark, LogOut, Menu, X, Sparkles, SearchCheck } from 'lucide-react'
import LogoutDialog from './LogoutDialog'

function Layout({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { name } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogout, setShowLogout] = useState(false)

  function handleConfirmLogout() {
    dispatch(logout())
    navigate('/')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/jobs', label: 'Find Jobs', icon: Briefcase },
    { to: '/saved', label: 'Saved Jobs', icon: Bookmark },
  ]

  function navClass({ isActive }) {
    return `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`
  }

  const SidebarInner = () => (
    <>
      {/* Logo area */}
      <div className="hidden md:block px-5 py-6 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <SearchCheck size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">CareerScan</h1>
            <p className="text-xs text-slate-500">AI Job Matching</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            onClick={() => setSidebarOpen(false)}
            className={navClass}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={() => setShowLogout(true)}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-all"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── DESKTOP SIDEBAR ── dark theme, visually separate */}
      <aside className="hidden md:flex flex-col w-60 bg-slate-900 min-h-screen shrink-0 shadow-xl">
        <SidebarInner />
      </aside>

      {/* ── MOBILE SIDEBAR ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 flex flex-col w-60 bg-slate-900 min-h-screen shadow-2xl">
            <div className="flex items-center justify-between px-5 py-6 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <SearchCheck size={17} className="text-white" />
                </div>
                <div className='flex flex-col gap-y-0.5 justify-center items-start'>
                  <h1 className="text-sm font-bold text-white">CareerScan</h1>
                  <p className="text-xs text-slate-500">AI Job Matching</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <SidebarInner />
          </aside>
        </div>
      )}

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── TOP NAV ── white with shadow, visually separate from page */}
        <header className="bg-white border-b border-gray-200 shadow-sm px-5 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700 p-1"
            >
              <Menu size={22} />
            </button>
            {/* Page breadcrumb visible on desktop */}
            <div className="hidden md:block">
              <p className="text-xs text-gray-400">Welcome back,</p>
              <p className="text-sm font-semibold text-gray-800">{name || 'User'}</p>
            </div>
          </div>

          {/* Right side — user avatar */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{name || 'User'}</p>
              <p className="text-xs text-gray-400">Logged in</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 p-6 bg-slate-50">
          {children}
        </main>

      </div>

      <LogoutDialog
        open={showLogout}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogout(false)}
      />
    </div>
  )
}

export default Layout