import Image from 'next/image';

type Entry = { rank: number; name: string; xp: number; avatarUrl?: string };

export default function LeaderboardTable({ entries }: { entries: Entry[] }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-sm text-ink">
          <th className="px-2 py-1">#</th>
          <th className="px-2 py-1">Name</th>
          <th className="px-2 py-1 text-right">XP</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.rank} className="odd:bg-paper">
            <td className="px-2 py-1">{e.rank}</td>
            <td className="px-2 py-1 flex items-center gap-2">
              {e.avatarUrl ? (
                <Image src={e.avatarUrl} alt="avatar" width={32} height={32} className="rounded-full" />
              ) : (
                <span className="w-8 h-8 rounded-full bg-secondary inline-block" />
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
