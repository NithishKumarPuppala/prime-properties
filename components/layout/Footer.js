import Link from 'next/link'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa'
import { MdApartment } from 'react-icons/md'

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <MdApartment className="text-white text-xl" />
              </div>
              <div className="font-display font-bold text-white text-lg">Prime Properties</div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Hyderabad's trusted specialists in land plots and industrial shed properties.
              15+ years of experience. 500+ successful deals.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <FaWhatsapp />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Properties</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/properties?type=land&listingType=sale', label: 'Land for Sale' },
                { href: '/properties?type=shed&listingType=rent', label: 'Industrial Sheds for Rent' },
                { href: '/properties?type=shed', label: 'Sheds for Sale' },
                { href: '/properties?featured=true', label: 'Featured Properties' },
                { href: '/properties', label: 'All Listings' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaPhone className="text-accent mt-0.5 shrink-0" />
                <a href="tel:+918341000111" className="hover:text-accent transition-colors">+91 8341000111</a>
              </li>
              <li className="flex items-start gap-3">
                <FaWhatsapp className="text-accent mt-0.5 shrink-0" />
                <a href="https://wa.me/918341000111" className="hover:text-accent transition-colors">WhatsApp Chat</a>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-accent mt-0.5 shrink-0" />
                <a href="mailto:sridher.puppala@gmail.com" className="hover:text-accent transition-colors">sridher.puppala@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-accent mt-0.5 shrink-0" />
                <span>C-33 , Green Industrial Park, Malkapur</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Prime Properties. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin" className="hover:text-gray-300 transition-colors">Admin Login</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
