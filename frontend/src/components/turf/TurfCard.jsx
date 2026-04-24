import { Link } from 'react-router-dom'
import { MapPin, Star, Clock, ChevronRight } from 'lucide-react'

const SPORT_EMOJIS = {
  football: '⚽', cricket: '🏏', 'box cricket': '🏏',
  badminton: '🏸', basketball: '🏀', volleyball: '🏐',
  tennis: '🎾', pickleball: '🏓'
}

export default function TurfCard({ turf }) {
  const sports = turf.sports || []

  return (
    <Link to={`/turfs/${turf.id}`} className="card-hover block group">
      {/* Image placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-dark-600 to-dark-700 rounded-t-2xl
                      overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-30">
            {SPORT_EMOJIS[sports[0]?.toLowerCase()] || '🏟️'}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-primary-500 text-dark-900
                        font-display font-700 text-sm px-3 py-1 rounded-lg">
          ₹{turf.price_per_hour}/hr
        </div>

        {/* Status */}
        {turf.status === 'active' && (
          <div className="absolute top-3 left-3 badge-green text-xs">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
            Available
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display font-600 text-white text-lg mb-1 group-hover:text-primary-400
                       transition-colors truncate">
          {turf.name}
        </h3>

        <div className="flex items-center gap-1 text-white/40 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{turf.city}</span>
        </div>

        {/* Sports chips */}
        {sports.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {sports.slice(0, 3).map(s => (
              <span key={s} className="text-xs bg-white/5 text-white/50
                                       border border-white/8 px-2 py-0.5 rounded-full">
                {SPORT_EMOJIS[s.toLowerCase()] || '🏅'} {s}
              </span>
            ))}
            {sports.length > 3 && (
              <span className="text-xs text-white/30">+{sports.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>1hr slots</span>
          </div>
          <div className="flex items-center gap-1 text-primary-400 text-sm font-display
                          group-hover:gap-2 transition-all">
            Book Now <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
