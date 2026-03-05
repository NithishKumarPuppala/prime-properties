import mongoose from 'mongoose'

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  propertyType: { type: String, enum: ['land', 'shed'], required: true },
  listingType: { type: String, enum: ['sale', 'rent'], required: true },
  status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
  price: { type: Number, required: true },
  priceUnit: { type: String, default: '' }, // per month, per acre, etc.
  location: {
    address: { type: String, required: true },
    area: { type: String },
    city: { type: String, default: 'Hyderabad' },
    state: { type: String, default: 'Telangana' },
    pincode: { type: String },
    mapUrl: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  size: { type: Number },
  sizeUnit: { type: String, enum: ['sqft', 'acres', 'guntas', 'sqyards'], default: 'sqft' },
  description: { type: String },
  features: [String],
  images: [{ url: String, public_id: String, caption: String }],
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

// Auto-generate slug before save
PropertySchema.pre('save', async function(next) {
  if (!this.slug || this.isModified('title') || this.isModified('location')) {
    const base = `${this.propertyType} ${this.location.address} ${this.size || ''}`.toLowerCase()
    const slug = base.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    const shortId = this._id.toString().slice(-6)
    this.slug = `${slug}-${shortId}`
  }
  next()
})

export default mongoose.models.Property || mongoose.model('Property', PropertySchema)
