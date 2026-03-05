import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import PropertyCard from '../components/property/PropertyCard'
import PropertyFilters from '../components/property/PropertyFilters'
import { useRouter } from 'next/router'
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa'

export default function Properties() {
  const router = useRouter()
  const [properties, setProperties] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const currentPage = Number(router.query.page) || 1

  useEffect(() => {
    if (!router.isReady) return
    fetchProperties()
  }, [router.query, router.isReady])

  async function fetchProperties() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      const q = router.query
      if (q.type) params.set('type', q.type)
      if (q.listingType) params.set('listingType', q.listingType)
      if (q.city) params.set('city', q.city)
      if (q.minPrice) params.set('minPrice', q.minPrice)
      if (q.maxPrice) params.set('maxPrice', q.maxPrice)
      if (q.search) params.set('search', q.search)
      if (q.featured) params.set('featured', q.featured)
      params.set('page', currentPage)
      params.set('limit', '12')

      const res = await fetch(`/api/properties?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProperties(data.properties)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getPageTitle = () => {
    const { type, listingType } = router.query
    if (type === 'land' && listingType === 'sale') return 'Land Plots for Sale'
    if (type === 'shed' && listingType === 'rent') return 'Industrial Sheds for Rent'
    if (type === 'land') return 'Land Properties'
    if (type === 'shed') return 'Industrial Sheds'
    return 'All Properties'
  }

  const setPage = (p) => {
    const q = { ...router.query, page: p }
    router.push({ pathname: '/properties', query: q })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Layout title={getPageTitle()}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-title mb-1">{getPageTitle()}</h1>
          {!loading && (
            <p className="text-gray-500 text-sm">{total} {total === 1 ? 'property' : 'properties'} found</p>
          )}
        </div>

        {/* Filters */}
        <PropertyFilters />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-accent text-3xl" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FaExclamationCircle className="text-red-400 text-4xl mb-3" />
            <p className="text-gray-500">{error}</p>
            <button onClick={fetchProperties} className="btn-primary mt-4">Retry</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🏡</div>
            <h3 className="font-semibold text-xl text-primary mb-2">No properties found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
            <button onClick={() => router.push('/properties')} className="btn-primary">Clear Filters</button>
          </div>
        )}

        {/* Property grid */}
        {!loading && properties.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <PropertyCard key={p._id} property={p} priority={i < 6} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:border-accent hover:text-accent transition-colors font-medium text-sm"
            >
              ← Prev
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl font-medium text-sm transition-colors ${
                  p === currentPage
                    ? 'bg-accent text-white'
                    : 'border border-gray-200 hover:border-accent hover:text-accent'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === pages}
              className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:border-accent hover:text-accent transition-colors font-medium text-sm"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
