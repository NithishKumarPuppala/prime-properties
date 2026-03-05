import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaBars, FaTimes, FaHome, FaBuilding, FaPhone, FaEnvelope } from 'react-icons/fa'
import { MdApartment } from 'react-icons/md'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [router.pathname])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties?type=land&listingType=sale', label: 'Land for Sale' },
    { href: '/properties?type=shed&listingType=rent', label: 'Industrial Sheds' },
    { href: '/properties', label: 'All Properties' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <MdApartment className="text-white text-xl" />
            </div>
            <div>
              <div className="font-display font-bold text-primary text-lg leading-tight">Prime Properties</div>
              <div className="text-xs text-gray-500 leading-tight hidden sm:block">Land & Industrial Specialists</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  router.asPath === link.href
                    ? 'text-accent bg-green-50'
                    : 'text-gray-600 hover:text-accent hover:bg-green-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-primary hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-accent hover:bg-green-50 transition-colors flex items-center gap-3"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <div className="h-16" />
    </>
  )
}
