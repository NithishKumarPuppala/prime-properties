import connectDB from '../../../utils/db'
import Enquiry from '../../../models/Enquiry'
import { requireAuth } from '../../../utils/auth'

async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    const { page = 1, limit = 20, unread } = req.query
    const filter = unread === 'true' ? { isRead: false } : {}
    const [enquiries, total, unreadCount] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('property', 'title slug'),
      Enquiry.countDocuments(filter),
      Enquiry.countDocuments({ isRead: false }),
    ])
    return res.json({ enquiries, total, unreadCount })
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    const { isRead } = req.body
    await Enquiry.findByIdAndUpdate(id, { isRead })
    return res.json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default requireAuth(handler)
