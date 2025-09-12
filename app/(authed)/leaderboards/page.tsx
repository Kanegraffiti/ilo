'use client';
import { useState } from 'react';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';

const mock = [
  { rank: 1, name: 'Ada', xp: 120 },
  { rank: 2, name: 'Bisi', xp: 100 },
];

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<'week' | 'all'>('week');
  const data = mock;
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-serif">Leaderboards</h1>
      <div className="flex gap-2">
        <Button variant={tab === 'week' ? 'primary' : 'secondary'} onClick={() => setTab('week')}>
          This Week
        </Button>
        <Button variant={tab === 'all' ? 'primary' : 'secondary'} onClick={() => setTab('all')}>
          All-Time
        </Button>
      </div>
      <Select label="Module" options={[{ value: '1', label: 'Module 1' }]} />
      {data.length ? (
        <LeaderboardTable entries={data} />
      ) : (
        <EmptyState icon="📭" title="No data" />
      )}
    </div>
  );
}
