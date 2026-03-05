import Link from 'next/link'
import Image from 'next/image'
import { FaMapMarkerAlt, FaRulerCombined, FaEye, FaHeart } from 'react-icons/fa'
import { formatPrice, formatArea } from '../../utils/helpers'

export default function PropertyCard({ property, priority = false }) {
  const {
    title, slug, propertyType, listingType, status,
    price, location, size, sizeUnit, images, views
  } = property

  const mainImage = images?.[0]?.url || '/images/placeholder.jpg'
  const isSold = status === 'sold' || status === 'rented'

  return (
    <Link href={`/property/${slug}`} className="card group block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading={priority ? 'eager' : 'lazy'}
          onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
        />
        
        {/* Status overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-lg px-6 py-2 rounded-full rotate-[-12deg] shadow-lg">
              {status === 'sold' ? 'SOLD' : 'RENTED'}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={propertyType === 'land' ? 'badge-land' : 'badge-shed'}>
            {propertyType === 'land' ? '🌿 Land' : '🏭 Shed'}
          </span>
          <span className={listingType === 'sale' ? 'badge-sale' : 'badge-rent'}>
            {listingType === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>

        {/* Views */}
        {views > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            <FaEye size={10} /> {views}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-primary text-base leading-snug mb-1 line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <FaMapMarkerAlt className="text-accent shrink-0" size={12} />
          <span className="truncate">{location?.address}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="price-display text-xl">{formatPrice(price, listingType)}</div>
            {size > 0 && (
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                <FaRulerCombined size={10} />
                {formatArea(size, sizeUnit)}
              </div>
            )}
          </div>
          <div className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
            View →
          </div>
        </div>
      </div>
    </Link>
  )
}
