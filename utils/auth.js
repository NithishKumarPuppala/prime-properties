import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  // Also check cookies
  const cookies = req.headers.cookie || ''
  const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('admin_token='))
  if (tokenCookie) {
    return tokenCookie.split('=')[1].trim()
  }
  return null
}

export function requireAuth(handler) {
  return async (req, res) => {
    const token = getTokenFromRequest(req)
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    req.admin = decoded
    return handler(req, res)
  }
}
