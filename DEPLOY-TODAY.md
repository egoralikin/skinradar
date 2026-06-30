# Deploy SkinRadar Today

This checklist gets the CS2 marketplace MVP online quickly.

## 1. Create services

Create:

- Vercel project for the Next.js app
- PostgreSQL database on Railway, Supabase, Neon, or Render
- Steam Web API key

## 2. Set environment variables

In Vercel, add:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
SESSION_SECRET="generate-a-long-random-secret-at-least-32-characters"
STEAM_API_KEY="your-steam-web-api-key"
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
```

For local testing, copy `.env.example` to `.env` and use your local or hosted database URL.

## 3. Install and migrate locally

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

## 4. Deploy

Push to GitHub, then import the repo into Vercel.

Production build command:

```bash
npm run build
```

After the database exists, run the production migration once:

```bash
npx prisma migrate deploy
```

You can run it from your machine with the production `DATABASE_URL`, or set it in your deployment workflow.

## 5. Steam login check

Make sure:

- `NEXT_PUBLIC_APP_URL` exactly matches the deployed domain.
- Steam login returns to `/api/auth/steam/callback`.
- The session cookie is created after login.

## 6. First public test

1. Sign in with Steam.
2. Add your Steam trade URL in Dashboard.
3. Go to Sell.
4. Confirm your inventory loads.
5. List one cheap item.
6. Open Market in a private browser.
7. Confirm the listing page loads.

## 7. Before real users

Add these before serious traffic:

- Rate limiting on auth, inventory, listings, and offers
- Listing ownership re-check before an item is shown as active
- Admin moderation tools
- Report listing/user flow
- Terms of Service and Privacy Policy
- Clear disclaimer that trades happen directly between Steam users
- Abuse prevention for spam offers and fake listings

## What changed in this version

The UI was rebuilt into an original SkinRadar theme with a search-first CS2 skin-market layout: sticky nav, Steam sign-in, language/currency badge, large search hero, category chips, game-items hub, marketplace cards, and filter-style sidebar.
