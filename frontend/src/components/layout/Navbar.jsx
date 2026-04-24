import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [dropdown,  setDropdown]  = useState(false)
  const { isAuthenticated, user, logout, isOwner, isClient } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false); setDropdown(false) }, [location])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="page-container flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center
                          group-hover:bg-primary-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-700 text-xl text-white">
            Turf<span className="text-primary-400">Book</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/turfs" className="nav-link">Browse Turfs</Link>
          {isClient && <Link to="/bookings" className="nav-link">My Bookings</Link>}
          {isOwner  && <Link to="/owner/dashboard" className="nav-link">Dashboard</Link>}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2 bg-dark-700/60 border border-white/10
                           hover:border-primary-500/30 rounded-xl px-4 py-2 transition-all"
              >
                <div className="w-7 h-7 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-400 text-xs font-display font-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-white/80 font-body">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${dropdown ? 'rotate-180' : ''}`} />
              </button>

              {dropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 card border border-white/8
                                shadow-2xl shadow-black/50 py-1 animate-fade-in">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-xs text-white/40">Signed in as</p>
                    <p className="text-sm text-white font-body truncate">{user?.email}</p>
                    <span className="badge-green text-xs mt-1">{user?.role}</span>
                  </div>
                  {isClient && (
                    <Link to="/bookings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/70
                                 hover:text-white hover:bg-white/5 transition-colors">
                      <Calendar className="w-4 h-4" /> My Bookings
                    </Link>
                  )}
                  {isOwner && (
                    <Link to="/owner/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/70
                                 hover:text-white hover:bg-white/5 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400
                               hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Log in</Link>
              <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} className="md:hidden btn-ghost p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-dark-800/98 backdrop-blur-md border-t border-white/5
                        animate-fade-in">
          <div className="page-container py-4 flex flex-col gap-1">
            <Link to="/turfs" className="btn-ghost text-left py-3">Browse Turfs</Link>
            {isClient && <Link to="/bookings" className="btn-ghost text-left py-3">My Bookings</Link>}
            {isOwner  && <Link to="/owner/dashboard" className="btn-ghost text-left py-3">Dashboard</Link>}
            <div className="divider my-2" />
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-white/40 text-xs">Signed in as {user?.email}</p>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login"    className="btn-outline text-center">Log in</Link>
                <Link to="/register" className="btn-primary text-center">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
