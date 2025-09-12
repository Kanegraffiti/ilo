import { Card } from '@/components/ui/Card';

const lessons = [
  { id: 1, title: 'Intro', media: 3 },
  { id: 2, title: 'Greetings', media: 5 },
];

export default function AdminLessonsPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-serif">Lessons</h1>
      <Card>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Media</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{l.title}</td>
                <td className="p-2">{l.media}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
