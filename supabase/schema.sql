create table modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  order_index int default 0,
  created_at timestamptz default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references modules(id) on delete set null,
  title text not null,
  status text not null default 'Published',
  notes_md text,
  objectives text[],
  published_at timestamptz default now(),
  order_index int default 0
);

create table lesson_media (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  kind text not null,
  path text not null,
  mime text,
  duration_seconds int,
  created_at timestamptz default now()
);

create table vocab (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  term text not null,
  meaning text not null,
  audio_path text
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  lesson_id uuid references lessons(id) on delete cascade,
  type text not null,
  payload jsonb not null,
  media_path text,
  score int,
  created_at timestamptz default now()
);

create table fun_facts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_md text not null,
  published_at timestamptz default now()
);
