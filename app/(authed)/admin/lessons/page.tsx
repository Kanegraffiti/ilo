import Image from 'next/image';
import { supabaseServer } from '../../../../lib/supabaseServer';

export default async function AdminLessonsPage() {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from('lessons')
    .select('id,title,published_at,modules(title),lesson_media(kind,path),vocab(id)')
    .eq('status', 'Published')
    .order('published_at', { ascending: false })
    .limit(20);

  const lessons = await Promise.all(
    (data || []).map(async (l: any) => {
      const img = l.lesson_media?.find((m: any) => m.kind === 'image');
      let preview: string | undefined;
      if (img) {
        const { data: urlData } = await supabase.storage
          .from('lesson-media')
          .createSignedUrl(img.path, 60);
        preview = urlData?.signedUrl;
      }
      return {
        ...l,
        preview,
        mediaCount: l.lesson_media?.length || 0,
        vocabCount: l.vocab?.length || 0,
      };
    })
  );

  return (
    <main className="p-4">
      <h1 className="text-2xl mb-4">Published Lessons</h1>
      <table className="min-w-full text-left border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Preview</th>
            <th className="p-2">Title</th>
            <th className="p-2">Module</th>
            <th className="p-2">Published</th>
            <th className="p-2">Media</th>
            <th className="p-2">Vocab</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((l: any) => (
            <tr key={l.id} className="border-b">
              <td className="p-2 w-24">
                {l.preview && (
                  <Image
                    src={l.preview}
                    alt="preview"
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover"
                  />
                )}
              </td>
              <td className="p-2">{l.title}</td>
              <td className="p-2">{l.modules?.title}</td>
              <td className="p-2">{l.published_at?.slice(0, 10)}</td>
              <td className="p-2">{l.mediaCount}</td>
              <td className="p-2">{l.vocabCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
