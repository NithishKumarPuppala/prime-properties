import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { FaPlus, FaTimes, FaUpload } from 'react-icons/fa'

export default function AddProperty() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [feature, setFeature] = useState('')
  const [features, setFeatures] = useState([])
  const [form, setForm] = useState({
    title: '', propertyType: 'land', listingType: 'sale',
    price: '', priceUnit: '', address: '', area: '',
    city: 'Hyderabad', state: 'Telangana', pincode: '',
    size: '', sizeUnit: 'sqft', description: '',
    mapUrl: '', isFeatured: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const addFeature = () => {
    if (feature.trim()) {
      setFeatures(prev => [...prev, feature.trim()])
      setFeature('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.address) {
      toast.error('Title, price and address are required')
      return
    }
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('features', JSON.stringify(features))
    images.forEach(img => fd.append('images', img))

    try {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data) {
        toast.error(data?.error || 'Failed to add property')
        return
      }

      if (data.success) {
        toast.success('Property added successfully!')
        router.push('/admin/properties')
      } else {
        toast.error(data.error || 'Failed to add property')
      }
    } catch (err) {
      console.error('Add property error:', err)
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title="Add New Property">
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. Prime Industrial Shed Near Patancheru" className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type *</label>
                  <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input-field">
                    <option value="land">Land Plot</option>
                    <option value="shed">Industrial Shed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Listing Type *</label>
                  <select name="listingType" value={form.listingType} onChange={handleChange} className="input-field">
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required
                    placeholder="e.g. 5000000" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Note</label>
                  <input name="priceUnit" value={form.priceUnit} onChange={handleChange}
                    placeholder="per month, per acre..." className="input-field" />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Location Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address *</label>
                <input name="address" value={form.address} onChange={handleChange} required
                  placeholder="e.g. Patancheru Industrial Area, Near TSIIC" className="input-field" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Area/Locality</label>
                  <input name="area" value={form.area} onChange={handleChange}
                    placeholder="e.g. Patancheru" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input name="city" value={form.city} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange}
                    placeholder="502319" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Maps Embed URL</label>
                <input name="mapUrl" value={form.mapUrl} onChange={handleChange}
                  placeholder="https://maps.google.com/maps?..." className="input-field" />
                <p className="text-xs text-gray-400 mt-1">From Google Maps → Share → Embed a map → Copy iframe src</p>
              </div>
            </div>
          </div>

          {/* Size & Description */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Property Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Size / Area</label>
                  <input name="size" type="number" value={form.size} onChange={handleChange}
                    placeholder="e.g. 12000" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
                  <select name="sizeUnit" value={form.sizeUnit} onChange={handleChange} className="input-field">
                    <option value="sqft">Sq Ft</option>
                    <option value="sqyards">Sq Yards</option>
                    <option value="acres">Acres</option>
                    <option value="guntas">Guntas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={5} placeholder="Describe the property, surroundings, access, special features..."
                  className="input-field resize-none" />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Key Features</label>
                <div className="flex gap-2 mb-2">
                  <input value={feature} onChange={e => setFeature(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="e.g. Three-phase power, Road access..." className="input-field flex-1" />
                  <button type="button" onClick={addFeature} className="btn-outline px-4">
                    <FaPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                      {f}
                      <button type="button" onClick={() => setFeatures(prev => prev.filter((_, j) => j !== i))}>
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Property Images</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center mb-4 hover:border-accent transition-colors">
              <label className="cursor-pointer">
                <FaUpload className="text-gray-300 text-3xl mx-auto mb-2" />
                <p className="text-gray-500 text-sm mb-1">Click to upload photos</p>
                <p className="text-xs text-gray-400">JPG, PNG, WebP up to 10MB each</p>
                <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
              </label>
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {previews.map((url, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={url} className="w-full h-full object-cover rounded-xl" alt="" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaTimes size={10} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">Main</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-semibold text-primary mb-4">Settings</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="sr-only" />
                <div className={`w-11 h-6 rounded-full transition-colors ${form.isFeatured ? 'bg-accent' : 'bg-gray-200'}`} />
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">Feature this property on homepage</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 sm:flex-none btn-primary py-4 px-8 text-base disabled:opacity-60">
              {loading ? 'Adding Property...' : '✅ Add Property'}
            </button>
            <button type="button" onClick={() => router.back()}
              className="flex-1 sm:flex-none btn-outline py-4 px-6">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
