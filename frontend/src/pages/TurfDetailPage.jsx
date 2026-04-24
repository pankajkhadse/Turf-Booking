// import { useState, useEffect } from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import { MapPin, Phone, Star, Clock, ChevronRight, ArrowLeft } from 'lucide-react'
// import { turfAPI, reviewAPI } from '../services/api'
// import { useAuth } from '../context/AuthContext'
// import { LoadingScreen, StarRating, EmptyState } from '../components/common'

// const SPORT_EMOJIS = {
//   football: '⚽', cricket: '🏏', 'box cricket': '🏏',
//   badminton: '🏸', basketball: '🏀', volleyball: '🏐',
//   tennis: '🎾', pickleball: '🏓'
// }

// export default function TurfDetailPage() {
//   const { id }    = useParams()
//   const navigate  = useNavigate()
//   const { isAuthenticated, isClient } = useAuth()

//   const [turf,    setTurf]    = useState(null)
//   const [reviews, setReviews] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [turfRes, reviewRes] = await Promise.all([
//           turfAPI.getById(id),
//           reviewAPI.getByTurf(id)
//         ])
//         setTurf(turfRes.data.turf || turfRes.data)
//         setReviews(reviewRes.data.reviews || [])
//       } catch {
//         navigate('/turfs')
//       } finally {
//         setLoading(false)
//       }
//     }
//     load()
//   }, [id])

//   if (loading) return <div className="pt-24"><LoadingScreen /></div>
//   if (!turf)   return null

//   const sports     = turf.sports || []
//   const avgRating  = reviews.length
//     ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
//     : null

//   return (
//     <div className="pt-24 pb-16 min-h-screen">
//       <div className="page-container">

//         {/* Back button */}
//         <button onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-white/40 hover:text-white
//                      text-sm mb-6 transition-colors group">
//           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//           Back to turfs
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* LEFT — main info */}
//           <div className="lg:col-span-2 space-y-6">

//             {/* Hero image placeholder */}
//             <div className="relative h-64 md:h-80 bg-gradient-to-br from-dark-600
//                             to-dark-700 rounded-2xl overflow-hidden">
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-8xl opacity-20">
//                   {SPORT_EMOJIS[sports[0]?.toLowerCase()] || '🏟️'}
//                 </span>
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 to-transparent" />
//               <div className="absolute bottom-4 left-4">
//                 {turf.status === 'active' && (
//                   <span className="badge-green text-xs">
//                     <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
//                     Open for Booking
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Turf info */}
//             <div className="card p-6">
//               <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
//                 <div>
//                   <h1 className="font-display font-700 text-2xl md:text-3xl text-white mb-2">
//                     {turf.name}
//                   </h1>
//                   <div className="flex items-center gap-1 text-white/50 text-sm">
//                     <MapPin className="w-4 h-4 text-primary-500/60" />
//                     {turf.address}, {turf.city}
//                   </div>
//                 </div>
//                 <div className="text-right flex-shrink-0">
//                   <div className="font-display font-700 text-3xl text-primary-400">
//                     ₹{turf.price_per_hour}
//                   </div>
//                   <div className="text-white/30 text-sm">per hour</div>
//                 </div>
//               </div>

//               {/* Rating */}
//               {avgRating && (
//                 <div className="flex items-center gap-2 mb-4">
//                   <StarRating rating={Math.round(avgRating)} size="md" />
//                   <span className="font-display font-600 text-white">{avgRating}</span>
//                   <span className="text-white/30 text-sm">({reviews.length} reviews)</span>
//                 </div>
//               )}

//               {/* Sports */}
//               {sports.length > 0 && (
//                 <div>
//                   <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Sports Available</p>
//                   <div className="flex flex-wrap gap-2">
//                     {sports.map(s => (
//                       <span key={s} className="flex items-center gap-1.5 bg-primary-500/10
//                                                border border-primary-500/20 text-primary-300
//                                                px-3 py-1.5 rounded-full text-sm">
//                         {SPORT_EMOJIS[s.toLowerCase()] || '🏅'} {s}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Owner info */}
//             <div className="card p-6">
//               <h3 className="font-display font-600 text-white mb-3">Turf Owner</h3>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-primary-500/15 rounded-full flex items-center justify-center">
//                   <span className="text-primary-400 font-display font-700">
//                     {turf.owner_name?.charAt(0) || 'O'}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-white font-body">{turf.owner_name || 'Owner'}</p>
//                   <p className="text-white/30 text-sm">Turf Owner</p>
//                 </div>
//               </div>
//             </div>

//             {/* Reviews */}
//             <div>
//               <h3 className="font-display font-600 text-white text-xl mb-4">
//                 Reviews {reviews.length > 0 && `(${reviews.length})`}
//               </h3>
//               {reviews.length === 0 ? (
//                 <EmptyState title="No reviews yet" desc="Be the first to review after playing!" />
//               ) : (
//                 <div className="space-y-4">
//                   {reviews.map(r => (
//                     <div key={r.id} className="card p-5">
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <div className="w-8 h-8 bg-white/5 rounded-full flex items-center
//                                           justify-center text-sm font-display font-600 text-white/60">
//                             {r.reviewer_name?.charAt(0) || 'U'}
//                           </div>
//                           <div>
//                             <p className="text-white/80 text-sm font-body">
//                               {r.reviewer_name || 'Player'}
//                             </p>
//                           </div>
//                         </div>
//                         <StarRating rating={r.rating} />
//                       </div>
//                       {r.comment && (
//                         <p className="text-white/50 text-sm leading-relaxed">{r.comment}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* RIGHT — booking sidebar */}
//           <div className="lg:col-span-1">
//             <div className="card p-6 sticky top-24">
//               <div className="text-center mb-6">
//                 <div className="font-display font-700 text-4xl text-primary-400 mb-1">
//                   ₹{turf.price_per_hour}
//                 </div>
//                 <div className="text-white/40 text-sm">per hour · 1hr slots</div>
//               </div>

//               <div className="space-y-3 mb-6">
//                 {[
//                   { icon: Clock,  text: 'Flexible 1-hour slots' },
//                   { icon: Star,   text: 'Instant confirmation' },
//                   { icon: MapPin, text: turf.city },
//                 ].map(({ icon: Icon, text }) => (
//                   <div key={text} className="flex items-center gap-2 text-white/50 text-sm">
//                     <Icon className="w-4 h-4 text-primary-500/60 flex-shrink-0" />
//                     {text}
//                   </div>
//                 ))}
//               </div>

//               {turf.status === 'active' ? (
//                 isClient ? (
//                   <Link to={`/book/${turf.id}`} className="btn-primary w-full text-center block">
//                     Book Now →
//                   </Link>
//                 ) : isAuthenticated ? (
//                   <div className="text-center text-white/40 text-sm p-4 bg-white/5 rounded-xl">
//                     Only clients can book turfs
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     <Link to="/login" className="btn-primary w-full text-center block">
//                       Login to Book
//                     </Link>
//                     <Link to="/register" className="btn-outline w-full text-center block text-sm">
//                       Create Account
//                     </Link>
//                   </div>
//                 )
//               ) : (
//                 <div className="text-center text-white/40 text-sm p-4 bg-white/5 rounded-xl">
//                   This turf is not available for booking
//                 </div>
//               )}

//               <p className="text-white/20 text-xs text-center mt-4">
//                 Free cancellation for pending bookings
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, Clock, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { turfAPI, reviewAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { LoadingScreen, StarRating, EmptyState } from '../components/common'

const SPORT_EMOJIS = {
  football: '⚽', cricket: '🏏', 'box cricket': '🏏',
  badminton: '🏸', basketball: '🏀', volleyball: '🏐',
  tennis: '🎾', pickleball: '🏓'
}

// Photo gallery component
function PhotoGallery({ images, turfName }) {
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-dark-600 to-dark-700
                      rounded-2xl overflow-hidden flex items-center justify-center">
        <span className="text-6xl opacity-20">🏟️</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-dark-700">
        <img
          src={images[active]?.image_url}
          alt={`${turfName} photo ${active + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent" />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive(p => (p - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-900/70
                         rounded-full flex items-center justify-center text-white
                         hover:bg-dark-900 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActive(p => (p + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-900/70
                         rounded-full flex items-center justify-center text-white
                         hover:bg-dark-900 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-dark-900/70 text-white/70 text-xs
                        px-2 py-1 rounded-full">
          {active + 1}/{images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0
                          transition-all ${active === i
                            ? 'ring-2 ring-primary-500 opacity-100'
                            : 'opacity-50 hover:opacity-80'}`}>
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TurfDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isClient } = useAuth()

  const [turf,    setTurf]    = useState(null)
  const [reviews, setReviews] = useState([])
  const [images,  setImages]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [turfRes, reviewRes, photoRes] = await Promise.all([
          turfAPI.getById(id),
          reviewAPI.getByTurf(id),
          turfAPI.getPhotos(id)
        ])
        setTurf(turfRes.data.turf || turfRes.data)
        setReviews(reviewRes.data.reviews || [])
        setImages(photoRes.data.photos || [])
      } catch {
        navigate('/turfs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="pt-24"><LoadingScreen /></div>
  if (!turf)   return null

  const sports    = turf.sports || []
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="page-container">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white
                     text-sm mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to turfs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Photo gallery */}
            <PhotoGallery images={images} turfName={turf.name} />

            {/* Turf info */}
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display font-700 text-2xl md:text-3xl text-white mb-2">
                    {turf.name}
                  </h1>
                  <div className="flex items-center gap-1 text-white/50 text-sm">
                    <MapPin className="w-4 h-4 text-primary-500/60" />
                    {turf.address}, {turf.city}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display font-700 text-3xl text-primary-400">
                    ₹{turf.price_per_hour}
                  </div>
                  <div className="text-white/30 text-sm">per hour</div>
                </div>
              </div>

              {avgRating && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={Math.round(avgRating)} size="md" />
                  <span className="font-display font-600 text-white">{avgRating}</span>
                  <span className="text-white/30 text-sm">({reviews.length} reviews)</span>
                </div>
              )}

              {sports.length > 0 && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Sports Available</p>
                  <div className="flex flex-wrap gap-2">
                    {sports.map(s => (
                      <span key={s}
                        className="flex items-center gap-1.5 bg-primary-500/10 border
                                   border-primary-500/20 text-primary-300 px-3 py-1.5
                                   rounded-full text-sm">
                        {SPORT_EMOJIS[s.toLowerCase()] || '🏅'} {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div>
              <h3 className="font-display font-600 text-white text-xl mb-4">
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h3>
              {reviews.length === 0 ? (
                <EmptyState title="No reviews yet" desc="Be the first to review after playing!" />
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="card p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/5 rounded-full flex items-center
                                          justify-center text-sm font-display font-600 text-white/60">
                            {r.reviewer_name?.charAt(0) || 'U'}
                          </div>
                          <p className="text-white/80 text-sm">{r.reviewer_name || 'Player'}</p>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      {r.comment && (
                        <p className="text-white/50 text-sm leading-relaxed">{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="font-display font-700 text-4xl text-primary-400 mb-1">
                  ₹{turf.price_per_hour}
                </div>
                <div className="text-white/40 text-sm">per hour · 1hr slots</div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { icon: Clock,  text: 'Flexible 1-hour slots' },
                  { icon: Star,   text: 'Instant confirmation' },
                  { icon: MapPin, text: turf.city },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-white/50 text-sm">
                    <Icon className="w-4 h-4 text-primary-500/60 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              {turf.status === 'active' ? (
                isClient ? (
                  <Link to={`/book/${turf.id}`} className="btn-primary w-full text-center block">
                    Book Now →
                  </Link>
                ) : isAuthenticated ? (
                  <div className="text-center text-white/40 text-sm p-4 bg-white/5 rounded-xl">
                    Only clients can book turfs
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login"    className="btn-primary w-full text-center block">Login to Book</Link>
                    <Link to="/register" className="btn-outline w-full text-center block text-sm">Create Account</Link>
                  </div>
                )
              ) : (
                <div className="text-center text-white/40 text-sm p-4 bg-white/5 rounded-xl">
                  This turf is not available for booking
                </div>
              )}

              <p className="text-white/20 text-xs text-center mt-4">
                Free cancellation up to 2 hours before slot
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
