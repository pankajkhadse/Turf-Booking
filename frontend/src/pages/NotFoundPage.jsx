import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display font-700 text-[120px] leading-none text-white/5 select-none">
          404
        </div>
        <h1 className="font-display font-700 text-3xl text-white -mt-4 mb-3">Page not found</h1>
        <p className="text-white/40 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/"      className="btn-primary">Go Home</Link>
          <Link to="/turfs" className="btn-outline">Browse Turfs</Link>
        </div>
      </div>
    </div>
  )
}
