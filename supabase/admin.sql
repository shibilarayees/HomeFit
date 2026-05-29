-- HomeFit app-admin: read-only aggregate view (counts + who joined).
-- Run in Supabase → SQL Editor. Then run the INSERT at the bottom (with YOUR email)
-- to make your account the admin. Admins see counts & membership only — never logs.

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.app_admins enable row level security;
drop policy if exists app_admins_self on public.app_admins;
create policy app_admins_self on public.app_admins for select using (user_id = auth.uid());

-- Is the caller an admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid())
$$;

-- Aggregate overview — restricted to admins. Returns counts + a who-joined list
-- (emails, family name, role, join date) and a family list. NO health data.
create or replace function public.admin_overview()
returns json language plpgsql stable security definer set search_path = public as $$
declare result json;
begin
  if not exists (select 1 from public.app_admins where user_id = auth.uid()) then
    raise exception 'Not authorized';
  end if;
  select json_build_object(
    'signups',   (select count(*) from auth.users),
    'families',  (select count(*) from public.families),
    'people',    (select count(*) from public.family_members),
    'active_7d', (select count(*) from public.family_state where updated_at > now() - interval '7 days'),
    'families_list', (
      select coalesce(json_agg(r), '[]'::json) from (
        select f.name,
               (select count(*) from public.family_members m where m.family_id = f.id) as members,
               f.created_at,
               s.updated_at as last_active
        from public.families f
        left join public.family_state s on s.family_id = f.id
        order by f.created_at desc
      ) r
    ),
    'members_list', (
      select coalesce(json_agg(r), '[]'::json) from (
        select m.email, f.name as family, m.role, m.joined_at
        from public.family_members m
        join public.families f on f.id = m.family_id
        order by m.joined_at desc
      ) r
    )
  ) into result;
  return result;
end; $$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.admin_overview() to authenticated;

-- 👉 Make yourself the admin: replace the email with YOUR admin account email,
--    then run just this line (sign up in the app with that email first).
-- insert into public.app_admins (user_id)
--   select id from auth.users where email = 'YOUR_EMAIL_HERE'
--   on conflict do nothing;
