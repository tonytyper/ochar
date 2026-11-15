-- the ochar database. in supabase: sql editor -> new query, paste this whole
-- file and run it. safe to run again later, nothing gets duplicated.


-- products -----------------------------------------------------------------
-- the site reads this table when it exists and has rows. until then it shows
-- the stand-in catalogue at the bottom of lib/products.ts

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  number      integer,                      -- the soap's number, as written on its box
  slug        text unique,                  -- the url: /shop/<slug>. made from name and number if empty
  name        text not null,
  description text,                         -- the short summary shown under the name
  ingredients text[] not null default '{}', -- one ingredient per item, in label order
  price       numeric(8, 2) not null check (price >= 0),
  image_url   text,                         -- a file name in the product-images bucket, or a full url
  gallery     text[] not null default '{}', -- more photos for the bar's page, same format
  tone        text,                         -- label colour when there's no photo: lavender, sea,
                                            -- orris, chamomile, apricot, sage, oat, fir, rose, clay
  status      text not null default 'for-sale'
              check (status in ('for-sale', 'curing', 'out-of-stock')),
  quantity    integer check (quantity >= 0), -- bars on hand, or on the rack while curing
  sort_order  integer not null default 0,   -- lower numbers come first in the shop
  created_at  timestamptz not null default now()
);

-- for a products table that was already there: adds whatever it's missing
alter table public.products add column if not exists number integer;
alter table public.products add column if not exists slug text;
alter table public.products add column if not exists name text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists ingredients text[] not null default '{}';
alter table public.products add column if not exists price numeric(8, 2);
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists gallery text[] not null default '{}';
alter table public.products add column if not exists tone text;
alter table public.products add column if not exists status text not null default 'for-sale';
alter table public.products add column if not exists quantity integer;
alter table public.products add column if not exists sort_order integer not null default 0;
alter table public.products add column if not exists created_at timestamptz not null default now();
create unique index if not exists products_slug_key on public.products (slug);

-- in_stock is worked out from status and quantity, so it can't be edited or go
-- stale: true only for a bar that's for sale and not run out. an older table
-- had a plain in_stock column, which gets replaced
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products'
      and column_name = 'in_stock' and is_generated = 'NEVER'
  ) then
    alter table public.products drop column in_stock;
  end if;
end
$$;
alter table public.products add column if not exists in_stock boolean
  generated always as (status = 'for-sale' and coalesce(quantity, 1) > 0) stored;

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

-- saves a paid order and takes the bars off the shelf, both or neither. a
-- bar for sale that runs out moves to out-of-stock. stripe can send the same
-- order twice, so stock is only taken the first time. returns false for a repeat
create or replace function public.save_paid_order(
  p_session  text,
  p_email    text,
  p_name     text,
  p_shipping jsonb,
  p_items    jsonb, -- [{ slug, name, quantity, amount }]
  p_amount   integer,
  p_currency text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  sold integer;
begin
  insert into orders (stripe_session_id, email, name, shipping, items, amount_total, currency, status)
  values (p_session, p_email, p_name, p_shipping, p_items, p_amount, p_currency, 'paid')
  on conflict (stripe_session_id) do nothing;

  if not found then
    return false;
  end if;

  for item in select * from jsonb_array_elements(p_items) loop
    sold := coalesce((item ->> 'quantity')::integer, 0);
    update products
       set quantity = greatest(quantity - sold, 0),
           status = case
             when status = 'for-sale' and quantity - sold <= 0 then 'out-of-stock'
             else status
           end
     where slug = item ->> 'slug'
       and quantity is not null;
  end loop;

  return true;
end;
$$;

revoke execute on function public.save_paid_order from public, anon, authenticated;
grant execute on function public.save_paid_order to service_role;


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
