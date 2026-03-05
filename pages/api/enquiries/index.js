import connectDB from '../../../utils/db'
import Enquiry from '../../../models/Enquiry'
import Property from '../../../models/Property'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    const { propertyId, name, phone, email, message } = req.body
    if (!propertyId || !name || !phone) {
      return res.status(400).json({ error: 'Property, name and phone are required' })
    }

    const property = await Property.findById(propertyId)
    const enquiry = await Enquiry.create({
      property: propertyId,
      propertyTitle: property?.title || '',
      name, phone, email, message,
    })

    return res.status(201).json({ success: true, enquiry })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
