import { getUserFromRequest, supabaseServer } from '@/lib/supabaseServer';
import { cohortEnrollSchema } from '@/lib/zodSchemas';

export const runtime = 'nodejs';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const payload = await req.json().catch(() => undefined);
  const parsed = cohortEnrollSchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.flatten().formErrors[0] || 'Please choose a learner to enroll.';
    return Response.json({ ok: false, message }, { status: 400 });
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return Response.json({ ok: false, message: 'Sign in to join a cohort.' }, { status: 401 });
  }

  const supabase = supabaseServer();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return Response.json({ ok: false, message: 'Profile not found for this account.' }, { status: 400 });
  }

  const isSelf = parsed.data.ownerKind === 'user' && parsed.data.ownerId === profile.id;
  let ownsChild = false;

  if (parsed.data.ownerKind === 'child') {
    const { data: child } = await supabase
      .from('child_profiles')
      .select('id, guardian_user_id')
      .eq('id', parsed.data.ownerId)
      .single();

    ownsChild = Boolean(child && child.guardian_user_id === user.id);
    if (!ownsChild) {
      return Response.json({ ok: false, message: 'You can only enroll learners you manage.' }, { status: 403 });
    }
  }

  if (!isSelf && parsed.data.ownerKind === 'user') {
    return Response.json({ ok: false, message: 'You can only enroll yourself or your children.' }, { status: 403 });
  }

  const { data: existing } = await supabase
    .from('cohort_enrollments')
    .select('id')
    .eq('cohort_id', params.id)
    .eq('owner_kind', parsed.data.ownerKind)
    .eq('owner_id', parsed.data.ownerId)
    .maybeSingle();

  if (existing) {
    return Response.json({ ok: true, alreadyJoined: true });
  }

  const { error } = await supabase.from('cohort_enrollments').insert({
    cohort_id: params.id,
    owner_kind: parsed.data.ownerKind,
    owner_id: parsed.data.ownerId,
  });

  if (error) {
    console.error('Enroll cohort error', error.message);
    return Response.json({ ok: false, message: 'Unable to enroll right now.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
