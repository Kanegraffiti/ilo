'use client';

import { CohortList, type CohortSummary } from '@/components/CohortList';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useEffect, useState } from 'react';

interface ChildOption {
  id: string;
  label: string;
  kind: 'user' | 'child';
}

export default function CohortsHomePage() {
  const [cohorts, setCohorts] = useState<CohortSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinOwner, setJoinOwner] = useState<ChildOption | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [options, setOptions] = useState<ChildOption[]>([]);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const supabase = supabaseBrowser();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const [profileRes, childrenRes] = await Promise.all([
        supabase.from('user_profiles').select('id, display_name').eq('user_id', userData.user.id).maybeSingle(),
        supabase.from('child_profiles').select('id, nickname'),
      ]);

      if (!active) return;

      const ownerOptions: ChildOption[] = [];
      if (profileRes.data) {
        ownerOptions.push({ id: profileRes.data.id, label: profileRes.data.display_name ?? 'Me', kind: 'user' });
      }
      (childrenRes.data ?? []).forEach((child) => {
        ownerOptions.push({ id: child.id, label: child.nickname ?? 'Child', kind: 'child' });
      });
      setOptions(ownerOptions);
      setJoinOwner(ownerOptions[0] ?? null);

      if (profileRes.data) {
        const { data } = await supabase
          .from('cohort_enrollments')
          .select('cohort_id, cohorts(id, name, description)')
          .eq('owner_id', profileRes.data.id);
        const cohortSummaries: CohortSummary[] = [];
        (data ?? []).forEach((row: any) => {
          if (row.cohorts) {
            cohortSummaries.push({
              id: row.cohorts.id,
              name: row.cohorts.name,
              description: row.cohorts.description,
            });
          }
        });
        setCohorts(cohortSummaries);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!joinOpen) {
      setJoinCode('');
      setJoinError(null);
      setSubmitting(false);
    }
  }, [joinOpen]);

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!joinOwner) {
      setJoinError('Select who should join this cohort.');
      return;
    }
    if (!joinCode) {
      setJoinError('Enter a cohort code.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/cohorts/${joinCode}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerKind: joinOwner.kind, ownerId: joinOwner.id }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        setJoinError(body.message || 'Unable to join this cohort.');
      } else {
        const supabase = supabaseBrowser();
        const { data } = await supabase.from('cohorts').select('id, name, description').eq('id', joinCode).maybeSingle();
        if (data) {
          setCohorts((prev) => {
            if (prev.some((cohort) => cohort.id === data.id)) {
              return prev;
            }
            return [{ id: data.id, name: data.name, description: data.description }, ...prev];
          });
        }
        setJoinOpen(false);
      }
    } catch (error) {
      console.error(error);
      setJoinError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-serif text-ink">Your cohorts</h1>
          <p className="text-sm text-ink/70">Join classes shared by your teacher and track progress.</p>
        </div>
        <Button onClick={() => setJoinOpen(true)}>Join class</Button>
      </header>

      <CohortList cohorts={cohorts} hrefBase="/cohorts" emptyState={loading ? 'Loading cohorts…' : 'No cohorts yet.'} />

      <Modal isOpen={joinOpen} onClose={() => setJoinOpen(false)} title="Join a cohort">
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="join-code" className="text-sm font-semibold text-ink">
              Cohort code
            </label>
            <input
              id="join-code"
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value)}
              className="h-12 w-full rounded-2xl border border-ink/10 bg-white/95 px-4 text-base focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/30"
              placeholder="Paste the invite code"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="join-owner" className="text-sm font-semibold text-ink">
              Who is joining?
            </label>
            <select
              id="join-owner"
              value={joinOwner?.id ?? ''}
              onChange={(event) => {
                const selected = options.find((option) => option.id === event.target.value);
                setJoinOwner(selected ?? null);
              }}
              className="h-12 w-full rounded-2xl border border-ink/10 bg-white/95 px-4 text-base focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {joinError ? <p className="rounded-2xl bg-error/10 px-4 py-2 text-sm font-semibold text-error">{joinError}</p> : null}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setJoinOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Joining…' : 'Join cohort'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
