# Commandly AI

Commandly AI is a polished React + Vite + Tailwind SaaS demo that now includes a real Supabase-backed auth and workspace flow.

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Supabase Auth
- Supabase Postgres

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and add your Supabase keys:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. In your Supabase project, run the SQL in [supabase/schema.sql](./supabase/schema.sql).

4. Start the app:

```bash
npm run dev
```

## Auth flow

- `/auth` handles sign up and sign in
- `/auth/callback` handles OAuth and email verification redirects
- `/auth/reset-password` handles password recovery updates
- `/onboarding` is protected and saves workspace data
- `/dashboard` is protected and loads the signed-in user's saved workspace

## Database model

- `profiles`
- `workspaces`
- `workspace_goals`

All workspace data is protected with Row Level Security so users can only read and update their own records.

## Social auth setup

Enable any providers you want in the Supabase Auth dashboard and add these redirect URLs:

- `http://localhost:5173/auth/callback`
- your production `/auth/callback` URL

The app includes buttons for:

- Google
- GitHub
- Discord

## Stripe setup

Add these server-side environment variables where your Netlify functions run:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_STARTER_MONTHLY`
- `STRIPE_PRICE_PRO_MONTHLY`
- `STRIPE_PRICE_BUSINESS_MONTHLY`
- `APP_URL`

The dashboard uses hosted Stripe Checkout for subscription signup and Stripe Billing Portal for self-service management.
