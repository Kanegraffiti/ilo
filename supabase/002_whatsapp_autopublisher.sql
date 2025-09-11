create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references modules(id) on delete set null,
  title text not null,
  status text not null default 'Draft', -- Draft|Published
  notes_md text,
  objectives text[],
  published_at timestamptz,
  order_index int default 0,
  created_by text,
  created_at timestamptz default now()
);

create table if not exists lesson_media (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  kind text not null,        -- audio|video|image|document
  path text not null,        -- storage path
  mime text,
  duration_seconds int,
  created_at timestamptz default now()
);

create table if not exists vocab (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  term text not null,
  meaning text not null,
  audio_path text
);

create table if not exists teacher_sessions (
  id uuid primary key default gen_random_uuid(),
  sender text not null unique,
  current_lesson_id uuid references lessons(id) on delete set null,
  updated_at timestamptz default now()
);

-- Suggested RLS policies should restrict access. Storage bucket 'lesson-media' should remain private; use signed URLs for access.
