import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Chip } from '@/components/ui/Chip';

export default function HomePage() {
  return (
    <div className="p-4 space-y-4">
      <Card
        header={<h2 className="text-xl font-bold">Continue lesson</h2>}
        footer={<ProgressBar value={40} />}
      >
        <p className="text-ink/80">Lesson 1</p>
      </Card>
      <div className="flex items-center gap-4">
        <Chip>🔥 Streak</Chip>
        <Chip>Goal: 10m</Chip>
      </div>
      <Card>
        <h3 className="font-bold">Fun Fact of the Week</h3>
        <p>Ọ̀rọ̀ Yorùbá...</p>
      </Card>
    </div>
  );
}
