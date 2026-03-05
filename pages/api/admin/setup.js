import connectDB from '../../../utils/db'
import Admin from '../../../models/Admin'

// One-time setup endpoint - disable after first use
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not allowed in production' })
  }

  await connectDB()

  const existing = await Admin.findOne({ email: 'admin@realestate.com' })
  if (existing) return res.json({ message: 'Admin already exists' })

  const admin = await Admin.create({
    name: 'Admin',
    email: 'admin@realestate.com',
    password: 'admin123456',
    phone: '+91 9999999999',
    whatsapp: '+919999999999',
    businessName: 'Prime Properties',
  })

  res.json({ message: 'Admin created', email: 'admin@realestate.com', password: 'admin123456' })
}
