import { getUserFromRequest, supabaseServer } from '@/lib/supabaseServer';
import { questionCreateSchema } from '@/lib/zodSchemas';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const payload = await req.json().catch(() => undefined);
  const parsed = questionCreateSchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.flatten().formErrors[0] || 'Please add a question before sending.';
    return Response.json({ ok: false, message }, { status: 400 });
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return Response.json({ ok: false, message: 'Sign in required.' }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return Response.json({ ok: false, message: 'Profile not found for this user.' }, { status: 400 });
  }

  if (parsed.data.ownerKind === 'user' && parsed.data.ownerId !== profile.id) {
    return Response.json({ ok: false, message: 'You can only ask questions for yourself or your children.' }, { status: 403 });
  }

  if (parsed.data.ownerKind === 'child') {
    const { data: child } = await supabase
      .from('child_profiles')
      .select('id, guardian_user_id')
      .eq('id', parsed.data.ownerId)
      .single();
    if (!child || child.guardian_user_id !== user.id) {
      return Response.json({ ok: false, message: 'You can only ask on behalf of linked children.' }, { status: 403 });
    }
  }

  const { error } = await supabase.from('questions').insert({
    lesson_id: parsed.data.lessonId,
    owner_kind: parsed.data.ownerKind,
    owner_id: parsed.data.ownerId,
    question: parsed.data.question,
  });

  if (error) {
    console.error('Question create error', error.message);
    return Response.json({ ok: false, message: 'Unable to submit question right now.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
