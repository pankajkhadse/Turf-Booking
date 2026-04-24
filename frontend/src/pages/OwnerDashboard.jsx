// import { useState, useEffect } from 'react'
// import { Plus, Trash2, Calendar, Clock, Loader2, LayoutDashboard,
//          Users, TrendingUp, BarChart2, ChevronDown, ChevronRight,
//          MapPin, Phone, Mail, X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
// import { format, addDays } from 'date-fns'
// import toast from 'react-hot-toast'
// import { turfAPI, slotAPI, bookingAPI } from '../services/api'
// import { useAuth } from '../context/AuthContext'
// import { Spinner, EmptyState, BookingStatusBadge } from '../components/common'

// // ── Helpers ────────────────────────────────────────────────────
// const toHHMM = (t) => t ? String(t).slice(0, 5) : ''

// // ── Create Turf Modal ──────────────────────────────────────────
// function CreateTurfModal({ onClose, onCreated }) {
//   const SPORTS = ['Football','Cricket','Box Cricket','Badminton','Basketball','Volleyball','Tennis']
//   const [form, setForm] = useState({ name: '', city: '', address: '', price_per_hour: '', status: 'active' })
//   const [selectedSports, setSelectedSports] = useState([])
//   const [loading, setLoading] = useState(false)

//   const toggleSport = (s) => setSelectedSports(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

//   const submit = async (e) => {
//     e.preventDefault()
//     if (!form.name || !form.city || !form.address || !form.price_per_hour) { toast.error('Please fill all required fields'); return }
//     if (selectedSports.length === 0) { toast.error('Select at least one sport'); return }
//     setLoading(true)
//     try {
//       await turfAPI.create({ ...form, sports: selectedSports, price_per_hour: Number(form.price_per_hour) })
//       toast.success('Turf created successfully!')
//       onCreated(); onClose()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to create turf') }
//     finally { setLoading(false) }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
//          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
//       <div className="card w-full max-w-lg p-6 my-4 animate-fade-in">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="font-display font-700 text-white text-xl">List a New Turf</h3>
//           <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
//         </div>
//         <form onSubmit={submit} className="space-y-4">
//           {[
//             { name: 'name',    label: 'Turf Name',   placeholder: 'Champions Arena' },
//             { name: 'city',    label: 'City',         placeholder: 'Nagpur' },
//             { name: 'address', label: 'Full Address', placeholder: 'Plot 5, Khamla, Nagpur' },
//           ].map(f => (
//             <div key={f.name}>
//               <label className="label">{f.label}</label>
//               <input className="input" placeholder={f.placeholder} value={form[f.name]}
//                 onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} />
//             </div>
//           ))}
//           <div>
//             <label className="label">Price per Hour (₹)</label>
//             <input className="input" type="number" min="0" placeholder="800" value={form.price_per_hour}
//               onChange={e => setForm(p => ({ ...p, price_per_hour: e.target.value }))} />
//           </div>
//           <div>
//             <label className="label">Sports Available</label>
//             <div className="flex flex-wrap gap-2">
//               {SPORTS.map(s => (
//                 <button key={s} type="button" onClick={() => toggleSport(s)}
//                   className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
//                     selectedSports.includes(s)
//                       ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
//                       : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25'}`}>
//                   {s}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="flex gap-3 pt-2">
//             <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
//             <button type="submit" disabled={loading}
//               className="btn-primary flex-1 flex items-center justify-center gap-2">
//               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create Turf
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // ── Generate Slots Modal ───────────────────────────────────────
// function GenerateSlotsModal({ turf, onClose }) {
//   const today = format(new Date(), 'yyyy-MM-dd')
//   const [form, setForm] = useState({ date: today, open_time: '06:00', close_time: '22:00', duration_minutes: 60 })
//   const [loading, setLoading] = useState(false)

//   const submit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const res = await slotAPI.generate({ turf_id: turf.id, ...form, duration_minutes: Number(form.duration_minutes) })
//       toast.success(res.data.message); onClose()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to generate slots') }
//     finally { setLoading(false) }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
//       <div className="card w-full max-w-md p-6 animate-fade-in">
//         <div className="flex items-center justify-between mb-1">
//           <h3 className="font-display font-700 text-white text-xl">Generate Slots</h3>
//           <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
//         </div>
//         <p className="text-white/40 text-sm mb-6">{turf.name}</p>
//         <form onSubmit={submit} className="space-y-4">
//           <div>
//             <label className="label">Date</label>
//             <input type="date" className="input" value={form.date} min={today}
//               onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="label">Open Time</label>
//               <input type="time" className="input" value={form.open_time}
//                 onChange={e => setForm(p => ({ ...p, open_time: e.target.value }))} />
//             </div>
//             <div>
//               <label className="label">Close Time</label>
//               <input type="time" className="input" value={form.close_time}
//                 onChange={e => setForm(p => ({ ...p, close_time: e.target.value }))} />
//             </div>
//           </div>
//           <div>
//             <label className="label">Slot Duration</label>
//             <select className="input appearance-none" value={form.duration_minutes}
//               onChange={e => setForm(p => ({ ...p, duration_minutes: e.target.value }))}>
//               <option value={60}>1 hour</option>
//               <option value={90}>1.5 hours</option>
//               <option value={120}>2 hours</option>
//             </select>
//           </div>
//           <div className="flex gap-3 pt-2">
//             <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
//             <button type="submit" disabled={loading}
//               className="btn-primary flex-1 flex items-center justify-center gap-2">
//               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Generate
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // ── Occupancy View ─────────────────────────────────────────────
// function OccupancyView({ turf }) {
//   const today = format(new Date(), 'yyyy-MM-dd')
//   const [date,      setDate]      = useState(today)
//   const [data,      setData]      = useState(null)
//   const [loading,   setLoading]   = useState(false)

//   // generate 7 day options
//   const days = Array.from({ length: 7 }, (_, i) => {
//     const d = addDays(new Date(), i)
//     return { label: format(d, 'EEE d'), value: format(d, 'yyyy-MM-dd') }
//   })

//   useEffect(() => { fetchOccupancy(date) }, [date, turf.id])

//   const fetchOccupancy = async (d) => {
//     setLoading(true)
//     try {
//       const res = await bookingAPI.getTurfOccupancy(turf.id, d)
//       setData(res.data)
//     } catch { setData(null) }
//     finally { setLoading(false) }
//   }

//   const statusIcon = (status) => {
//     if (status === 'booked')    return <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
//     if (status === 'pending')   return <AlertCircle  className="w-3.5 h-3.5 text-amber-400  flex-shrink-0" />
//     if (status === 'blocked')   return <XCircle      className="w-3.5 h-3.5 text-red-400    flex-shrink-0" />
//     return <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" />
//   }

//   const statusColor = (status) => {
//     if (status === 'booked')    return 'bg-primary-500/15 border-primary-500/25'
//     if (status === 'pending')   return 'bg-amber-500/15  border-amber-500/25'
//     if (status === 'blocked')   return 'bg-red-500/15    border-red-500/25'
//     return 'bg-white/3 border-white/8'
//   }

//   return (
//     <div className="space-y-4">
//       {/* Date strip */}
//       <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
//         {days.map(d => (
//           <button key={d.value} onClick={() => setDate(d.value)}
//             className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm border transition-all ${
//               date === d.value
//                 ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
//                 : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white'}`}>
//             {d.label}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-8"><Spinner /></div>
//       ) : !data ? (
//         <div className="text-center py-8 text-white/30 text-sm">No slot data for this date</div>
//       ) : (
//         <>
//           {/* Summary bar */}
//           <div className="grid grid-cols-4 gap-3">
//             {[
//               { label: 'Total Slots', value: data.summary.total,      color: 'text-white' },
//               { label: 'Booked',      value: data.summary.booked,     color: 'text-primary-400' },
//               { label: 'Available',   value: data.summary.available,  color: 'text-white/60' },
//               { label: 'Occupancy',   value: `${data.summary.occupancy_percent}%`, color: 'text-amber-400' },
//             ].map(s => (
//               <div key={s.label} className="card p-3 text-center">
//                 <div className={`font-display font-700 text-xl ${s.color}`}>{s.value}</div>
//                 <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* Occupancy progress bar */}
//           <div className="card p-4">
//             <div className="flex justify-between text-xs text-white/40 mb-2">
//               <span>Occupancy</span>
//               <span>{data.summary.booked}/{data.summary.total} slots filled</span>
//             </div>
//             <div className="h-2 bg-white/5 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-primary-500 rounded-full transition-all duration-500"
//                 style={{ width: `${data.summary.occupancy_percent}%` }}
//               />
//             </div>
//           </div>

//           {/* Slot grid */}
//           {data.slots.length === 0 ? (
//             <div className="text-center py-6 text-white/30 text-sm">
//               No slots generated for this date yet
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//               {data.slots.map(slot => (
//                 <div key={slot.id}
//                   className={`flex items-center gap-2 p-3 rounded-xl border ${statusColor(slot.status)}`}>
//                   {statusIcon(slot.status)}
//                   <div className="min-w-0">
//                     <div className="text-white/80 text-sm font-display font-600">
//                       {toHHMM(slot.start_time)} – {toHHMM(slot.end_time)}
//                     </div>
//                     {slot.booked_by ? (
//                       <div className="text-white/40 text-xs truncate">{slot.booked_by}</div>
//                     ) : (
//                       <div className="text-white/25 text-xs capitalize">{slot.status}</div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Legend */}
//           <div className="flex flex-wrap gap-4 text-xs text-white/30">
//             {[
//               { color: 'bg-primary-500/50', label: 'Booked' },
//               { color: 'bg-amber-500/50',   label: 'Pending' },
//               { color: 'bg-white/20',       label: 'Available' },
//               { color: 'bg-red-500/50',     label: 'Blocked' },
//             ].map(l => (
//               <div key={l.label} className="flex items-center gap-1.5">
//                 <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
//                 {l.label}
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// // ── Bookings Table ─────────────────────────────────────────────
// function BookingsTable({ turf }) {
//   const [bookings, setBookings] = useState([])
//   const [loading,  setLoading]  = useState(false)
//   const [filter,   setFilter]   = useState('all')
//   const [expanded, setExpanded] = useState(null)

//   useEffect(() => { fetchBookings() }, [turf.id])

//   const fetchBookings = async () => {
//     setLoading(true)
//     try {
//       const res = await bookingAPI.getTurfBookings(turf.id)
//       setBookings(res.data.bookings || [])
//     } catch { setBookings([]) }
//     finally { setLoading(false) }
//   }

//   const FILTERS = ['all', 'confirmed', 'pending', 'cancelled']
//   const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

//   return (
//     <div className="space-y-4">
//       {/* Filter tabs */}
//       <div className="flex gap-2 flex-wrap">
//         {FILTERS.map(f => (
//           <button key={f} onClick={() => setFilter(f)}
//             className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition-all ${
//               filter === f
//                 ? 'bg-primary-500/20 border-primary-500/30 text-primary-300'
//                 : 'border-white/5 text-white/40 hover:border-white/15 hover:text-white'}`}>
//             {f}
//             {f === 'all' && ` (${bookings.length})`}
//             {f !== 'all' && ` (${bookings.filter(b => b.status === f).length})`}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-8"><Spinner /></div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-10 text-white/30 text-sm">
//           No {filter === 'all' ? '' : filter} bookings yet
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map(booking => (
//             <div key={booking.id} className="card overflow-hidden">
//               <div className="p-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

//                   {/* Customer info */}
//                   <div className="flex items-center gap-3 min-w-0">
//                     <div className="w-9 h-9 bg-primary-500/15 rounded-full flex items-center
//                                     justify-center flex-shrink-0">
//                       <span className="text-primary-400 font-display font-700 text-sm">
//                         {booking.customer_name?.charAt(0) || 'U'}
//                       </span>
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-white font-body truncate">{booking.customer_name}</p>
//                       <p className="text-white/30 text-xs">
//                         {booking.slot_date
//                           ? format(new Date(booking.slot_date), 'dd MMM yyyy')
//                           : '—'}
//                         {booking.slot_times && ` · ${booking.slot_times}`}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Right side */}
//                   <div className="flex items-center gap-3 flex-shrink-0">
//                     <BookingStatusBadge status={booking.status} />
//                     <span className="font-display font-700 text-primary-400">
//                       ₹{booking.total_price}
//                     </span>
//                     <button onClick={() => setExpanded(expanded === booking.id ? null : booking.id)}
//                       className="text-white/30 hover:text-white transition-colors">
//                       <ChevronDown className={`w-4 h-4 transition-transform ${expanded === booking.id ? 'rotate-180' : ''}`} />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Expanded detail */}
//               {expanded === booking.id && (
//                 <div className="border-t border-white/5 bg-dark-800/40 px-4 py-4 animate-fade-in">
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
//                     <div>
//                       <p className="text-white/30 text-xs mb-1">Booking ID</p>
//                       <p className="font-mono text-primary-400">#{String(booking.id).padStart(6, '0')}</p>
//                     </div>
//                     <div>
//                       <p className="text-white/30 text-xs mb-1">Phone</p>
//                       <div className="flex items-center gap-1 text-white/70">
//                         <Phone className="w-3.5 h-3.5" />
//                         {booking.customer_phone || '—'}
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-white/30 text-xs mb-1">Email</p>
//                       <div className="flex items-center gap-1 text-white/70 truncate">
//                         <Mail className="w-3.5 h-3.5 flex-shrink-0" />
//                         <span className="truncate">{booking.customer_email || '—'}</span>
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-white/30 text-xs mb-1">Slots Booked</p>
//                       <p className="text-white/70">{booking.slot_times || '—'}</p>
//                     </div>
//                     <div>
//                       <p className="text-white/30 text-xs mb-1">Amount</p>
//                       <p className="text-primary-400 font-display font-600">₹{booking.total_price}</p>
//                     </div>
//                     <div>
//                       <p className="text-white/30 text-xs mb-1">Booked At</p>
//                       <p className="text-white/70">
//                         {booking.booked_at
//                           ? format(new Date(booking.booked_at), 'dd MMM, hh:mm a')
//                           : '—'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Stats Cards ────────────────────────────────────────────────
// function StatsCards({ turf }) {
//   const [stats,   setStats]   = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     bookingAPI.getTurfStats(turf.id)
//       .then(r => setStats(r.data.stats))
//       .catch(() => setStats(null))
//       .finally(() => setLoading(false))
//   }, [turf.id])

//   if (loading) return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//       {Array(4).fill(0).map((_, i) => (
//         <div key={i} className="card p-4 animate-pulse">
//           <div className="shimmer h-7 w-16 rounded mb-2" />
//           <div className="shimmer h-3 w-20 rounded" />
//         </div>
//       ))}
//     </div>
//   )

//   if (!stats) return null

//   const occupancyPct = stats.total_slots > 0
//     ? Math.round((stats.booked_slots / stats.total_slots) * 100)
//     : 0

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//       {[
//         { label: 'Total Revenue',   value: `₹${Number(stats.total_revenue).toLocaleString('en-IN')}`, color: 'text-primary-400', sub: 'all time' },
//         { label: "Today's Revenue", value: `₹${Number(stats.today_revenue).toLocaleString('en-IN')}`, color: 'text-amber-400',   sub: `${stats.today_bookings} bookings` },
//         { label: 'Confirmed',       value: stats.confirmed_bookings,   color: 'text-white',       sub: `${stats.cancelled_bookings} cancelled` },
//         { label: 'Occupancy',       value: `${occupancyPct}%`,         color: 'text-primary-300', sub: `${stats.booked_slots}/${stats.total_slots} slots` },
//       ].map(s => (
//         <div key={s.label} className="card p-4">
//           <div className={`font-display font-700 text-2xl mb-0.5 ${s.color}`}>{s.value}</div>
//           <div className="text-white/60 text-xs font-body">{s.label}</div>
//           <div className="text-white/25 text-xs mt-0.5">{s.sub}</div>
//         </div>
//       ))}
//     </div>
//   )
// }

// // ── Turf Panel ─────────────────────────────────────────────────
// function TurfPanel({ turf, onSlots, onDelete, onRefresh }) {
//   const [activeTab, setActiveTab] = useState(null)

//   const TABS = [
//     { key: 'bookings',  label: 'Bookings',  icon: Users },
//     { key: 'occupancy', label: 'Occupancy', icon: BarChart2 },
//   ]

//   const toggleTab = (key) => setActiveTab(prev => prev === key ? null : key)

//   return (
//     <div className="card overflow-hidden">
//       {/* Turf header */}
//       <div className="p-5">
//         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 flex-wrap mb-1">
//               <h3 className="font-display font-600 text-white text-lg">{turf.name}</h3>
//               <span className={`badge text-xs ${turf.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
//                 {turf.status}
//               </span>
//             </div>
//             <div className="flex items-center gap-1 text-white/40 text-sm">
//               <MapPin className="w-3.5 h-3.5" /> {turf.city} · ₹{turf.price_per_hour}/hr
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="flex items-center gap-2">
//             <button onClick={() => onSlots(turf)}
//               className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
//                          bg-primary-500/10 border border-primary-500/20 text-primary-400
//                          hover:bg-primary-500/20 transition-all">
//               <Calendar className="w-4 h-4" /> Slots
//             </button>
//             <button onClick={() => onDelete(turf)}
//               className="p-2 rounded-lg text-white/30 hover:text-red-400
//                          hover:bg-red-500/10 transition-all border border-white/5">
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Stats for this turf */}
//         <div className="mt-4">
//           <StatsCards turf={turf} />
//         </div>

//         {/* Tab buttons */}
//         <div className="flex gap-2 mt-4">
//           {TABS.map(t => (
//             <button key={t.key} onClick={() => toggleTab(t.key)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all ${
//                 activeTab === t.key
//                   ? 'bg-primary-500/20 border-primary-500/30 text-primary-300'
//                   : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white'}`}>
//               <t.icon className="w-4 h-4" />
//               {t.label}
//               <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeTab === t.key ? 'rotate-180' : ''}`} />
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tab content */}
//       {activeTab && (
//         <div className="border-t border-white/5 p-5 bg-dark-800/20 animate-fade-in">
//           {activeTab === 'bookings'  && <BookingsTable  turf={turf} />}
//           {activeTab === 'occupancy' && <OccupancyView  turf={turf} />}
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Main Dashboard ─────────────────────────────────────────────
// export default function OwnerDashboard() {
//   const { user } = useAuth()
//   const [turfs,        setTurfs]        = useState([])
//   const [loading,      setLoading]      = useState(true)
//   const [showCreate,   setShowCreate]   = useState(false)
//   const [slotsTarget,  setSlotsTarget]  = useState(null)
//   const [deleteTarget, setDeleteTarget] = useState(null)
//   const [deleting,     setDeleting]     = useState(false)

//   const fetchTurfs = async () => {
//     setLoading(true)
//     try {
//       const res = await turfAPI.getAll()
//       const all = res.data.turfs || []
//       setTurfs(all.filter(t => Number(t.owner_id) === Number(user?.id)))
//     } catch { setTurfs([]) }
//     finally { setLoading(false) }
//   }

//   useEffect(() => { fetchTurfs() }, [])

//   const handleDelete = async () => {
//     if (!deleteTarget) return
//     setDeleting(true)
//     try {
//       await turfAPI.delete(deleteTarget.id)
//       toast.success('Turf deleted')
//       setDeleteTarget(null)
//       fetchTurfs()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete')
//     } finally { setDeleting(false) }
//   }

//   return (
//     <div className="pt-24 pb-16 min-h-screen">
//       <div className="page-container">

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="section-title">Owner Dashboard</h1>
//             <p className="text-white/40 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
//           </div>
//           <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 self-start">
//             <Plus className="w-4 h-4" /> List New Turf
//           </button>
//         </div>

//         {/* Turf list */}
//         {loading ? (
//           <div className="flex justify-center py-16"><Spinner size="lg" /></div>
//         ) : turfs.length === 0 ? (
//           <EmptyState
//             icon={LayoutDashboard}
//             title="No turfs listed yet"
//             desc="List your first turf to start accepting bookings"
//             action={
//               <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
//                 <Plus className="w-4 h-4 inline mr-1" /> List a Turf
//               </button>
//             }
//           />
//         ) : (
//           <div className="space-y-6">
//             {turfs.map(turf => (
//               <TurfPanel
//                 key={turf.id}
//                 turf={turf}
//                 onSlots={setSlotsTarget}
//                 onDelete={setDeleteTarget}
//                 onRefresh={fetchTurfs}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showCreate  && <CreateTurfModal onClose={() => setShowCreate(false)} onCreated={fetchTurfs} />}
//       {slotsTarget && <GenerateSlotsModal turf={slotsTarget} onClose={() => setSlotsTarget(null)} />}

//       {/* Delete confirm */}
//       {deleteTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//              style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
//           <div className="card w-full max-w-sm p-6 animate-fade-in">
//             <h3 className="font-display font-700 text-white text-lg mb-2">Delete Turf?</h3>
//             <p className="text-white/50 text-sm mb-6">
//               Are you sure you want to delete{' '}
//               <span className="text-white">{deleteTarget.name}</span>?
//               All slots and bookings will also be removed.
//             </p>
//             <div className="flex gap-3">
//               <button onClick={() => setDeleteTarget(null)} className="btn-outline flex-1">Cancel</button>
//               <button onClick={handleDelete} disabled={deleting}
//                 className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400
//                            hover:bg-red-500/30 rounded-xl px-4 py-3 transition-all
//                            flex items-center justify-center gap-2">
//                 {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Calendar, Clock, Loader2, LayoutDashboard,
         Users, TrendingUp, BarChart2, ChevronDown, ChevronRight,
         MapPin, Phone, Mail, X, CheckCircle2, XCircle, AlertCircle,
         Image as ImageIcon } from 'lucide-react'
import { format, addDays } from 'date-fns'
import toast from 'react-hot-toast'
import { turfAPI, slotAPI, bookingAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Spinner, EmptyState, BookingStatusBadge } from '../components/common'

// ── Helpers ────────────────────────────────────────────────────
const toHHMM = (t) => t ? String(t).slice(0, 5) : ''

// ── Create Turf Modal ──────────────────────────────────────────
function CreateTurfModal({ onClose, onCreated }) {
  const SPORTS = ['Football','Cricket','Box Cricket','Badminton','Basketball','Volleyball','Tennis']
  const [form, setForm] = useState({ name: '', city: '', address: '', price_per_hour: '', status: 'active' })
  const [selectedSports, setSelectedSports] = useState([])
  const [loading, setLoading] = useState(false)

  const toggleSport = (s) => setSelectedSports(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.city || !form.address || !form.price_per_hour) { toast.error('Please fill all required fields'); return }
    if (selectedSports.length === 0) { toast.error('Select at least one sport'); return }
    setLoading(true)
    try {
      await turfAPI.create({ ...form, sports: selectedSports, price_per_hour: Number(form.price_per_hour) })
      toast.success('Turf created successfully!')
      onCreated(); onClose()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create turf') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
         style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-lg p-6 my-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-700 text-white text-xl">List a New Turf</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {[
            { name: 'name',    label: 'Turf Name',   placeholder: 'Champions Arena' },
            { name: 'city',    label: 'City',         placeholder: 'Nagpur' },
            { name: 'address', label: 'Full Address', placeholder: 'Plot 5, Khamla, Nagpur' },
          ].map(f => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input className="input" placeholder={f.placeholder} value={form[f.name]}
                onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="label">Price per Hour (₹)</label>
            <input className="input" type="number" min="0" placeholder="800" value={form.price_per_hour}
              onChange={e => setForm(p => ({ ...p, price_per_hour: e.target.value }))} />
          </div>
          <div>
            <label className="label">Sports Available</label>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map(s => (
                <button key={s} type="button" onClick={() => toggleSport(s)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    selectedSports.includes(s)
                      ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create Turf
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Generate Slots Modal ───────────────────────────────────────
function GenerateSlotsModal({ turf, onClose }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [form, setForm] = useState({ date: today, open_time: '06:00', close_time: '22:00', duration_minutes: 60 })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await slotAPI.generate({ turf_id: turf.id, ...form, duration_minutes: Number(form.duration_minutes) })
      toast.success(res.data.message); onClose()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to generate slots') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="card w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-700 text-white text-xl">Generate Slots</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-white/40 text-sm mb-6">{turf.name}</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={form.date} min={today}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Open Time</label>
              <input type="time" className="input" value={form.open_time}
                onChange={e => setForm(p => ({ ...p, open_time: e.target.value }))} />
            </div>
            <div>
              <label className="label">Close Time</label>
              <input type="time" className="input" value={form.close_time}
                onChange={e => setForm(p => ({ ...p, close_time: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Slot Duration</label>
            <select className="input appearance-none" value={form.duration_minutes}
              onChange={e => setForm(p => ({ ...p, duration_minutes: e.target.value }))}>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Occupancy View ─────────────────────────────────────────────
function OccupancyView({ turf }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [date,      setDate]      = useState(today)
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(false)

  // generate 7 day options
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i)
    return { label: format(d, 'EEE d'), value: format(d, 'yyyy-MM-dd') }
  })

  useEffect(() => { fetchOccupancy(date) }, [date, turf.id])

  const fetchOccupancy = async (d) => {
    setLoading(true)
    try {
      const res = await bookingAPI.getTurfOccupancy(turf.id, d)
      setData(res.data)
    } catch { setData(null) }
    finally { setLoading(false) }
  }

  const statusIcon = (status) => {
    if (status === 'booked')    return <CheckCircle2 className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
    if (status === 'pending')   return <AlertCircle  className="w-3.5 h-3.5 text-amber-400  flex-shrink-0" />
    if (status === 'blocked')   return <XCircle      className="w-3.5 h-3.5 text-red-400    flex-shrink-0" />
    return <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" />
  }

  const statusColor = (status) => {
    if (status === 'booked')    return 'bg-primary-500/15 border-primary-500/25'
    if (status === 'pending')   return 'bg-amber-500/15  border-amber-500/25'
    if (status === 'blocked')   return 'bg-red-500/15    border-red-500/25'
    return 'bg-white/3 border-white/8'
  }

  return (
    <div className="space-y-4">
      {/* Date strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {days.map(d => (
          <button key={d.value} onClick={() => setDate(d.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm border transition-all ${
              date === d.value
                ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white'}`}>
            {d.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : !data ? (
        <div className="text-center py-8 text-white/30 text-sm">No slot data for this date</div>
      ) : (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Slots', value: data.summary.total,      color: 'text-white' },
              { label: 'Booked',      value: data.summary.booked,     color: 'text-primary-400' },
              { label: 'Available',   value: data.summary.available,  color: 'text-white/60' },
              { label: 'Occupancy',   value: `${data.summary.occupancy_percent}%`, color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="card p-3 text-center">
                <div className={`font-display font-700 text-xl ${s.color}`}>{s.value}</div>
                <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Occupancy progress bar */}
          <div className="card p-4">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Occupancy</span>
              <span>{data.summary.booked}/{data.summary.total} slots filled</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${data.summary.occupancy_percent}%` }}
              />
            </div>
          </div>

          {/* Slot grid */}
          {data.slots.length === 0 ? (
            <div className="text-center py-6 text-white/30 text-sm">
              No slots generated for this date yet
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {data.slots.map(slot => (
                <div key={slot.id}
                  className={`flex items-center gap-2 p-3 rounded-xl border ${statusColor(slot.status)}`}>
                  {statusIcon(slot.status)}
                  <div className="min-w-0">
                    <div className="text-white/80 text-sm font-display font-600">
                      {toHHMM(slot.start_time)} – {toHHMM(slot.end_time)}
                    </div>
                    {slot.booked_by ? (
                      <div className="text-white/40 text-xs truncate">{slot.booked_by}</div>
                    ) : (
                      <div className="text-white/25 text-xs capitalize">{slot.status}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-white/30">
            {[
              { color: 'bg-primary-500/50', label: 'Booked' },
              { color: 'bg-amber-500/50',   label: 'Pending' },
              { color: 'bg-white/20',       label: 'Available' },
              { color: 'bg-red-500/50',     label: 'Blocked' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Bookings Table ─────────────────────────────────────────────
function BookingsTable({ turf }) {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [filter,   setFilter]   = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { fetchBookings() }, [turf.id])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingAPI.getTurfBookings(turf.id)
      setBookings(res.data.bookings || [])
    } catch { setBookings([]) }
    finally { setLoading(false) }
  }

  const FILTERS = ['all', 'confirmed', 'pending', 'cancelled']
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize border transition-all ${
              filter === f
                ? 'bg-primary-500/20 border-primary-500/30 text-primary-300'
                : 'border-white/5 text-white/40 hover:border-white/15 hover:text-white'}`}>
            {f}
            {f === 'all' && ` (${bookings.length})`}
            {f !== 'all' && ` (${bookings.filter(b => b.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-white/30 text-sm">
          No {filter === 'all' ? '' : filter} bookings yet
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => (
            <div key={booking.id} className="card overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                  {/* Customer info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-primary-500/15 rounded-full flex items-center
                                    justify-center flex-shrink-0">
                      <span className="text-primary-400 font-display font-700 text-sm">
                        {booking.customer_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-body truncate">{booking.customer_name}</p>
                      <p className="text-white/30 text-xs">
                        {booking.slot_date
                          ? format(new Date(booking.slot_date), 'dd MMM yyyy')
                          : '—'}
                        {booking.slot_times && ` · ${booking.slot_times}`}
                      </p>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <BookingStatusBadge status={booking.status} />
                    <span className="font-display font-700 text-primary-400">
                      ₹{booking.total_price}
                    </span>
                    <button onClick={() => setExpanded(expanded === booking.id ? null : booking.id)}
                      className="text-white/30 hover:text-white transition-colors">
                      <ChevronDown className={`w-4 h-4 transition-transform ${expanded === booking.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === booking.id && (
                <div className="border-t border-white/5 bg-dark-800/40 px-4 py-4 animate-fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-white/30 text-xs mb-1">Booking ID</p>
                      <p className="font-mono text-primary-400">#{String(booking.id).padStart(6, '0')}</p>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-1">Phone</p>
                      <div className="flex items-center gap-1 text-white/70">
                        <Phone className="w-3.5 h-3.5" />
                        {booking.customer_phone || '—'}
                      </div>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-1">Email</p>
                      <div className="flex items-center gap-1 text-white/70 truncate">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{booking.customer_email || '—'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-1">Slots Booked</p>
                      <p className="text-white/70">{booking.slot_times || '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-1">Amount</p>
                      <p className="text-primary-400 font-display font-600">₹{booking.total_price}</p>
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-1">Booked At</p>
                      <p className="text-white/70">
                        {booking.booked_at
                          ? format(new Date(booking.booked_at), 'dd MMM, hh:mm a')
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Stats Cards ────────────────────────────────────────────────
function StatsCards({ turf }) {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingAPI.getTurfStats(turf.id)
      .then(r => setStats(r.data.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [turf.id])

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="shimmer h-7 w-16 rounded mb-2" />
          <div className="shimmer h-3 w-20 rounded" />
        </div>
      ))}
    </div>
  )

  if (!stats) return null

  const occupancyPct = stats.total_slots > 0
    ? Math.round((stats.booked_slots / stats.total_slots) * 100)
    : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: 'Total Revenue',   value: `₹${Number(stats.total_revenue).toLocaleString('en-IN')}`, color: 'text-primary-400', sub: 'all time' },
        { label: "Today's Revenue", value: `₹${Number(stats.today_revenue).toLocaleString('en-IN')}`, color: 'text-amber-400',   sub: `${stats.today_bookings} bookings` },
        { label: 'Confirmed',       value: stats.confirmed_bookings,   color: 'text-white',       sub: `${stats.cancelled_bookings} cancelled` },
        { label: 'Occupancy',       value: `${occupancyPct}%`,         color: 'text-primary-300', sub: `${stats.booked_slots}/${stats.total_slots} slots` },
      ].map(s => (
        <div key={s.label} className="card p-4">
          <div className={`font-display font-700 text-2xl mb-0.5 ${s.color}`}>{s.value}</div>
          <div className="text-white/60 text-xs font-body">{s.label}</div>
          <div className="text-white/25 text-xs mt-0.5">{s.sub}</div>
        </div>
      ))}
    </div>
  )
}


// ── Photo Manager ──────────────────────────────────────────────
function PhotoManager({ turf }) {
  const [photos,    setPhotos]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const res = await turfAPI.getPhotos(turf.id)
      setPhotos(res.data.photos || [])
    } catch { setPhotos([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchPhotos() }, [turf.id])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const remaining = 4 - photos.length
    if (remaining <= 0) { toast.error('Maximum 4 photos per turf'); return }

    const toUpload = files.slice(0, remaining)
    const formData = new FormData()
    toUpload.forEach(f => formData.append('photos', f))

    setUploading(true)
    try {
      await turfAPI.uploadPhotos(turf.id, formData)
      toast.success(`${toUpload.length} photo${toUpload.length > 1 ? 's' : ''} uploaded!`)
      fetchPhotos()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDelete = async (photo_id) => {
    try {
      await turfAPI.deletePhoto(turf.id, photo_id)
      toast.success('Photo deleted')
      fetchPhotos()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const handleMakePrimary = async (photo_id) => {
    try {
      await turfAPI.makePrimary(turf.id, photo_id)
      toast.success('Primary photo updated')
      fetchPhotos()
    } catch (err) {
      toast.error('Failed to update primary photo')
    }
  }

  const canUpload = photos.length < 4

  return (
    <div className="space-y-4">
      {/* Upload area */}
      {canUpload && (
        <div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            className="hidden"
            id={`photo-upload-${turf.id}`}
          />
          <label
            htmlFor={`photo-upload-${turf.id}`}
            className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl
                        border-2 border-dashed cursor-pointer transition-all
                        ${uploading
                          ? 'border-primary-500/30 bg-primary-500/5 cursor-not-allowed'
                          : 'border-white/15 hover:border-primary-500/40 hover:bg-primary-500/5'}`}>
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                <span className="text-white/40 text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-white/30" />
                <span className="text-white/50 text-sm text-center">
                  Click to upload photos
                </span>
                <span className="text-white/25 text-xs">
                  {photos.length}/4 · JPG, PNG, WebP · Max 5MB each
                </span>
              </>
            )}
          </label>
        </div>
      )}

      {/* Photo grid */}
      {loading ? (
        <div className="flex justify-center py-4"><Spinner /></div>
      ) : photos.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-4">No photos yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map(photo => (
            <div key={photo.id} className="relative group rounded-xl overflow-hidden
                                           aspect-square bg-dark-700">
              <img src={photo.image_url} alt="" className="w-full h-full object-cover" />

              {/* Primary badge */}
              {photo.is_primary ? (
                <div className="absolute top-1.5 left-1.5 bg-primary-500 text-dark-900
                                text-xs px-2 py-0.5 rounded-full font-display font-600">
                  Cover
                </div>
              ) : null}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-dark-900/70 opacity-0 group-hover:opacity-100
                              transition-opacity flex flex-col items-center justify-center gap-2">
                {!photo.is_primary && (
                  <button
                    onClick={() => handleMakePrimary(photo.id)}
                    className="text-xs bg-primary-500/20 border border-primary-500/40
                               text-primary-300 px-3 py-1.5 rounded-lg hover:bg-primary-500/30
                               transition-all w-full text-center">
                    Set as cover
                  </button>
                )}
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="text-xs bg-red-500/20 border border-red-500/30 text-red-400
                             px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-all
                             w-full text-center">
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Empty slots indicator */}
          {Array.from({ length: 4 - photos.length }).map((_, i) => (
            <div key={`empty-${i}`}
              className="aspect-square rounded-xl border border-dashed border-white/8
                         bg-white/2 flex items-center justify-center">
              <span className="text-white/15 text-xs">Empty</span>
            </div>
          ))}
        </div>
      )}

      {photos.length >= 4 && (
        <p className="text-white/30 text-xs text-center">
          Maximum 4 photos reached. Delete one to upload a new photo.
        </p>
      )}
    </div>
  )
}

// ── Turf Panel ─────────────────────────────────────────────────
function TurfPanel({ turf, onSlots, onDelete, onRefresh }) {
  const [activeTab, setActiveTab] = useState(null)

  const TABS = [
    { key: 'bookings',  label: 'Bookings',  icon: Users },
    { key: 'occupancy', label: 'Occupancy', icon: BarChart2 },
    { key: 'photos',    label: 'Photos',    icon: ImageIcon },
  ]

  const toggleTab = (key) => setActiveTab(prev => prev === key ? null : key)

  return (
    <div className="card overflow-hidden">
      {/* Turf header */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-display font-600 text-white text-lg">{turf.name}</h3>
              <span className={`badge text-xs ${turf.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                {turf.status}
              </span>
            </div>
            <div className="flex items-center gap-1 text-white/40 text-sm">
              <MapPin className="w-3.5 h-3.5" /> {turf.city} · ₹{turf.price_per_hour}/hr
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button onClick={() => onSlots(turf)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                         bg-primary-500/10 border border-primary-500/20 text-primary-400
                         hover:bg-primary-500/20 transition-all">
              <Calendar className="w-4 h-4" /> Slots
            </button>
            <button onClick={() => onDelete(turf)}
              className="p-2 rounded-lg text-white/30 hover:text-red-400
                         hover:bg-red-500/10 transition-all border border-white/5">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats for this turf */}
        <div className="mt-4">
          <StatsCards turf={turf} />
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 mt-4">
          {TABS.map(t => (
            <button key={t.key} onClick={() => toggleTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all ${
                activeTab === t.key
                  ? 'bg-primary-500/20 border-primary-500/30 text-primary-300'
                  : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white'}`}>
              <t.icon className="w-4 h-4" />
              {t.label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeTab === t.key ? 'rotate-180' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab && (
        <div className="border-t border-white/5 p-5 bg-dark-800/20 animate-fade-in">
          {activeTab === 'bookings'  && <BookingsTable  turf={turf} />}
          {activeTab === 'occupancy' && <OccupancyView  turf={turf} />}
          {activeTab === 'photos'    && <PhotoManager   turf={turf} />}
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function OwnerDashboard() {
  const { user } = useAuth()
  const [turfs,        setTurfs]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [showCreate,   setShowCreate]   = useState(false)
  const [slotsTarget,  setSlotsTarget]  = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  const fetchTurfs = async () => {
    setLoading(true)
    try {
      const res = await turfAPI.getAll()
      const all = res.data.turfs || []
      setTurfs(all.filter(t => Number(t.owner_id) === Number(user?.id)))
    } catch { setTurfs([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTurfs() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await turfAPI.delete(deleteTarget.id)
      toast.success('Turf deleted')
      setDeleteTarget(null)
      fetchTurfs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally { setDeleting(false) }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="page-container">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Owner Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 self-start">
            <Plus className="w-4 h-4" /> List New Turf
          </button>
        </div>

        {/* Turf list */}
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : turfs.length === 0 ? (
          <EmptyState
            icon={LayoutDashboard}
            title="No turfs listed yet"
            desc="List your first turf to start accepting bookings"
            action={
              <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
                <Plus className="w-4 h-4 inline mr-1" /> List a Turf
              </button>
            }
          />
        ) : (
          <div className="space-y-6">
            {turfs.map(turf => (
              <TurfPanel
                key={turf.id}
                turf={turf}
                onSlots={setSlotsTarget}
                onDelete={setDeleteTarget}
                onRefresh={fetchTurfs}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate  && <CreateTurfModal onClose={() => setShowCreate(false)} onCreated={fetchTurfs} />}
      {slotsTarget && <GenerateSlotsModal turf={slotsTarget} onClose={() => setSlotsTarget(null)} />}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
          <div className="card w-full max-w-sm p-6 animate-fade-in">
            <h3 className="font-display font-700 text-white text-lg mb-2">Delete Turf?</h3>
            <p className="text-white/50 text-sm mb-6">
              Are you sure you want to delete{' '}
              <span className="text-white">{deleteTarget.name}</span>?
              All slots and bookings will also be removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400
                           hover:bg-red-500/30 rounded-xl px-4 py-3 transition-all
                           flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
