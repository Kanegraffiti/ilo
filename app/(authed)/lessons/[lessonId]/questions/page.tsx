'use client';

import { QuestionForm } from '@/components/QuestionForm';
import { QuestionList, type QuestionItem } from '@/components/QuestionList';
import { Button } from '@/components/ui/Button';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useEffect, useState } from 'react';

interface OwnerOption {
  id: string;
  label: string;
  kind: 'user' | 'child';
}

export default function LessonQuestionsPage({ params }: { params: { lessonId: string } }) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [options, setOptions] = useState<OwnerOption[]>([]);
  const [owner, setOwner] = useState<OwnerOption | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = supabaseBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const [profileRes, childRes, questionRes] = await Promise.all([
        supabase.from('user_profiles').select('id, display_name').eq('user_id', userData.user.id).maybeSingle(),
        supabase.from('child_profiles').select('id, nickname'),
        supabase
          .from('questions')
          .select('id, question, answer, created_at, answered_at, owner_kind, owner_id, answered_by')
          .eq('lesson_id', params.lessonId)
          .order('created_at', { ascending: true }),
      ]);

      if (!active) return;

      const ownerOptions: OwnerOption[] = [];
      if (profileRes.data) {
        ownerOptions.push({ id: profileRes.data.id, label: profileRes.data.display_name ?? 'Me', kind: 'user' });
      }
      (childRes.data ?? []).forEach((child) => {
        ownerOptions.push({ id: child.id, label: child.nickname ?? 'Child', kind: 'child' });
      });
      setOptions(ownerOptions);
      setOwner(ownerOptions[0] ?? null);

      const userIds = new Set<string>();
      const childIds = new Set<string>();
      const teacherIds = new Set<string>();

      (questionRes.data ?? []).forEach((row) => {
        if (row.owner_kind === 'user') {
          userIds.add(row.owner_id);
        } else {
          childIds.add(row.owner_id);
        }
        if (row.answered_by) {
          teacherIds.add(row.answered_by);
        }
      });

      const [userProfiles, childProfiles, teacherProfiles] = await Promise.all([
        userIds.size
          ? supabase.from('user_profiles').select('id, display_name').in('id', Array.from(userIds))
          : Promise.resolve({ data: [] }),
        childIds.size
          ? supabase.from('child_profiles').select('id, nickname').in('id', Array.from(childIds))
          : Promise.resolve({ data: [] }),
        teacherIds.size
          ? supabase.from('user_profiles').select('user_id, display_name').in('user_id', Array.from(teacherIds))
          : Promise.resolve({ data: [] }),
      ]);

      const teacherNameById = new Map<string, string>();
      (teacherProfiles.data ?? []).forEach((row: any) => {
        teacherNameById.set(row.user_id, row.display_name ?? 'Teacher');
      });
      const userNameById = new Map<string, string>();
      (userProfiles.data ?? []).forEach((row: any) => {
        userNameById.set(row.id, row.display_name ?? 'Learner');
      });
      const childNameById = new Map<string, string>();
      (childProfiles.data ?? []).forEach((row: any) => {
        childNameById.set(row.id, row.nickname ?? 'Learner');
      });

      setQuestions(
        (questionRes.data ?? []).map((row) => ({
          id: row.id,
          question: row.question,
          createdAt: row.created_at,
          answer: row.answer,
          answeredAt: row.answered_at,
          askedBy: row.owner_kind === 'user' ? userNameById.get(row.owner_id) : childNameById.get(row.owner_id),
          answeredByName: row.answered_by ? teacherNameById.get(row.answered_by) : null,
        })),
      );
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [params.lessonId]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-serif text-ink">Lesson Q&amp;A</h1>
          <p className="text-sm text-ink/70">Ask your teacher a question or review previous answers.</p>
        </div>
        <Button variant="secondary" href={`/lessons/${params.lessonId}`}>
          Back to lesson
        </Button>
      </header>

      {owner ? (
        <QuestionForm
          lessonId={params.lessonId}
          ownerKind={owner.kind}
          ownerId={owner.id}
          onSubmitted={() => {
            // refresh questions
            setLoading(true);
            setQuestions([]);
            // trigger reload by changing dependency
            void (async () => {
              const supabase = supabaseBrowser();
              const { data } = await supabase
                .from('questions')
                .select('id, question, answer, created_at, answered_at, owner_kind, owner_id, answered_by')
                .eq('lesson_id', params.lessonId)
                .order('created_at', { ascending: true });
              if (!data) {
                setLoading(false);
                return;
              }
              const userIds = new Set<string>();
              const childIds = new Set<string>();
              const teacherIds = new Set<string>();
              data.forEach((row) => {
                if (row.owner_kind === 'user') userIds.add(row.owner_id);
                else childIds.add(row.owner_id);
                if (row.answered_by) teacherIds.add(row.answered_by);
              });
              const [userProfiles, childProfiles, teacherProfiles] = await Promise.all([
                userIds.size
                  ? supabase.from('user_profiles').select('id, display_name').in('id', Array.from(userIds))
                  : Promise.resolve({ data: [] }),
                childIds.size
                  ? supabase.from('child_profiles').select('id, nickname').in('id', Array.from(childIds))
                  : Promise.resolve({ data: [] }),
                teacherIds.size
                  ? supabase.from('user_profiles').select('user_id, display_name').in('user_id', Array.from(teacherIds))
                  : Promise.resolve({ data: [] }),
              ]);
              const teacherNameById = new Map<string, string>();
              (teacherProfiles.data ?? []).forEach((row: any) => teacherNameById.set(row.user_id, row.display_name ?? 'Teacher'));
              const userNameById = new Map<string, string>();
              (userProfiles.data ?? []).forEach((row: any) => userNameById.set(row.id, row.display_name ?? 'Learner'));
              const childNameById = new Map<string, string>();
              (childProfiles.data ?? []).forEach((row: any) => childNameById.set(row.id, row.nickname ?? 'Learner'));
              setQuestions(
                data.map((row) => ({
                  id: row.id,
                  question: row.question,
                  createdAt: row.created_at,
                  answer: row.answer,
                  answeredAt: row.answered_at,
                  askedBy: row.owner_kind === 'user' ? userNameById.get(row.owner_id) : childNameById.get(row.owner_id),
                  answeredByName: row.answered_by ? teacherNameById.get(row.answered_by) : null,
                })),
              );
              setLoading(false);
            })();
          }}
        />
      ) : (
        <p className="rounded-2xl border border-ink/10 bg-white/95 p-4 text-sm text-ink/70">
          Sign in to ask a question.
        </p>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif text-ink">Questions</h2>
          {options.length > 1 ? (
            <div className="flex items-center gap-2 text-sm text-ink/80">
              <span>Asking as</span>
              <select
                value={owner?.id ?? ''}
                onChange={(event) => {
                  const selected = options.find((option) => option.id === event.target.value);
                  setOwner(selected ?? null);
                }}
                className="h-10 rounded-2xl border border-ink/10 bg-white/95 px-3"
              >
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        {loading ? (
          <p className="rounded-2xl border border-dashed border-ink/10 bg-white/95 p-4 text-sm text-ink/70">
            Loading questions…
          </p>
        ) : (
          <QuestionList questions={questions} />
        )}
      </section>
    </div>
  );
}
