import { rateLimit } from '@/lib/rateLimit';
import { getUserFromRequest, supabaseServer } from '@/lib/supabaseServer';
import { cohortCreateSchema } from '@/lib/zodSchemas';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anonymous').split(',')[0]?.trim();
  if (!rateLimit(`cohort:create:${ip}`, 10, 60000).ok) {
    return Response.json({ ok: false, message: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  const payload = await req.json().catch(() => undefined);
  const parsed = cohortCreateSchema.safeParse(payload);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const message =
      flattened.fieldErrors.name?.[0] || flattened.formErrors[0] || 'Please review the cohort form and try again.';
    return Response.json({ ok: false, message }, { status: 400 });
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return Response.json({ ok: false, message: 'Sign in to create a cohort.' }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'teacher') {
    return Response.json({ ok: false, message: 'Only teachers can create cohorts.' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('cohorts')
    .insert({ name: parsed.data.name, description: parsed.data.description ?? null, teacher_id: user.id })
    .select('id, name, description, created_at')
    .single();

  if (error || !data) {
    console.error('Create cohort error', error?.message);
    return Response.json({ ok: false, message: 'Unable to create cohort right now.' }, { status: 500 });
  }

  return Response.json({ ok: true, cohort: data });
}
