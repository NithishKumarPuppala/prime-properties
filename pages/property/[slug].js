import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import EnquiryForm from '../../components/property/EnquiryForm'
import connectDB from '../../utils/db'
import Property from '../../models/Property'
import { formatPrice, formatArea } from '../../utils/helpers'
import {
  FaMapMarkerAlt, FaRulerCombined, FaPhone, FaWhatsapp,
  FaShare, FaChevronLeft, FaChevronRight, FaExpandAlt
} from 'react-icons/fa'
import Link from 'next/link'
import Head from 'next/head'

export default function PropertyDetail({ property }) {
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!property) return (
    <Layout title="Property Not Found">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🏡</div>
        <h1 className="section-title mb-3">Property Not Found</h1>
        <p className="text-gray-500 mb-6">This property may have been sold or removed.</p>
        <Link href="/properties" className="btn-primary">Browse Available Properties</Link>
      </div>
    </Layout>
  )

  const {
    _id, title, slug, propertyType, listingType, status,
    price, location, size, sizeUnit, description, features, images
  } = property

  const waMessage = `Hi, I'm interested in: ${title} - ${location?.address}. Please share more details.`
  const waUrl = `https://wa.me/919999999999?text=${encodeURIComponent(waMessage)}`
  const isSold = status === 'sold' || status === 'rented'

  const prevImg = () => setActiveImg(prev => (prev - 1 + images.length) % images.length)
  const nextImg = () => setActiveImg(prev => (prev + 1) % images.length)

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({ title, text: `Check out this property: ${title}`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
    }
  }

  return (
    <>
      <Head>
        <title>{title} | Prime Properties Hyderabad</title>
        <meta name="description" content={`${title} - ${location?.address}. ${formatPrice(price, listingType)}. ${formatArea(size, sizeUnit)}. Contact Prime Properties Hyderabad.`} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={images?.[0]?.url || ''} />
      </Head>

      <Layout>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-accent transition-colors">Properties</Link>
            <span>/</span>
            <span className="text-primary font-medium truncate max-w-xs">{title}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="card mb-6 overflow-hidden">
                <div className="relative bg-gray-100 aspect-video">
                  {images && images.length > 0 ? (
                    <>
                      <img
                        src={images[activeImg]?.url}
                        alt={title}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setLightbox(true)}
                        onError={e => e.target.src = '/images/placeholder.jpg'}
                      />
                      
                      {/* Nav arrows */}
                      {images.length > 1 && (
                        <>
                          <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                            <FaChevronLeft />
                          </button>
                          <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                            <FaChevronRight />
                          </button>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, i) => (
                              <button key={i} onClick={() => setActiveImg(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-white w-5' : 'bg-white/60'}`} />
                            ))}
                          </div>
                        </>
                      )}

                      {/* Expand */}
                      <button onClick={() => setLightbox(true)}
                        className="absolute top-3 right-3 w-9 h-9 bg-black/50 text-white rounded-lg flex items-center justify-center hover:bg-black/70 transition-colors">
                        <FaExpandAlt size={14} />
                      </button>

                      {/* Status badge */}
                      {isSold && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-red-500 text-white font-bold text-2xl px-8 py-3 rounded-full rotate-[-12deg] shadow-xl">
                            {status.toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Image counter */}
                      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {activeImg + 1}/{images.length}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <div className="text-5xl mb-2">🏡</div>
                        <p>No images available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images && images.length > 1 && (
                  <div className="p-3 flex gap-2 overflow-x-auto">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          i === activeImg ? 'border-accent' : 'border-transparent'
                        }`}>
                        <img src={img.url} alt="" className="w-full h-full object-cover"
                          onError={e => e.target.src = '/images/placeholder.jpg'} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Info */}
              <div className="card p-6 mb-6">
                {/* Badges + Share */}
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className={propertyType === 'land' ? 'badge-land' : 'badge-shed'}>
                      {propertyType === 'land' ? '🌿 Land' : '🏭 Industrial Shed'}
                    </span>
                    <span className={listingType === 'sale' ? 'badge-sale' : 'badge-rent'}>
                      {listingType === 'sale' ? 'For Sale' : 'For Rent'}
                    </span>
                    {isSold && <span className="badge-sold">{status.toUpperCase()}</span>}
                  </div>
                  <button onClick={shareProperty}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors">
                    <FaShare size={14} /> Share
                  </button>
                </div>

                <h1 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">{title}</h1>
                
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <FaMapMarkerAlt className="text-accent shrink-0" />
                  <span>{location?.address}, {location?.city}</span>
                </div>

                {/* Key details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price</div>
                    <div className="price-display text-2xl">{formatPrice(price, listingType)}</div>
                  </div>
                  {size > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Area</div>
                      <div className="font-semibold text-primary flex items-center gap-1">
                        <FaRulerCombined className="text-accent" size={14} />
                        {formatArea(size, sizeUnit)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Type</div>
                    <div className="font-semibold text-primary capitalize">{propertyType}</div>
                  </div>
                  {location?.pincode && (
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pincode</div>
                      <div className="font-semibold text-primary">{location.pincode}</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {description && (
                  <div>
                    <h2 className="font-semibold text-lg text-primary mb-3">About this Property</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
                  </div>
                )}

                {/* Features */}
                {features && features.length > 0 && (
                  <div className="mt-6">
                    <h2 className="font-semibold text-lg text-primary mb-3">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-accent text-xs">✓</span>
                          </span>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Map */}
              {(location?.mapUrl || (location?.lat && location?.lng)) && (
                <div className="card p-4 mb-6">
                  <h2 className="font-semibold text-lg text-primary mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-accent" /> Location on Map
                  </h2>
                  {location.mapUrl ? (
                    <div className="rounded-xl overflow-hidden aspect-video bg-gray-100">
                      <iframe
                        src={location.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <a
                      href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full justify-center"
                    >
                      Open in Google Maps
                    </a>
                  )}
                </div>
              )}

              {/* Mobile CTA */}
              <div className="lg:hidden flex gap-3 sticky bottom-20 bg-white/95 backdrop-blur p-4 -mx-4 shadow-lg border-t border-gray-100 z-30">
                <a href="tel:+919999999999" className="flex-1 btn-dark py-4 flex items-center justify-center gap-2">
                  <FaPhone /> Call
                </a>
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 btn-primary py-4 flex items-center justify-center gap-2">
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Price box */}
              <div className="card p-5 mb-4 bg-primary text-white">
                <div className="text-gray-400 text-sm mb-1">
                  {listingType === 'rent' ? 'Monthly Rent' : 'Sale Price'}
                </div>
                <div className="text-3xl font-bold text-accent mb-1">{formatPrice(price, listingType)}</div>
                {size > 0 && (
                  <div className="text-sm text-gray-400">{formatArea(size, sizeUnit)}</div>
                )}
              </div>

              {/* Call & WhatsApp */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <a href="tel:+919999999999" className="btn-dark py-4 flex items-center justify-center gap-2">
                  <FaPhone /> Call
                </a>
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-primary py-4 flex items-center justify-center gap-2">
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>

              {/* Enquiry Form */}
              <div className="card p-5">
                <h3 className="font-display font-bold text-lg text-primary mb-4">Send Enquiry</h3>
                <EnquiryForm propertyId={_id} propertyTitle={title} />
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && images && images.length > 0 && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button className="absolute top-4 right-4 text-white text-3xl font-bold" onClick={() => setLightbox(false)}>×</button>
            <button onClick={(e) => { e.stopPropagation(); prevImg() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center">
              <FaChevronLeft />
            </button>
            <img
              src={images[activeImg]?.url}
              alt={title}
              className="max-h-[85vh] max-w-full object-contain"
              onClick={e => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); nextImg() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center">
              <FaChevronRight />
            </button>
            <div className="absolute bottom-4 text-white/60 text-sm">
              {activeImg + 1} / {images.length}
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}

export async function getServerSideProps({ params }) {
  try {
    await connectDB()
    const property = await Property.findOne({ slug: params.slug }).lean()
    if (!property) return { props: { property: null } }
    // Increment views
    await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } })
    return { props: { property: JSON.parse(JSON.stringify(property)) } }
  } catch {
    return { props: { property: null } }
  }
}
