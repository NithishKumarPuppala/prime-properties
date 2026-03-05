# Prime Properties - Real Estate Platform

A production-ready real estate listing platform for land plots and industrial sheds in Hyderabad, Telangana.

## 🏗️ Tech Stack
- **Frontend**: Next.js 14, TailwindCSS, React Icons
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT + bcrypt
- **Image Storage**: Local filesystem (`/public/uploads`)
- **Deployment**: Vercel + MongoDB Atlas

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```
Fill in your MongoDB URI and JWT secret.

### 3. Create Admin Account
```bash
npm run dev
```
Then visit: `http://localhost:3000/api/admin/setup` (POST request)
Or use the default:
- Email: `admin@realestate.com`
- Password: `admin123456`

### 4. Run Development Server
```bash
npm run dev
```

## 📁 Project Structure

```
/
├── components/
│   ├── layout/
│   │   ├── Navbar.js         # Responsive navbar with mobile menu
│   │   ├── Footer.js         # Footer with links and contact
│   │   ├── Layout.js         # Page wrapper with SEO head
│   │   └── FloatingButtons.js # Fixed WhatsApp + Call buttons
│   ├── property/
│   │   ├── PropertyCard.js   # Property listing card
│   │   ├── EnquiryForm.js    # Contact form with validation
│   │   └── PropertyFilters.js # Search and filter UI
│   └── admin/
│       └── AdminLayout.js    # Admin sidebar + header
├── pages/
│   ├── index.js              # Home page with hero + featured
│   ├── properties.js         # Properties listing with filters
│   ├── contact.js            # Contact page
│   ├── property/
│   │   └── [slug].js         # Property detail page (SEO-friendly URL)
│   ├── admin/
│   │   ├── index.js          # Admin login
│   │   ├── dashboard.js      # Admin dashboard
│   │   ├── properties.js     # Manage all properties
│   │   ├── add-property.js   # Add new property
│   │   ├── enquiries.js      # View customer enquiries
│   │   └── edit-property/
│   │       └── [id].js       # Edit existing property
│   └── api/
│       ├── properties/
│       │   ├── index.js      # GET all properties (public)
│       │   └── [slug].js     # GET property by slug (public)
│       ├── enquiries/
│       │   └── index.js      # POST new enquiry (public)
│       └── admin/
│           ├── login.js      # Admin login
│           ├── setup.js      # One-time admin setup
│           ├── properties.js # Admin CRUD (protected)
│           ├── property/
│           │   └── [id].js   # Edit/delete/status update
│           └── enquiries.js  # View enquiries (protected)
├── models/
│   ├── Property.js           # Property schema
│   ├── Enquiry.js            # Enquiry schema
│   └── Admin.js              # Admin user schema
├── utils/
│   ├── db.js                 # MongoDB connection
│   ├── auth.js               # JWT utilities + middleware
│   └── helpers.js            # Price/area formatters
└── styles/
    └── globals.css           # Global styles + utilities
```

## 🌐 Deployment on Vercel

1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Random string (32+ chars)
4. Deploy!

## 🗄️ MongoDB Atlas Setup

1. Create free cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IP `0.0.0.0/0` for Vercel
4. Copy connection string to `MONGODB_URI`

## 📱 Features

### Public
- ✅ Responsive mobile-first design
- ✅ Property listing with filters (type, price, location)
- ✅ Property detail pages with SEO-friendly URLs
- ✅ Image gallery with lightbox
- ✅ Enquiry forms
- ✅ WhatsApp & Call floating buttons
- ✅ Contact page

### Admin
- ✅ Secure JWT login
- ✅ Add/edit/delete properties
- ✅ Upload multiple images
- ✅ Mark properties as Sold/Rented
- ✅ Feature properties on homepage
- ✅ View and manage enquiries
- ✅ Mark enquiries as read

## 🎨 Customization

Edit these files to customize for your business:
- Phone/WhatsApp: `components/layout/Navbar.js`, `FloatingButtons.js`
- Business name: `components/layout/Navbar.js`, `Footer.js`
- Colors: `tailwind.config.js`
- SEO: `components/layout/Layout.js`

## 🔧 Changing Default Admin

Visit `/api/admin/setup` only works in development mode.
For production, use MongoDB Atlas to manually insert or update admin document.
