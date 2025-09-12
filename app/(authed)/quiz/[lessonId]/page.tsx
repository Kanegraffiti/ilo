'use client';
import React, { useEffect, useState } from 'react';
import QuizBlock, { QuizItem } from '@/components/QuizBlock';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function QuizPage({ params }: { params: { lessonId: string } }) {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [lesson, setLesson] = useState<any>();
  const [toast, setToast] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id,title')
        .eq('id', params.lessonId)
        .single();
      setLesson(lessonData);
      const { data: vocab } = await supabase
        .from('vocab')
        .select('id,term,meaning')
        .eq('lesson_id', params.lessonId);
      const qs: QuizItem[] = (vocab || []).map((v) => ({
        id: v.id,
        type: 'text',
        question: `Translate "${v.term}"`,
        answer: v.meaning,
      }));
      setItems(qs);
    };
    load();
  }, [params.lessonId]);

  const handleComplete = async (score: number, payload: Record<string, string>) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: lesson.id, type: 'quiz', score: Math.round(score * 100), payload }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('failed');
      if (score === 1) setToast('🎉 Perfect score!');
    } catch (e) {
      setToast('Saved offline – will upload when online');
    }
  };

  if (!lesson) return <p className="p-4">Loading…</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{lesson.title}</h1>
      <QuizBlock items={items} onComplete={handleComplete} />
      {toast && <p role="status">{toast}</p>}
    </div>
  );
}
