# KSK Enterprise

A full-stack multi-business ecommerce platform for **KSK Enterprise** based in Wa, Upper West Region, Ghana.

**Live URL:** [https://ksk-enterprise.vercel.app](https://ksk-enterprise.vercel.app) *(update after deployment)*

---

## Business Lines

1. **Fashion & Smocks** — Hand-woven traditional smocks and fugus
2. **Car Rentals** — Vehicles for weddings, personal use, and corporate events
3. **Construction** — Building materials and contracting services

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TailwindCSS + Lucide Icons |
| Backend | Next.js API Routes + Server Actions |
| Database | Supabase PostgreSQL + RPC Functions |
| Auth | Supabase Auth |
| Storage | Supabase Storage (products, vehicles, materials, hero-slides) |
| Payments | Paystack (Mobile Money + Bank Cards) |
| RLS | Supabase Row Level Security with SECURITY DEFINER functions |
| Deployment | Vercel |

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local development)
- [Vercel CLI](https://vercel.com/docs/cli) (optional, for deployment)

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ksk-enterprise
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Where to Get It |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings > API > URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings > API > anon/public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Project Settings > API > service_role |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack Dashboard > Settings > API Keys > Test Public Key |
| `PAYSTACK_SECRET_KEY` | Paystack Dashboard > Settings > API Keys > Test Secret Key |
| `ADMIN_EMAILS` | Comma-separated list of admin emails |

### 3. Database Setup

Run the migrations in your Supabase SQL Editor:

1. Open `supabase/migrations/001_initial_schema.sql`
2. Copy the entire contents
3. Paste into Supabase Dashboard > SQL Editor > New Query
4. Click **Run**

Then run the seed data:

1. Open `supabase/seed.sql`
2. Copy the entire contents
3. Paste into SQL Editor
4. Click **Run**

Then create storage buckets:

1. Open `supabase/migrations/002_storage_buckets.sql`
2. Run in SQL Editor

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Supabase Configuration

### Auth Settings

1. Go to Supabase Dashboard > Authentication > Settings
2. Under **Site URL**, set: `http://localhost:3000` (dev) / `https://your-domain.vercel.app` (prod)
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`

### Storage Buckets

The migration `002_storage_buckets.sql` creates four public buckets:
- `products` — For smock/product images
- `vehicles` — For car rental images
- `materials` — For construction material images
- `hero-slides` — For homepage hero carousel images

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:
- **Public read** for products, vehicles, materials
- **Authenticated users** can create orders, bookings, inquiries
- **Admin users** (role = 'admin') have full CRUD access
- **SECURITY DEFINER RPC function** `is_admin()` avoids circular dependency in RLS policies

---

## Paystack Configuration

### Test Mode (Development)

1. Sign up at [Paystack](https://paystack.com)
2. Get your **Test Public Key** and **Test Secret Key**
3. Add them to `.env.local`
4. Use test card: `4084084084084081`, CVV: `408`, Expiry: any future date

### Live Mode (Production)

1. Complete Paystack business verification
2. Switch to Live keys in your dashboard
3. Update `.env.local` with Live keys
4. Deploy the Edge Function (see below)

### Webhook Setup

1. Deploy the Edge Function:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   supabase functions deploy paystack-webhook
   ```

2. In Paystack Dashboard > Settings > Webhooks:
   - URL: `https://your-project.supabase.co/functions/v1/paystack-webhook`
   - Secret: Your Paystack secret key

---

## Deployment to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) > New Project
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Click **Deploy**

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Add environment variables in the Vercel dashboard after deployment.

---

## Project Structure

```
ksk-enterprise/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (routes)/
│   │   │   ├── fashion/        # Smocks catalog + detail
│   │   │   ├── rentals/        # Car rental catalog + booking
│   │   │   ├── construction/   # Materials catalog + detail
│   │   │   ├── about/          # About Us page
│   │   │   ├── contact/        # Contact form
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── checkout/       # Checkout with Paystack
│   │   │   ├── login/          # Auth login
│   │   │   ├── register/       # Auth signup
│   │   │   └── admin/          # Admin dashboard
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── home/               # Homepage sections
│   │   └── ui/                 # Reusable UI components
│   ├── context/
│   │   └── CartContext.tsx     # Global cart state
│   ├── lib/
│   │   ├── actions/            # Server Actions
│   │   ├── supabase/           # Supabase clients
│   │   └── utils.ts            # Utilities
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── middleware.ts           # Route protection
├── supabase/
│   ├── migrations/             # Database schema
│   ├── seed.sql                # Seed data
│   └── functions/              # Edge Functions
├── public/                     # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## Admin Access

1. Register a new account at `/register`
2. If the email is in the `ADMIN_EMAILS` env variable, the account will automatically be assigned the `admin` role via the `handle_new_user` trigger
3. Alternatively, manually update the user's role in Supabase Dashboard > Table Editor > profiles
4. The `is_admin()` RPC function (SECURITY DEFINER) checks admin role without RLS circular dependency
5. Access the admin dashboard at `/admin`
6. Non-admin users will be redirected to the homepage

---

## Features

### Customer Features
- Browse products, vehicles, and materials
- Add items to cart
- Checkout with Paystack (Mobile Money / Bank Card) or Cash
- Book car rentals
- Submit construction inquiries
- View order confirmation

### Admin Features
- Dashboard with statistics
- CRUD for products, vehicles, and materials
- Image upload to Supabase Storage
- Manage orders, bookings, and inquiries
- Update status of orders/bookings/inquiries

---

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection issues
- Verify Supabase URL and anon key in `.env.local`
- Check that RLS policies allow the operation
- Ensure the database schema matches the migration

### Paystack not loading
- Check that `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set
- Verify you're using the correct key (Test vs Live)
- Check browser console for errors

### Images not uploading
- Verify storage buckets exist in Supabase
- Check RLS policies on storage.objects
- Ensure the user has admin role

---

## License

MIT License — KSK Enterprise, Wa, Ghana.

---

## Support

- Phone: 0242 070 938 / 0202 348 762
- Location: Wa, Upper West Region, Ghana
