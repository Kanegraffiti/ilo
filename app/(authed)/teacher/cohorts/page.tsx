'use client';

import { CohortList, type CohortSummary } from '@/components/CohortList';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TabNav } from '@/components/ui/TabNav';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { cohortCreateSchema } from '@/lib/zodSchemas';
import { useEffect, useState } from 'react';

const TEACHER_TABS = [
  { label: 'Dashboard', href: '/teacher/dashboard' },
  { label: 'Lessons', href: '/teacher/lessons' },
  { label: 'Cohorts', href: '/teacher/cohorts' },
  { label: 'Questions', href: '/teacher/dashboard#questions' },
];

export default function TeacherCohortsPage() {
  const [cohorts, setCohorts] = useState<CohortSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      setFormError(null);
      setSubmitting(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = supabaseBrowser();
      const { data } = await supabase.from('cohorts').select('id, name, description').order('created_at', { ascending: false });
      if (!active) return;
      setCohorts((data ?? []).map((row) => ({ id: row.id, name: row.name, description: row.description })));
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const parsed = cohortCreateSchema.safeParse({ name: formName, description: formDescription });
    if (!parsed.success) {
      const message = parsed.error.flatten().fieldErrors.name?.[0] || parsed.error.flatten().formErrors[0];
      setFormError(message ?? 'Please check the details.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/cohorts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        setFormError(body.message || 'Unable to create cohort right now.');
      } else {
        setCohorts((prev) => [{ ...body.cohort, studentCount: 0 }, ...prev]);
        setModalOpen(false);
        setFormName('');
        setFormDescription('');
      }
    } catch (error) {
      console.error(error);
      setFormError('Unable to create cohort right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <TabNav items={TEACHER_TABS} />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-serif text-ink">Cohorts</h1>
          <p className="text-sm text-ink/70">Invite learners and keep an eye on progress.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>New cohort</Button>
      </header>

      <CohortList cohorts={cohorts} emptyState={loading ? 'Loading cohorts…' : 'No cohorts yet. Create one to begin.'} />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create cohort">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cohort-name" className="text-sm font-semibold text-ink">
              Name
            </label>
            <input
              id="cohort-name"
              required
              value={formName}
              onChange={(event) => setFormName(event.target.value)}
              className="h-12 w-full rounded-2xl border border-ink/10 bg-white/95 px-4 text-base text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="cohort-description" className="text-sm font-semibold text-ink">
              Description
            </label>
            <textarea
              id="cohort-description"
              value={formDescription}
              onChange={(event) => setFormDescription(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-ink/10 bg-white/95 px-4 py-3 text-base text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/30"
              placeholder="Saturday enrichment group"
            />
          </div>
          {formError ? <p className="rounded-2xl bg-error/10 px-3 py-2 text-sm font-semibold text-error">{formError}</p> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create cohort'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
