import connectDB from '../../../utils/db'
import Property from '../../../models/Property'
import { requireAuth } from '../../../utils/auth'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import cloudinary from '../../../utils/cloudinary'

export const config = { api: { bodyParser: false } }

const uploadDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      multiples: true,
    })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

function getField(fields, key) {
  const val = fields[key]
  if (Array.isArray(val)) return val[0]
  return val
}

async function handler(req, res) {
  await connectDB()

  // Helpful for debugging on Vercel
  // eslint-disable-next-line no-console
  console.log('[/api/admin/properties] method:', req.method)

  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS', 'HEAD'])
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    // Create property
    try {
      const { fields, files } = await parseForm(req)
      
      const images = []
      const uploadedFiles = files.images
        ? (Array.isArray(files.images) ? files.images : [files.images])
        : []

      for (const file of uploadedFiles) {
        if (file && file.filepath) {
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: 'properties',
          })
          images.push({
            url: result.secure_url,
            public_id: result.public_id,
          })
          // best-effort cleanup of temp file
          fs.unlink(file.filepath, () => {})
        }
      }

      const featuresRaw = getField(fields, 'features')
      const features = featuresRaw ? JSON.parse(featuresRaw) : []

      const property = new Property({
        title: getField(fields, 'title'),
        propertyType: getField(fields, 'propertyType'),
        listingType: getField(fields, 'listingType'),
        price: Number(getField(fields, 'price')),
        priceUnit: getField(fields, 'priceUnit') || '',
        location: {
          address: getField(fields, 'address'),
          area: getField(fields, 'area') || '',
          city: getField(fields, 'city') || 'Hyderabad',
          state: getField(fields, 'state') || 'Telangana',
          pincode: getField(fields, 'pincode') || '',
          mapUrl: getField(fields, 'mapUrl') || '',
          lat: getField(fields, 'lat') ? Number(getField(fields, 'lat')) : null,
          lng: getField(fields, 'lng') ? Number(getField(fields, 'lng')) : null,
        },
        size: Number(getField(fields, 'size')) || 0,
        sizeUnit: getField(fields, 'sizeUnit') || 'sqft',
        description: getField(fields, 'description') || '',
        features,
        images,
        isFeatured: getField(fields, 'isFeatured') === 'true',
      })

      await property.save()
      return res.status(201).json({ success: true, property })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'GET') {
    const { status, page = 1, limit = 20 } = req.query
    const filter = status && status !== 'all' ? { status } : {}
    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Property.countDocuments(filter),
    ])
    return res.json({ properties, total })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).json({ error: `Method ${req.method} not allowed` })
}

export default requireAuth(handler)
