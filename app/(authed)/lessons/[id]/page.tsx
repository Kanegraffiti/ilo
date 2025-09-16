import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { VocabList } from '@/components/VocabList';
import { ToneKeypad } from '@/components/ToneKeypad';
import { OfflineNotice } from '@/components/OfflineNotice';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Lesson {
  id: string;
  title: string;
  objectives: string[];
  notes: string[];
  vocab: { id: string; term: string; translation: string }[];
  prevId?: string;
  nextId?: string;
}

const LESSONS: Lesson[] = [
  {
    id: 'intro',
    title: 'Ẹ káàárọ̀ greetings',
    objectives: ['Greet elders respectfully', 'Match tone marks to sound'],
    notes: [
      'Start by modelling the greeting slowly: “Ẹ káàárọ̀.” Have children repeat the rising tone on the last syllable.',
      'Use mirrors or gestures to encourage posture—hands together or small bow shows respect.',
    ],
    vocab: [
      { id: 'ora', term: 'Ẹ káàárọ̀', translation: 'Good morning' },
      { id: 'osan', term: 'Ẹ káàsán', translation: 'Good afternoon' },
      { id: 'ale', term: 'Ẹ káalẹ́', translation: 'Good evening' },
    ],
    nextId: 'feelings',
  },
  {
    id: 'feelings',
    title: 'Báwo ni o ṣe ń rí? Feelings check-in',
    objectives: ['Share feelings politely', 'Use Yorùbá nasal sounds'],
    notes: [
      'Introduce feelings vocabulary with emotive gestures. Encourage kids to point to emojis that match their mood.',
      'Model the nasal “ń” sound slowly. Pair with ToneKeypad entries for practice.',
    ],
    vocab: [
      { id: 'dara', term: 'Mo wà dáadáa', translation: 'I am fine' },
      { id: 'nu', term: 'Inú mi dùn', translation: 'I am happy' },
      { id: 'binu', term: 'Inú mi bínú díẹ̀', translation: 'I feel upset a little' },
    ],
    prevId: 'intro',
  },
];

function getLesson(id: string) {
  return LESSONS.find((lesson) => lesson.id === id);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const lesson = getLesson(params.id);
  if (!lesson) {
    return { title: 'Lesson not found · Ìlọ̀' };
  }
  return { title: `${lesson.title} · Ìlọ̀` };
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const lesson = getLesson(params.id);
  if (!lesson) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Chip tone="accent" size="sm">
          Lesson module
        </Chip>
        <h1 className="text-4xl font-serif">{lesson.title}</h1>
        <div className="flex flex-wrap gap-2">
          {lesson.objectives.map((objective) => (
            <Chip key={objective} tone="secondary" size="sm">
              {objective}
            </Chip>
          ))}
        </div>
      </header>

      <OfflineNotice />

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border border-ink/10 bg-white/85" bodyClassName="space-y-4">
          <h2 className="text-2xl font-serif">Teaching notes</h2>
          <div className="prose max-w-none prose-lg text-ink/80">
            {lesson.notes.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Card>
        <Card className="border border-ink/10 bg-secondary/10" bodyClassName="space-y-4">
          <h2 className="text-2xl font-serif">Media gallery</h2>
          <div className="grid gap-4">
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-secondary/40 bg-white/80 p-6 text-center text-lg text-secondary">
              Signed audio + story visuals download on first view. Offline placeholder shown when not connected.
            </div>
            <Button variant="secondary" size="md">Download printable</Button>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif">Vocabulary practice</h2>
        <VocabList items={lesson.vocab} />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-serif">Practice writing tones</h2>
        <Card className="border border-ink/10 bg-white/85" bodyClassName="space-y-4">
          <label htmlFor="tone-practice" className="text-lg font-semibold text-ink">
            Write your greeting here
          </label>
          <textarea
            id="tone-practice"
            className="min-h-[140px] w-full rounded-2xl border border-ink/10 bg-white/90 p-4 text-lg text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/30"
            placeholder="Ẹ káàárọ̀, bàbá mi."
          />
          <ToneKeypad targetId="tone-practice" />
        </Card>
      </section>

      <nav className="sticky bottom-4 z-20 flex flex-wrap gap-4 rounded-2xl border border-ink/10 bg-paper/95 p-4 shadow-md" aria-label="Lesson pagination">
        <Button
          href={lesson.prevId ? `/lessons/${lesson.prevId}` : '#'}
          variant="ghost"
          size="md"
          disabled={!lesson.prevId}
        >
          ← Previous lesson
        </Button>
        <Button
          href={lesson.nextId ? `/lessons/${lesson.nextId}` : '#'}
          variant="primary"
          size="md"
          disabled={!lesson.nextId}
        >
          Next lesson →
        </Button>
      </nav>
    </div>
  );
}

