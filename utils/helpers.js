import slugify from 'slugify'

export function createPropertySlug(title, location, size, id) {
  const base = `${title} ${location} ${size}`
  const slug = slugify(base, { lower: true, strict: true, trim: true })
  return `${slug}-${id.toString().slice(-6)}`
}

export function formatPrice(price, listingType) {
  if (!price) return 'Price on request'
  const num = Number(price)
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr${listingType === 'rent' ? '/mo' : ''}`
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L${listingType === 'rent' ? '/mo' : ''}`
  return `₹${num.toLocaleString('en-IN')}${listingType === 'rent' ? '/mo' : ''}`
}

export function formatArea(size, unit) {
  if (!size) return ''
  return `${Number(size).toLocaleString('en-IN')} ${unit || 'sq ft'}`
}
