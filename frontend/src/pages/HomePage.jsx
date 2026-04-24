import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, MapPin, Star, Clock, Shield, Zap, ChevronRight,
         Trophy, Users, Calendar } from 'lucide-react'

const SPORTS = [
  { name: 'Football',    emoji: '⚽', color: 'from-green-500/20 to-green-600/5' },
  { name: 'Cricket',     emoji: '🏏', color: 'from-amber-500/20 to-amber-600/5' },
  { name: 'Box Cricket', emoji: '🏏', color: 'from-orange-500/20 to-orange-600/5' },
  { name: 'Badminton',   emoji: '🏸', color: 'from-blue-500/20 to-blue-600/5' },
  { name: 'Basketball',  emoji: '🏀', color: 'from-red-500/20 to-red-600/5' },
  { name: 'Volleyball',  emoji: '🏐', color: 'from-purple-500/20 to-purple-600/5' },
]

const STATS = [
  { icon: Trophy, value: '200+', label: 'Turfs Listed' },
  { icon: Users,  value: '10K+', label: 'Happy Players' },
  { icon: Calendar, value: '50K+', label: 'Slots Booked' },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Book your slot in under 60 seconds. Real-time availability, zero waiting.'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'Pay safely via UPI, card, or wallet. Instant confirmation every time.'
  },
  {
    icon: Clock,
    title: 'Flexible Slots',
    desc: 'Book 1 hour or 3 hours — pick consecutive slots that fit your schedule.'
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    desc: 'Only players who actually played can leave reviews. 100% genuine ratings.'
  },
]

export default function HomePage() {
  const [city, setCity] = useState('')
  const navigate        = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/turfs${city ? `?city=${city}` : ''}`)
  }

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                          bg-primary-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-96 h-96
                          bg-primary-600/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
        </div>

        <div className="page-container relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 badge-green mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse-slow" />
              <span className="text-xs">200+ Turfs across India</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-700 leading-[1.05]
                           text-white mb-6 animate-fade-up"
                style={{ animationDelay: '0.1s', opacity: 0 }}>
              Book Your
              <span className="block text-primary-400 relative">
                Perfect Turf
                <svg className="absolute -bottom-2 left-0 right-0 mx-auto w-64" viewBox="0 0 256 8" fill="none">
                  <path d="M4 4 Q128 8 252 4" stroke="#22c55e" strokeWidth="2.5"
                        strokeLinecap="round" opacity="0.6"/>
                </svg>
              </span>
              <span className="block text-white/80">in Seconds</span>
            </h1>

            <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-10 animate-fade-up"
               style={{ animationDelay: '0.2s', opacity: 0 }}>
              Find and book football, cricket, badminton turfs near you.
              Real-time slots, instant confirmation, zero hassle.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6
                         animate-fade-up"
              style={{ animationDelay: '0.3s', opacity: 0 }}>
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Enter your city..."
                  className="input pl-11"
                />
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2 justify-center">
                <Search className="w-4 h-4" />
                Find Turfs
              </button>
            </form>

            <p className="text-white/25 text-sm animate-fade-up"
               style={{ animationDelay: '0.4s', opacity: 0 }}>
              Popular: Nagpur · Mumbai · Pune · Hyderabad · Bangalore
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16
                          animate-fade-up"
               style={{ animationDelay: '0.5s', opacity: 0 }}>
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div className="font-display font-700 text-2xl text-white">{value}</div>
                <div className="text-white/40 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPORT CATEGORIES */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-primary-400 text-sm font-display uppercase tracking-widest mb-3">
              What do you play?
            </p>
            <h2 className="section-title">Browse by Sport</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPORTS.map((sport, i) => (
              <Link
                key={sport.name}
                to={`/turfs?sport=${sport.name.toLowerCase()}`}
                className="group card-hover p-6 text-center"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sport.color}
                                 flex items-center justify-center mx-auto mb-3 text-2xl
                                 group-hover:scale-110 transition-transform duration-300`}>
                  {sport.emoji}
                </div>
                <p className="font-display font-500 text-white/80 text-sm group-hover:text-white
                               transition-colors">
                  {sport.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-dark-800/30">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-primary-400 text-sm font-display uppercase tracking-widest mb-3">
              Simple & Fast
            </p>
            <h2 className="section-title">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Find a Turf', desc: 'Search by city, sport, or date. Filter by price and availability.' },
              { step: '02', title: 'Pick Your Slots', desc: 'Choose single or multiple consecutive slots for longer sessions.' },
              { step: '03', title: 'Play!', desc: 'Get instant confirmation. Show your booking ID at the venue and play.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px
                                  bg-gradient-to-r from-primary-500/30 to-transparent -z-10" />
                )}
                <div className="w-16 h-16 bg-primary-500/10 border border-primary-500/20
                                rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-700 text-primary-400 text-xl">{item.step}</span>
                </div>
                <h3 className="font-display font-600 text-white text-lg mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-400 text-sm font-display uppercase tracking-widest mb-3">
                Why TurfBook?
              </p>
              <h2 className="section-title mb-6">
                Everything you need
                <span className="block text-primary-400">to play more</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-8">
                We built TurfBook because booking a turf shouldn't be harder than playing on one.
                Real-time slots, instant payments, genuine reviews.
              </p>
              <Link to="/turfs" className="btn-primary inline-flex items-center gap-2">
                Explore Turfs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-5 hover:border-primary-500/20 transition-colors">
                  <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <h4 className="font-display font-600 text-white mb-1">{title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="page-container">
          <div className="relative card overflow-hidden p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-600/5" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
            <div className="relative z-10">
              <h2 className="section-title mb-4">Ready to play?</h2>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                Join 10,000+ players already booking on TurfBook. Your next game is just a few taps away.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register" className="btn-primary">Create Free Account</Link>
                <Link to="/turfs"    className="btn-outline">Browse Turfs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
