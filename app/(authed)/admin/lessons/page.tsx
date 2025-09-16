'use client';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';

interface AdminLesson {
  id: string;
  title: string;
  module: string;
  publishedAt: string;
  mediaCount: number;
  vocabCount: number;
}

const LESSONS: AdminLesson[] = Array.from({ length: 8 }).map((_, index) => ({
  id: `lesson-${index + 1}`,
  title: index % 2 === 0 ? 'Ẹ káàárọ̀ greetings' : 'Báwo ni o ṣe ń rí? Feelings',
  module: index % 2 === 0 ? 'Greetings' : 'Feelings',
  publishedAt: new Date(Date.now() - index * 86_400_000).toISOString(),
  mediaCount: 4 - (index % 3),
  vocabCount: 6 + index,
}));

export default function AdminLessonsPage() {
  const pageMotion = usePageEnter();

  return (
    <motion.div {...pageMotion} className="space-y-8">
      <header className="space-y-3">
        <Chip tone="secondary" size="sm">
          Admin view
        </Chip>
        <h1 className="text-4xl font-serif">Recent published lessons</h1>
        <p className="text-lg text-ink/70">Readonly snapshot of the last 30 lessons for quick QA checks.</p>
      </header>
      <Card className="border border-ink/10 bg-white/85" bodyClassName="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink/10 text-left">
          <thead className="text-sm uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Media</th>
              <th className="px-4 py-3 text-right">Vocab</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 text-lg">
            {LESSONS.map((lesson) => (
              <tr key={lesson.id}>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <span className="font-semibold text-ink">{lesson.title}</span>
                    <p className="text-sm text-ink/60">ID: {lesson.id}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-ink/70">{lesson.module}</td>
                <td className="px-4 py-4 text-ink/70">
                  {new Date(lesson.publishedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-4 text-right font-semibold">{lesson.mediaCount}</td>
                <td className="px-4 py-4 text-right font-semibold">{lesson.vocabCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  );
}
