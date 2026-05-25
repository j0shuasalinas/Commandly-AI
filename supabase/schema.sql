create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  business_name text not null,
  business_type text not null default 'Small Business',
  website_url text,
  business_email text not null,
  brand_voice text not null default 'Professional',
  setup_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_goals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  goal_key text not null,
  created_at timestamptz not null default now(),
  unique (workspace_id, goal_key)
);

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_goals enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "workspaces_select_own" on public.workspaces;
create policy "workspaces_select_own"
on public.workspaces
for select
to authenticated
using (auth.uid() = owner_id);

drop policy if exists "workspaces_insert_own" on public.workspaces;
create policy "workspaces_insert_own"
on public.workspaces
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "workspaces_update_own" on public.workspaces;
create policy "workspaces_update_own"
on public.workspaces
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "workspace_goals_select_own" on public.workspace_goals;
create policy "workspace_goals_select_own"
on public.workspace_goals
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_goals.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_goals_insert_own" on public.workspace_goals;
create policy "workspace_goals_insert_own"
on public.workspace_goals
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_goals.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_goals_delete_own" on public.workspace_goals;
create policy "workspace_goals_delete_own"
on public.workspace_goals
for delete
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_goals.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);
