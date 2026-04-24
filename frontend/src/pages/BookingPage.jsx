

// import { useState, useEffect } from 'react'
// import { useParams, useNavigate, Link } from 'react-router-dom'
// import { ArrowLeft, Calendar, Clock, CheckCircle2, AlertCircle, Loader2, CreditCard } from 'lucide-react'
// import { format, addDays, startOfToday } from 'date-fns'
// import toast from 'react-hot-toast'
// import { turfAPI, slotAPI, paymentAPI,bookingAPI  } from '../services/api'
// import { useAuth } from '../context/AuthContext'
// import { LoadingScreen, Spinner } from '../components/common'
// import useRazorpay from '../hooks/useRazorpay'

// function SlotButton({ slot, selected, onClick }) {
//   const isSelected    = selected.some(s => s.id === slot.id)
//   const isUnavailable = slot.status !== 'available'
//   return (
//     <button
//       onClick={() => !isUnavailable && onClick(slot)}
//       disabled={isUnavailable}
//       className={`relative p-3 rounded-xl border text-sm font-body transition-all
//         ${isUnavailable
//           ? 'border-white/5 bg-white/3 text-white/20 cursor-not-allowed'
//           : isSelected
//             ? 'border-primary-500 bg-primary-500/20 text-primary-300'
//             : 'border-white/10 bg-dark-700/40 text-white/70 hover:border-white/25 hover:text-white'}`}
//     >
//       <div className="font-display font-600">{slot.start_time?.slice(0, 5)}</div>
//       <div className="text-xs opacity-60 mt-0.5">
//         {isUnavailable ? 'Taken' : `to ${slot.end_time?.slice(0, 5)}`}
//       </div>
//       {isSelected && (
//         <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
//           <CheckCircle2 className="w-3 h-3 text-dark-900" />
//         </div>
//       )}
//     </button>
//   )
// }

// export default function BookingPage() {
//   const { turfId }  = useParams()
//   const navigate    = useNavigate()
//   const { user }    = useAuth()
//   const { openPayment } = useRazorpay()

//   const [turf,          setTurf]          = useState(null)
//   const [selectedDate,  setSelectedDate]  = useState(format(new Date(), 'yyyy-MM-dd'))
//   const [slots,         setSlots]         = useState([])
//   const [selectedSlots, setSelectedSlots] = useState([])
//   const [loadingTurf,   setLoadingTurf]   = useState(true)
//   const [loadingSlots,  setLoadingSlots]  = useState(false)
//   const [booking,       setBooking]       = useState(false)
//   const [step,          setStep]          = useState('select')  // select | paying | done
//   const [bookingResult, setBookingResult] = useState(null)

//   const today = startOfToday()
//   const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i))

//   useEffect(() => {
//     turfAPI.getById(turfId)
//       .then(r => setTurf(r.data.turf || r.data))
//       .catch(() => navigate('/turfs'))
//       .finally(() => setLoadingTurf(false))
//   }, [turfId])

//   useEffect(() => {
//     if (!selectedDate) return
//     setSelectedSlots([])
//     setLoadingSlots(true)
//     slotAPI.getAvailability(turfId, selectedDate)
//       .then(r => setSlots(r.data.available_slots || []))
//       .catch(() => setSlots([]))
//       .finally(() => setLoadingSlots(false))
//   }, [selectedDate, turfId])

//   const toggleSlot = (slot) => {
//     setSelectedSlots(prev => {
//       const exists = prev.some(s => s.id === slot.id)
//       if (exists) return prev.filter(s => s.id !== slot.id)
//       if (prev.length === 0) return [slot]
//       const sorted   = [...prev].sort((a, b) => a.start_time.localeCompare(b.start_time))
//       const first    = sorted[0]
//       const last     = sorted[sorted.length - 1]
//       const isAfter  = slot.start_time === last.end_time
//       const isBefore = slot.end_time   === first.start_time
//       if (!isAfter && !isBefore) {
//         toast.error('Please select consecutive slots only')
//         return prev
//       }
//       return [...prev, slot]
//     })
//   }

//   const totalHours = selectedSlots.length
//   const totalPrice = turf ? totalHours * turf.price_per_hour : 0

//   // ─── Main booking + payment flow ────────────────────────────
//   const handleBook = async () => {
//     if (selectedSlots.length === 0) {
//       toast.error('Please select at least one slot')
//       return
//     }
//     setBooking(true)
//     setStep('paying')

//     let bookingId = null

//     try {
//       // STEP 1 — create booking (slots go to pending)
//       const slotRes = await slotAPI.book({ slot_ids: selectedSlots.map(s => s.id) })
//       bookingId = slotRes.data.booking_id
//       toast.success('Slots reserved! Opening payment...')

//       // STEP 2 — create Razorpay order
//       const payRes = await paymentAPI.initiate({ booking_id: bookingId })
//       const { order_id, amount, key_id } = payRes.data

//       // STEP 3 — open Razorpay popup
//       openPayment({
//         order_id,
//         amount,
//         key_id,
//         user,

//         // STEP 4a — payment success
//         onSuccess: async (razorpayResponse) => {
//           try {
//             await paymentAPI.verify({
//               booking_id:          bookingId,
//               razorpay_order_id:   razorpayResponse.razorpay_order_id,
//               razorpay_payment_id: razorpayResponse.razorpay_payment_id,
//               razorpay_signature:  razorpayResponse.razorpay_signature,
//               method:              razorpayResponse.method || 'upi',   // ← add this
//             })
//             setBookingResult({
//               booking_id:  bookingId,
//               payment_id:  razorpayResponse.razorpay_payment_id,
//               total_price: totalPrice,
//               date:        selectedDate,
//               hours:       totalHours,
//             })
//             setStep('done')
//             toast.success('Payment successful! Booking confirmed.')
//           } catch (err) {
//             toast.error('Payment verification failed. Please contact support.')
//             setStep('select')
//             setBooking(false)
//           }
//         },

//         // STEP 4b — payment failed or cancelled
//         // correct ✅ — uses your axios instance from api.js
//         onFailure: async (reason) => {
//           toast.error(reason || 'Payment cancelled')
//           try {
//             await bookingAPI.cancel(bookingId)
//           } catch { }
//           setStep('select')
//           setBooking(false)
//           // refresh slots so cancelled slots show as available again
//           slotAPI.getAvailability(turfId, selectedDate)
//             .then(r => setSlots(r.data.available_slots || []))
//         }
//       })

//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Something went wrong')
//       setStep('select')
//       setBooking(false)
//     }
//   }

//   if (loadingTurf) return <div className="pt-24"><LoadingScreen /></div>

//   // ─── Success screen ──────────────────────────────────────────
//   if (step === 'done' && bookingResult) {
//     return (
//       <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
//         <div className="page-container max-w-md">
//           <div className="card p-8 text-center">
//             <div className="w-20 h-20 bg-primary-500/15 rounded-full flex items-center justify-center mx-auto mb-6 relative">
//               <CheckCircle2 className="w-10 h-10 text-primary-400" />
//               <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping" />
//             </div>

//             <h2 className="font-display font-700 text-2xl text-white mb-2">
//               Booking Confirmed!
//             </h2>
//             <p className="text-white/50 text-sm mb-6">
//               Payment successful. Show your booking ID at the venue.
//             </p>

//             {/* Booking ID */}
//             <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-4">
//               <p className="text-white/40 text-xs mb-1">Booking ID</p>
//               <p className="font-mono font-500 text-primary-400 text-xl">
//                 #{String(bookingResult.booking_id).padStart(6, '0')}
//               </p>
//             </div>

//             {/* Payment ID */}
//             <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-6">
//               <p className="text-white/40 text-xs mb-1">Payment ID</p>
//               <p className="font-mono text-white/60 text-xs break-all">
//                 {bookingResult.payment_id}
//               </p>
//             </div>

//             {/* Details */}
//             <div className="space-y-2 text-sm text-left mb-6">
//               {[
//                 { label: 'Turf',     value: turf?.name },
//                 { label: 'Date',     value: format(new Date(bookingResult.date), 'dd MMM yyyy') },
//                 { label: 'Duration', value: `${bookingResult.hours} hour${bookingResult.hours > 1 ? 's' : ''}` },
//                 { label: 'Amount',   value: `₹${bookingResult.total_price}`, highlight: true },
//               ].map(({ label, value, highlight }) => (
//                 <div key={label} className="flex justify-between">
//                   <span className="text-white/40">{label}</span>
//                   <span className={highlight ? 'text-primary-400 font-display font-700' : 'text-white'}>
//                     {value}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col gap-2">
//               <Link to="/bookings" className="btn-primary text-center">View My Bookings</Link>
//               <Link to="/turfs"    className="btn-ghost text-center text-sm">Book Another Turf</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // ─── Main booking UI ─────────────────────────────────────────
//   return (
//     <div className="pt-24 pb-16 min-h-screen">
//       <div className="page-container max-w-3xl">

//         <button onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors group">
//           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//           Back to turf
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

//           {/* LEFT — date + slots */}
//           <div className="lg:col-span-3 space-y-6">
//             <div>
//               <p className="text-white/40 text-sm mb-1">Booking at</p>
//               <h1 className="font-display font-700 text-2xl text-white">{turf?.name}</h1>
//               <p className="text-white/40 text-sm">{turf?.city} · ₹{turf?.price_per_hour}/hr</p>
//             </div>

//             {/* Date picker */}
//             <div className="card p-5">
//               <div className="flex items-center gap-2 mb-4">
//                 <Calendar className="w-4 h-4 text-primary-400" />
//                 <h3 className="font-display font-600 text-white">Select Date</h3>
//               </div>
//               <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
//                 {dates.map(date => {
//                   const dateStr  = format(date, 'yyyy-MM-dd')
//                   const isActive = dateStr === selectedDate
//                   return (
//                     <button key={dateStr} onClick={() => setSelectedDate(dateStr)}
//                       className={`flex-shrink-0 flex flex-col items-center px-4 py-3
//                                   rounded-xl border transition-all min-w-[60px]
//                         ${isActive
//                           ? 'border-primary-500 bg-primary-500/20 text-primary-300'
//                           : 'border-white/10 text-white/60 hover:border-white/25'}`}>
//                       <span className="text-xs opacity-70">{format(date, 'EEE')}</span>
//                       <span className="font-display font-700 text-lg leading-tight">{format(date, 'd')}</span>
//                       <span className="text-xs opacity-60">{format(date, 'MMM')}</span>
//                     </button>
//                   )
//                 })}
//               </div>
//             </div>

//             {/* Slot grid */}
//             <div className="card p-5">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4 text-primary-400" />
//                   <h3 className="font-display font-600 text-white">Available Slots</h3>
//                 </div>
//                 {selectedSlots.length > 0 && (
//                   <button onClick={() => setSelectedSlots([])}
//                     className="text-xs text-white/30 hover:text-white transition-colors">
//                     Clear selection
//                   </button>
//                 )}
//               </div>

//               {loadingSlots ? (
//                 <div className="flex justify-center py-8"><Spinner /></div>
//               ) : slots.length === 0 ? (
//                 <div className="text-center py-8">
//                   <AlertCircle className="w-8 h-8 text-white/20 mx-auto mb-2" />
//                   <p className="text-white/40 text-sm">No slots available for this date</p>
//                   <p className="text-white/20 text-xs mt-1">Try selecting a different date</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
//                     {slots.map(slot => (
//                       <SlotButton key={slot.id} slot={slot} selected={selectedSlots} onClick={toggleSlot} />
//                     ))}
//                   </div>
//                   <p className="text-white/20 text-xs mt-4">
//                     Tap multiple consecutive slots to book longer sessions
//                   </p>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* RIGHT — summary */}
//           <div className="lg:col-span-2">
//             <div className="card p-5 sticky top-24">
//               <h3 className="font-display font-600 text-white mb-4">Booking Summary</h3>

//               <div className="space-y-3 mb-5">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-white/40">Date</span>
//                   <span className="text-white">{format(new Date(selectedDate), 'dd MMM yyyy')}</span>
//                 </div>

//                 {selectedSlots.length > 0 ? (
//                   <>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-white/40">Time</span>
//                       <span className="text-white text-right">
//                         {[...selectedSlots].sort((a, b) => a.start_time.localeCompare(b.start_time))[0]?.start_time?.slice(0, 5)}
//                         {' – '}
//                         {[...selectedSlots].sort((a, b) => a.start_time.localeCompare(b.start_time)).slice(-1)[0]?.end_time?.slice(0, 5)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-white/40">Duration</span>
//                       <span className="text-white">{totalHours} hr{totalHours > 1 ? 's' : ''}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-white/40">Rate</span>
//                       <span className="text-white">₹{turf?.price_per_hour}/hr</span>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="py-4 text-center text-white/25 text-sm">
//                     Select slots to see summary
//                   </div>
//                 )}
//               </div>

//               {selectedSlots.length > 0 && (
//                 <>
//                   <div className="divider mb-4" />
//                   <div className="flex justify-between mb-5">
//                     <span className="font-display font-600 text-white">Total</span>
//                     <span className="font-display font-700 text-2xl text-primary-400">
//                       ₹{totalPrice}
//                     </span>
//                   </div>
//                 </>
//               )}

//               <button
//                 onClick={handleBook}
//                 disabled={selectedSlots.length === 0 || booking}
//                 className="btn-primary w-full flex items-center justify-center gap-2"
//               >
//                 {booking ? (
//                   <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
//                 ) : (
//                   <><CreditCard className="w-4 h-4" /> Pay ₹{totalPrice || '0'}</>
//                 )}
//               </button>

//               <div className="flex items-center justify-center gap-2 mt-3">
//                 <img src="https://razorpay.com/favicon.ico" alt="" className="w-3 h-3 opacity-40" />
//                 <p className="text-white/20 text-xs">Secured by Razorpay</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, CheckCircle2, AlertCircle,
         Loader2, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, startOfToday, startOfMonth, endOfMonth,
         eachDayOfInterval, isSameMonth, isBefore, addMonths, subMonths } from 'date-fns'
import toast from 'react-hot-toast'
import { turfAPI, slotAPI, paymentAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { LoadingScreen, Spinner } from '../components/common'
import useRazorpay from '../hooks/useRazorpay'

// ── Slot button ───────────────────────────────────────────────
function SlotButton({ slot, selected, onClick }) {
  const isSelected    = selected.some(s => s.id === slot.id)
  const isUnavailable = slot.status !== 'available'
  return (
    <button onClick={() => !isUnavailable && onClick(slot)} disabled={isUnavailable}
      className={`relative p-3 rounded-xl border text-sm font-body transition-all
        ${isUnavailable
          ? 'border-white/5 bg-white/3 text-white/20 cursor-not-allowed'
          : isSelected
            ? 'border-primary-500 bg-primary-500/20 text-primary-300'
            : 'border-white/10 bg-dark-700/40 text-white/70 hover:border-white/25 hover:text-white'}`}>
      <div className="font-display font-600">{slot.start_time?.slice(0, 5)}</div>
      <div className="text-xs opacity-60 mt-0.5">
        {isUnavailable ? 'Taken' : `to ${slot.end_time?.slice(0, 5)}`}
      </div>
      {isSelected && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-500
                        rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-3 h-3 text-dark-900" />
        </div>
      )}
    </button>
  )
}

// ── 30-day Calendar Picker ────────────────────────────────────
function CalendarPicker({ selectedDate, onSelectDate }) {
  const today = startOfToday()
  const [viewMonth, setViewMonth] = useState(startOfMonth(today))

  const days = eachDayOfInterval({
    start: startOfMonth(viewMonth),
    end:   endOfMonth(viewMonth)
  })

  // padding days before the 1st
  const startPad = startOfMonth(viewMonth).getDay() // 0=Sun
  const padDays  = Array(startPad).fill(null)

  const canGoPrev = !isBefore(startOfMonth(viewMonth), startOfMonth(today))
    ? isSameMonth(viewMonth, today) ? false : true
    : false

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          disabled={isSameMonth(viewMonth, today)}
          className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30
                     disabled:cursor-not-allowed transition-colors text-white/50">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-display font-600 text-white">
          {format(viewMonth, 'MMMM yyyy')}
        </span>
        <button onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/50">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-center text-white/25 text-xs py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {padDays.map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const dateStr  = format(day, 'yyyy-MM-dd')
          const isPast   = isBefore(day, today)
          const isActive = dateStr === selectedDate
          const isToday  = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
          return (
            <button
              key={dateStr}
              onClick={() => !isPast && onSelectDate(dateStr)}
              disabled={isPast}
              className={`aspect-square rounded-xl text-sm flex items-center justify-center
                          transition-all relative
                ${isPast
                  ? 'text-white/15 cursor-not-allowed'
                  : isActive
                    ? 'bg-primary-500 text-dark-900 font-display font-700'
                    : isToday
                      ? 'border border-primary-500/40 text-primary-300 hover:bg-primary-500/15'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-white/25">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary-500" /> Selected
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm border border-primary-500/40" /> Today
        </div>
      </div>
    </div>
  )
}

// ── Main BookingPage ──────────────────────────────────────────
export default function BookingPage() {
  const { turfId }      = useParams()
  const navigate        = useNavigate()
  const { user }        = useAuth()
  const { openPayment } = useRazorpay()

  const [turf,          setTurf]          = useState(null)
  const [selectedDate,  setSelectedDate]  = useState(format(new Date(), 'yyyy-MM-dd'))
  const [slots,         setSlots]         = useState([])
  const [selectedSlots, setSelectedSlots] = useState([])
  const [loadingTurf,   setLoadingTurf]   = useState(true)
  const [loadingSlots,  setLoadingSlots]  = useState(false)
  const [booking,       setBooking]       = useState(false)
  const [step,          setStep]          = useState('select') // select | paying | done
  const [bookingResult, setBookingResult] = useState(null)

  useEffect(() => {
    turfAPI.getById(turfId)
      .then(r => setTurf(r.data.turf || r.data))
      .catch(() => navigate('/turfs'))
      .finally(() => setLoadingTurf(false))
  }, [turfId])

  useEffect(() => {
    if (!selectedDate) return
    setSelectedSlots([])
    setLoadingSlots(true)
    slotAPI.getAvailability(turfId, selectedDate)
      .then(r => setSlots(r.data.available_slots || []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [selectedDate, turfId])

  const toggleSlot = (slot) => {
    setSelectedSlots(prev => {
      const exists = prev.some(s => s.id === slot.id)
      if (exists) return prev.filter(s => s.id !== slot.id)
      if (prev.length === 0) return [slot]
      const sorted   = [...prev].sort((a, b) => a.start_time.localeCompare(b.start_time))
      const first    = sorted[0]
      const last     = sorted[sorted.length - 1]
      const isAfter  = slot.start_time === last.end_time
      const isBefore = slot.end_time   === first.start_time
      if (!isAfter && !isBefore) {
        toast.error('Please select consecutive slots only')
        return prev
      }
      return [...prev, slot]
    })
  }

  const totalHours = selectedSlots.length
  const totalPrice = turf ? totalHours * turf.price_per_hour : 0

  // ── Book + Pay flow ───────────────────────────────────────
  const handleBook = async () => {
    if (selectedSlots.length === 0) { toast.error('Please select at least one slot'); return }
    setBooking(true)
    setStep('paying')
    let bookingId = null

    try {
      // Step 1 — lock slots and create booking
      const slotRes = await slotAPI.book({ slot_ids: selectedSlots.map(s => s.id) })
      bookingId = slotRes.data.booking_id
      toast.success('Slots reserved! Opening payment...')

      // Step 2 — create Razorpay order
      const payRes = await paymentAPI.initiate({ booking_id: bookingId })
      const { order_id, amount, key_id } = payRes.data

      // Step 3 — open popup
      openPayment({
        order_id, amount, key_id, user,

        // Step 4a — success
        onSuccess: async (razorpayResponse) => {
          try {
            await paymentAPI.verify({
              booking_id:          bookingId,
              razorpay_order_id:   razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature:  razorpayResponse.razorpay_signature,
              method:              razorpayResponse.method || 'upi',
            })
            setBookingResult({
              booking_id:  bookingId,
              payment_id:  razorpayResponse.razorpay_payment_id,
              total_price: totalPrice,
              date:        selectedDate,
              hours:       totalHours,
              start_time:  [...selectedSlots].sort((a,b) => a.start_time.localeCompare(b.start_time))[0]?.start_time,
              end_time:    [...selectedSlots].sort((a,b) => a.start_time.localeCompare(b.start_time)).slice(-1)[0]?.end_time,
            })
            setStep('done')
            toast.success('Payment successful! Booking confirmed.')
          } catch {
            toast.error('Payment verification failed. Please contact support.')
            setStep('select')
            setBooking(false)
          }
        },

        // Step 4b — failed or cancelled by user
        // DO NOT call cancel API here — the slots are still pending
        // backend will auto-free them via a cleanup job, or user can retry
        onFailure: (reason) => {
          toast.error(reason || 'Payment cancelled')
          setStep('select')
          setBooking(false)
          // refresh slots to show current state
          slotAPI.getAvailability(turfId, selectedDate)
            .then(r => setSlots(r.data.available_slots || []))
        }
      })

    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
      setStep('select')
      setBooking(false)
    }
  }

  if (loadingTurf) return <div className="pt-24"><LoadingScreen /></div>

  // ── Success screen ────────────────────────────────────────
  if (step === 'done' && bookingResult) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="page-container max-w-md">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-primary-500/15 rounded-full flex items-center
                            justify-center mx-auto mb-6 relative">
              <CheckCircle2 className="w-10 h-10 text-primary-400" />
              <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-ping" />
            </div>
            <h2 className="font-display font-700 text-2xl text-white mb-2">Booking Confirmed!</h2>
            <p className="text-white/50 text-sm mb-6">
              Payment successful. Show your booking ID at the venue.
            </p>

            {/* Ticket */}
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-5 mb-4 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Booking ID</span>
                <span className="font-mono text-primary-400 font-600">
                  #{String(bookingResult.booking_id).padStart(6, '0')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Turf</span>
                <span className="text-white">{turf?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Date</span>
                <span className="text-white">
                  {format(new Date(bookingResult.date + 'T00:00:00'), 'dd MMM yyyy')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Time</span>
                <span className="text-white">
                  {bookingResult.start_time?.slice(0,5)} – {bookingResult.end_time?.slice(0,5)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Duration</span>
                <span className="text-white">
                  {bookingResult.hours} hr{bookingResult.hours > 1 ? 's' : ''}
                </span>
              </div>
              <div className="border-t border-primary-500/20 pt-3 flex justify-between">
                <span className="text-white/60 font-display font-600">Total Paid</span>
                <span className="text-primary-400 font-display font-700 text-lg">
                  ₹{bookingResult.total_price}
                </span>
              </div>
            </div>

            <div className="bg-white/3 border border-white/8 rounded-xl p-3 mb-6">
              <p className="text-white/30 text-xs mb-1">Payment ID</p>
              <p className="font-mono text-white/50 text-xs break-all">{bookingResult.payment_id}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Link to="/bookings" className="btn-primary text-center">View My Bookings</Link>
              <Link to="/turfs"    className="btn-ghost text-center text-sm">Book Another Turf</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main booking UI ───────────────────────────────────────
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="page-container max-w-3xl">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to turf
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — calendar + slots */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <p className="text-white/40 text-sm mb-1">Booking at</p>
              <h1 className="font-display font-700 text-2xl text-white">{turf?.name}</h1>
              <p className="text-white/40 text-sm">{turf?.city} · ₹{turf?.price_per_hour}/hr</p>
            </div>

            {/* 30-day calendar */}
            <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* Slots grid */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-400" />
                  <h3 className="font-display font-600 text-white">
                    Slots for {format(new Date(selectedDate + 'T00:00:00'), 'dd MMM')}
                  </h3>
                </div>
                {selectedSlots.length > 0 && (
                  <button onClick={() => setSelectedSlots([])}
                    className="text-xs text-white/30 hover:text-white transition-colors">
                    Clear
                  </button>
                )}
              </div>

              {loadingSlots ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">No slots available for this date</p>
                  <p className="text-white/20 text-xs mt-1">
                    Owner may not have generated slots yet — try another date
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map(slot => (
                      <SlotButton key={slot.id} slot={slot}
                        selected={selectedSlots} onClick={toggleSlot} />
                    ))}
                  </div>
                  <p className="text-white/20 text-xs mt-4">
                    Tap multiple consecutive slots to book longer sessions
                  </p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT — summary sidebar */}
          <div className="lg:col-span-2">
            <div className="card p-5 sticky top-24">
              <h3 className="font-display font-600 text-white mb-4">Booking Summary</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Date</span>
                  <span className="text-white">
                    {format(new Date(selectedDate + 'T00:00:00'), 'dd MMM yyyy')}
                  </span>
                </div>

                {selectedSlots.length > 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Time</span>
                      <span className="text-white text-right">
                        {[...selectedSlots].sort((a,b) => a.start_time.localeCompare(b.start_time))[0]?.start_time?.slice(0,5)}
                        {' – '}
                        {[...selectedSlots].sort((a,b) => a.start_time.localeCompare(b.start_time)).slice(-1)[0]?.end_time?.slice(0,5)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Duration</span>
                      <span className="text-white">{totalHours} hr{totalHours > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Rate</span>
                      <span className="text-white">₹{turf?.price_per_hour}/hr</span>
                    </div>
                  </>
                ) : (
                  <div className="py-4 text-center text-white/25 text-sm">
                    Select slots to see summary
                  </div>
                )}
              </div>

              {selectedSlots.length > 0 && (
                <>
                  <div className="divider mb-4" />
                  <div className="flex justify-between mb-5">
                    <span className="font-display font-600 text-white">Total</span>
                    <span className="font-display font-700 text-2xl text-primary-400">
                      ₹{totalPrice}
                    </span>
                  </div>
                </>
              )}

              <button onClick={handleBook}
                disabled={selectedSlots.length === 0 || booking}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {booking ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Pay ₹{totalPrice || '0'}</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-3">
                <img src="https://razorpay.com/favicon.ico" alt="" className="w-3 h-3 opacity-40" />
                <p className="text-white/20 text-xs">Secured by Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
