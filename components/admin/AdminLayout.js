import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { MdApartment, MdDashboard, MdAddHome, MdList, MdEmail, MdLogout, MdMenu, MdClose } from 'react-icons/md'
import { FaBell } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const info = localStorage.getItem('admin_info')
    if (!token) {
      router.replace('/admin')
      return
    }
    if (info) setAdmin(JSON.parse(info))
    fetchUnread(token)
  }, [])

  const fetchUnread = async (token) => {
    try {
      const res = await fetch('/api/admin/enquiries?unread=true', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setUnreadCount(data.unreadCount || 0)
    } catch {}
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    toast.success('Logged out')
    router.push('/admin')
  }

  const navItems = [
    { href: '/admin/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { href: '/admin/properties', icon: MdList, label: 'Properties' },
    { href: '/admin/add-property', icon: MdAddHome, label: 'Add Property' },
    { href: '/admin/enquiries', icon: MdEmail, label: 'Enquiries', badge: unreadCount },
  ]

  return (
    <>
      <Head>
        <title>{title} | Admin | Prime Properties</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Logo */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shrink-0">
              <MdApartment size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Prime Properties</div>
              <div className="text-xs text-gray-400">Admin Panel</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white">
              <MdClose size={20} />
            </button>
          </div>

          {/* Admin info */}
          {admin && (
            <div className="px-4 py-3 border-b border-white/10">
              <div className="text-sm font-medium">{admin.name}</div>
              <div className="text-xs text-gray-400">{admin.email}</div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative ${
                  router.pathname === item.href
                    ? 'bg-accent text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}>
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <MdLogout size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
                <MdMenu size={24} />
              </button>
              <h1 className="font-semibold text-gray-800 text-lg">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/enquiries" className="relative">
                <FaBell className="text-gray-500 hover:text-accent transition-colors" size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/" target="_blank" className="text-xs text-accent hover:underline hidden sm:block">
                View Site →
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
