-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric(10, 2) not null,
  currency text not null default 'GBP',
  period text not null check (period in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  renewal_date date not null,
  url text,
  payment_method text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Activity log table
create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  action text not null check (action in ('added', 'modified', 'deleted')),
  subscription_name text not null,
  details text,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.subscriptions enable row level security;
alter table public.activity_log enable row level security;

-- RLS Policies: users can only see/modify their own data
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);

create policy "Users can view own activity log"
  on public.activity_log for select
  using (auth.uid() = user_id);

create policy "Users can insert own activity log"
  on public.activity_log for insert
  with check (auth.uid() = user_id);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_subscription_updated
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();
