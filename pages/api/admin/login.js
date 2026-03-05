import dbConnect from "../../../utils/db"
import User from "../../../models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    await dbConnect()

    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    let user = await User.findOne({ email })

    // Auto-bootstrap default admin if not present
    if (!user && email === "admin@realestate.com") {
      const hashed = await bcrypt.hash("admin123", 10)
      user = await User.create({
        email: "admin@realestate.com",
        password: hashed,
        role: "admin",
      })
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const secret = process.env.JWT_SECRET || "dev-admin-secret"

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "7d" }
    )

    return res.status(200).json({
      success: true,
      token,
      admin: {
        email: user.email,
        role: user.role || "admin",
      },
    })
  } catch (error) {
    console.error("Admin login error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}