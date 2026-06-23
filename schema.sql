--
-- Xacres Supabase Database Schema
--

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. Lands Table
-- =========================================================================
create table if not exists public.lands (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text not null unique,
    listed_price numeric not null,
    area_acres numeric not null,
    district text not null,
    village text not null,
    latitude double precision not null,
    longitude double precision not null,
    land_type text not null,
    road_access boolean not null default false,
    road_width_m numeric,
    approval_type varchar(50),
    clu_category varchar(100),
    municipal_limit_type varchar(50),
    access_type varchar(50),
    green_belt boolean default false,
    green_belt_width_m numeric,
    description text,
    is_public boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. Land Images Table
-- =========================================================================
create table if not exists public.land_images (
    id uuid default uuid_generate_v4() primary key,
    land_id uuid references public.lands(id) on delete cascade not null,
    url text not null,
    is_primary boolean not null default false,
    sort_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 3. Lands Admin Table (Private/Sensitive Information)
-- =========================================================================
create table if not exists public.lands_admin (
    id uuid default uuid_generate_v4() primary key,
    land_id uuid references public.lands(id) on delete cascade not null unique,
    contact_type varchar(20) default 'OWNER',
    owner_name text,
    owner_phone_number varchar(20),
    expected_price numeric not null,
    minimum_price numeric not null,
    negotiable boolean not null default true,
    admin_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 4. Lands Polygon Table (GeoJSON / Map Boundaries)
-- =========================================================================
create table if not exists public.lands_polygon (
    id uuid default uuid_generate_v4() primary key,
    land_id uuid references public.lands(id) on delete cascade not null unique,
    polygon jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 5. Buyer Leads Table (Customer Inquiries)
-- =========================================================================
create table if not exists public.buyer_leads (
    id uuid default uuid_generate_v4() primary key,
    land_id uuid references public.lands(id) on delete cascade not null,
    name text not null,
    phone_number varchar(20) not null,
    buyer_district text not null,
    purchase_purpose text not null,
    interested_district text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- Triggers for Automatically Updating `updated_at` timestamps
-- =========================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger on_lands_update
    before update on public.lands
    for each row execute procedure public.handle_updated_at();

create trigger on_lands_admin_update
    before update on public.lands_admin
    for each row execute procedure public.handle_updated_at();

-- =========================================================================
-- Row Level Security (RLS) Enablement
-- =========================================================================
alter table public.lands enable row level security;
alter table public.land_images enable row level security;
alter table public.lands_admin enable row level security;
alter table public.lands_polygon enable row level security;
alter table public.buyer_leads enable row level security;

-- =========================================================================
-- RLS Policies
-- =========================================================================

-- --- Lands Policies ---
-- 1. Public can read listings that are public
create policy "Allow public read-only of public lands"
on public.lands for select
using (is_public = true);

-- 2. Authenticated users (Admins) can do everything
create policy "Allow admins full access to lands"
on public.lands for all
to authenticated
using (true)
with check (true);


-- --- Land Images Policies ---
-- 1. Public can view land images
create policy "Allow public read-only of land images"
on public.land_images for select
using (true);

-- 2. Authenticated users (Admins) can do everything
create policy "Allow admins full access to land images"
on public.land_images for all
to authenticated
using (true)
with check (true);


-- --- Lands Admin Policies (Highly Protected) ---
-- 1. Only Authenticated users (Admins) can access lands admin data
create policy "Allow admins full access to lands admin info"
on public.lands_admin for all
to authenticated
using (true)
with check (true);


-- --- Lands Polygon Policies ---
-- 1. Public can view map polygons
create policy "Allow public read-only of polygons"
on public.lands_polygon for select
using (true);

-- 2. Authenticated users (Admins) can do everything
create policy "Allow admins full access to polygons"
on public.lands_polygon for all
to authenticated
using (true)
with check (true);


-- --- Buyer Leads Policies ---
-- 1. Public (anonymous) users can insert leads (submit the contact form)
create policy "Allow public to insert buyer leads"
on public.buyer_leads for insert
with check (true);

-- 2. Only Authenticated users (Admins) can read, update, or delete leads
create policy "Allow admins full access to buyer leads"
on public.buyer_leads for all
to authenticated
using (true)
with check (true);

-- =========================================================================
-- 6. Brokers Table (Confidential/Sensitive CRM Information)
-- =========================================================================
create table if not exists public.brokers (
    id uuid default uuid_generate_v4() primary key,
    broker_code varchar(50) unique not null,
    name varchar(150) not null,
    office_name varchar(200),
    phone_number varchar(20) not null,
    alternate_phone_number varchar(20),
    district varchar(100) not null,
    tehsil varchar(100) not null,
    address text,
    google_location_url text,
    experience_years integer default 0,
    referred_by varchar(150),
    reputation varchar(20) not null check (reputation in ('SILVER', 'GOLD', 'DIAMOND')),
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index creation
create index if not exists idx_broker_name on public.brokers(name);
create index if not exists idx_broker_district on public.brokers(district);
create index if not exists idx_broker_tehsil on public.brokers(tehsil);

-- Trigger to automatically update updated_at on brokers table
create trigger on_brokers_update
    before update on public.brokers
    for each row execute procedure public.handle_updated_at();

-- Enable Row Level Security (RLS) on brokers table
alter table public.brokers enable row level security;

-- RLS Policy: Only Authenticated admins can view, create, edit, or delete broker data
create policy "Allow admins full access to brokers"
on public.brokers for all
to authenticated
using (true)
with check (true);

-- =========================================================================
-- 7. Lands Table Schema Modification: Broker Association
-- =========================================================================
alter table public.lands add column if not exists broker_id uuid references public.brokers(id) on delete set null;
alter table public.lands add column if not exists tehsil text;
alter table public.lands add column if not exists listing_number bigint generated always as identity (start with 10000) unique;

-- =========================================================================
-- 8. Lands Table Schema Modification: Planning & Feasibility
-- =========================================================================
-- Rename area to area_acres if it exists under old name
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lands' and column_name = 'area') then
    alter table public.lands rename column area to area_acres;
  end if;
end $$;

alter table public.lands add column if not exists road_width_m numeric;
alter table public.lands add column if not exists approval_type varchar(50);
alter table public.lands add column if not exists clu_category varchar(100);
alter table public.lands add column if not exists municipal_limit_type varchar(50);
alter table public.lands add column if not exists access_type varchar(50);
alter table public.lands add column if not exists green_belt boolean default false;
alter table public.lands add column if not exists green_belt_width_m numeric;

-- =========================================================================
-- 9. Column Renaming & Type Standardization Migrations
-- =========================================================================
-- This section migrates pre-existing databases to standardized naming conventions

-- A. Lands Table (price -> listed_price, type -> land_type)
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lands' and column_name = 'price') then
    alter table public.lands rename column price to listed_price;
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lands' and column_name = 'type') then
    alter table public.lands rename column type to land_type;
  end if;
end $$;

-- B. Brokers Table (mobile_number -> phone_number, alternate_mobile_number -> alternate_phone_number)
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'brokers' and column_name = 'mobile_number') then
    alter table public.brokers rename column mobile_number to phone_number;
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'brokers' and column_name = 'alternate_mobile_number') then
    alter table public.brokers rename column alternate_mobile_number to alternate_phone_number;
  end if;

  alter table public.brokers alter column phone_number type varchar(20);
  alter table public.brokers alter column alternate_phone_number type varchar(20);
end $$;

-- C. Buyer Leads Table (phone -> phone_number, drop note/budget, add buyer_district/purchase_purpose/interested_district)
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'buyer_leads' and column_name = 'phone') then
    alter table public.buyer_leads rename column phone to phone_number;
  end if;

  alter table public.buyer_leads alter column phone_number type varchar(20);

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'buyer_leads' and column_name = 'note') then
    alter table public.buyer_leads drop column note;
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'buyer_leads' and column_name = 'budget') then
    alter table public.buyer_leads drop column budget;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'buyer_leads' and column_name = 'buyer_district') then
    alter table public.buyer_leads add column buyer_district text not null default '';
    alter table public.buyer_leads alter column buyer_district drop default;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'buyer_leads' and column_name = 'purchase_purpose') then
    alter table public.buyer_leads add column purchase_purpose text not null default '';
    alter table public.buyer_leads alter column purchase_purpose drop default;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'buyer_leads' and column_name = 'interested_district') then
    alter table public.buyer_leads add column interested_district text not null default '';
    alter table public.buyer_leads alter column interested_district drop default;
  end if;
end $$;

-- D. Lands Admin Table (owner_phone -> owner_phone_number)
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'lands_admin' and column_name = 'owner_phone') then
    alter table public.lands_admin rename column owner_phone to owner_phone_number;
  end if;

  alter table public.lands_admin alter column owner_phone_number type varchar(20);
end $$;

-- =========================================================================
-- 10. Seller Leads & Images
-- =========================================================================
create table if not exists public.seller_leads (
    id uuid default gen_random_uuid() primary key,
    name varchar(150) not null,
    phone_number varchar(20) not null,
    district varchar(100) not null,
    location_name varchar(150) not null,
    notes text,
    admin_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.seller_lead_images (
    id uuid default gen_random_uuid() primary key,
    seller_lead_id uuid references public.seller_leads(id) on delete cascade not null,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.seller_leads enable row level security;
alter table public.seller_lead_images enable row level security;

create policy "Allow public to insert seller leads"
on public.seller_leads for insert
with check (true);

create policy "Allow admins full access to seller leads"
on public.seller_leads for all
to authenticated
using (true)
with check (true);

create policy "Allow admins full access to seller lead images"
on public.seller_lead_images for all
to authenticated
using (true)
with check (true);

create policy "Allow public read-only of seller lead images"
on public.seller_lead_images for select
using (true);

-- =========================================================================
-- 11. Broker Images
-- =========================================================================
create table if not exists public.broker_images (
    id uuid default gen_random_uuid() primary key,
    broker_id uuid references public.brokers(id) on delete cascade not null,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.broker_images enable row level security;

create policy "Allow admins full access to broker images"
on public.broker_images for all
to authenticated
using (true)
with check (true);

