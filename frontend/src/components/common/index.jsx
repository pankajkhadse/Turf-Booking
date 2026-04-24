import { Star } from 'lucide-react'

export function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={`${s} border-2 border-primary-500/20 border-t-primary-500
                     rounded-full animate-spin ${className}`} />
  )
}

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center py-32">
      <Spinner size="lg" />
    </div>
  )
}

export function EmptyState({ icon: Icon, title, desc, action }) {
  return (
    <div className="text-center py-20">
      {Icon && (
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-white/20" />
        </div>
      )}
      <h3 className="font-display font-600 text-white/60 mb-2">{title}</h3>
      {desc && <p className="text-white/30 text-sm mb-6">{desc}</p>}
      {action}
    </div>
  )
}

export function StarRating({ rating, size = 'sm' }) {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${s} ${i <= rating
          ? 'text-amber-400 fill-amber-400'
          : 'text-white/15'}`} />
      ))}
    </div>
  )
}

export function BookingStatusBadge({ status }) {
  const map = {
    pending:   'badge-amber',
    confirmed: 'badge-green',
    completed: 'badge-gray',
    cancelled: 'badge-red',
    failed:    'badge-red',
  }
  return <span className={map[status] || 'badge-gray'}>{status}</span>
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="shimmer h-44 rounded-xl" />
      <div className="shimmer h-4 rounded w-2/3" />
      <div className="shimmer h-3 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="shimmer h-6 rounded-full w-16" />
        <div className="shimmer h-6 rounded-full w-20" />
      </div>
      <div className="shimmer h-10 rounded-xl" />
    </div>
  )
}
