import { supabaseServer } from '@/lib/supabaseServer';

export default async function AdminLessonsPage() {
  if (process.env.NODE_ENV === 'production') {
    return <p className="p-4">Admin access disabled in production.</p>;
  }
  const supabase = supabaseServer();
  const { data } = await supabase
    .from('lessons')
    .select('id,title,published_at,modules(title),lesson_media(path),vocab(id)')
    .eq('status', 'Published')
    .order('published_at', { ascending: false })
    .limit(30);
  const lessons = await Promise.all(
    (data || []).map(async (l) => {
      const mediaCount = l.lesson_media?.length || 0;
      const vocabCount = l.vocab?.length || 0;
      const thumb = l.lesson_media?.[0]?.path;
      let thumbUrl: string | undefined;
      if (thumb) {
        const { data: url } = await supabase.storage
          .from('lesson-media')
          .createSignedUrl(thumb, 60);
        thumbUrl = url?.signedUrl;
      }
      return { ...l, mediaCount, vocabCount, thumbUrl };
    })
  );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Recent Lessons</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border">Module</th>
            <th className="p-2 border">Lesson</th>
            <th className="p-2 border">Published</th>
            <th className="p-2 border">Media</th>
            <th className="p-2 border">Vocab</th>
            <th className="p-2 border">Thumbnail</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((l: any) => (
            <tr key={l.id} className="border-t">
              <td className="p-2 border">{l.modules?.title}</td>
              <td className="p-2 border">{l.title}</td>
              <td className="p-2 border">{new Date(l.published_at).toLocaleString()}</td>
              <td className="p-2 border">{l.mediaCount}</td>
              <td className="p-2 border">{l.vocabCount}</td>
              <td className="p-2 border">
                {l.thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.thumbUrl} alt="thumb" className="w-12 h-12 object-cover" />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
