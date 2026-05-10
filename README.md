# MAYURA - Premium Fashion E-Commerce Marketplace

A sophisticated fashion e-commerce platform showcasing curated outfit collections with glassmorphic premium design. Built with Next.js 16, Supabase, and Razorpay.

## 🎨 Project Overview

**Mayura** is a luxury fashion marketplace that revolutionizes how customers shop for complete outfits. Instead of hunting for individual pieces, shoppers browse expertly-curated outfit collections and can either purchase complete looks or select individual products from each outfit.

**Tagline:** "Wear Your Form"

### Key Features

- **Curated Outfit Collections**: Pre-styled outfit combinations designed by fashion experts
- **Flexible Shopping**: Add complete outfits to cart OR select individual pieces
- **Glassmorphic Design**: Premium UI with backdrop blur effects and gold accents
- **Role-Based Access**: Customer and admin accounts with separate dashboards
- **Complete E-Commerce**: Shopping cart, checkout, order tracking, favorites
- **Admin Management**: Full control over products, outfits, orders, and analytics

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with RLS policies
- **Styling**: Tailwind CSS with custom glassmorphic components
- **Storage**: Vercel Blob (for product images)
- **Payments**: Razorpay integration (configured, awaiting API setup)
- **Fonts**: Playfair Display (headings), Lora (body)
- **Icons**: Lucide React

## 📁 Project Structure

```
app/
├── page.tsx                          # Home page with hero and featured outfits
├── (shop)/
│   ├── outfits/page.tsx             # Outfit browsing with filters
│   ├── outfits/[id]/page.tsx        # Outfit detail page with products
│   └── cart/page.tsx                # Shopping cart management
├── checkout/page.tsx                 # Multi-step checkout with Razorpay
├── (info)/
│   ├── about/page.tsx               # About Mayura
│   ├── contact/page.tsx             # Contact form
│   ├── faq/page.tsx                 # FAQ page
│   └── shipping/page.tsx            # Shipping policy
├── account/
│   └── dashboard/page.tsx           # Customer account dashboard
├── admin/
│   └── dashboard/page.tsx           # Admin control panel
├── (auth)/
│   ├── login/page.tsx               # Login page
│   ├── sign-up/page.tsx             # Registration page
│   └── callback/route.ts            # Auth callback handler
├── auth/callback/route.ts           # Supabase auth callback
└── globals.css                      # Glassmorphic theme with design tokens

components/
├── layout/
│   ├── navbar.tsx                   # Navigation with auth state
│   ├── footer.tsx                   # Footer with links
│   └── layout-wrapper.tsx           # Main layout wrapper
└── outfits/
    └── outfit-card.tsx              # Reusable outfit card component

lib/
├── supabase/
│   ├── client.ts                    # Supabase browser client
│   ├── server.ts                    # Supabase server client
│   └── proxy.ts                     # Supabase session proxy
└── utils.ts                         # Utility functions

middleware.ts                        # Auth session refresh
```

## 🎨 Design System

### Color Palette
- **Primary Background**: `#f5f1ec` (Soft Cream)
- **Accent**: `#d4af37` (Gold)
- **Foreground**: `#1a1a1a` (Charcoal)
- **Secondary**: `#e8e4df` (Light Gray)
- **Muted**: `#d9d4ce` (Subtle Gray)

### Typography
- **Headings**: Playfair Display (Light, 400-700 weight)
- **Body**: Lora (Regular weight)
- **Spacing**: Max 2 font families with consistent weights

### Component Styles
- `.glass`: Glassmorphic cards with backdrop blur
- `.glass-sm`: Smaller glassmorphic components
- `.btn-premium`: Premium button styling
- `.text-premium`: Premium text with letter spacing

## 🗄️ Database Schema

### Tables
- **users**: Authentication + profile (role: customer/admin)
- **products**: Individual fashion items
- **outfits**: Outfit collections
- **outfit_items**: Many-to-many relationship with optional items
- **cart_items**: Shopping cart entries (outfit or product)
- **orders**: Customer orders with status tracking
- **order_items**: Order line items
- **favorites**: Wishlisted outfits
- **outfit_reviews**: Customer reviews with ratings
- **payments**: Razorpay transaction records

### RLS Policies
- Customers: View public outfits/products, manage own cart/orders/favorites
- Admins: Full access to all resources
- Reviews: Public read, user-owned create/update/delete

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (pnpm recommended)
- Supabase account with database setup
- Razorpay merchant account
- Vercel Blob storage configured

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
# NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
# RAZORPAY_KEY_ID=your_key
# RAZORPAY_KEY_SECRET=your_secret

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Database Setup

The database schema needs to be applied to your Supabase project. Due to connection timeouts, the migration script is documented in the plan file. Apply the SQL schema to your Supabase database using their SQL editor.

## 📋 Pages Built

### Public Pages
- ✅ **Home** (`/`): Hero, featured outfits, why choose Mayura
- ✅ **Outfits** (`/outfits`): Filterable outfit grid (occasion, season, price)
- ✅ **Outfit Detail** (`/outfits/[id]`): Full outfit with products, reviews, similar outfits
- ✅ **Cart** (`/cart`): Cart management with promo code support
- ✅ **Checkout** (`/checkout`): Multi-step checkout (address, shipping, payment)
- ✅ **About** (`/about`): Brand story and values
- ✅ **Contact** (`/contact`): Contact form and business info
- ✅ **FAQ** (`/faq`): Common questions
- ✅ **Shipping** (`/shipping`): Shipping policy and options

### Auth Pages
- ✅ **Login** (`/auth/login`): Email/password login
- ✅ **Sign Up** (`/auth/sign-up`): User registration
- ✅ **Auth Callback** (`/auth/callback`): Session handler

### Account Pages
- ✅ **Account Dashboard** (`/account/dashboard`): Profile, orders, favorites, settings

### Admin Pages
- ✅ **Admin Dashboard** (`/admin/dashboard`): Stats, orders, analytics (UI framework ready)

## 🔄 Supabase Integration

The project includes:
- Supabase Auth client setup (browser & server)
- Session management with middleware
- RLS policies for role-based access
- User auto-creation trigger on signup
- Proper error handling for auth flows

**Note:** Database schema migration encountered timeout issues. Apply the migration SQL directly through Supabase dashboard.

## 💳 Razorpay Integration

Checkout page framework is ready with:
- Multi-step checkout UI
- Razorpay payment method selection
- Order total calculation with shipping/tax
- Security badges and encrypted messaging

**TODO:** Connect to actual Razorpay API with webhook handling for order confirmation.

## 🎯 Implementation Highlights

### 1. Glassmorphic Premium Design
- Backdrop blur effects on cards
- Gold accent color throughout
- Smooth transitions and hover states
- Responsive grid layouts

### 2. Outfit-First Shopping Model
- Products exist only within outfits
- Optional and required items system
- Mixed cart (outfits + individual products)
- Individual product price tracking

### 3. Advanced Filtering
- Occasion filter (Casual, Formal, Party)
- Season filter (Spring, Summer, Autumn, Winter)
- Price range filter
- Multiple sort options (price, rating, newest)

### 4. Role-Based Access
- Customer dashboard with orders, favorites, addresses
- Admin dashboard with products, outfits, orders management
- Auth-protected routes with RLS database policies

### 5. Mobile Responsive
- Mobile-first approach
- Collapsible navigation
- Touch-friendly inputs
- Responsive grid systems

## 🔐 Security Features

- Supabase RLS (Row Level Security) policies
- HTTPS-only authentication
- Secure session management
- Protected admin routes
- Input validation on forms
- CSRF protection via Next.js

## 📊 Sample Data

The project includes sample data for:
- 8+ outfit collections with varying prices and occasions
- Detailed product specifications
- Customer reviews and ratings
- Order history examples
- Admin analytics data

## 🚧 Next Steps & TODOs

### Critical Path (Backend)
1. Apply database schema migration to Supabase
2. Configure Razorpay API keys and webhook handlers
3. Implement cart state management (Zustand/Redux)
4. Build API routes for cart, orders, and checkout
5. Connect admin dashboard to database

### Feature Enhancements
- Search functionality with filters
- Advanced recommendation engine
- Email notifications
- Order status webhooks
- Inventory management
- Seller dashboard (if multi-vendor needed)
- Social sharing features
- Size guide and fit recommendations

### Performance
- Image optimization and lazy loading
- Database query optimization
- Caching strategies for popular outfits
- CDN setup for static assets

## 📱 Responsive Design Notes

- Mobile navigation collapses to hamburger menu
- Filter panel toggles on mobile
- Touch-friendly button sizes (min 44px)
- Stack layouts on small screens
- Full-width inputs on mobile forms

## 🎓 Learning Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Tailwind CSS](https://tailwindcss.com)
- [Razorpay Integration](https://razorpay.com/docs/api/orders/)

## 📄 License

This project is proprietary to Mayura. All rights reserved.

## 👥 Contact

For questions or support: hello@mayura.com

---

**Built with** ❤️ **by Mayura Design Team**

"Wear Your Form" - Express yourself through curated fashion.
