import { TeacherLessonForm } from '@/components/TeacherLessonForm';
import { TabNav } from '@/components/ui/TabNav';

const TEACHER_TABS = [
  { label: 'Dashboard', href: '/teacher/dashboard' },
  { label: 'Lessons', href: '/teacher/lessons' },
  { label: 'Cohorts', href: '/teacher/cohorts' },
  { label: 'Questions', href: '/teacher/dashboard#questions' },
];

export default function TeacherLessonCreatePage() {
  return (
    <div className="space-y-6">
      <TabNav items={TEACHER_TABS} />
      <header className="space-y-2">
        <h1 className="text-4xl font-serif text-ink">Create a lesson</h1>
        <p className="text-sm text-ink/70">
          Design rich learning experiences with objectives, vocab, and media.
        </p>
      </header>
      <TeacherLessonForm submitLabel="Publish lesson" />
    </div>
  );
}
