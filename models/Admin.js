import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  whatsapp: { type: String },
  businessName: { type: String },
  createdAt: { type: Date, default: Date.now },
})

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

AdminSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema)
