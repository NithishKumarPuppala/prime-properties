import connectDB from '../../../utils/db'
import Property from '../../../models/Property'
import { requireAuth } from '../../../utils/auth'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

const uploadDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    // Public: list properties
    const {
      type, listingType, city, status = 'available',
      minPrice, maxPrice, featured, limit = 12, page = 1, search
    } = req.query

    const filter = {}
    if (type) filter.propertyType = type
    if (listingType) filter.listingType = listingType
    if (city) filter['location.city'] = { $regex: city, $options: 'i' }
    if (status !== 'all') filter.status = status
    if (featured === 'true') filter.isFeatured = true
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.area': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Property.countDocuments(filter),
    ])

    return res.json({ properties, total, pages: Math.ceil(total / Number(limit)), page: Number(page) })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

// POST requires auth - handled in separate file
export default handler
