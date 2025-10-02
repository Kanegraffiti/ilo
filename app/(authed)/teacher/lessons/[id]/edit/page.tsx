'use client';

import { TeacherLessonForm } from '@/components/TeacherLessonForm';
import { TabNav } from '@/components/ui/TabNav';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useEffect, useState } from 'react';

interface LessonFormState {
  title: string;
  status: 'draft' | 'published';
  moduleId?: string;
  moduleTitle?: string;
  objectives: string[];
  notesMd: string;
  vocab: { term: string; translation: string }[];
}

const TEACHER_TABS = [
  { label: 'Dashboard', href: '/teacher/dashboard' },
  { label: 'Lessons', href: '/teacher/lessons' },
  { label: 'Cohorts', href: '/teacher/cohorts' },
  { label: 'Questions', href: '/teacher/dashboard#questions' },
];

export default function TeacherLessonEditPage({ params }: { params: { id: string } }) {
  const [initialValues, setInitialValues] = useState<LessonFormState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = supabaseBrowser();
      const { data } = await supabase
        .from('lessons')
        .select('id, title, status, module_id, notes_md, objectives, modules(title), vocab(term, meaning)')
        .eq('id', params.id)
        .single();

      if (!active) return;

      if (data) {
        setInitialValues({
          title: data.title,
          status: (data.status ?? 'Draft').toLowerCase() === 'published' ? 'published' : 'draft',
          moduleId: data.module_id ?? undefined,
          moduleTitle: data.modules?.title ?? undefined,
          objectives: Array.isArray(data.objectives) ? data.objectives : [],
          notesMd: data.notes_md ?? '',
          vocab: (data.vocab ?? []).map((item: any) => ({ term: item.term, translation: item.meaning })),
        });
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <div className="space-y-6">
      <TabNav items={TEACHER_TABS} />
      <header className="space-y-2">
        <h1 className="text-4xl font-serif text-ink">Edit lesson</h1>
        <p className="text-sm text-ink/70">Update notes, objectives, or upload new media.</p>
      </header>
      {loading ? (
        <p className="rounded-2xl border border-ink/10 bg-surface-50/80 p-4 text-sm text-ink/70">Loading lesson…</p>
      ) : initialValues ? (
        <TeacherLessonForm lessonId={params.id} initialValues={initialValues} submitLabel="Save changes" />
      ) : (
        <p className="rounded-2xl border border-ink/10 bg-error/10 p-4 text-sm font-semibold text-error">
          We could not find that lesson.
        </p>
      )}
    </div>
  );
}
