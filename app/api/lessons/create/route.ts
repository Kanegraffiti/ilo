import { randomUUID } from 'crypto';
import { rateLimit } from '@/lib/rateLimit';
import { getUserFromRequest, supabaseServer } from '@/lib/supabaseServer';
import { lessonUpsertSchema } from '@/lib/zodSchemas';

export const runtime = 'nodejs';

const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_LESSON_BUCKET ?? 'lesson-media';

function mediaKindFromMime(mime: string) {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';
  return 'document';
}

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0]?.trim();
  if (!rateLimit(`lesson:create:${ip}`, 15, 60000).ok) {
    return Response.json({ ok: false, message: 'Please slow down a little before creating more lessons.' }, { status: 429 });
  }

  const payload = await req.json().catch(() => undefined);
  const parsed = lessonUpsertSchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.flatten().formErrors[0] || 'Please review the lesson details and try again.';
    return Response.json({ ok: false, message }, { status: 400 });
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return Response.json({ ok: false, message: 'Sign in required.' }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'teacher') {
    return Response.json({ ok: false, message: 'Only teachers can create lessons.' }, { status: 403 });
  }

  let moduleId = parsed.data.moduleId ?? null;
  if (!moduleId && parsed.data.moduleTitle) {
    const { data: module, error: moduleError } = await supabase
      .from('modules')
      .insert({ title: parsed.data.moduleTitle })
      .select('id')
      .single();
    if (moduleError || !module) {
      console.error('Create module error', moduleError?.message);
      return Response.json({ ok: false, message: 'Unable to create the module for this lesson.' }, { status: 500 });
    }
    moduleId = module.id;
  }

  const statusValue = parsed.data.status === 'published' ? 'Published' : 'Draft';
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .insert({
      module_id: moduleId,
      title: parsed.data.title,
      status: statusValue,
      notes_md: parsed.data.notesMd,
      objectives: parsed.data.objectives,
      published_at: statusValue === 'Published' ? new Date().toISOString() : null,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (lessonError || !lesson) {
    console.error('Create lesson error', lessonError?.message);
    return Response.json({ ok: false, message: 'Unable to save the lesson.' }, { status: 500 });
  }

  if (parsed.data.vocab.length) {
    const vocabRows = parsed.data.vocab.map((entry) => ({
      lesson_id: lesson.id,
      term: entry.term,
      meaning: entry.translation,
    }));
    const { error: vocabError } = await supabase.from('vocab').insert(vocabRows);
    if (vocabError) {
      console.error('Vocab insert error', vocabError.message);
    }
  }

  const uploadUrls: { path: string; url: string }[] = [];
  if (parsed.data.media.length) {
    const mediaRows = [] as { lesson_id: string; kind: string; path: string; mime: string }[];

    for (const file of parsed.data.media) {
      const safeName = file.fileName.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
      const path = `${lesson.id}/${Date.now()}-${randomUUID()}-${safeName}`;
      const kind = mediaKindFromMime(file.contentType);
      mediaRows.push({ lesson_id: lesson.id, kind, path, mime: file.contentType });
      const { data: signed, error: signedError } = await supabase
        .storage
        .from(MEDIA_BUCKET)
        .createSignedUploadUrl(path, 60 * 5);
      if (signedError || !signed) {
        console.error('Signed upload error', signedError?.message);
        continue;
      }
      uploadUrls.push({ path, url: signed.signedUrl });
    }

    if (mediaRows.length) {
      const { error: mediaError } = await supabase.from('lesson_media').insert(mediaRows);
      if (mediaError) {
        console.error('Media insert error', mediaError.message);
      }
    }
  }

  return Response.json({ ok: true, lessonId: lesson.id, uploadUrls });
}
