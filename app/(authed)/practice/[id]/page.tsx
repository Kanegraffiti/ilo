import AudioRecorder from '../../../../components/AudioRecorder';
import QuizBlock, { QuizItem } from '../../../../components/QuizBlock';
import Flashcards from '../../../../components/Flashcards';

export default function PracticePage({ params }: { params: { id: string } }) {
  const quiz: QuizItem[] = [
    { id: '1', type: 'mcq', question: 'Translate Hello', options: ['Bawo', 'Kaabo'], answer: 'Kaabo' },
    { id: '2', type: 'text', question: 'Type Yoruba for thank you', answer: 'ẹ se' },
  ];
  const vocab = [
    { id: '1', term: 'Báwo', meaning: 'Hello' },
    { id: '2', term: 'Ẹ ṣé', meaning: 'Thank you' },
  ];
  return (
    <main className="p-4 space-y-6">
      <h1 className="text-2xl mb-4">Practice</h1>
      <section>
        <h2 className="text-xl mb-2">Pronunciation</h2>
        <AudioRecorder onRecorded={() => {}} />
      </section>
      <section>
        <h2 className="text-xl mb-2">Quiz</h2>
        <QuizBlock items={quiz} />
      </section>
      <section>
        <h2 className="text-xl mb-2">Flashcards</h2>
        <Flashcards items={vocab} />
      </section>
    </main>
  );
}
