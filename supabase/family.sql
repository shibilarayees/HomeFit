-- HomeFit "Family groups" — link multiple logins into one shared family.
-- Run this in Supabase → SQL Editor → New query → paste → Run.
-- (You already ran schema.sql for the single-user table; this adds the family layer.)

-- 1) Tables ------------------------------------------------------------------
create table if not exists public.families (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  invite_code text not null unique,
  created_by  uuid references auth.users (id),
  created_at  timestamptz not null default now()
);

create table if not exists public.family_members (
  family_id uuid not null references public.families (id) on delete cascade,
  user_id   uuid not null references auth.users (id) on delete cascade,
  email     text,
  role      text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (family_id, user_id),
  unique (user_id)                       -- each user belongs to exactly one family
);

create table if not exists public.family_state (
  family_id  uuid primary key references public.families (id) on delete cascade,
  data       jsonb not null default '{"members":[],"logs":{}}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) Helper: current user's family id (SECURITY DEFINER avoids RLS recursion) -
create or replace function public.current_family_id()
returns uuid language sql stable security definer set search_path = public as $$
  select family_id from public.family_members where user_id = auth.uid() limit 1
$$;

-- 3) Row-Level Security ------------------------------------------------------
alter table public.families       enable row level security;
alter table public.family_members enable row level security;
alter table public.family_state   enable row level security;

drop policy if exists fam_select on public.families;
drop policy if exists fm_select  on public.family_members;
drop policy if exists fs_select  on public.family_state;
drop policy if exists fs_insert  on public.family_state;
drop policy if exists fs_update  on public.family_state;

create policy fam_select on public.families       for select using (id = public.current_family_id());
create policy fm_select  on public.family_members for select using (family_id = public.current_family_id());
create policy fs_select  on public.family_state   for select using (family_id = public.current_family_id());
create policy fs_insert  on public.family_state   for insert with check (family_id = public.current_family_id());
create policy fs_update  on public.family_state   for update using (family_id = public.current_family_id()) with check (family_id = public.current_family_id());

grant select on public.families to authenticated;
grant select on public.family_members to authenticated;
grant select, insert, update on public.family_state to authenticated;

-- 4) RPCs: create / join / fetch family --------------------------------------
create or replace function public.create_family(p_name text, p_data jsonb default '{"members":[],"logs":{}}'::jsonb)
returns public.families language plpgsql security definer set search_path = public as $$
declare v_family public.families; v_code text; v_email text;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'You are already in a family';
  end if;
  loop
    v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (select 1 from public.families where invite_code = v_code);
  end loop;
  select email into v_email from auth.users where id = auth.uid();
  insert into public.families (name, invite_code, created_by)
    values (coalesce(nullif(trim(p_name), ''), 'My Family'), v_code, auth.uid())
    returning * into v_family;
  insert into public.family_members (family_id, user_id, email, role)
    values (v_family.id, auth.uid(), v_email, 'owner');
  insert into public.family_state (family_id, data)
    values (v_family.id, coalesce(p_data, '{"members":[],"logs":{}}'::jsonb));
  return v_family;
end; $$;

create or replace function public.join_family(p_code text)
returns public.families language plpgsql security definer set search_path = public as $$
declare v_family public.families; v_email text;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select * into v_family from public.families where invite_code = upper(trim(p_code));
  if v_family.id is null then raise exception 'Invalid invite code'; end if;
  if exists (select 1 from public.family_members where user_id = auth.uid() and family_id = v_family.id) then
    return v_family;  -- already a member of this family
  end if;
  if exists (select 1 from public.family_members where user_id = auth.uid()) then
    raise exception 'You are already in a different family';
  end if;
  select email into v_email from auth.users where id = auth.uid();
  insert into public.family_members (family_id, user_id, email, role)
    values (v_family.id, auth.uid(), v_email, 'member');
  return v_family;
end; $$;

create or replace function public.my_family()
returns public.families language sql stable security definer set search_path = public as $$
  select f.* from public.families f
  join public.family_members m on m.family_id = f.id
  where m.user_id = auth.uid() limit 1
$$;

grant execute on function public.create_family(text, jsonb) to authenticated;
grant execute on function public.join_family(text) to authenticated;
grant execute on function public.my_family() to authenticated;
grant execute on function public.current_family_id() to authenticated;

-- 5) Realtime: let family members see each other's updates live ---------------
alter publication supabase_realtime add table public.family_state;
