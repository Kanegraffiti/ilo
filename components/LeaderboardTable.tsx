import Image from 'next/image';

type Entry = { rank: number; name: string; xp: number; avatarUrl?: string };

export default function LeaderboardTable({ entries }: { entries: Entry[] }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-sm opacity-80">
          <th className="px-2 py-1">#</th>
          <th className="px-2 py-1">Name</th>
          <th className="px-2 py-1 text-right">XP</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.rank} className="odd:bg-surface-2">
            <td className="px-2 py-1">{e.rank}</td>
            <td className="px-2 py-1 flex items-center gap-2">
              {e.avatarUrl ? (
                <Image src={e.avatarUrl} alt="avatar" width={32} height={32} className="rounded-full" />
              ) : (
                <span className="inline-block h-8 w-8 rounded-full bg-secondary" aria-hidden="true" />
              )}
              {e.name}
            </td>
            <td className="px-2 py-1 text-right">{e.xp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
