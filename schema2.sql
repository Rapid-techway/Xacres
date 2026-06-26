--
-- Xacres Supabase Database Schema (Clean Setup for New Database)
--

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. Brokers Table (Confidential/Sensitive CRM Information)
-- =========================================================================
create table public.brokers (
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

-- Indexes for Brokers
create index idx_broker_name on public.brokers(name);
create index idx_broker_district on public.brokers(district);
create index idx_broker_tehsil on public.brokers(tehsil);

-- =========================================================================
-- 2. Lands Table
-- =========================================================================
create table public.lands (
    id uuid default uuid_generate_v4() primary key,
    listing_number bigint generated always as identity (start with 10000) unique,
    title text not null,
    slug text not null unique,
    listed_price numeric not null,
    area_acres numeric not null,
    district text not null,
    tehsil text,
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
    broker_id uuid references public.brokers(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 3. Land Images Table
-- =========================================================================
create table public.land_images (
    id uuid default uuid_generate_v4() primary key,
    land_id uuid references public.lands(id) on delete cascade not null,
    url text not null,
    is_primary boolean not null default false,
    sort_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 4. Lands Admin Table (Private/Sensitive Information)
-- =========================================================================
create table public.lands_admin (
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
-- 5. Lands Polygon Table (GeoJSON / Map Boundaries)
-- =========================================================================
create table public.lands_polygon (
    id uuid default uuid_generate_v4() primary key,
    land_id uuid references public.lands(id) on delete cascade not null unique,
    polygon jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 6. Buyer Leads Table (Customer Inquiries)
-- =========================================================================
create table public.buyer_leads (
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
-- 7. Seller Leads Table
-- =========================================================================
create table public.seller_leads (
    id uuid default gen_random_uuid() primary key,
    name varchar(150) not null,
    phone_number varchar(20) not null,
    district varchar(100) not null,
    location_name varchar(150) not null,
    notes text,
    admin_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 8. Seller Lead Images Table
-- =========================================================================
create table public.seller_lead_images (
    id uuid default gen_random_uuid() primary key,
    seller_lead_id uuid references public.seller_leads(id) on delete cascade not null,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 9. Broker Images Table
-- =========================================================================
create table public.broker_images (
    id uuid default gen_random_uuid() primary key,
    broker_id uuid references public.brokers(id) on delete cascade not null,
    image_url text not null,
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

create trigger on_brokers_update
    before update on public.brokers
    for each row execute procedure public.handle_updated_at();

create trigger on_lands_update
    before update on public.lands
    for each row execute procedure public.handle_updated_at();

create trigger on_lands_admin_update
    before update on public.lands_admin
    for each row execute procedure public.handle_updated_at();

-- =========================================================================
-- Row Level Security (RLS) Enablement
-- =========================================================================
alter table public.brokers enable row level security;
alter table public.lands enable row level security;
alter table public.land_images enable row level security;
alter table public.lands_admin enable row level security;
alter table public.lands_polygon enable row level security;
alter table public.buyer_leads enable row level security;
alter table public.seller_leads enable row level security;
alter table public.seller_lead_images enable row level security;
alter table public.broker_images enable row level security;

-- =========================================================================
-- RLS Policies
-- =========================================================================

-- --- Brokers Policies ---
create policy "Allow admins full access to brokers"
on public.brokers for all
to authenticated
using (true)
with check (true);

-- --- Lands Policies ---
create policy "Allow public read-only of public lands"
on public.lands for select
using (is_public = true);

create policy "Allow admins full access to lands"
on public.lands for all
to authenticated
using (true)
with check (true);

-- --- Land Images Policies ---
create policy "Allow public read-only of land images"
on public.land_images for select
using (true);

create policy "Allow admins full access to land images"
on public.land_images for all
to authenticated
using (true)
with check (true);

-- --- Lands Admin Policies (Highly Protected) ---
create policy "Allow admins full access to lands admin info"
on public.lands_admin for all
to authenticated
using (true)
with check (true);

-- --- Lands Polygon Policies ---
create policy "Allow public read-only of polygons"
on public.lands_polygon for select
using (true);

create policy "Allow admins full access to polygons"
on public.lands_polygon for all
to authenticated
using (true)
with check (true);

-- --- Buyer Leads Policies ---
create policy "Allow public to insert buyer leads"
on public.buyer_leads for insert
with check (true);

create policy "Allow admins full access to buyer leads"
on public.buyer_leads for all
to authenticated
using (true)
with check (true);

-- --- Seller Leads Policies ---
create policy "Allow public to insert seller leads"
on public.seller_leads for insert
with check (true);

create policy "Allow admins full access to seller leads"
on public.seller_leads for all
to authenticated
using (true)
with check (true);

-- --- Seller Lead Images Policies ---
create policy "Allow public read-only of seller lead images"
on public.seller_lead_images for select
using (true);

create policy "Allow admins full access to seller lead images"
on public.seller_lead_images for all
to authenticated
using (true)
with check (true);

-- --- Broker Images Policies ---
create policy "Allow admins full access to broker images"
on public.broker_images for all
to authenticated
using (true)
with check (true);
