import { FaPhone, FaWhatsapp } from 'react-icons/fa'

export default function FloatingButtons({ phone = '+919999999999', whatsapp = '+919999999999', message = '' }) {
  const waUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`
  
  return (
    <div className="floating-cta">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-float hover:bg-green-600 active:scale-95 transition-all animate-pulse-green"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>
      <a
        href={`tel:${phone}`}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-light active:scale-95 transition-all"
        title="Call Now"
        aria-label="Call Now"
      >
        <FaPhone size={20} />
      </a>
    </div>
  )
}
