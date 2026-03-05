import Layout from '../components/layout/Layout'
import PropertyCard from '../components/property/PropertyCard'
import Link from 'next/link'
import connectDB from '../utils/db'
import Property from '../models/Property'
import {
  FaPhone, FaWhatsapp, FaMapMarkerAlt, FaAward, FaHandshake,
  FaCheckCircle, FaArrowRight, FaStar
} from 'react-icons/fa'
import { MdLandscape, MdApartment, MdPeople } from 'react-icons/md'

export default function Home({ featuredProperties, stats }) {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 40%)',
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <FaStar size={12} /> Hyderabad's Trusted Property Dealer
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find Your
                <span className="text-accent block">Perfect</span>
                Property
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md">
                Premium land plots for sale and industrial sheds for rent across Hyderabad & Telangana.
                15+ years of trusted service.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/properties?type=land&listingType=sale" className="btn-primary text-center text-lg py-4 px-8 flex items-center justify-center gap-2">
                  🌿 Land for Sale
                </Link>
                <Link href="/properties?type=shed&listingType=rent" className="btn-outline text-center text-lg py-4 px-8 flex items-center justify-center gap-2 border-white text-white hover:bg-white hover:text-primary">
                  🏭 Sheds for Rent
                </Link>
              </div>

              {/* Quick contact */}
              <div className="flex flex-wrap gap-4">
                <a href="tel:+918341000111" className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors">
                  <FaPhone className="text-accent" />
                  <span>+91 8341000111</span>
                </a>
                <a href="https://wa.me/918341000111" className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors">
                  <FaWhatsapp className="text-green-400" />
                  <span>WhatsApp Now</span>
                </a>
              </div>
            </div>

            {/* Stats card */}
            <div className="hidden lg:grid grid-cols-2 gap-4 animate-slide-up">
              {[
                { icon: MdLandscape, label: 'Land Plots', value: stats.land + '+', color: 'bg-amber-500' },
                { icon: MdApartment, label: 'Industrial Sheds', value: stats.shed + '+', color: 'bg-blue-500' },
                { icon: FaHandshake, label: 'Deals Closed', value: '500+', color: 'bg-accent' },
                { icon: MdPeople, label: 'Happy Clients', value: '450+', color: 'bg-purple-500' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white hover:bg-white/20 transition-all">
                  <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                    <s.icon size={20} className="text-white" />
                  </div>
                  <div className="text-3xl font-bold font-display">{s.value}</div>
                  <div className="text-gray-400 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile stats */}
      <section className="lg:hidden bg-white px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Land Plots', value: stats.land + '+', emoji: '🌿' },
            { label: 'Sheds', value: stats.shed + '+', emoji: '🏭' },
            { label: 'Deals', value: '500+', emoji: '🤝' },
            { label: 'Clients', value: '450+', emoji: '😊' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-2">Browse by Category</h2>
        <p className="text-center text-gray-500 mb-8">Find exactly what you're looking for</p>
        
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              href: '/properties?type=land&listingType=sale',
              icon: '🌿',
              title: 'Land for Sale',
              desc: 'Agricultural, residential & commercial plots',
              color: 'from-amber-50 to-amber-100 border-amber-200',
              accent: 'text-amber-600',
            },
            {
              href: '/properties?type=shed&listingType=rent',
              icon: '🏭',
              title: 'Industrial Sheds for Rent',
              desc: 'Warehouses, factories & storage facilities',
              color: 'from-blue-50 to-blue-100 border-blue-200',
              accent: 'text-blue-600',
            },
            {
              href: '/properties',
              icon: '🔍',
              title: 'All Listings',
              desc: 'Browse our complete property portfolio',
              color: 'from-green-50 to-green-100 border-green-200',
              accent: 'text-green-600',
            },
          ].map((cat) => (
            <Link key={cat.href} href={cat.href}
              className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6 group hover:shadow-lg transition-all`}>
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className={`font-display font-bold text-xl mb-2 ${cat.accent}`}>{cat.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{cat.desc}</p>
              <div className={`flex items-center gap-2 ${cat.accent} text-sm font-semibold group-hover:gap-3 transition-all`}>
                View Properties <FaArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Featured Properties</h2>
                <p className="text-gray-500 mt-1">Handpicked premium listings</p>
              </div>
              <Link href="/properties" className="hidden sm:flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                View All <FaArrowRight size={14} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((p, i) => (
                <PropertyCard key={p._id} property={p} priority={i < 3} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link href="/properties" className="btn-outline">View All Properties</Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-2">Why Choose Prime Properties?</h2>
        <p className="text-center text-gray-500 mb-10">We make property deals simple, transparent, and rewarding</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FaAward, title: '15+ Years Experience', desc: 'Deep market knowledge across Hyderabad & Telangana' },
            { icon: FaCheckCircle, title: 'Verified Properties', desc: 'All listings are verified and legally clear' },
            { icon: FaHandshake, title: 'End-to-End Support', desc: 'From search to registration, we guide you through' },
            { icon: FaMapMarkerAlt, title: 'Local Expertise', desc: 'We know every neighborhood, price trend & opportunity' },
          ].map((f, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="text-accent text-2xl" />
              </div>
              <h3 className="font-semibold text-primary mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA Banner */}
      <section className="bg-accent mx-4 mb-12 rounded-3xl overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Ready to Find Your Property?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Call us or send a WhatsApp message. We respond within 30 minutes during business hours!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+918341000111"
              className="bg-white text-accent font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 text-lg">
              <FaPhone /> Call Now
            </a>
            <a href="https://wa.me/918341000111?text=Hi, I'm interested in your properties"
              target="_blank" rel="noopener noreferrer"
              className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-lg">
              <FaWhatsapp /> WhatsApp
            </a>
            <Link href="/contact"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-accent transition-colors flex items-center justify-center gap-2 text-lg">
              Send Enquiry
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    await connectDB()
    const [featured, landCount, shedCount] = await Promise.all([
      Property.find({ isFeatured: true, status: 'available' }).sort({ createdAt: -1 }).limit(6).lean(),
      Property.countDocuments({ propertyType: 'land' }),
      Property.countDocuments({ propertyType: 'shed' }),
    ])

    return {
      props: {
        featuredProperties: JSON.parse(JSON.stringify(featured)),
        stats: { land: landCount, shed: shedCount },
      }
    }
  } catch {
    return { props: { featuredProperties: [], stats: { land: 0, shed: 0 } } }
  }
}
