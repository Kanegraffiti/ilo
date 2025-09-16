'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';

interface Entry {
  id: string;
  name: string;
  xp: number;
  module: string;
}

const WEEKLY: Entry[] = [
  { id: '1', name: 'Adé', xp: 320, module: 'greetings' },
  { id: '2', name: 'Bólú', xp: 280, module: 'greetings' },
  { id: '3', name: 'Chioma', xp: 250, module: 'feelings' },
  { id: '4', name: 'Dáre', xp: 200, module: 'songs' },
];

const ALL_TIME: Entry[] = [
  { id: 'a', name: 'Adé', xp: 2400, module: 'greetings' },
  { id: 'b', name: 'Chioma', xp: 2200, module: 'feelings' },
  { id: 'c', name: 'Imole', xp: 2100, module: 'songs' },
  { id: 'd', name: 'Temi', xp: 1950, module: 'games' },
];

const MODULES = [
  { value: 'all', label: 'All modules' },
  { value: 'greetings', label: 'Greetings' },
  { value: 'feelings', label: 'Feelings' },
  { value: 'songs', label: 'Songs & rhymes' },
  { value: 'games', label: 'Games' },
];

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<'week' | 'all'>('week');
  const [moduleFilter, setModuleFilter] = useState('all');
  const pageMotion = usePageEnter();

  const data = useMemo(() => {
    const source = tab === 'week' ? WEEKLY : ALL_TIME;
    const sorted = [...source].sort((a, b) => b.xp - a.xp);
    if (moduleFilter === 'all') return sorted;
    return sorted.filter((entry) => entry.module === moduleFilter);
  }, [tab, moduleFilter]);

  return (
    <motion.div {...pageMotion} className="space-y-8">
      <header className="space-y-3">
        <Chip tone="accent" size="sm">
          Friendly competition
        </Chip>
        <h1 className="text-4xl font-serif">Leaderboards</h1>
        <p className="text-lg text-ink/70">Celebrate effort, not pressure. Kids earn XP for daily practice and kindness.</p>
      </header>

      <div role="tablist" aria-label="Leaderboard timeframe" className="flex gap-3">
        <Button variant={tab === 'week' ? 'primary' : 'ghost'} size="md" onClick={() => setTab('week')}>
          This week
        </Button>
        <Button variant={tab === 'all' ? 'primary' : 'ghost'} size="md" onClick={() => setTab('all')}>
          All time
        </Button>
      </div>

      <Select
        label="Module"
        value={moduleFilter}
        onChange={(event) => setModuleFilter(event.target.value)}
      >
        {MODULES.map((mod) => (
          <option key={mod.value} value={mod.value}>
            {mod.label}
          </option>
        ))}
      </Select>

      {data.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No explorers yet"
          description="Invite kids to start the module to see points roll in."
          action={<Button href="/kids">Add a child</Button>}
        />
      ) : (
        <Card className="border border-ink/10 bg-white/85" bodyClassName="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink/10">
            <thead className="text-left text-sm uppercase tracking-wide text-ink/60">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Learner</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3 text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 text-lg">
              {data.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-primary/5">
                  <td className="px-4 py-4 font-semibold text-primary">#{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 font-semibold text-secondary">
                        {entry.name.charAt(0)}
                      </span>
                      <span>{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-ink/70 capitalize">{entry.module.replace('-', ' ')}</td>
                  <td className="px-4 py-4 text-right font-semibold">{entry.xp.toLocaleString()} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </motion.div>
  );
}
