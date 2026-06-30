-- ================================================
-- HousekeepingWeb Schema
-- 在 Supabase Dashboard > SQL Editor 執行此檔案
-- ================================================

-- profiles 表（掛接 auth.users）
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null check (role in ('employer', 'housekeeper')),
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

-- orders 表（雇主發包）
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  address text not null,
  area_ping int not null default 20,
  rooms int not null default 2,
  living_rooms int not null default 1,
  kitchens int not null default 1,
  bathrooms int not null default 1,
  special_requirements text,
  budget_min int not null default 0,
  budget_max int not null default 0,
  scheduled_date date not null,
  status text not null default 'open'
    check (status in ('open', 'assigned', 'in_progress', 'completed', 'cancelled')),
  assigned_housekeeper_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- order_todos 表（清潔項目）
create table if not exists order_todos (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  task text not null,
  completed boolean default false
);

-- applications 表（家政人員接單申請）
create table if not exists applications (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  housekeeper_id uuid references profiles(id) on delete cascade not null,
  proposed_price int not null,
  message text default '',
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now()
);

-- ================================================
-- RLS
-- ================================================
alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_todos enable row level security;
alter table applications enable row level security;

-- Profiles
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Orders
create policy "orders_select_auth" on orders for select using (auth.uid() is not null);
create policy "orders_insert_employer" on orders for insert with check (auth.uid() = employer_id);
create policy "orders_update_employer" on orders for update using (auth.uid() = employer_id);

-- Order todos
create policy "todos_select_auth" on order_todos for select using (auth.uid() is not null);
create policy "todos_insert_auth" on order_todos for insert with check (auth.uid() is not null);
create policy "todos_update_auth" on order_todos for update using (auth.uid() is not null);

-- Applications
create policy "applications_insert_housekeeper" on applications for insert with check (auth.uid() = housekeeper_id);
create policy "applications_select_auth" on applications for select using (auth.uid() is not null);
create policy "applications_update_auth" on applications for update using (auth.uid() is not null);
