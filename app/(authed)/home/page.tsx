import BadgeRow from '../../../components/BadgeRow';
import StreakCounter from '../../../components/StreakCounter';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl">Welcome back</h1>
      <StreakCounter days={3} />
      <BadgeRow badges={[{ id: 'first', title: 'First Recording' }]} />
      <Link href="/lessons/1" className="block px-4 py-2 bg-primary text-paper rounded">
        Continue Lesson
      </Link>
    </main>
  );
}
