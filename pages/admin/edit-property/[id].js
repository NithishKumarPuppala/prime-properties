import { useState, useEffect } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa'

export default function EditProperty() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [newImages, setNewImages] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [feature, setFeature] = useState('')
  const [features, setFeatures] = useState([])
  const [form, setForm] = useState({
    title: '', propertyType: 'land', listingType: 'sale', status: 'available',
    price: '', priceUnit: '', address: '', area: '',
    city: 'Hyderabad', state: 'Telangana', pincode: '',
    size: '', sizeUnit: 'sqft', description: '',
    mapUrl: '', isFeatured: false,
  })

  useEffect(() => {
    if (!id) return
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/properties/${id}`)
      const p = await res.json()
      if (p._id) {
        setForm({
          title: p.title || '', propertyType: p.propertyType || 'land',
          listingType: p.listingType || 'sale', status: p.status || 'available',
          price: p.price || '', priceUnit: p.priceUnit || '',
          address: p.location?.address || '', area: p.location?.area || '',
          city: p.location?.city || 'Hyderabad', state: p.location?.state || 'Telangana',
          pincode: p.location?.pincode || '', size: p.size || '',
          sizeUnit: p.sizeUnit || 'sqft', description: p.description || '',
          mapUrl: p.location?.mapUrl || '', isFeatured: p.isFeatured || false,
        })
        setFeatures(p.features || [])
        setExistingImages(p.images || [])
      }
    } catch { toast.error('Failed to load property') }
    finally { setFetching(false) }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files)
    setNewImages(prev => [...prev, ...files])
    setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
  }

  const removeNewImage = (i) => {
    setNewImages(prev => prev.filter((_, j) => j !== i))
    setNewPreviews(prev => prev.filter((_, j) => j !== i))
  }

  const removeExistingImage = (publicId) => {
    setExistingImages(prev => prev.filter(img => img.public_id !== publicId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('features', JSON.stringify(features))
    fd.append('keepImages', JSON.stringify(existingImages.map(img => img.public_id)))
    newImages.forEach(img => fd.append('images', img))

    try {
      const res = await fetch(`/api/admin/property/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Property updated!')
        router.push('/admin/properties')
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } catch { toast.error('Network error') }
    finally { setLoading(false) }
  }

  if (fetching) {
    return <AdminLayout title="Edit Property"><div className="text-center py-20 text-gray-400">Loading...</div></AdminLayout>
  }

  return (
    <AdminLayout title="Edit Property">
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="space-y-5">
          {/* Same fields as Add Property but with existing values */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Basic Information</h2>
            <div className="space-y-4">
              <input name="title" value={form.title} onChange={handleChange} required
                placeholder="Property Title *" className="input-field" />
              <div className="grid grid-cols-3 gap-4">
                <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input-field">
                  <option value="land">Land Plot</option>
                  <option value="shed">Industrial Shed</option>
                </select>
                <select name="listingType" value={form.listingType} onChange={handleChange} className="input-field">
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                <select name="status" value={form.status} onChange={handleChange} className="input-field">
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" value={form.price} onChange={handleChange}
                  placeholder="Price (₹) *" className="input-field" required />
                <input name="priceUnit" value={form.priceUnit} onChange={handleChange}
                  placeholder="Per month / per acre..." className="input-field" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Location</h2>
            <div className="space-y-4">
              <input name="address" value={form.address} onChange={handleChange}
                placeholder="Full Address *" className="input-field" required />
              <div className="grid grid-cols-3 gap-4">
                <input name="area" value={form.area} onChange={handleChange} placeholder="Area" className="input-field" />
                <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="input-field" />
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" className="input-field" />
              </div>
              <input name="mapUrl" value={form.mapUrl} onChange={handleChange}
                placeholder="Google Maps embed URL" className="input-field" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="size" type="number" value={form.size} onChange={handleChange}
                  placeholder="Size / Area" className="input-field" />
                <select name="sizeUnit" value={form.sizeUnit} onChange={handleChange} className="input-field">
                  <option value="sqft">Sq Ft</option>
                  <option value="sqyards">Sq Yards</option>
                  <option value="acres">Acres</option>
                  <option value="guntas">Guntas</option>
                </select>
              </div>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={5} placeholder="Property description..." className="input-field resize-none" />
              <div>
                <div className="flex gap-2 mb-2">
                  <input value={feature} onChange={e => setFeature(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), features.push(feature.trim()), setFeature(''))}
                    placeholder="Add feature..." className="input-field flex-1" />
                  <button type="button" onClick={() => { if(feature.trim()) { setFeatures(p => [...p, feature.trim()]); setFeature('') } }}
                    className="btn-outline px-4"><FaPlus /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                      {f}
                      <button type="button" onClick={() => setFeatures(p => p.filter((_, j) => j !== i))}><FaTimes size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Images</h2>
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current images (click × to remove):</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {existingImages.map((img, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={img.url} className="w-full h-full object-cover rounded-xl" alt="" />
                      <button type="button" onClick={() => removeExistingImage(img.public_id)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center block cursor-pointer hover:border-accent transition-colors">
              <FaUpload className="text-gray-300 text-xl mx-auto mb-1" />
              <p className="text-sm text-gray-500">Add more images</p>
              <input type="file" multiple accept="image/*" onChange={handleNewImages} className="hidden" />
            </label>
            {newPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {newPreviews.map((url, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={url} className="w-full h-full object-cover rounded-xl" alt="" />
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-card p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-5 h-5 accent-green-500" />
              <span className="text-sm font-medium text-gray-700">Feature on homepage</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="flex-1 sm:flex-none btn-primary py-4 px-8 disabled:opacity-60">
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-outline py-4 px-6">Cancel</button>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
