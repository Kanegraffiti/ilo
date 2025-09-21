-- Supabase schema for WhatsApp lesson bot content.
-- Execute manually inside Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists lessons (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    body_md text,
    level text,
    topic text,
    slug text unique,
    status text check (status in ('draft','published')) default 'draft',
    author_phone text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index if not exists lessons_slug_idx on lessons (slug);
create index if not exists lessons_status_idx on lessons (status);

create table if not exists lesson_media (
    id uuid primary key default gen_random_uuid(),
    lesson_id uuid references lessons(id) on delete cascade,
    kind text check (kind in ('image','audio','video')),
    url text not null,
    caption text,
    created_at timestamptz default now()
);

create index if not exists lesson_media_lesson_idx on lesson_media (lesson_id);

create table if not exists quizzes (
    id uuid primary key default gen_random_uuid(),
    lesson_id uuid references lessons(id) on delete cascade,
    prompt text not null,
    options jsonb not null,
    answer_idx int check (answer_idx >= 0),
    created_at timestamptz default now()
);

create index if not exists quizzes_lesson_idx on quizzes (lesson_id);

create table if not exists publishes (
    id uuid primary key default gen_random_uuid(),
    lesson_id uuid references lessons(id) on delete cascade,
    channel text,
    result jsonb,
    created_at timestamptz default now()
);

create table if not exists chat_state (
    sender_phone text primary key,
    active_lesson uuid references lessons(id) on delete set null,
    last_cmd text,
    updated_at timestamptz default now()
);

-- Upsert helpers -------------------------------------------------------------
-- Example: persist chat state from the bot (idempotent update)
-- insert into chat_state (sender_phone, active_lesson, last_cmd, updated_at)
-- values ('+15551234567', '00000000-0000-0000-0000-000000000000', 'EXPECT_MEDIA:image', now())
-- on conflict (sender_phone) do update
--     set active_lesson = excluded.active_lesson,
--         last_cmd = excluded.last_cmd,
--         updated_at = excluded.updated_at;

-- Example: ensure publishes row exists for a lesson idempotently
-- insert into publishes (id, lesson_id, channel, result)
-- values (
--     gen_random_uuid(),
--     '00000000-0000-0000-0000-000000000000',
--     'whatsapp',
--     jsonb_build_object('status', 'queued')
-- )
-- on conflict (id) do update set result = excluded.result;
