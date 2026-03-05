import mongoose from 'mongoose'

const EnquirySchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  propertyTitle: { type: String },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, trim: true, lowercase: true },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  source: { type: String, enum: ['website', 'whatsapp', 'call'], default: 'website' },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
})

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema)
