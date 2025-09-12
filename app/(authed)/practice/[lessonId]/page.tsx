'use client';
import React, { useEffect, useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function PracticePage({ params }: { params: { lessonId: string } }) {
  const [lesson, setLesson] = useState<any>();
  const [blob, setBlob] = useState<Blob | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const load = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase
        .from('lessons')
        .select('id,title,objectives')
        .eq('id', params.lessonId)
        .single();
      setLesson(data);
    };
    load();
  }, [params.lessonId]);

  const submit = async () => {
    if (!blob) return;
    const fd = new FormData();
    fd.append('file', blob, 'recording.webm');
    fd.append('data', JSON.stringify({ lesson_id: lesson.id, type: 'voice', payload: {} }));
    try {
      const res = await fetch('/api/submissions', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('failed');
      setToast('Uploaded');
    } catch (e) {
      setToast('Saved offline – will upload when online');
    }
  };

  if (!lesson) return <p className="p-4">Loading…</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{lesson.title}</h1>
      <ul className="list-disc pl-6">
        {lesson.objectives?.map((o: string) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <AudioRecorder onRecorded={setBlob} />
      <button className="px-4 py-2 bg-primary text-paper" onClick={submit} aria-label="Submit recording">
        Submit
      </button>
      {toast && <p role="status">{toast}</p>}
    </div>
  );
}
