import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone_no: '', password: '', role: 'client' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone_no || !form.password) { toast.error('Please fill all fields'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await authAPI.register(form)
      const res = await authAPI.login({ email: form.email, password: form.password })
      login(res.data.user, res.data.token)
      toast.success(`Welcome to TurfBook, ${form.name}!`)
      navigate(form.role === 'owner' ? '/owner/dashboard' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/6 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to home
        </Link>
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="font-display font-700 text-2xl text-white">Create account</h1>
            <p className="text-white/40 text-sm mt-1">Join TurfBook — it's free</p>
          </div>
          <div className="flex gap-2 mb-5 p-1 bg-dark-600/40 rounded-xl">
            {[{ value: 'client', label: 'I want to Play' }, { value: 'owner', label: 'I own a Turf' }].map(r => (
              <button key={r.value} type="button" onClick={() => setForm(f => ({ ...f, role: r.value }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-display transition-all ${form.role === r.value ? 'bg-primary-500 text-dark-900 font-700' : 'text-white/50 hover:text-white'}`}>
                {r.label}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Pankaj Kumar', auto: 'name' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', auto: 'email' },
              { name: 'phone_no', label: 'Phone Number', type: 'tel', placeholder: '9876543210', auto: 'tel' },
            ].map(f => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handle} placeholder={f.placeholder} autoComplete={f.auto} className="input" />
              </div>
            ))}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} name="password" value={form.password} onChange={handle} placeholder="Min 6 characters" className="input pr-11" autoComplete="new-password" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
