import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Link from 'next/link'
import { FaEdit, FaTrash, FaEye, FaToggleOn } from 'react-icons/fa'
import { MdAddHome } from 'react-icons/md'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/helpers'

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { fetchProperties() }, [filter])

  const fetchProperties = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const status = filter === 'all' ? 'all' : filter
      const res = await fetch(`/api/admin/properties?status=${status}&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setProperties(data.properties || [])
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const deleteProperty = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/admin/property/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success('Property deleted')
        setProperties(prev => prev.filter(p => p._id !== id))
      } else {
        toast.error('Failed to delete')
      }
    } catch { toast.error('Error') }
    finally { setDeleting(null) }
  }

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/admin/property/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success('Status updated')
        setProperties(prev => prev.map(p => p._id === id ? { ...p, status } : p))
      }
    } catch { toast.error('Failed to update') }
  }

  return (
    <AdminLayout title="Properties">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {['all', 'available', 'sold', 'rented'].map(s => (
            <button key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                filter === s ? 'bg-accent text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <Link href="/admin/add-property" className="btn-primary flex items-center gap-2 text-sm">
          <MdAddHome size={18} /> Add New
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 skeleton rounded-2xl" />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-card">
          <div className="text-5xl mb-4">🏡</div>
          <h3 className="font-semibold text-xl text-primary mb-2">No properties found</h3>
          <Link href="/admin/add-property" className="btn-primary mt-4 inline-block">Add First Property</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Property</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {p.images?.[0]?.url && (
                            <img src={p.images[0].url} className="w-full h-full object-cover" alt="" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-primary max-w-xs truncate">{p.title}</div>
                          <div className="text-xs text-gray-400">{p.isFeatured && '⭐ Featured'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={p.propertyType === 'land' ? 'badge-land' : 'badge-shed'}>
                        {p.propertyType}
                      </span>
                      <span className={`ml-1 ${p.listingType === 'sale' ? 'badge-sale' : 'badge-rent'}`}>
                        {p.listingType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-accent">{formatPrice(p.price, p.listingType)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{p.location?.address}</td>
                    <td className="px-4 py-3">
                      <select
                        value={p.status}
                        onChange={e => updateStatus(p._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer ${
                          p.status === 'available' ? 'bg-green-100 text-green-700' :
                          p.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/property/${p.slug}`} target="_blank"
                          className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                          <FaEye size={12} />
                        </Link>
                        <Link href={`/admin/edit-property/${p._id}`}
                          className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center hover:bg-amber-100 transition-colors">
                          <FaEdit size={12} />
                        </Link>
                        <button onClick={() => deleteProperty(p._id, p.title)}
                          disabled={deleting === p._id}
                          className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-40">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-gray-100">
            {properties.map(p => (
              <div key={p._id} className="p-4 flex gap-3">
                <div className="w-16 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  {p.images?.[0]?.url && (
                    <img src={p.images[0].url} className="w-full h-full object-cover" alt="" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-primary truncate">{p.title}</div>
                  <div className="text-xs text-gray-500 mb-1">{p.location?.address}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-accent">{formatPrice(p.price, p.listingType)}</span>
                    <span className={`text-xs ${p.status === 'available' ? 'text-green-600' : 'text-red-500'} font-medium`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Link href={`/admin/edit-property/${p._id}`}
                    className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-lg font-medium">
                    Edit
                  </Link>
                  <button onClick={() => deleteProperty(p._id, p.title)}
                    className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
