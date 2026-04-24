import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react'
import { turfAPI } from '../services/api'
import TurfCard from '../components/turf/TurfCard'
import { LoadingScreen, EmptyState, SkeletonCard } from '../components/common'

const SPORTS = ['Football', 'Cricket', 'Box Cricket', 'Badminton', 'Basketball', 'Volleyball']
const CITIES = ['Nagpur', 'Mumbai', 'Pune', 'Hyderabad', 'Bangalore', 'Delhi', 'Chennai']

export default function TurfsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [turfs,    setTurfs]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const [filters, setFilters] = useState({
    city:  searchParams.get('city')  || '',
    sport: searchParams.get('sport') || '',
    search: '',
  })

  useEffect(() => {
    fetchTurfs()
  }, [])

  const fetchTurfs = async () => {
    setLoading(true)
    try {
      const res = await turfAPI.getAll()
      setTurfs(res.data.turfs || [])
    } catch {
      setTurfs([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = turfs.filter(t => {
    const matchCity   = !filters.city  || t.city?.toLowerCase().includes(filters.city.toLowerCase())
    const matchSearch = !filters.search || t.name?.toLowerCase().includes(filters.search.toLowerCase())
    const matchSport  = !filters.sport  ||
      (t.sports || []).some(s => s.toLowerCase().includes(filters.sport.toLowerCase()))
    return matchCity && matchSearch && matchSport
  })

  const clearFilters = () => setFilters({ city: '', sport: '', search: '' })
  const hasFilters   = filters.city || filters.sport || filters.search

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="page-container">

        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Browse Turfs</h1>
          <p className="text-white/40">
            {loading ? 'Loading...' : `${filtered.length} turf${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search turf name..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="input pl-11"
            />
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all
              ${showFilter
                ? 'bg-primary-500/20 border-primary-500/40 text-primary-400'
                : 'bg-dark-700/60 border-white/10 text-white/70 hover:border-white/20'
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-body">Filters</span>
            {hasFilters && (
              <span className="w-5 h-5 bg-primary-500 rounded-full text-dark-900
                               text-xs font-700 flex items-center justify-center">
                {[filters.city, filters.sport].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="card p-5 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="label">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <select
                    value={filters.city}
                    onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
                    className="input pl-10 appearance-none"
                  >
                    <option value="">All Cities</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Sport */}
              <div>
                <label className="label">Sport</label>
                <select
                  value={filters.sport}
                  onChange={e => setFilters(f => ({ ...f, sport: e.target.value }))}
                  className="input appearance-none"
                >
                  <option value="">All Sports</option>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Sport quick-pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {SPORTS.map(s => (
                <button
                  key={s}
                  onClick={() => setFilters(f => ({ ...f, sport: f.sport === s ? '' : s }))}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    filters.sport === s
                      ? 'bg-primary-500/20 border-primary-500/40 text-primary-400'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-white/40
                           hover:text-white mt-4 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.city && (
              <span className="badge-green gap-1">
                <MapPin className="w-3 h-3" /> {filters.city}
                <button onClick={() => setFilters(f => ({ ...f, city: '' }))} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.sport && (
              <span className="badge-green gap-1">
                {filters.sport}
                <button onClick={() => setFilters(f => ({ ...f, sport: '' }))} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No turfs found"
            desc="Try adjusting your filters or search in a different city"
            action={
              <button onClick={clearFilters} className="btn-outline text-sm">
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(turf => (
              <TurfCard key={turf.id} turf={turf} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
