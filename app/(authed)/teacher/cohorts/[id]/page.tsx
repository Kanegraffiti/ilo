'use client';

import { StudentList, type StudentListItem } from '@/components/StudentList';
import { Button } from '@/components/ui/Button';
import { TabNav } from '@/components/ui/TabNav';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useEffect, useMemo, useState } from 'react';

const TEACHER_TABS = [
  { label: 'Dashboard', href: '/teacher/dashboard' },
  { label: 'Lessons', href: '/teacher/lessons' },
  { label: 'Cohorts', href: '/teacher/cohorts' },
  { label: 'Questions', href: '/teacher/dashboard#questions' },
];

interface CohortDetail {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
}

export default function TeacherCohortDetailPage({ params }: { params: { id: string } }) {
  const [cohort, setCohort] = useState<CohortDetail | null>(null);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const inviteLink = useMemo(() => `${typeof window !== 'undefined' ? window.location.origin : ''}/cohorts/${params.id}`, [params.id]);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = supabaseBrowser();
      const [{ data: cohortRow }, studentsRes] = await Promise.all([
        supabase.from('cohorts').select('id, name, description, created_at').eq('id', params.id).maybeSingle(),
        fetch(`/api/cohorts/${params.id}/students`).then((res) => res.json()),
      ]);

      if (!active) return;

      if (cohortRow) {
        setCohort(cohortRow);
      }

      if (studentsRes?.ok && Array.isArray(studentsRes.students)) {
        setStudents(
          studentsRes.students.map((student: any) => ({
            id: student.id,
            displayName: student.displayName,
            avatarUrl: student.avatarUrl,
            xp: student.xp,
            streak: student.streak,
          })),
        );
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
      {cohort ? (
        <header className="space-y-2">
          <h1 className="text-4xl font-serif text-ink">{cohort.name}</h1>
          {cohort.description ? <p className="text-sm text-ink/70">{cohort.description}</p> : null}
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink/60">
            <span>Created {cohort.created_at ? new Date(cohort.created_at).toLocaleDateString() : '—'}</span>
            <span>·</span>
            <span>{students.length} learners</span>
          </div>
        </header>
      ) : (
        <p className="rounded-2xl border border-ink/10 bg-surface-50/80 p-4 text-sm text-ink/70">
          {loading ? 'Loading cohort…' : 'Cohort not found.'}
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-2xl font-serif text-ink">Invite link</h2>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white/95 p-4 shadow-sm">
          <code className="flex-1 truncate text-sm text-ink/80">{inviteLink}</code>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (typeof navigator !== 'undefined') {
                navigator.clipboard.writeText(inviteLink).catch(() => undefined);
              }
            }}
          >
            Copy
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif text-ink">Learners</h2>
        </div>
        <StudentList students={students} emptyLabel={loading ? 'Loading students…' : 'No learners enrolled yet.'} />
      </section>
    </div>
  );
}
