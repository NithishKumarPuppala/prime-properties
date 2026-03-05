import connectDB from '../../../utils/db'
import Property from '../../../models/Property'

export default async function handler(req, res) {
  await connectDB()
  const { slug } = req.query

  if (req.method === 'GET') {
    const property = await Property.findOne({ slug })
    if (!property) return res.status(404).json({ error: 'Property not found' })
    
    // Increment views
    await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } })
    
    return res.json(property)
  }

  res.status(405).json({ error: 'Method not allowed' })
}
