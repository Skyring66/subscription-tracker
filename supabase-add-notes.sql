-- Run this in Supabase SQL Editor if you already created the tables.
alter table public.subscriptions add column if not exists notes text;
