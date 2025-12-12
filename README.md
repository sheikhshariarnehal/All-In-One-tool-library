# Tool Library - SaaS Tool Platform

A comprehensive SaaS-based tool library website built with Next.js 16, TypeScript, Supabase, and Stripe.

## Features

- 🛠️ **50+ Professional Tools** - Developer, Academic, Professional, AI Image tools
- 🔐 **Authentication** - Secure email/password auth via Supabase
- 💳 **Subscription Plans** - Free, Pro, and Enterprise tiers via Stripe
- 🌙 **Dark Mode** - System-aware theme switching
- 📱 **Responsive Design** - Mobile-first approach
- 🔍 **SEO Optimized** - Dynamic sitemap, meta tags, structured data
- ⚡ **Server Components** - Next.js App Router with React Server Components

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with SSR
- **Payments**: Stripe Subscriptions
- **State**: Zustand
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- Stripe account

### 1. Clone and Install

```bash
cd tool-library
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings > API** to get your keys
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Database Migrations

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the migration file at `supabase/migrations/001_initial_schema.sql`

### 4. Configure Stripe

1. Get your API keys from [stripe.com/dashboard](https://dashboard.stripe.com/apikeys)
2. Create products and prices for Pro and Enterprise plans
3. Add the keys to `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected app routes
│   │   ├── dashboard/     # User dashboard
│   │   ├── favorites/     # Saved tools
│   │   ├── history/       # Usage history
│   │   └── settings/      # User settings
│   ├── (marketing)/       # Public marketing pages
│   │   ├── pricing/       # Pricing page
│   │   └── blog/          # Blog
│   ├── auth/              # Authentication
│   ├── tools/             # Tool pages
│   │   ├── [category]/    # Category listing
│   │   └── [category]/[slug]/ # Individual tool
│   └── api/               # API routes
├── components/
│   ├── layout/            # Header, Footer, Sidebar
│   ├── tools/             # Tool components
│   │   ├── developer/     # Dev tools
│   │   ├── academic/      # Academic tools
│   │   ├── utilities/     # Utility tools
│   │   └── ai-image/      # Image tools
│   ├── auth/              # Auth forms
│   └── providers/         # Context providers
├── lib/
│   ├── supabase/          # Supabase clients
│   └── tools/             # Tool registry & categories
├── config/                # App configuration
└── types/                 # TypeScript types
```

## Tool Categories

| Category | Tools |
|----------|-------|
| Developer | JSON Formatter, Base64, URL Encoder, Hash Generator, Regex Tester, Lorem Ipsum |
| Academic | Word Counter, Citation Generator |
| Utilities | QR Code Generator |
| AI Image | Image Compressor |

## Subscription Tiers

| Feature | Free | Pro ($9/mo) | Enterprise ($29/mo) |
|---------|------|-------------|---------------------|
| Tool Access | Basic | All Tools | All Tools |
| Monthly Uses | 100 | 1000 | Unlimited |
| History | 7 days | 30 days | 1 year |
| Export | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key (server only) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro plan |
| `STRIPE_ENTERPRISE_PRICE_ID` | Stripe price ID for Enterprise |
| `NEXT_PUBLIC_APP_URL` | Your app's URL |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Stripe Webhooks

For production, set up a webhook endpoint:

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.*`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## License

MIT License - feel free to use for your own projects!
