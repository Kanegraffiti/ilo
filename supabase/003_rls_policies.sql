-- Enable RLS
alter table modules enable row level security;
alter table lessons enable row level security;
alter table lesson_media enable row level security;
alter table vocab enable row level security;
alter table submissions enable row level security;
alter table fun_facts enable row level security;

-- Public read for published learning content
create policy "public can read published lessons"
on lessons for select
using (status = 'Published');

create policy "public can read modules"
on modules for select
using (true);

create policy "public can read lesson_media of published lessons"
on lesson_media for select
using (exists (select 1 from lessons l where l.id = lesson_media.lesson_id and l.status = 'Published'));

create policy "public can read vocab of published lessons"
on vocab for select
using (exists (select 1 from lessons l where l.id = vocab.lesson_id and l.status = 'Published'));

create policy "public can read fun facts"
on fun_facts for select using (true);

-- Only authenticated users can create their own submissions
create policy "users insert their submissions"
on submissions for insert
with check (auth.uid() = user_id);

create policy "users read their submissions"
on submissions for select
using (auth.uid() = user_id);
