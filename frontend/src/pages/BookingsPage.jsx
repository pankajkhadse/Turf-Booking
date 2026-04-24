// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { Calendar, MapPin, Clock, X, Star, ChevronDown, Loader2 } from 'lucide-react'
// import { format } from 'date-fns'
// import toast from 'react-hot-toast'
// import { bookingAPI, reviewAPI } from '../services/api'
// import { LoadingScreen, BookingStatusBadge, EmptyState, StarRating } from '../components/common'

// function ReviewModal({ booking, onClose, onSubmit }) {
//   const [rating,  setRating]  = useState(5)
//   const [comment, setComment] = useState('')
//   const [loading, setLoading] = useState(false)

//   const submit = async () => {
//     setLoading(true)
//     try {
//       await reviewAPI.add({ booking_id: booking.id, rating, comment })
//       toast.success('Review submitted!')
//       onSubmit()
//       onClose()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to submit review')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
//       <div className="card w-full max-w-md p-6 animate-fade-in">
//         <div className="flex items-start justify-between mb-6">
//           <div>
//             <h3 className="font-display font-700 text-white text-lg">Rate your experience</h3>
//             <p className="text-white/40 text-sm mt-1">{booking.turf_name}</p>
//           </div>
//           <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Star selector */}
//         <div className="flex gap-2 mb-6 justify-center">
//           {[1,2,3,4,5].map(i => (
//             <button key={i} onClick={() => setRating(i)}>
//               <Star className={`w-8 h-8 transition-all ${
//                 i <= rating ? 'text-amber-400 fill-amber-400 scale-110' : 'text-white/20'
//               }`} />
//             </button>
//           ))}
//         </div>

//         <div className="mb-5">
//           <label className="label">Comment (optional)</label>
//           <textarea
//             value={comment}
//             onChange={e => setComment(e.target.value)}
//             rows={3}
//             placeholder="How was your experience? Great pitch? Friendly staff?"
//             className="input resize-none"
//           />
//         </div>

//         <div className="flex gap-3">
//           <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
//           <button onClick={submit} disabled={loading}
//             className="btn-primary flex-1 flex items-center justify-center gap-2">
//             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
//             Submit Review
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// function BookingCard({ booking, onCancel, onReview }) {
//   const [expanded, setExpanded] = useState(false)
//   const isPast = booking.start_time && new Date() > new Date(booking.start_time)
//   const canCancel = ['pending', 'confirmed'].includes(booking.status)&& !isPast
//   const canReview = booking.status === 'completed'
  

 

//   return (
//     <div className="card overflow-hidden">
//       <div className="p-5">
//         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-1 flex-wrap">
//               <h3 className="font-display font-600 text-white truncate">{booking.turf_name}</h3>
//               <BookingStatusBadge status={booking.status} />
//             </div>
//             <div className="flex items-center gap-1 text-white/40 text-sm">
//               <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
//               {booking.city}
//             </div>
//           </div>

//           <div className="text-right flex-shrink-0">
//             <div className="font-display font-700 text-xl text-primary-400">
//               ₹{booking.total_price}
//             </div>
//             <div className="text-white/30 text-xs">
//               {booking.booked_at ? format(new Date(booking.booked_at), 'dd MMM yyyy') : ''}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-wrap gap-2 mt-4">
//           {/* {canCancel && (
//             <button
//               onClick={() => onCancel(booking)}
//               className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300
//                          border border-red-500/20 hover:border-red-500/40 px-3 py-1.5
//                          rounded-lg transition-all"
//             >
//               <X className="w-3.5 h-3.5" /> Cancel Booking
//             </button>
//           )} */}

//           {canCancel ? (
//             <button
//               onClick={() => onCancel(booking)}
//               className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300
//                  border border-red-500/20 hover:border-red-500/40 px-3 py-1.5
//                  rounded-lg transition-all"
//             >
//               <X className="w-3.5 h-3.5" />
//               Cancel Booking
//             </button>
//           ) : (
//             ['pending', 'confirmed'].includes(booking.status) && (
//               <span className="text-xs text-white/40 px-3 py-1.5">
//                 Cancellation closed
//               </span>
//             )
//           )}

//           {canReview && (
//             <button
//               onClick={() => onReview(booking)}
//               className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300
//                          border border-amber-500/20 hover:border-amber-500/40 px-3 py-1.5
//                          rounded-lg transition-all"
//             >
//               <Star className="w-3.5 h-3.5" /> Write Review
//             </button>
//           )}
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white
//                        px-3 py-1.5 rounded-lg transition-all ml-auto"
//           >
//             Details
//             <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
//           </button>
//         </div>
//       </div>

//       {/* Expanded details */}
//       {expanded && (
//         <div className="border-t border-white/5 px-5 py-4 bg-dark-800/30 animate-fade-in">
//           <div className="grid grid-cols-2 gap-3 text-sm">
//             <div>
//               <p className="text-white/30 text-xs mb-1">Booking ID</p>
//               <p className="font-mono text-primary-400">#{String(booking.id).padStart(6, '0')}</p>
//             </div>
//             <div>
//               <p className="text-white/30 text-xs mb-1">Total Amount</p>
//               <p className="text-white font-display font-600">₹{booking.total_price}</p>
//             </div>
//             <div>
//               <p className="text-white/30 text-xs mb-1">Status</p>
//               <BookingStatusBadge status={booking.status} />
//             </div>
//             <div>
//               <p className="text-white/30 text-xs mb-1">Booked On</p>
//               <p className="text-white/70">
//                 {booking.booked_at ? format(new Date(booking.booked_at), 'dd MMM yyyy, hh:mm a') : '—'}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function BookingsPage() {
//   const [bookings,      setBookings]      = useState([])
//   const [loading,       setLoading]       = useState(true)
//   const [filter,        setFilter]        = useState('all')
//   const [cancelTarget,  setCancelTarget]  = useState(null)
//   const [reviewTarget,  setReviewTarget]  = useState(null)
//   const [cancelling,    setCancelling]    = useState(false)

//   const fetchBookings = async () => {
//     try {
//       const res = await bookingAPI.getHistory()
//       setBookings(res.data.bookings || [])
//     } catch {
//       setBookings([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { fetchBookings() }, [])

//   // const handleCancel = async () => {
//   //   if (!cancelTarget) return
//   //   setCancelling(true)
//   //   try {
//   //     await bookingAPI.cancel(cancelTarget.id)
//   //     toast.success('Booking cancelled')
//   //     setCancelTarget(null)
//   //     fetchBookings()
//   //   } catch (err) {
//   //     toast.error(err.response?.data?.message || 'Failed to cancel')
//   //   } finally {
//   //     setCancelling(false)
//   //   }
//   // }

//   const handleCancel = async () => {
//   if (!cancelTarget) return

//   // 🔥 ADD THIS CHECK
//   if (!['pending', 'confirmed'].includes(cancelTarget.status)) {
//     toast.error(`Cannot cancel booking (${cancelTarget.status})`)
//     setCancelTarget(null)
//     return
//   }

//   setCancelling(true)
//   try {
//     await bookingAPI.cancel(cancelTarget.id)
//     toast.success('Booking cancelled')
//     setCancelTarget(null)
//     fetchBookings()
//   } catch (err) {
//     toast.error(err.response?.data?.message || 'Failed to cancel')
//   } finally {
//     setCancelling(false)
//   }
// }

//   const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']
//   const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

//   if (loading) return <div className="pt-24"><LoadingScreen /></div>

//   return (
//     <div className="pt-24 pb-16 min-h-screen">
//       <div className="page-container max-w-2xl">

//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="section-title">My Bookings</h1>
//             <p className="text-white/40 text-sm mt-1">{bookings.length} total bookings</p>
//           </div>
//           <Link to="/turfs" className="btn-outline text-sm py-2">+ Book New</Link>
//         </div>

//         {/* Filter tabs */}
//         <div className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
//           {FILTERS.map(f => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm capitalize transition-all ${
//                 filter === f
//                   ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
//                   : 'text-white/40 hover:text-white border border-white/5 hover:border-white/15'
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>

//         {/* Bookings list */}
//         {filtered.length === 0 ? (
//           <EmptyState
//             icon={Calendar}
//             title={filter === 'all' ? "No bookings yet" : `No ${filter} bookings`}
//             desc={filter === 'all' ? "Book a turf to get started" : ""}
//             action={filter === 'all' && (
//               <Link to="/turfs" className="btn-primary text-sm">Browse Turfs</Link>
//             )}
//           />
//         ) : (
//           <div className="space-y-4">
//             {filtered.map(booking => (
//               <BookingCard
//                 key={booking.id}
//                 booking={booking}
//                 onCancel={setCancelTarget}
//                 onReview={setReviewTarget}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Cancel confirm modal */}
//       {cancelTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
//           <div className="card w-full max-w-sm p-6 animate-fade-in">
//             <h3 className="font-display font-700 text-white text-lg mb-2">Cancel Booking?</h3>
//             <p className="text-white/50 text-sm mb-6">
//               Are you sure you want to cancel your booking at{' '}
//               <span className="text-white">{cancelTarget.turf_name}</span>?
//               This cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button onClick={() => setCancelTarget(null)} className="btn-outline flex-1">
//                 Keep It
//               </button>
//               <button
//                 onClick={handleCancel}
//                 disabled={cancelling}
//                 className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400
//                            hover:bg-red-500/30 rounded-xl px-4 py-3 transition-all
//                            flex items-center justify-center gap-2"
//               >
//                 {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
//                 Yes, Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Review modal */}
//       {reviewTarget && (
//         <ReviewModal
//           booking={reviewTarget}
//           onClose={() => setReviewTarget(null)}
//           onSubmit={fetchBookings}
//         />
//       )}
//     </div>
//   )
// }



import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, X, Star, ChevronDown, Loader2,
         Ticket, CheckCircle2, AlertCircle } from 'lucide-react'
import { format, parseISO, differenceInHours } from 'date-fns'
import toast from 'react-hot-toast'
import { bookingAPI, reviewAPI } from '../services/api'
import { LoadingScreen, BookingStatusBadge, EmptyState, StarRating } from '../components/common'

// ── helpers ──────────────────────────────────────────────────
const toHHMM = (t) => t ? String(t).slice(0, 5) : '—'

// returns true if cancellation is still allowed (more than 2hrs before slot)
const canStillCancel = (booking) => {
  if (!['pending', 'confirmed'].includes(booking.status)) return false
  if (!booking.slot_date || !booking.start_time) return true // no slot info yet, allow
  const slotDateStr = booking.slot_date instanceof Date
    ? booking.slot_date.toISOString().split('T')[0]
    : String(booking.slot_date).split('T')[0]
  const slotStart = new Date(`${slotDateStr}T${String(booking.start_time).slice(0, 8)}`)
  const twoHoursBefore = new Date(slotStart.getTime() - 2 * 60 * 60 * 1000)
  return new Date() < twoHoursBefore
}

// returns the deadline string e.g. "Cancel by 4:00 PM today"
const cancelDeadline = (booking) => {
  if (!booking.slot_date || !booking.start_time) return null
  const slotDateStr = booking.slot_date instanceof Date
    ? booking.slot_date.toISOString().split('T')[0]
    : String(booking.slot_date).split('T')[0]
  const slotStart = new Date(`${slotDateStr}T${String(booking.start_time).slice(0, 8)}`)
  const deadline  = new Date(slotStart.getTime() - 2 * 60 * 60 * 1000)
  return format(deadline, 'h:mm a, dd MMM')
}

// ── Review Modal ──────────────────────────────────────────────
function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating,  setRating]  = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      await reviewAPI.add({ booking_id: booking.id, rating, comment })
      toast.success('Review submitted!')
      onSubmit()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-display font-700 text-white text-lg">Rate your experience</h3>
            <p className="text-white/40 text-sm mt-1">{booking.turf_name}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 mb-6 justify-center">
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => setRating(i)}>
              <Star className={`w-8 h-8 transition-all ${i <= rating ? 'text-amber-400 fill-amber-400 scale-110' : 'text-white/20'}`} />
            </button>
          ))}
        </div>
        <div className="mb-5">
          <label className="label">Comment (optional)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            rows={3} placeholder="How was your experience?"
            className="input resize-none" />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button onClick={submit} disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Submit Review
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Booking Ticket Card ───────────────────────────────────────
function BookingCard({ booking, onCancel, onReview }) {
  const [expanded, setExpanded] = useState(false)
  const allowCancel = canStillCancel(booking)
  const deadline    = cancelDeadline(booking)
  const canReview   = booking.status === 'completed'

  // format slot date safely
  const slotDateFormatted = booking.slot_date
    ? (() => {
        try {
          const d = booking.slot_date instanceof Date
            ? booking.slot_date
            : new Date(String(booking.slot_date).split('T')[0] + 'T00:00:00')
          return format(d, 'dd MMM yyyy')
        } catch { return '—' }
      })()
    : '—'

  const startTime = toHHMM(booking.start_time)
  const endTime   = toHHMM(booking.end_time)
  const hours     = booking.slot_count || 1

  const statusColors = {
    confirmed: 'border-primary-500/40 bg-primary-500/5',
    pending:   'border-amber-500/40 bg-amber-500/5',
    completed: 'border-white/10 bg-white/3',
    cancelled: 'border-red-500/20 bg-red-500/3',
    failed:    'border-red-500/20 bg-red-500/3',
  }

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${statusColors[booking.status] || 'border-white/10'}`}>

      {/* Ticket top — main info */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

          {/* Left — turf + location */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-display font-600 text-white text-lg truncate">
                {booking.turf_name}
              </h3>
              <BookingStatusBadge status={booking.status} />
            </div>
            <div className="flex items-center gap-1 text-white/40 text-sm">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {booking.city}{booking.address ? `, ${booking.address}` : ''}
            </div>
          </div>

          {/* Right — amount */}
          <div className="text-right flex-shrink-0">
            <div className="font-display font-700 text-2xl text-primary-400">
              ₹{booking.total_price}
            </div>
            <div className="text-white/30 text-xs">
              {hours} hr{hours > 1 ? 's' : ''} · ₹{booking.price_per_hour || Math.round(booking.total_price / hours)}/hr
            </div>
          </div>
        </div>

        {/* Ticket details row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white/30 text-xs mb-1">Date</p>
            <p className="text-white font-display font-600 text-sm">{slotDateFormatted}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white/30 text-xs mb-1">Time</p>
            <p className="text-white font-display font-600 text-sm">
              {startTime !== '—' ? `${startTime} – ${endTime}` : '—'}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white/30 text-xs mb-1">Booking ID</p>
            <p className="font-mono text-primary-400 text-sm">
              #{String(booking.id).padStart(6, '0')}
            </p>
          </div>
        </div>

        {/* Cancel deadline info */}
        {['pending', 'confirmed'].includes(booking.status) && deadline && (
          <div className={`mt-3 flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${
            allowCancel
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {allowCancel
              ? `Free cancellation until ${deadline}`
              : 'Cancellation window closed'}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {allowCancel && (
            <button onClick={() => onCancel(booking)}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300
                         border border-red-500/20 hover:border-red-500/40 px-3 py-1.5
                         rounded-lg transition-all">
              <X className="w-3.5 h-3.5" /> Cancel Booking
            </button>
          )}
          {canReview && (
            <button onClick={() => onReview(booking)}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300
                         border border-amber-500/20 hover:border-amber-500/40 px-3 py-1.5
                         rounded-lg transition-all">
              <Star className="w-3.5 h-3.5" /> Write Review
            </button>
          )}
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white
                       px-3 py-1.5 rounded-lg transition-all ml-auto">
            {expanded ? 'Less' : 'More details'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dashed divider — ticket perforation style */}
      {expanded && (
        <div className="relative">
          <div className="absolute left-0 right-0 border-t border-dashed border-white/10" />
          <div className="absolute -left-2 w-4 h-4 rounded-full bg-dark-900 border border-white/10" style={{top: '-8px'}} />
          <div className="absolute -right-2 w-4 h-4 rounded-full bg-dark-900 border border-white/10" style={{top: '-8px'}} />
        </div>
      )}

      {/* Expanded ticket stub */}
      {expanded && (
        <div className="px-5 py-4 bg-dark-800/30 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/30 text-xs mb-1">Slot breakdown</p>
              <p className="text-white/70 font-mono text-xs">
                {booking.slot_times || `${startTime} – ${endTime}`}
              </p>
            </div>
            <div>
              <p className="text-white/30 text-xs mb-1">Booked on</p>
              <p className="text-white/70 text-xs">
                {booking.booked_at
                  ? format(new Date(booking.booked_at), 'dd MMM yyyy, hh:mm a')
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-white/30 text-xs mb-1">Status</p>
              <BookingStatusBadge status={booking.status} />
            </div>
            <div>
              <p className="text-white/30 text-xs mb-1">Total paid</p>
              <p className="text-primary-400 font-display font-600">₹{booking.total_price}</p>
            </div>
          </div>

          {/* Show venue address if available */}
          {booking.address && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-white/30 text-xs mb-1">Venue address</p>
              <p className="text-white/60 text-xs">{booking.address}, {booking.city}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function BookingsPage() {
  const [bookings,     setBookings]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [filter,       setFilter]       = useState('all')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [reviewTarget, setReviewTarget] = useState(null)
  const [cancelling,   setCancelling]   = useState(false)

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getHistory()
      setBookings(res.data.bookings || [])
    } catch {
      setBookings([])
    } finally {
      setLoading(false) }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async () => {
    if (!cancelTarget) return

    // frontend double-check before hitting API
    if (!canStillCancel(cancelTarget)) {
      toast.error('Cancellation window has closed for this booking')
      setCancelTarget(null)
      return
    }

    setCancelling(true)
    try {
      const res = await bookingAPI.cancel(cancelTarget.id)
      toast.success(res.data.message || 'Booking cancelled')
      setCancelTarget(null)
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    } finally {
      setCancelling(false)
    }
  }

  const FILTERS = ['all', 'confirmed', 'pending', 'completed', 'cancelled']
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <div className="pt-24"><LoadingScreen /></div>

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="page-container max-w-2xl">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">My Bookings</h1>
            <p className="text-white/40 text-sm mt-1">{bookings.length} total bookings</p>
          </div>
          <Link to="/turfs" className="btn-outline text-sm py-2">+ Book New</Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm capitalize transition-all ${
                filter === f
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-white/40 hover:text-white border border-white/5 hover:border-white/15'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title={filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            desc={filter === 'all' ? 'Book a turf to get started' : ''}
            action={filter === 'all' && (
              <Link to="/turfs" className="btn-primary text-sm">Browse Turfs</Link>
            )}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map(booking => (
              <BookingCard key={booking.id} booking={booking}
                onCancel={setCancelTarget} onReview={setReviewTarget} />
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirm modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="card w-full max-w-sm p-6 animate-fade-in">
            <h3 className="font-display font-700 text-white text-lg mb-2">Cancel Booking?</h3>
            <p className="text-white/50 text-sm mb-2">
              Are you sure you want to cancel your booking at{' '}
              <span className="text-white">{cancelTarget.turf_name}</span>?
            </p>
            {cancelTarget.status === 'confirmed' && (
              <p className="text-primary-400/70 text-xs mb-4 bg-primary-500/10 border border-primary-500/20 rounded-lg px-3 py-2">
                Refund will be processed in 5–7 business days.
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setCancelTarget(null)} className="btn-outline flex-1">
                Keep It
              </button>
              <button onClick={handleCancel} disabled={cancelling}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400
                           hover:bg-red-500/30 rounded-xl px-4 py-3 transition-all
                           flex items-center justify-center gap-2">
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewTarget && (
        <ReviewModal booking={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={fetchBookings} />
      )}
    </div>
  )
}
