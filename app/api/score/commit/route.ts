import { supabaseServer } from '@/lib/supabaseServer';
import { scoreCommitSchema } from '@/lib/zodSchemas';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  if (!rateLimit(ip).ok) return new Response('Too many requests', { status: 429 });
  const body = await req.json();
  const payload = scoreCommitSchema.parse(body);
  const supabase = supabaseServer();
  await supabase.from('progress').insert({
    owner_kind: payload.owner_kind,
    owner_id: payload.owner_id,
    module_id: payload.module_id,
    lesson_id: payload.lesson_id,
    xp: payload.xp,
    streak_days: payload.streak_days ?? 0,
  });
  return Response.json({ ok: true });
}
