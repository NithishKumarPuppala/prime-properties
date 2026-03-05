import Navbar from './Navbar'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'
import Head from 'next/head'

export default function Layout({ children, title, description, ogImage }) {
  const pageTitle = title ? `${title} | Prime Properties Hyderabad` : 'Prime Properties Hyderabad - Land & Industrial Sheds'
  const pageDesc = description || 'Buy land plots and rent industrial sheds in Hyderabad, Telangana. Prime Properties - your trusted real estate partner for 15+ years.'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
