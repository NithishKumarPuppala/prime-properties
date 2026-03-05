import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { MdApartment } from 'react-icons/md'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data) {
        toast.error(data?.message || 'Login failed')
        return
      }

      if (data.success && data.token && data.admin) {
        try {
          localStorage.setItem('admin_token', data.token)
          localStorage.setItem('admin_info', JSON.stringify(data.admin))
        } catch {
          // ignore storage errors, still allow navigation
        }
        toast.success('Welcome back!')
        router.push('/admin/dashboard')
      } else {
        toast.error(data.message || 'Invalid response from server')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <>
      <Head>
        <title>Admin Login | Prime Properties</title>
      </Head>

      <div className="min-h-screen bg-primary flex items-center justify-center px-4">

        <div className="w-full max-w-md">

          <div className="text-center mb-8">

            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MdApartment className="text-white text-3xl" />
            </div>

            <h1 className="font-display text-3xl font-bold text-white">
              Admin Portal
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Prime Properties Management
            </p>

          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl">

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="admin@realestate.com"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    className="input-field pr-10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-base mt-2"
              >

                {loading ? "Logging in..." : "Login to Dashboard"}

              </button>

            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Secure admin access only
            </p>

          </div>

        </div>

      </div>
    </>
  )
}