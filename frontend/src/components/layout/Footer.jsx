import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-800/40 mt-20">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-700 text-xl text-white">
                Turf<span className="text-primary-400">Book</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Book your favourite turf in seconds. Play more, wait less.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary-500/20
                             flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-white/50 hover:text-primary-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-600 text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Browse Turfs', to: '/turfs' },
                // { label: 'Book a Slot',  to: '/turfs' },
                { label: 'My Bookings', to: '/bookings' },
                { label: 'List Your Turf', to: '/register' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/40 hover:text-primary-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h4 className="font-display font-600 text-white mb-4">Sports</h4>
            <ul className="space-y-2">
              {['Football', 'Cricket', 'Box Cricket', 'Badminton', 'Basketball', 'Volleyball'].map(s => (
                <li key={s}>
                  <span className="text-white/40 text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-600 text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: 'Nagpur, Maharashtra' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail,  text: 'hello@turfbook.in' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-white/40 text-sm">
                  <Icon className="w-4 h-4 text-primary-500/60 flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-sm">© 2025 TurfBook. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-white/25 text-sm cursor-pointer hover:text-white/50">Privacy Policy</span>
            <span className="text-white/25 text-sm cursor-pointer hover:text-white/50">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
