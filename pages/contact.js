import Layout from '../components/layout/Layout'
import EnquiryForm from '../components/property/EnquiryForm'
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: '000000000000000000000000', ...form }),
      })
      if (res.ok) {
        setSubmitted(true)
        toast.success('Message sent! We\'ll contact you soon.')
      }
    } catch { toast.error('Failed to send. Please call us directly.') }
    finally { setLoading(false) }
  }

  return (
    <Layout title="Contact Us" description="Contact Prime Properties Hyderabad. Call, WhatsApp or email us for land plots and industrial sheds.">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold mb-3">Get In Touch</h1>
          <p className="text-gray-300 text-lg">We respond within 30 minutes during business hours</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <h2 className="section-title mb-6">Contact Details</h2>
            
            <div className="space-y-4 mb-8">
              {[
                { icon: FaPhone, label: 'Phone', value: '+91 8341000111', href: 'tel:+918341000111', color: 'bg-blue-100 text-blue-600' },
                { icon: FaWhatsapp, label: 'WhatsApp', value: '+91 8341000111', href: 'https://wa.me/918341000111', color: 'bg-green-100 text-green-600' },
                { icon: FaEnvelope, label: 'Email', value: 'sridher.puppala@gmail.com', href: 'mailto:sridher.puppala@gmail.com', color: 'bg-amber-100 text-amber-600' },
                { icon: FaMapMarkerAlt, label: 'Office', value: 'C-33 , Green Industrial Park, Malkapur', href: null, color: 'bg-red-100 text-red-600' },
                { icon: FaClock, label: 'Hours', value: 'Mon–Sat: 10AM – 8PM', href: null, color: 'bg-purple-100 text-purple-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="font-semibold text-primary hover:text-accent transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <div className="font-semibold text-primary">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Big CTA buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a href="tel:+918341000111"
                className="btn-dark py-5 flex items-center justify-center gap-2 text-lg rounded-2xl">
                <FaPhone /> Call Now
              </a>
              <a href="https://wa.me/918341000111?text=Hi, I need help with a property"
                target="_blank" rel="noopener noreferrer"
                className="btn-primary py-5 flex items-center justify-center gap-2 text-lg rounded-2xl">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>

          {/* Enquiry Form */}
          <div>
            <h2 className="section-title mb-6">Send a Message</h2>
            <div className="card p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="font-display font-bold text-xl text-primary mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll contact you within 30 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={e => setForm(p => ({...p, name: e.target.value}))}
                    className="input-field"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                    className="input-field"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={form.email}
                    onChange={e => setForm(p => ({...p, email: e.target.value}))}
                    className="input-field"
                  />
                  <textarea
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={e => setForm(p => ({...p, message: e.target.value}))}
                    rows={4}
                    className="input-field resize-none"
                  />
                  <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base disabled:opacity-60">
                    {loading ? 'Sending...' : '📩 Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Map placeholder */}
            <div className="mt-4 card overflow-hidden">
              <div className="bg-gray-100 aspect-video flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FaMapMarkerAlt size={40} className="mx-auto mb-2" />
                  <p className="text-sm">Hyderabad, Telangana</p>
                  <a
                    href="https://maps.google.com/?q=Hyderabad,Telangana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-sm underline mt-1 inline-block"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
