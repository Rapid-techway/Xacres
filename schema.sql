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
    price numeric not null,
    area numeric not null,
    district text not null,
    village text not null,
    latitude double precision not null,
    longitude double precision not null,
    type text not null,
    road_access boolean not null default false,
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
    owner_name text not null,
    owner_phone text not null,
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
-- 5. Land Leads Table (Customer Inquiries)
-- =========================================================================
create table if not exists public.land_leads (
    id uuid default uuid_generate_v4() primary key,
    land_id uuid references public.lands(id) on delete cascade not null,
    name text not null,
    phone text not null,
    note text,
    budget text,
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
alter table public.land_leads enable row level security;

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


-- --- Land Leads Policies ---
-- 1. Public (anonymous) users can insert leads (submit the contact form)
create policy "Allow public to insert leads"
on public.land_leads for insert
with check (true);

-- 2. Only Authenticated users (Admins) can read, update, or delete leads
create policy "Allow admins full access to leads"
on public.land_leads for all
to authenticated
using (true)
with check (true);
