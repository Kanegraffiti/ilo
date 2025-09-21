'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { QuizBlock, type QuizItem } from '@/components/QuizBlock';
import { useToast } from '@/components/ui/Toast';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { usePageEnter } from '@/lib/anim';
import { motion } from 'framer-motion';

interface LessonSummary {
  id: string;
  title: string;
}

export default function QuizPage({ params }: { params: { lessonId: string } }) {
  const [lesson, setLesson] = useState<LessonSummary | null>(null);
  const [items, setItems] = useState<QuizItem[]>([]);
  const { push } = useToast();
  const pageMotion = usePageEnter();

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id,title')
        .eq('id', params.lessonId)
        .maybeSingle();
      if (lessonData) {
        setLesson(lessonData as LessonSummary);
      }
      const { data: vocab } = await supabase
        .from('vocab')
        .select('id,term,meaning')
        .eq('lesson_id', params.lessonId);
      const generated: QuizItem[] = (vocab || []).map((v) => ({
        id: v.id,
        type: 'text',
        prompt: `Translate “${v.term}”`,
        answer: v.meaning,
        hint: 'Use the tone keypad for accents.',
      }));
      setItems(generated);
    };
    load();
  }, [params.lessonId]);

  const headerTitle = useMemo(() => lesson?.title ?? 'Loading lesson…', [lesson]);

  return (
    <motion.div {...pageMotion} className="space-y-6 bg-paper c-on-paper">
      <header className="space-y-2">
        <Chip tone="secondary" size="sm">
          Quick quiz
        </Chip>
        <h1 className="text-3xl font-serif">{headerTitle}</h1>
        <p className="text-lg opacity-80">Check understanding with instant feedback. Saved offline if the network drops.</p>
      </header>
      <Card bodyClassName="space-y-6">
        <QuizBlock
          items={items}
          onComplete={(score) => {
            if (!lesson) return;
            if (score === 100) {
              push({ title: '🎉 Perfect score!', description: 'Your answers are all correct.', tone: 'success' });
            } else {
              push({ title: 'Nice work!', description: `You scored ${score}%. Keep practicing.`, tone: 'info' });
            }
            fetch('/api/submissions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lesson_id: lesson.id, type: 'quiz', score }),
            }).catch(() => {
              push({ title: 'Saved offline', description: 'We will upload your quiz once online.', tone: 'info' });
            });
          }}
        />
      </Card>
    </motion.div>
  );
}
