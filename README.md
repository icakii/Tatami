# Tatami

Marketing and ordering site for the Tatami club platform: landing page, customer accounts, orders and Paddle checkout. Orders land in TatamiHub (`/orders`).

Shares the Supabase project with TatamiHub and KimeClub. The `orders` table, its RLS, the `paddle-webhook` and `cancel-order` functions all live in the TatamiHub repo.

## Run locally

```
cp .env.example .env   # fill in the Supabase URL/anon key and Paddle client token
npm install
npm run dev
```

## Deploy (Render static site)

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Rewrite rule: `/*` to `/index.html` (SPA routing)
- Environment: everything in `.env.example`

After the first deploy, add the site's URL to Supabase Auth redirect URLs and to the `ALLOWED_ORIGINS` function secret (for `cancel-order`).
