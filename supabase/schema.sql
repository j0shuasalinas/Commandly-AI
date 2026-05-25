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
  phone text,
  logo_url text,
  brand_voice text not null default 'Professional',
  setup_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspaces add column if not exists phone text;
alter table public.workspaces add column if not exists logo_url text;

create table if not exists public.workspace_goals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  goal_key text not null,
  created_at timestamptz not null default now(),
  unique (workspace_id, goal_key)
);

create table if not exists public.workspace_leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  source text not null default 'Manual',
  status text not null default 'New',
  last_contact text not null default 'Not contacted',
  next_step text not null default 'Generate follow-up',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  channel text not null,
  status text not null default 'Draft',
  scheduled_date text,
  performance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_automations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'Paused',
  enabled boolean not null default false,
  trigger_label text,
  action_label text,
  approval_label text,
  output_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_reviews (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer text not null,
  source text not null default 'Website',
  rating integer not null default 5,
  status text not null default 'New',
  review_date text,
  review_text text not null,
  ai_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_ai_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  template text,
  tone text,
  goal text,
  prompt text,
  output text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  integration_key text not null,
  name text not null,
  description text,
  status text not null default 'Not Connected',
  action_label text not null default 'Connect',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, integration_key)
);

create table if not exists public.workspace_team_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null default 'Viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, email)
);

create table if not exists public.workspace_billing_state (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.workspaces(id) on delete cascade,
  current_plan text,
  prompts_used integer not null default 0,
  review_replies_used integer not null default 0,
  campaigns_created integer not null default 0,
  leads_tracked integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row
execute function public.set_updated_at();

drop trigger if exists set_workspace_leads_updated_at on public.workspace_leads;
create trigger set_workspace_leads_updated_at
before update on public.workspace_leads
for each row
execute function public.set_updated_at();

drop trigger if exists set_workspace_campaigns_updated_at on public.workspace_campaigns;
create trigger set_workspace_campaigns_updated_at
before update on public.workspace_campaigns
for each row
execute function public.set_updated_at();

drop trigger if exists set_workspace_automations_updated_at on public.workspace_automations;
create trigger set_workspace_automations_updated_at
before update on public.workspace_automations
for each row
execute function public.set_updated_at();

drop trigger if exists set_workspace_reviews_updated_at on public.workspace_reviews;
create trigger set_workspace_reviews_updated_at
before update on public.workspace_reviews
for each row
execute function public.set_updated_at();

drop trigger if exists set_workspace_ai_drafts_updated_at on public.workspace_ai_drafts;
create trigger set_workspace_ai_drafts_updated_at
before update on public.workspace_ai_drafts
for each row
execute function public.set_updated_at();

drop trigger if exists set_workspace_integrations_updated_at on public.workspace_integrations;
create trigger set_workspace_integrations_updated_at
before update on public.workspace_integrations
for each row
execute function public.set_updated_at();

drop trigger if exists set_workspace_team_members_updated_at on public.workspace_team_members;
create trigger set_workspace_team_members_updated_at
before update on public.workspace_team_members
for each row
execute function public.set_updated_at();

drop trigger if exists set_workspace_billing_state_updated_at on public.workspace_billing_state;
create trigger set_workspace_billing_state_updated_at
before update on public.workspace_billing_state
for each row
execute function public.set_updated_at();

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_goals to authenticated;
grant select, insert, update, delete on public.workspace_leads to authenticated;
grant select, insert, update, delete on public.workspace_campaigns to authenticated;
grant select, insert, update, delete on public.workspace_automations to authenticated;
grant select, insert, update, delete on public.workspace_reviews to authenticated;
grant select, insert, update, delete on public.workspace_ai_drafts to authenticated;
grant select, insert, update, delete on public.workspace_integrations to authenticated;
grant select, insert, update, delete on public.workspace_team_members to authenticated;
grant select, insert, update, delete on public.workspace_billing_state to authenticated;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_goals enable row level security;
alter table public.workspace_leads enable row level security;
alter table public.workspace_campaigns enable row level security;
alter table public.workspace_automations enable row level security;
alter table public.workspace_reviews enable row level security;
alter table public.workspace_ai_drafts enable row level security;
alter table public.workspace_integrations enable row level security;
alter table public.workspace_team_members enable row level security;
alter table public.workspace_billing_state enable row level security;

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

drop policy if exists "workspace_leads_select_own" on public.workspace_leads;
create policy "workspace_leads_select_own"
on public.workspace_leads
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_leads.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_leads_insert_own" on public.workspace_leads;
create policy "workspace_leads_insert_own"
on public.workspace_leads
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_leads.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_leads_update_own" on public.workspace_leads;
create policy "workspace_leads_update_own"
on public.workspace_leads
for update
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_leads.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_leads.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_campaigns_select_own" on public.workspace_campaigns;
create policy "workspace_campaigns_select_own"
on public.workspace_campaigns
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_campaigns.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_campaigns_insert_own" on public.workspace_campaigns;
create policy "workspace_campaigns_insert_own"
on public.workspace_campaigns
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_campaigns.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_campaigns_update_own" on public.workspace_campaigns;
create policy "workspace_campaigns_update_own"
on public.workspace_campaigns
for update
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_campaigns.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_campaigns.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_automations_select_own" on public.workspace_automations;
create policy "workspace_automations_select_own"
on public.workspace_automations
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_automations.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_automations_insert_own" on public.workspace_automations;
create policy "workspace_automations_insert_own"
on public.workspace_automations
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_automations.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_automations_update_own" on public.workspace_automations;
create policy "workspace_automations_update_own"
on public.workspace_automations
for update
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_automations.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_automations.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_reviews_select_own" on public.workspace_reviews;
create policy "workspace_reviews_select_own"
on public.workspace_reviews
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_reviews.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_reviews_insert_own" on public.workspace_reviews;
create policy "workspace_reviews_insert_own"
on public.workspace_reviews
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_reviews.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_reviews_update_own" on public.workspace_reviews;
create policy "workspace_reviews_update_own"
on public.workspace_reviews
for update
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_reviews.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_reviews.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_ai_drafts_select_own" on public.workspace_ai_drafts;
create policy "workspace_ai_drafts_select_own"
on public.workspace_ai_drafts
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_ai_drafts.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_ai_drafts_insert_own" on public.workspace_ai_drafts;
create policy "workspace_ai_drafts_insert_own"
on public.workspace_ai_drafts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_ai_drafts.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_integrations_select_own" on public.workspace_integrations;
create policy "workspace_integrations_select_own"
on public.workspace_integrations
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_integrations.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_integrations_insert_own" on public.workspace_integrations;
create policy "workspace_integrations_insert_own"
on public.workspace_integrations
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_integrations.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_integrations_update_own" on public.workspace_integrations;
create policy "workspace_integrations_update_own"
on public.workspace_integrations
for update
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_integrations.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_integrations.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_team_members_select_own" on public.workspace_team_members;
create policy "workspace_team_members_select_own"
on public.workspace_team_members
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_team_members.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_team_members_insert_own" on public.workspace_team_members;
create policy "workspace_team_members_insert_own"
on public.workspace_team_members
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_team_members.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_team_members_update_own" on public.workspace_team_members;
create policy "workspace_team_members_update_own"
on public.workspace_team_members
for update
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_team_members.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_team_members.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_billing_state_select_own" on public.workspace_billing_state;
create policy "workspace_billing_state_select_own"
on public.workspace_billing_state
for select
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_billing_state.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_billing_state_insert_own" on public.workspace_billing_state;
create policy "workspace_billing_state_insert_own"
on public.workspace_billing_state
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_billing_state.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);

drop policy if exists "workspace_billing_state_update_own" on public.workspace_billing_state;
create policy "workspace_billing_state_update_own"
on public.workspace_billing_state
for update
to authenticated
using (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_billing_state.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspaces
    where public.workspaces.id = workspace_billing_state.workspace_id
      and public.workspaces.owner_id = auth.uid()
  )
);
