import { Card } from '@/components/ui/Card';
import ToneKeypad from '@/components/ToneKeypad';

export default function LessonPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-serif">Lesson {params.id}</h1>
      <Card>Lesson content...</Card>
      <ToneKeypad />
    </div>
  );
}
