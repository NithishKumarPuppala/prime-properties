import connectDB from '../../../../utils/db'
import Property from '../../../../models/Property'
import { requireAuth } from '../../../../utils/auth'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import cloudinary from '../../../../utils/cloudinary'

export const config = { api: { bodyParser: false } }

const uploadDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ uploadDir, keepExtensions: true, maxFileSize: 10 * 1024 * 1024, multiples: true })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err); else resolve({ fields, files })
    })
  })
}

function getField(fields, key) {
  const val = fields[key]
  return Array.isArray(val) ? val[0] : val
}

async function handler(req, res) {
  await connectDB()
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { fields, files } = await parseForm(req)
      
      const existingProperty = await Property.findById(id)
      if (!existingProperty) return res.status(404).json({ error: 'Property not found' })

      const images = [...existingProperty.images]
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
          fs.unlink(file.filepath, () => {})
        }
      }

      // Remove deleted images
      const keepImages = getField(fields, 'keepImages')
      const keepList = keepImages ? JSON.parse(keepImages) : null
      const finalImages = keepList ? images.filter(img => keepList.includes(img.public_id)) : images

      const update = {
        title: getField(fields, 'title') || existingProperty.title,
        propertyType: getField(fields, 'propertyType') || existingProperty.propertyType,
        listingType: getField(fields, 'listingType') || existingProperty.listingType,
        status: getField(fields, 'status') || existingProperty.status,
        price: Number(getField(fields, 'price')) || existingProperty.price,
        priceUnit: getField(fields, 'priceUnit') || '',
        'location.address': getField(fields, 'address') || existingProperty.location.address,
        'location.area': getField(fields, 'area') || '',
        'location.city': getField(fields, 'city') || 'Hyderabad',
        'location.mapUrl': getField(fields, 'mapUrl') || '',
        size: Number(getField(fields, 'size')) || existingProperty.size,
        sizeUnit: getField(fields, 'sizeUnit') || existingProperty.sizeUnit,
        description: getField(fields, 'description') || '',
        isFeatured: getField(fields, 'isFeatured') === 'true',
        images: finalImages,
      }

      const property = await Property.findByIdAndUpdate(id, update, { new: true })
      return res.json({ success: true, property })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    const property = await Property.findByIdAndDelete(id)
    if (!property) return res.status(404).json({ error: 'Not found' })
    return res.json({ success: true })
  }

  if (req.method === 'PATCH') {
    // Quick status update
    try {
      let body = ''
      req.on('data', chunk => { body += chunk })
      await new Promise(resolve => req.on('end', resolve))
      const { status } = JSON.parse(body)
      const property = await Property.findByIdAndUpdate(id, { status }, { new: true })
      return res.json({ success: true, property })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default requireAuth(handler)
