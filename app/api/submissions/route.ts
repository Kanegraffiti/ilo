import { supabaseServer } from '@/lib/supabaseServer';
import { submissionSchema } from '@/lib/zodSchemas';

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('multipart/form-data')) {
    const form = await req.formData();
    const data = JSON.parse((form.get('data') as string) || '{}');
    const file = form.get('file') as File | null;
    let media_path;
    if (file) {
      const path = `submissions/${Date.now()}-${file.name}`;
      await supabase.storage
        .from('lesson-media')
        .upload(path, file, { contentType: file.type });
      media_path = path;
    }
    const payload = submissionSchema.parse({ ...data, media_path });
    await supabase.from('submissions').insert({ ...payload, user_id: null });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } else {
    const body = await req.json();
    const payload = submissionSchema.parse(body);
    await supabase.from('submissions').insert({ ...payload, user_id: null });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
}
