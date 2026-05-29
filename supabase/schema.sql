-- HomeFit cloud storage schema.
-- Run this in your Supabase project: SQL Editor → New query → paste → Run.
--
-- One row per user holds their entire HomeFit dataset (members + logs) as JSON.
-- Row-Level Security ensures each user can only read/write their OWN row.

create table if not exists public.homefit_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb       not null default '{"members":[],"logs":{}}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.homefit_state enable row level security;

-- Recreate policies idempotently.
drop policy if exists "own_state_select" on public.homefit_state;
drop policy if exists "own_state_insert" on public.homefit_state;
drop policy if exists "own_state_update" on public.homefit_state;

create policy "own_state_select" on public.homefit_state
  for select using (auth.uid() = user_id);

create policy "own_state_insert" on public.homefit_state
  for insert with check (auth.uid() = user_id);

create policy "own_state_update" on public.homefit_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
