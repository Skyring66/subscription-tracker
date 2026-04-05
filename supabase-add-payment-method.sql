-- Run this in Supabase SQL Editor if you already created the tables.
-- If setting up fresh, this column is already in supabase-schema.sql.

alter table public.subscriptions add column if not exists payment_method text;
