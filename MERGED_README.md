# KSK Enterprise - Unified Application

## Overview

This is the **complete unified application** for KSK Enterprise, a multi-business ecommerce platform based in Wa, Upper West Region, Ghana. The application has been merged from 4 separate development parts into a single, production-ready solution.

## Business Lines

1. **Fashion & Smocks** — Hand-woven traditional smocks and fugus
2. **Car Rentals** — Vehicles for weddings, personal use, and corporate events  
3. **Construction** — Building materials and contracting services

## Merge History

This unified application combines the best features from 4 development parts:

- **Part 1**: Foundation with Next.js + Supabase setup, homepage, and basic schema
- **Part 2**: Additional UI pages (about, admin, cart, contact, login, register, rentals, construction)
- **Part 3**: Backend integration with CartContext, server actions, API routes, and middleware
- **Part 4**: Admin CRUD operations, image upload, Paystack payment integration, and deployment configuration

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TailwindCSS |
| Backend | Next.js API Routes + Server Actions |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage (3 buckets: products, vehicles, materials) |
| Payments | Paystack (Mobile Money + Bank Cards) |
| Webhooks | Supabase Edge Functions |
| Deployment | Vercel |

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local development)
- [Vercel CLI](https://vercel.com/docs/cli) (optional, for deployment)

## Quick Start

### 1. Install Dependencies

```bash
cd ksk-enterprise-unified
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Paystack test public key
- `PAYSTACK_SECRET_KEY` - Paystack test secret key
- `ADMIN_EMAILS` - Comma-separated list of admin emails

### 3. Database Setup

Run the migrations in your Supabase SQL Editor:

**Initial Schema:**
1. Open `supabase/migrations/001_initial_schema.sql`
2. Copy contents and paste into Supabase Dashboard > SQL Editor
3. Click **Run**

**Storage Buckets:**
1. Open `supabase/migrations/002_storage_buckets.sql`
2. Run in SQL Editor

**Seed Data:**
1. Open `supabase/seed.sql`
2. Run in SQL Editor to populate sample data

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ksk-enterprise-unified/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (routes)/
│   │   │   ├── fashion/        # Smocks catalog + detail pages
│   │   │   ├── rentals/        # Car rental catalog + booking
│   │   │   ├── construction/   # Materials catalog + detail
│   │   │   ├── about/          # About Us page
│   │   │   ├── contact/        # Contact form
│   │   │   ├── cart/           # Shopping cart with CartContext
│   │   │   ├── checkout/       # Checkout with Paystack integration
│   │   │   ├── login/          # Auth login
│   │   │   ├── register/       # Auth signup
│   │   │   └── admin/          # Admin dashboard with CRUD
│   │   ├── api/                # API routes for orders, bookings, inquiries
│   │   ├── layout.tsx          # Root layout with CartProvider
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── home/               # Homepage sections
│   │   └── ui/                 # ErrorBoundary, LoadingSpinner
│   ├── context/
│   │   └── CartContext.tsx     # Global cart state management
│   ├── lib/
│   │   ├── actions/            # Server Actions (auth, products, admin)
│   │   ├── supabase/           # Supabase clients (server, admin, client)
│   │   └── utils.ts            # Utilities
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── middleware.ts           # Route protection for admin
├── supabase/
│   ├── migrations/             # Database schema (001_initial_schema.sql, 002_storage_buckets.sql)
│   ├── seed.sql                # Sample data
│   ├── functions/              # Edge Functions (paystack-webhook)
│   └── config.toml             # Supabase CLI configuration
├── public/                     # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

## Features

### Customer Features
- ✅ Browse products, vehicles, and materials
- ✅ Add items to cart (with size/color options for products)
- ✅ Checkout with Paystack (Mobile Money / Bank Card) or Cash
- ✅ Book car rentals with date selection
- ✅ Submit construction inquiries
- ✅ View order confirmation
- ✅ User authentication (login/register)

### Admin Features
- ✅ Dashboard with statistics overview
- ✅ CRUD operations for products, vehicles, and materials
- ✅ Image upload to Supabase Storage
- ✅ Manage orders, bookings, and inquiries
- ✅ Update status of orders/bookings/inquiries
- ✅ Protected admin routes with middleware

## Payment Integration

### Paystack Setup

**Test Mode (Development):**
1. Sign up at [Paystack](https://paystack.com)
2. Get Test Public Key and Test Secret Key
3. Add to `.env.local`
4. Use test card: `4084084084084081`, CVV: `408`, Expiry: any future date

**Live Mode (Production):**
1. Complete Paystack business verification
2. Switch to Live keys in dashboard
3. Update `.env.local` with Live keys
4. Deploy the Edge Function

### Webhook Setup

Deploy the Paystack webhook handler:

```bash
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy paystack-webhook
```

Then configure in Paystack Dashboard > Settings > Webhooks:
- URL: `https://your-project.supabase.co/functions/v1/paystack-webhook`
- Secret: Your Paystack secret key

## Supabase Configuration

### Auth Settings

1. Go to Supabase Dashboard > Authentication > Settings
2. Set **Site URL**: `http://localhost:3000` (dev) or your production URL
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`

### Storage Buckets

The migration creates three public buckets:
- `products` — For smock/product images
- `vehicles` — For car rental images  
- `materials` — For construction material images

### Row Level Security (RLS)

All tables have RLS enabled:
- **Public read** for products, vehicles, materials
- **Authenticated users** can create orders, bookings, inquiries
- **Admin users** (role = 'admin') have full CRUD access

## Deployment to Vercel

### Option 1: Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) > New Project
3. Import GitHub repository
4. Add all environment variables from `.env.local`
5. Click **Deploy**

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard after deployment.

## Admin Access

1. Register a new account at `/register`
2. If the email is in `ADMIN_EMAILS` env variable, the account automatically gets `admin` role
3. Access admin dashboard at `/admin`
4. Non-admin users are redirected to homepage

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection issues
- Verify Supabase URL and anon key in `.env.local`
- Check RLS policies allow the operation
- Ensure database schema matches migrations

### Paystack not loading
- Check `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set
- Verify correct key (Test vs Live)
- Check browser console for errors

### Images not uploading
- Verify storage buckets exist in Supabase
- Check RLS policies on storage.objects
- Ensure user has admin role

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:reset     # Reset Supabase database (requires CLI)
npm run db:seed      # Seed Supabase database (requires CLI)
npm run supabase:start   # Start local Supabase instance
npm run supabase:stop    # Stop local Supabase instance
npm run supabase:deploy  # Deploy Paystack webhook function
```

## License

MIT License — KSK Enterprise, Wa, Ghana

## Support

For issues or questions, please contact the development team or refer to the Supabase and Next.js documentation.
