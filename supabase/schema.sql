-- the ochar database. in supabase: sql editor -> new query, paste this whole
-- file and run it. safe to run again later, nothing gets duplicated.


-- products -----------------------------------------------------------------
-- the site reads this table when it exists and has rows. until then it shows
-- the stand-in catalogue at the bottom of lib/products.ts

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique,                  -- the url: /shop/<slug>. made from the name if empty
  name        text not null,
  description text,                         -- the short summary shown under the name
  ingredients text[] not null default '{}', -- one ingredient per item, in label order
  price       numeric(8, 2) not null check (price >= 0),
  image_url   text,                         -- a file name in the product-images bucket, or a full url
  gallery     text[] not null default '{}', -- more photos for the bar's page, same format
  tone        text,                         -- label colour when there's no photo: lavender, sea,
                                            -- orris, chamomile, apricot, sage, oat, fir, rose, clay
  in_stock    boolean not null default true,
  sort_order  integer not null default 0,   -- lower numbers come first in the shop
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "anyone can read products" on public.products;
create policy "anyone can read products"
  on public.products for select
  to anon, authenticated
  using (true);

grant select on public.products to anon, authenticated;


-- orders -------------------------------------------------------------------
-- written by the stripe webhook (app/api/stripe/webhook) using the secret key.
-- there are no policies, so nobody can read or write these with the public key

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  email             text,
  name              text,
  shipping          jsonb,                  -- name and address from stripe checkout
  items             jsonb not null default '[]',
  amount_total      integer,                -- in cents
  currency          text,
  status            text not null default 'paid',
  shipped           boolean not null default false,
  created_at        timestamptz not null default now()
);

alter table public.orders enable row level security;


-- messages -----------------------------------------------------------------
-- from the contact form. same as orders: secret key only

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  topic      text,
  message    text not null,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

grant all on public.products, public.orders, public.messages to service_role;


-- product photos -----------------------------------------------------------
-- a public bucket: anyone can view a photo, only you can upload (from the
-- dashboard, under storage)

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
