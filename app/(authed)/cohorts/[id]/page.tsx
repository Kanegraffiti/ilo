'use client';

import { Button } from '@/components/ui/Button';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useEffect, useMemo, useState } from 'react';

interface LessonItem {
  id: string;
  title: string;
  status?: string | null;
}

interface CohortInfo {
  id: string;
  name: string;
  description?: string | null;
}

export default function CohortDetailPage({ params }: { params: { id: string } }) {
  const [cohort, setCohort] = useState<CohortInfo | null>(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = supabaseBrowser();
      const { data: cohortRow } = await supabase.from('cohorts').select('id, name, description').eq('id', params.id).maybeSingle();
      if (cohortRow && active) {
        setCohort(cohortRow);
      }
      const { data: lessonRows } = await supabase
        .from('lessons')
        .select('id, title, status')
        .order('created_at', { ascending: true })
        .limit(20);
      if (active) {
        setLessons((lessonRows ?? []).map((row) => ({ id: row.id, title: row.title, status: row.status })));
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [params.id]);

  const publishedLessons = useMemo(() => lessons.filter((lesson) => (lesson.status ?? '').toLowerCase() === 'published'), [lessons]);

  return (
    <div className="space-y-6">
      {cohort ? (
        <header className="space-y-2">
          <h1 className="text-4xl font-serif text-ink">{cohort.name}</h1>
          {cohort.description ? <p className="text-sm text-ink/70">{cohort.description}</p> : null}
        </header>
      ) : (
        <p className="rounded-2xl border border-ink/10 bg-surface-50/80 p-4 text-sm text-ink/70">
          {loading ? 'Loading cohort…' : 'We could not find that cohort.'}
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-2xl font-serif text-ink">Assigned lessons</h2>
        {loading ? (
          <p className="rounded-2xl border border-dashed border-ink/10 bg-white/95 p-4 text-sm text-ink/70">Loading lessons…</p>
        ) : publishedLessons.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/10 bg-white/95 p-4 text-sm text-ink/70">
            Lessons assigned to this cohort will appear here.
          </p>
        ) : (
          <ul className="space-y-3">
            {publishedLessons.map((lesson) => (
              <li key={lesson.id} className="rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-ink">{lesson.title}</p>
                    <p className="text-xs text-ink/60">{lesson.status}</p>
                  </div>
                  <Button href={`/lessons/${lesson.id}`} variant="secondary" size="sm">
                    Open lesson
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-serif text-ink">Upcoming live sessions</h2>
        <p className="rounded-2xl border border-dashed border-ink/10 bg-white/95 p-4 text-sm text-ink/70">
          Your teacher will share live session details here once scheduled.
        </p>
      </section>
    </div>
  );
}
