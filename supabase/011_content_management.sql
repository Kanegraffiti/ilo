-- 1. Add role to user_profiles (defaults to guardian)
alter table user_profiles add column if not exists role text not null default 'guardian'
    check (role in ('teacher','guardian'));

-- 2. Cohorts (classrooms)
create table if not exists cohorts (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id),
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- 3. Cohort enrollments
create table if not exists cohort_enrollments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references cohorts(id) on delete cascade,
  owner_kind text not null check (owner_kind in ('user','child')),
  owner_id uuid not null,
  joined_at timestamptz default now()
);

-- 4. Lesson questions (Q&A)
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  owner_kind text not null check (owner_kind in ('user','child')),
  owner_id uuid not null,
  question text not null,
  answer text,
  answered_by uuid references auth.users(id),
  created_at timestamptz default now(),
  answered_at timestamptz
);

-- 5. Policies
alter table cohorts enable row level security;
alter table cohort_enrollments enable row level security;
alter table questions enable row level security;
-- Teachers can read/write only their cohorts
create policy "teacher_manage_own_cohorts"
  on cohorts for all using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);
-- Guardians can read enrollments for themselves/children; teacher reads for own cohort
create policy "read_cohort_enrollments"
  on cohort_enrollments for select using (
    (exists(select 1 from user_profiles up where up.id = cohort_enrollments.owner_id and up.user_id = auth.uid())) or
    (exists(select 1 from child_profiles cp where cp.id = cohort_enrollments.owner_id and cp.guardian_user_id = auth.uid())) or
    (exists(select 1 from cohorts c where c.id = cohort_enrollments.cohort_id and c.teacher_id = auth.uid()))
  );
-- Students join cohort
create policy "join_cohort"
  on cohort_enrollments for insert with check (
    (exists(select 1 from cohorts c where c.id = cohort_enrollments.cohort_id)) and
    ((owner_kind='user' and exists(select 1 from user_profiles up where up.id = cohort_enrollments.owner_id and up.user_id = auth.uid())) or
     (owner_kind='child' and exists(select 1 from child_profiles cp where cp.id = cohort_enrollments.owner_id and cp.guardian_user_id = auth.uid())))
  );
-- Questions: owner can insert; anyone in the cohort or teacher can read; only teacher answers
create policy "ask_question"
  on questions for insert with check (
    (owner_kind='user' and exists(select 1 from user_profiles up where up.id = questions.owner_id and up.user_id = auth.uid())) or
    (owner_kind='child' and exists(select 1 from child_profiles cp where cp.id = questions.owner_id and cp.guardian_user_id = auth.uid()))
  );
create policy "read_questions"
  on questions for select using (
    exists(select 1 from lessons l 
           join modules m on l.module_id = m.id
           join cohorts c on c.teacher_id = auth.uid() -- teacher sees all
           )
    or 
    exists(select 1 from cohort_enrollments ce 
           join lessons l on l.module_id = (select module_id from lessons where lessons.id = questions.lesson_id)
           where ce.owner_id = (
              case questions.owner_kind 
                when 'user' then questions.owner_id 
                else (select guardian_user_id from child_profiles where id = questions.owner_id) 
              end
           ) and ce.cohort_id = any(select c2.id from cohorts c2 where c2.teacher_id = auth.uid()))
  );
create policy "answer_questions"
  on questions for update using (auth.uid() = any(select teacher_id from cohorts c join lessons l on l.module_id = c.id where l.id = questions.lesson_id))
  with check (auth.uid() = any(select teacher_id from cohorts c join lessons l on l.module_id = c.id where l.id = questions.lesson_id));
