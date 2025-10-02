'use client';

import { useCardPop } from '@/lib/anim';
import Icon from '@/components/icons/Icon';
import { motion } from 'framer-motion';

export interface StudentListItem {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
  xp?: number | null;
  streak?: number | null;
}

interface StudentListProps {
  students: StudentListItem[];
  emptyLabel?: string;
}

export function StudentList({ students, emptyLabel = 'No students yet.' }: StudentListProps) {
  const cardPop = useCardPop();

  if (students.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/10 bg-surface-50/90 p-6 text-center text-sm text-ink/70">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {students.map((student) => (
        <motion.div
          key={student.id}
          {...cardPop}
          className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
            {student.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={student.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              student.displayName.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex flex-1 flex-col">
            <span className="text-lg font-semibold text-ink">{student.displayName}</span>
            <div className="text-xs text-ink/60">
              <span>{student.xp ?? 0} XP</span>
              {typeof student.streak === 'number' && student.streak > 0 ? (
                <span className="ml-3 inline-flex items-center gap-1">
                  <Icon name="star" size={14} aria-hidden />
                  {student.streak}-day streak
                </span>
              ) : null}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
