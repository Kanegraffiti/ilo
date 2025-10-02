'use client';

import { Button } from '@/components/ui/Button';
import { TabNav } from '@/components/ui/TabNav';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LessonRow {
  id: string;
  title: string;
  status?: string | null;
  module_id?: string | null;
  module_title?: string | null;
  created_at?: string | null;
}

const TEACHER_TABS = [
  { label: 'Dashboard', href: '/teacher/dashboard' },
  { label: 'Lessons', href: '/teacher/lessons' },
  { label: 'Cohorts', href: '/teacher/cohorts' },
  { label: 'Questions', href: '/teacher/dashboard#questions' },
];

export default function TeacherLessonsPage() {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
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

      const { data } = await supabase
        .from('lessons')
        .select('id, title, status, module_id, created_at, modules(title)')
        .order('created_at', { ascending: false });

      if (!active) return;

      setLessons(
        (data ?? []).map((row: any) => ({
          id: row.id,
          title: row.title,
          status: row.status,
          module_id: row.module_id,
          module_title: (row as any).modules?.title ?? null,
          created_at: row.created_at,
        })),
      );
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <TabNav items={TEACHER_TABS} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-serif text-ink">Manage lessons</h1>
            <p className="text-sm text-ink/70">Draft, publish, and keep track of your content.</p>
          </div>
          <Button href="/teacher/lessons/new">Create lesson</Button>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white/95 shadow-sm">
        <table className="min-w-full divide-y divide-ink/10">
          <thead className="bg-surface-100/70 text-left text-xs font-semibold uppercase tracking-wide text-ink/60">
            <tr>
              <th scope="col" className="px-4 py-3">
                Title
              </th>
              <th scope="col" className="px-4 py-3">
                Module
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Created
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {lessons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-ink/70">
                  {loading ? 'Loading lessons…' : 'No lessons yet. Start by creating one!'}
                </td>
              </tr>
            ) : (
              lessons.map((lesson) => (
                <tr key={lesson.id} className="text-sm text-ink">
                  <td className="px-4 py-3 font-semibold">{lesson.title}</td>
                  <td className="px-4 py-3 text-ink/70">{lesson.module_title ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        (lesson.status ?? '').toLowerCase() === 'published'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {lesson.status ?? 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/60">
                    {lesson.created_at ? new Date(lesson.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/teacher/lessons/${lesson.id}/edit`}
                      className="text-sm font-semibold text-primary hover:text-primary/80"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
