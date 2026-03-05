import Layout from '../components/layout/Layout'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout title="Page Not Found">
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-8xl font-display font-bold text-gray-100 mb-4">404</div>
        <h1 className="section-title mb-3">Page Not Found</h1>
        <p className="text-gray-500 text-lg mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/properties" className="btn-outline">Browse Properties</Link>
        </div>
      </div>
    </Layout>
  )
}
