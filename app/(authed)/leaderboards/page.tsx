import LeaderboardTable from '@/components/LeaderboardTable';

const mock = [
  { rank: 1, name: 'Ada', xp: 120 },
  { rank: 2, name: 'Bisi', xp: 100 },
];

export default function LeaderboardsPage() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-serif">Leaderboards</h1>
      <LeaderboardTable entries={mock} />
    </div>
  );
}
