import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { FaPhone, FaEnvelope, FaWhatsapp, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchEnquiries() }, [filter])

  const fetchEnquiries = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const unread = filter === 'unread' ? '&unread=true' : ''
      const res = await fetch(`/api/admin/enquiries?limit=100${unread}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setEnquiries(data.enquiries || [])
    } catch { toast.error('Failed to load enquiries') }
    finally { setLoading(false) }
  }

  const markRead = async (id) => {
    const token = localStorage.getItem('admin_token')
    try {
      await fetch(`/api/admin/enquiries?id=${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, isRead: true } : e))
    } catch {}
  }

  return (
    <AdminLayout title="Enquiries">
      <div className="flex gap-2 mb-5">
        {['all', 'unread'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              filter === f ? 'bg-accent text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent'
            }`}>
            {f === 'all' ? 'All Enquiries' : 'Unread Only'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-card">
          <div className="text-5xl mb-4">📬</div>
          <h3 className="font-semibold text-xl text-primary">No enquiries yet</h3>
          <p className="text-gray-500 text-sm mt-2">Customer enquiries will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map(e => (
            <div key={e._id}
              className={`bg-white rounded-2xl shadow-card p-4 sm:p-5 transition-all ${!e.isRead ? 'border-l-4 border-accent' : ''}`}>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  {e.name[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{e.name}</span>
                      {!e.isRead && <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Property */}
                  {e.propertyTitle && (
                    <p className="text-sm text-accent mb-1">
                      Re: {e.property?.slug ? (
                        <Link href={`/property/${e.property.slug}`} target="_blank" className="underline hover:text-accent-dark">
                          {e.propertyTitle}
                        </Link>
                      ) : e.propertyTitle}
                    </p>
                  )}

                  {/* Message */}
                  {e.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2 mb-3">{e.message}</p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`tel:${e.phone}`}
                      className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                      <FaPhone size={12} /> {e.phone}
                    </a>
                    <a href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}?text=Hi ${e.name}, regarding your property enquiry...`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
                      <FaWhatsapp size={12} /> WhatsApp
                    </a>
                    {e.email && (
                      <a href={`mailto:${e.email}`}
                        className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors">
                        <FaEnvelope size={12} /> {e.email}
                      </a>
                    )}
                    {!e.isRead && (
                      <button onClick={() => markRead(e._id)}
                        className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors ml-auto">
                        <FaCheck size={12} /> Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
