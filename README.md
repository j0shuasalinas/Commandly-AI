# Commandly AI

Commandly AI is a premium small-business SaaS dashboard built by Joshua Salinas. It combines onboarding, authentication, workspace management, AI-assisted writing, lead tracking, campaigns, automations, integrations, billing scaffolding, and a polished analytics-first dashboard experience in one app.

This project is intended as a portfolio product, client demo, and foundation for a real SaaS MVP.

## Product overview

Commandly AI helps small businesses run marketing and operations from one AI command center.

Current app capabilities:

- branded landing page with dark/light mode
- Supabase auth, onboarding, and protected dashboard routes
- workspace-backed dashboard data for leads, campaigns, automations, drafts, integrations, team, and billing state
- Gemini-ready AI generation through Netlify functions
- editable business profile with workspace logo upload
- multi-page dashboard shell with polished navigation, dropdowns, and responsive layouts

## Stack

- React + Vite
- Tailwind CSS
- React Router
- Supabase Auth
- Supabase Postgres
- Netlify Functions
- Gemini API

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and add your client-side Supabase values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. In your Supabase project, run the SQL in [supabase/schema.sql](./supabase/schema.sql).

4. Add server-side environment variables for Netlify functions:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash-lite
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PRICE_STARTER_MONTHLY=price_starter
STRIPE_PRICE_PRO_MONTHLY=price_pro
STRIPE_PRICE_BUSINESS_MONTHLY=price_business
APP_URL=http://localhost:5173
```

5. Start the app:

```bash
npm run dev
```

For local Gemini testing, use a Netlify-backed dev session so `/.netlify/functions/*` routes are available. Plain Vite dev will still run the UI, but server-side AI generation will show a friendly message until the Netlify function is reachable.

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
- `workspace_leads`
- `workspace_campaigns`
- `workspace_automations`
- `workspace_reviews`
- `workspace_ai_drafts`
- `workspace_integrations`
- `workspace_team_members`
- `workspace_billing_state`

All workspace data is protected with Row Level Security so users can only read and update their own records.

## Social auth setup

Enable any providers you want in the Supabase Auth dashboard and add these redirect URLs:

- `http://localhost:5173/auth/callback`
- your production `/auth/callback` URL

The app includes buttons for:

- Google
- GitHub
- Discord

## Billing setup

Add these server-side environment variables where your Netlify functions run:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_STARTER_MONTHLY`
- `STRIPE_PRICE_PRO_MONTHLY`
- `STRIPE_PRICE_BUSINESS_MONTHLY`
- `APP_URL`

The dashboard includes Stripe checkout and billing portal scaffolding that can be expanded into live subscription syncing.

## Ownership and usage

Copyright (c) Joshua Salinas. All rights reserved.

This repository is not released as open-source software. You may view it for portfolio, evaluation, and inspiration purposes only. You may not copy, redistribute, rebrand, resell, or deploy substantial portions of this project without explicit written permission from the author.

If you want to collaborate, license, or build on top of Commandly AI, contact the project owner directly first.
