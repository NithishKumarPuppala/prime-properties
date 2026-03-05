import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Link from 'next/link'
import { MdApartment, MdEmail, MdAddHome, MdCheckCircle } from 'react-icons/md'
import { FaLandmark, FaIndustry, FaEye } from 'react-icons/fa'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentProperties, setRecentProperties] = useState([])
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const [propsRes, enqRes] = await Promise.all([
        fetch('/api/admin/properties?limit=5', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/enquiries?limit=5', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const [propsData, enqData] = await Promise.all([propsRes.json(), enqRes.json()])

      setRecentProperties(propsData.properties || [])
      setRecentEnquiries(enqData.enquiries || [])

      // Calculate stats
      const allPropsRes = await fetch('/api/admin/properties?limit=1000&status=all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const allProps = await allPropsRes.json()
      const props = allProps.properties || []
      setStats({
        total: props.length,
        available: props.filter(p => p.status === 'available').length,
        sold: props.filter(p => p.status === 'sold' || p.status === 'rented').length,
        land: props.filter(p => p.propertyType === 'land').length,
        shed: props.filter(p => p.propertyType === 'shed').length,
        enquiries: enqData.total || 0,
        unread: enqData.unreadCount || 0,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const { formatPrice } = require('../../utils/helpers')

  return (
    <AdminLayout title="Dashboard">
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: MdApartment, label: 'Total Properties', value: stats?.total ?? '—', color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
          { icon: MdCheckCircle, label: 'Available', value: stats?.available ?? '—', color: 'bg-green-50 text-green-600', border: 'border-green-200' },
          { icon: FaLandmark, label: 'Land Plots', value: stats?.land ?? '—', color: 'bg-amber-50 text-amber-600', border: 'border-amber-200' },
          { icon: MdEmail, label: 'Enquiries', value: stats?.enquiries ?? '—', color: 'bg-purple-50 text-purple-600', border: 'border-purple-200', badge: stats?.unread },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm`}>
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-primary">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
              {s.label}
              {s.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{s.badge} new</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Link href="/admin/add-property"
          className="bg-accent text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-accent-dark transition-colors shadow-float">
          <MdAddHome size={32} />
          <div>
            <div className="font-bold text-lg">Add New Property</div>
            <div className="text-green-100 text-sm">List a land plot or shed</div>
          </div>
        </Link>
        <Link href="/admin/enquiries"
          className="bg-primary text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-primary-light transition-colors">
          <MdEmail size={32} />
          <div>
            <div className="font-bold text-lg">View Enquiries</div>
            <div className="text-gray-400 text-sm">
              {stats?.unread > 0 ? `${stats.unread} unread messages` : 'Check messages'}
            </div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-primary">Recent Properties</h2>
            <Link href="/admin/properties" className="text-sm text-accent hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 skeleton rounded-xl" />)}
            </div>
          ) : recentProperties.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No properties yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentProperties.map(p => (
                <div key={p._id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {p.images?.[0]?.url && (
                      <img src={p.images[0].url} className="w-full h-full object-cover" alt="" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-primary truncate">{p.title}</div>
                    <div className="text-xs text-gray-400">{p.location?.address}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-accent">₹{(p.price / 100000).toFixed(1)}L</div>
                    <div className={`text-xs ${p.status === 'available' ? 'text-green-600' : 'text-red-500'}`}>
                      {p.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-primary">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-accent hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 skeleton rounded-xl" />)}
            </div>
          ) : recentEnquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No enquiries yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentEnquiries.map(e => (
                <div key={e._id} className={`px-5 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!e.isRead ? 'bg-blue-50/50' : ''}`}>
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {e.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-primary flex items-center gap-2">
                      {e.name}
                      {!e.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{e.propertyTitle || 'General enquiry'}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <a href={`tel:${e.phone}`} className="text-xs text-accent font-medium hover:underline">{e.phone}</a>
                    <div className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
