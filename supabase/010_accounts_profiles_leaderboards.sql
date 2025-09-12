-- Migration for accounts, profiles, and leaderboards

-- 1) Top-level user profile
create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  display_name text not null,
  avatar_url text,
  country text,
  age int,
  created_at timestamptz default now()
);

-- 2) Child profiles
create table if not exists child_profiles (
  id uuid primary key default gen_random_uuid(),
  guardian_user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  age int not null check (age between 4 and 12),
  avatar_url text,
  created_at timestamptz default now()
);

-- 3) Progress & scores
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  owner_kind text not null check (owner_kind in ('user','child')),
  owner_id uuid not null,
  module_id uuid references modules(id) on delete set null,
  lesson_id uuid references lessons(id) on delete set null,
  xp int not null default 0,
  streak_days int not null default 0,
  last_activity_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 4) Quiz results
create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  owner_kind text not null check (owner_kind in ('user','child')),
  owner_id uuid not null,
  lesson_id uuid references lessons(id) on delete cascade,
  score int not null check (score between 0 and 100),
  max_score int not null default 100,
  duration_seconds int,
  created_at timestamptz default now()
);

-- 5) Leaderboard snapshots
create table if not exists leaderboards (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('weekly','all_time')),
  module_id uuid,
  owner_kind text not null check (owner_kind in ('user','child')),
  owner_id uuid not null,
  display_name text not null,
  avatar_url text,
  xp int not null default 0,
  rank int,
  week_start date,
  generated_at timestamptz default now()
);
create index if not exists leaderboards_scope_idx on leaderboards(scope, module_id, week_start, generated_at desc);

-- Enable RLS
alter table user_profiles enable row level security;
alter table child_profiles enable row level security;
alter table progress enable row level security;
alter table quiz_results enable row level security;
alter table leaderboards enable row level security;

-- user_profiles policies
create policy "me_read_profile" on user_profiles for select using (auth.uid() = user_id);
create policy "me_upsert_profile" on user_profiles for insert with check (auth.uid() = user_id);
create policy "me_update_profile" on user_profiles for update using (auth.uid() = user_id);

-- child_profiles policies
create policy "guardian_read_children" on child_profiles for select using (auth.uid() = guardian_user_id);
create policy "guardian_write_children" on child_profiles for insert with check (auth.uid() = guardian_user_id);
create policy "guardian_update_children" on child_profiles for update using (auth.uid() = guardian_user_id);
create policy "guardian_delete_children" on child_profiles for delete using (auth.uid() = guardian_user_id);

-- progress policies
create policy "owner_read_progress" on progress for select using (
  (owner_kind='user' and exists(select 1 from user_profiles up where up.id=progress.owner_id and up.user_id=auth.uid()))
  or
  (owner_kind='child' and exists(select 1 from child_profiles cp where cp.id=progress.owner_id and cp.guardian_user_id=auth.uid()))
);

-- quiz_results policies
create policy "owner_read_quiz" on quiz_results for select using (
  (owner_kind='user' and exists(select 1 from user_profiles up where up.id=quiz_results.owner_id and up.user_id=auth.uid()))
  or
  (owner_kind='child' and exists(select 1 from child_profiles cp where cp.id=quiz_results.owner_id and cp.guardian_user_id=auth.uid()))
);

-- leaderboards policy
create policy "public_read_leaderboards" on leaderboards for select using (true);
