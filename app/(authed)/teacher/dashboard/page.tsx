'use client';

import { CohortList, type CohortSummary } from '@/components/CohortList';
import { QuestionList, type QuestionItem } from '@/components/QuestionList';
import { TabNav } from '@/components/ui/TabNav';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useCardPop } from '@/lib/anim';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

interface LessonSummary {
  id: string;
  title: string;
  status?: string | null;
  created_at?: string | null;
}

const TEACHER_TABS = [
  { label: 'Dashboard', href: '/teacher/dashboard' },
  { label: 'Lessons', href: '/teacher/lessons' },
  { label: 'Cohorts', href: '/teacher/cohorts' },
  { label: 'Questions', href: '/teacher/dashboard#questions' },
];

export default function TeacherDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [cohorts, setCohorts] = useState<CohortSummary[]>([]);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const cardPop = useCardPop();

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = supabaseBrowser();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setLoading(false);
          return;
        }

        const [{ data: cohortRows }, { data: lessonRows }, { data: questionRows }] = await Promise.all([
          supabase.from('cohorts').select('id, name, description, created_at').order('created_at', { ascending: false }),
          supabase
            .from('lessons')
            .select('id, title, status, created_at')
            .order('created_at', { ascending: false })
            .limit(6),
          supabase
            .from('questions')
            .select('id, question, created_at, answer, answered_at')
            .is('answer', null)
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

        if (!active) return;

        setCohorts(
          (cohortRows ?? []).map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description,
          })),
        );
        setLessons(
          (lessonRows ?? []).map((row) => ({
            id: row.id,
            title: row.title,
            status: row.status,
            created_at: row.created_at,
          })),
        );
        setQuestions(
          (questionRows ?? []).map((row) => ({
            id: row.id,
            question: row.question,
            createdAt: row.created_at,
            answer: row.answer,
            answeredAt: row.answered_at,
          })),
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Cohorts', value: cohorts.length },
      { label: 'Lessons', value: lessons.length },
      { label: 'Open questions', value: questions.length },
    ],
    [cohorts.length, lessons.length, questions.length],
  );

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <TabNav items={TEACHER_TABS} />
        <div>
          <h1 className="text-4xl font-serif text-ink">Teacher dashboard</h1>
          <p className="text-sm text-ink/70">Create, assign, and respond — all within Ìlọ̀.</p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <motion.article
            key={item.label}
            {...cardPop}
            className="rounded-2xl border border-ink/10 bg-white/95 p-5 text-center shadow-sm"
          >
            <p className="text-sm text-ink/60">{item.label}</p>
            <p className="text-4xl font-semibold text-primary">{item.value}</p>
          </motion.article>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif text-ink">Recent lessons</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {lessons.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink/10 bg-surface-50/80 p-4 text-sm text-ink/70">
              {loading ? 'Loading lessons…' : 'Create a lesson to see it here.'}
            </p>
          ) : (
            lessons.map((lesson) => (
              <motion.article
                key={lesson.id}
                {...cardPop}
                className="rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-sm"
              >
                <p className="text-lg font-semibold text-ink">{lesson.title}</p>
                <p className="text-xs text-ink/60">
                  {lesson.status ?? 'Draft'} ·{' '}
                  {lesson.created_at ? new Date(lesson.created_at).toLocaleDateString() : '—'}
                </p>
              </motion.article>
            ))
          )}
        </div>
      </section>

      <section id="questions" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif text-ink">Questions awaiting replies</h2>
        </div>
        <QuestionList questions={questions} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif text-ink">Your cohorts</h2>
        </div>
        <CohortList cohorts={cohorts} emptyState={loading ? 'Loading cohorts…' : 'Create your first cohort to begin.'} />
      </section>
    </div>
  );
}
