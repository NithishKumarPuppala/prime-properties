import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa'

export default function PropertyFilters() {
  const router = useRouter()
  const { query } = router

  const [filters, setFilters] = useState({
    search: query.search || '',
    type: query.type || '',
    listingType: query.listingType || '',
    city: query.city || '',
    minPrice: query.minPrice || '',
    maxPrice: query.maxPrice || '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ search: '', type: '', listingType: '', city: '', minPrice: '', maxPrice: '' })
    router.push('/properties')
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
      <form onSubmit={handleSearch}>
        {/* Search bar - always visible */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by location, property type..."
              className="input-field pl-10"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium text-sm transition-colors ${
              showFilters || hasActiveFilters
                ? 'border-accent text-accent bg-green-50'
                : 'border-gray-200 text-gray-600 hover:border-accent hover:text-accent'
            }`}
          >
            <FaFilter size={14} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-accent rounded-full" />
            )}
          </button>
          <button type="submit" className="btn-primary px-4 py-3">
            Search
          </button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-gray-100">
            <select
              value={filters.type}
              onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="input-field text-sm"
            >
              <option value="">All Types</option>
              <option value="land">Land Plots</option>
              <option value="shed">Industrial Sheds</option>
            </select>

            <select
              value={filters.listingType}
              onChange={e => setFilters(prev => ({ ...prev, listingType: e.target.value }))}
              className="input-field text-sm"
            >
              <option value="">Sale & Rent</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>

            <input
              type="text"
              value={filters.city}
              onChange={e => setFilters(prev => ({ ...prev, city: e.target.value }))}
              placeholder="City/Area"
              className="input-field text-sm"
            />

            <input
              type="number"
              value={filters.minPrice}
              onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              placeholder="Min Price (₹)"
              className="input-field text-sm"
            />

            <input
              type="number"
              value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              placeholder="Max Price (₹)"
              className="input-field text-sm"
            />
          </div>
        )}

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null
              return (
                <span key={key} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  {value}
                  <button type="button" onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}>
                    <FaTimes size={10} />
                  </button>
                </span>
              )
            })}
            <button type="button" onClick={clearFilters} className="text-xs text-red-500 underline">
              Clear all
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
