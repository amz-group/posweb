create schema if not exists private;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.systems (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  short_description text,
  full_description text,
  price_iqd numeric not null default 0,
  version text,
  platform text,
  file_size text,
  features text[] not null default '{}',
  screenshots text[] not null default '{}',
  system_file_uri text,
  system_file_name text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  last_update date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  logo text,
  hero_image text,
  site_name text default 'KRD GROUP',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.download_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  system_id uuid not null references public.systems(id) on delete cascade,
  system_name text,
  customer_name text,
  customer_phone text,
  expiration_date timestamptz,
  max_downloads integer not null default 1,
  current_downloads integer not null default 0,
  status text not null default 'Active' check (status in ('Active', 'Used', 'Expired', 'Disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.download_history (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  system_id uuid not null references public.systems(id) on delete cascade,
  system_name text,
  customer_name text,
  customer_phone text,
  download_date date,
  download_time time,
  download_status text not null default 'success' check (download_status in ('success', 'failed')),
  created_at timestamptz not null default now()
);

create table public.purchase_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  system_id uuid references public.systems(id) on delete set null,
  system_name text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'contacted', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  system text,
  message text,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin') $$;
revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$ begin insert into public.profiles (id) values (new.id); return new; end $$;
revoke all on function private.handle_new_user() from public;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.systems enable row level security;
alter table public.site_settings enable row level security;
alter table public.download_codes enable row level security;
alter table public.download_history enable row level security;
alter table public.purchase_requests enable row level security;
alter table public.contact_messages enable row level security;

create policy "profiles read own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "systems public read" on public.systems for select to anon, authenticated using (status = 'active');
create policy "systems admin read" on public.systems for select to authenticated using (private.is_admin());
create policy "systems admin insert" on public.systems for insert to authenticated with check (private.is_admin());
create policy "systems admin update" on public.systems for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "systems admin delete" on public.systems for delete to authenticated using (private.is_admin());
create policy "settings public read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings admin insert" on public.site_settings for insert to authenticated with check (private.is_admin());
create policy "settings admin update" on public.site_settings for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "settings admin delete" on public.site_settings for delete to authenticated using (private.is_admin());

create policy "codes admin all" on public.download_codes for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "history admin all" on public.download_history for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "purchases public create" on public.purchase_requests for insert to anon, authenticated with check (true);
create policy "purchases admin read" on public.purchase_requests for select to authenticated using (private.is_admin());
create policy "purchases admin update" on public.purchase_requests for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "purchases admin delete" on public.purchase_requests for delete to authenticated using (private.is_admin());
create policy "contacts public create" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "contacts admin read" on public.contact_messages for select to authenticated using (private.is_admin());
create policy "contacts admin update" on public.contact_messages for update to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "contacts admin delete" on public.contact_messages for delete to authenticated using (private.is_admin());

grant select on public.systems, public.site_settings to anon, authenticated;
grant insert on public.purchase_requests, public.contact_messages to anon, authenticated;
grant select, insert, update, delete on public.systems, public.site_settings, public.download_codes, public.download_history, public.purchase_requests, public.contact_messages to authenticated;
grant select on public.profiles to authenticated;

insert into storage.buckets (id, name, public) values ('public-assets', 'public-assets', true), ('system-files', 'system-files', false) on conflict (id) do nothing;
create policy "public assets readable" on storage.objects for select to anon, authenticated using (bucket_id = 'public-assets');
create policy "admins upload public assets" on storage.objects for insert to authenticated with check (bucket_id = 'public-assets' and private.is_admin());
create policy "admins manage public assets" on storage.objects for update to authenticated using (bucket_id = 'public-assets' and private.is_admin()) with check (bucket_id = 'public-assets' and private.is_admin());
create policy "admins delete public assets" on storage.objects for delete to authenticated using (bucket_id = 'public-assets' and private.is_admin());
create policy "admins upload system files" on storage.objects for insert to authenticated with check (bucket_id = 'system-files' and private.is_admin());
create policy "admins read system files" on storage.objects for select to authenticated using (bucket_id = 'system-files' and private.is_admin());
create policy "admins update system files" on storage.objects for update to authenticated using (bucket_id = 'system-files' and private.is_admin()) with check (bucket_id = 'system-files' and private.is_admin());
create policy "admins delete system files" on storage.objects for delete to authenticated using (bucket_id = 'system-files' and private.is_admin());

-- Promote the first administrator after signup:
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
