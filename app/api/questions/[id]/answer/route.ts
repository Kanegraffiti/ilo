import { rateLimit } from '@/lib/rateLimit';
import { getUserFromRequest, supabaseServer } from '@/lib/supabaseServer';
import { questionAnswerSchema } from '@/lib/zodSchemas';

export const runtime = 'nodejs';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0]?.trim();
  if (!rateLimit(`question:answer:${ip}`, 20, 60000).ok) {
    return Response.json({ ok: false, message: 'Please pause before sending more answers.' }, { status: 429 });
  }

  const payload = await req.json().catch(() => undefined);
  const parsed = questionAnswerSchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.flatten().formErrors[0] || 'Please write an answer before submitting.';
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
    return Response.json({ ok: false, message: 'Only teachers can answer questions.' }, { status: 403 });
  }

  const { data: question } = await supabase
    .from('questions')
    .select('id, lesson_id')
    .eq('id', params.id)
    .single();

  if (!question) {
    return Response.json({ ok: false, message: 'Question not found.' }, { status: 404 });
  }

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, created_by')
    .eq('id', question.lesson_id)
    .single();

  if (!lesson || lesson.created_by !== user.id) {
    return Response.json({ ok: false, message: 'You can only answer questions for your lessons.' }, { status: 403 });
  }

  const { error } = await supabase
    .from('questions')
    .update({
      answer: parsed.data.answer,
      answered_by: user.id,
      answered_at: new Date().toISOString(),
    })
    .eq('id', params.id);

  if (error) {
    console.error('Answer question error', error.message);
    return Response.json({ ok: false, message: 'Unable to save the answer right now.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
