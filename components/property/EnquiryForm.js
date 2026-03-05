import { useState } from 'react'
import { FaUser, FaPhone, FaEnvelope, FaCommentAlt, FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function EnquiryForm({ propertyId, propertyTitle, compact = false }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast.error('Name and phone are required')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId, ...form }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        toast.success('Enquiry sent! We will call you soon.')
      } else {
        toast.error(data.error || 'Failed to send enquiry')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <FaCheckCircle className="text-accent text-5xl mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl text-primary mb-2">Enquiry Sent!</h3>
        <p className="text-gray-500 text-sm">We'll contact you within 30 minutes.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-accent text-sm font-medium underline"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!compact && propertyTitle && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
          Enquiring about: <strong>{propertyTitle}</strong>
        </div>
      )}

      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name *"
          className="input-field pl-9"
          required
        />
      </div>

      <div className="relative">
        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number *"
          className="input-field pl-9"
          required
        />
      </div>

      <div className="relative">
        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address (optional)"
          className="input-field pl-9"
        />
      </div>

      <div className="relative">
        <FaCommentAlt className="absolute left-3 top-4 text-gray-400 text-sm" />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your message (optional)"
          rows={compact ? 2 : 4}
          className="input-field pl-9 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : '📩 Send Enquiry'}
      </button>
    </form>
  )
}
