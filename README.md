# SkinRadar — CS2 Trading Marketplace MVP

SkinRadar is a deploy-ready CS2 skin-search and P2P trading marketplace starter built with Next.js, Prisma, PostgreSQL, and Steam login.

This version is intentionally **not an exact copy** of any existing website. It uses an original brand, original styling, and an original implementation while borrowing the general CS2 search-market UX pattern: top navigation, Steam sign-in, search-first homepage, category chips, game-item library links, market cards, and inventory-based listing.

## Included

- Next.js App Router frontend
- Steam OpenID login
- Steam profile lookup
- CS2 inventory fetch for app `730`, context `2`
- PostgreSQL + Prisma schema
- P2P seller listings
- Buyer interest / offer flow
- Search-first homepage styled like a modern CS2 skin-search site
- Market page with search, sort, and filter-style links
- Game Items category hub
- Inventory, Trade Up, About, and Contact pages
- Deployment checklist

## Pages

- `/` — search-first landing page
- `/market` — public marketplace listings
- `/sell` — logged-in inventory listing flow
- `/dashboard` — profile, trade URL, listings, buyer interest
- `/listing/[id]` — listing details and offer form
- `/game-items` — cases, knives, gloves, and item categories
- `/inventory` — Steam inventory entry page
- `/tradeup` — trade-up tool placeholder
- `/about` — project info
- `/contact` — support/report placeholder

## Setup

```bash
npm install
cp .env.example .env
```

Fill `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
SESSION_SECRET="generate-a-long-random-secret-at-least-32-characters"
STEAM_API_KEY="your-steam-web-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start locally:

```bash
npm run dev
```

## Production

Use Vercel for the app and Railway/Supabase/Neon for PostgreSQL.

```bash
npx prisma migrate deploy
npm run build
```

## Important launch notes

- Add Terms, Privacy, fraud reporting, and moderation before public traffic.
- Do not add gambling, roulette, coinflip, case opening, or bot-custody features without legal review.
- Add rate limiting before launch.
- Re-check item ownership before showing a listing as active.
- Require users to save their Steam trade URL before they can receive serious offers.
