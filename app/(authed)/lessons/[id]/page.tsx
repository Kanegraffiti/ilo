import VocabList from '../../../../components/VocabList';

async function fetchLesson(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/lessons/${id}`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function LessonPage({ params }: { params: { id: string } }) {
  const { lesson, media, vocab } = await fetchLesson(params.id);
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl">{lesson.title}</h1>
      <ul className="list-disc ml-6">
        {lesson.objectives?.map((o: string) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      {media.map((m: any) => (
        <div key={m.id}>
          {/* TODO: signed URLs and media types */}
          <p>{m.kind}: {m.path}</p>
        </div>
      ))}
      <article className="prose" dangerouslySetInnerHTML={{ __html: lesson.notes_md || '' }} />
      <VocabList items={vocab} />
    </main>
  );
}
