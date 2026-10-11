# ochar

The shop for ochar, homemade all-natural soap from the Tonoyan family.

Next.js 16 and Tailwind v4. Products, photos, orders and contact messages live
in Supabase, payments go through Stripe Checkout, and the site is hosted on
Vercel.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Nothing needs setting up first: without any
keys the shop runs on a stand-in catalogue, and the cart offers "order by
email" instead of card checkout.

## Where to change things

| What | Where |
| --- | --- |
| Email, shipping rates, free shipping threshold, bar weight, return window | `lib/site.ts` |
| Colours and fonts | `app/globals.css` |
| Products | the Supabase `products` table (until then, the bottom of `lib/products.ts`) |
| Home page | `app/page.tsx` and `app/components/herosection.tsx` |
| Our story, FAQ, ingredients | `app/about`, `app/faq`, `app/ingredients` |
| Shipping, privacy and terms pages | `app/shipping-returns`, `app/privacy`, `app/terms` |

Anything in `lib/site.ts` marked `PLACEHOLDER` was made up and needs a real
answer before launch.

## Setting up the services

Do these in order. Each one works on its own, so the site can go live after
step 3 and take payments later.

### 1. Supabase: products, photos, orders

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste in `supabase/schema.sql` and run it. This makes
   the `products`, `orders` and `messages` tables and the `product-images`
   photo bucket.
3. Optional: run `supabase/seed.sql` to start from the stand-in catalogue, then
   edit the rows in **Table Editor** into your real bars.
4. Upload photos under **Storage → product-images**. Put the file name (for
   example `lavender-field.jpg`) in the bar's `image_url` column. Extra photos
   go in `gallery`.
5. Under **Project Settings → API Keys**, copy the project URL, the
   publishable key and the secret key into `.env.local` (see `.env.example`).

> `.env.local` still points at the old Supabase project, which no longer
> exists. Replace those two lines with the new project's values. Until you
> do, every page waits a few seconds for the dead address before falling back
> to the stand-in catalogue, and `npm run build` fails on purpose (see "How it
> fits together").

**Photos.** Every bar is shown in a 4:3 landscape frame, cropped to fill. Use
JPGs at least 2000px wide, with the bar roughly centred. If your camera shoots
3:2, change `--aspect-photo` in `app/globals.css` to `3 / 2`. For a photo at
the top of the home page, set `heroImage` in `lib/site.ts`.

**Contact messages** land in the `messages` table. Supabase doesn't email you
when one arrives. To get an email, add a Database Webhook on that table, or
check the table now and then.

### 2. Stripe: payments

1. Create an account at [stripe.com](https://stripe.com) and stay in **test
   mode** for now.
2. **Developers → API keys**: copy the secret key (`sk_test_...`) into
   `STRIPE_SECRET_KEY`. The cart's "Check out" button switches on once it's
   set.
3. Try it: add bars to the cart, check out, and pay with card
   `4242 4242 4242 4242`, any future date and any CVC.
4. **Developers → Webhooks → Add endpoint**:
   `https://<your-site>/api/stripe/webhook`, listening for
   `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
   Copy its signing secret into `STRIPE_WEBHOOK_SECRET`. Paid orders are then
   saved to the Supabase `orders` table. (Locally:
   `stripe listen --forward-to localhost:3000/api/stripe/webhook`.)
5. **Settings → Customer emails**: turn on receipts for successful payments.
   The thank-you page tells customers a receipt is coming.
6. **Sales tax**: set up Stripe Tax, then uncomment `automatic_tax` in
   `app/api/checkout/route.ts`.
7. **Going live**: activate the account, then swap in the `sk_live_...` key
   and make a live-mode webhook with its own signing secret.

Prices are always taken from the catalogue on the server, never from the
browser, so a cart can't be edited to pay less.

### 3. Vercel: hosting

1. Push the repo to GitHub, then import it at
   [vercel.com/new](https://vercel.com/new). Vercel recognises Next.js on its
   own.
2. Add the environment variables from `.env.example` under **Settings →
   Environment Variables**.
3. Deploy. Add your domain under **Settings → Domains**, set
   `NEXT_PUBLIC_SITE_URL` to it, and redeploy.

Catalogue changes in Supabase show up on the site within five minutes. No
redeploy needed.

## Before launch

- [ ] Real values for everything marked `PLACEHOLDER` in `lib/site.ts`
- [ ] Real bars, prices, ingredients and photos in Supabase
- [ ] The About page and home page story rewritten in your own words
- [ ] Shipping, privacy and terms pages read through, ideally by someone who
      knows the rules where you're registered
- [ ] One full test order in Stripe test mode, including the webhook
- [ ] Stripe receipts switched on

## How it fits together

- **Pages** are server components. They call `getProducts()` from
  `lib/products.ts` directly and are rebuilt every five minutes.
- **Products** come from Supabase when the table exists and has rows. If it
  doesn't, the stand-in catalogue at the bottom of `lib/products.ts` is used.
  If Supabase is set up but can't be reached, production pages keep their last
  good version and checkout refuses, rather than quietly showing the stand-in
  catalogue at made-up prices.
- **The cart** lives in the browser's localStorage (`lib/cart.ts`). It only
  stores which bars and how many. Names and prices are always looked up fresh.
- **Checkout** (`app/api/checkout/route.ts`) builds a Stripe Checkout page from
  the cart and sends the customer there. Afterwards they land on
  `/checkout/success`, and Stripe calls `/api/stripe/webhook` to record the
  order.
- **Bars without a photo** are drawn as their paper label on a coloured ground
  (`app/components/productart.tsx`), coloured by each bar's `tone`.
