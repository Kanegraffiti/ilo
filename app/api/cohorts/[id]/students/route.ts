import { getUserFromRequest, supabaseServer } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return Response.json({ ok: false, message: 'Sign in required.' }, { status: 401 });
  }

  const supabase = supabaseServer();

  const { data: cohort } = await supabase
    .from('cohorts')
    .select('id, teacher_id')
    .eq('id', params.id)
    .single();

  if (!cohort || cohort.teacher_id !== user.id) {
    return Response.json({ ok: false, message: 'You can only view your own cohorts.' }, { status: 403 });
  }

  const { data: enrollments, error } = await supabase
    .from('cohort_enrollments')
    .select('owner_kind, owner_id, joined_at')
    .eq('cohort_id', params.id);

  if (error || !enrollments) {
    console.error('Fetch cohort students error', error?.message);
    return Response.json({ ok: false, message: 'Unable to fetch students right now.' }, { status: 500 });
  }

  const userOwnerIds = enrollments.filter((e) => e.owner_kind === 'user').map((e) => e.owner_id);
  const childOwnerIds = enrollments.filter((e) => e.owner_kind === 'child').map((e) => e.owner_id);

  const [userProfilesRes, childProfilesRes, progressUsersRes, progressChildrenRes] = await Promise.all([
    userOwnerIds.length
      ? supabase.from('user_profiles').select('id, display_name, avatar_url').in('id', userOwnerIds)
      : Promise.resolve({ data: [] as any[] }),
    childOwnerIds.length
      ? supabase.from('child_profiles').select('id, nickname, avatar_url').in('id', childOwnerIds)
      : Promise.resolve({ data: [] as any[] }),
    userOwnerIds.length
      ? supabase
          .from('progress')
          .select('owner_kind, owner_id, xp, streak_days')
          .eq('owner_kind', 'user')
          .in('owner_id', userOwnerIds)
      : Promise.resolve({ data: [] as any[] }),
    childOwnerIds.length
      ? supabase
          .from('progress')
          .select('owner_kind, owner_id, xp, streak_days')
          .eq('owner_kind', 'child')
          .in('owner_id', childOwnerIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const userProfiles = (userProfilesRes.data || []) as { id: string; display_name: string; avatar_url?: string | null }[];
  const childProfiles = (childProfilesRes.data || []) as { id: string; nickname: string; avatar_url?: string | null }[];
  const progressUsers = (progressUsersRes.data || []) as { owner_id: string; xp: number; streak_days: number }[];
  const progressChildren = (progressChildrenRes.data || []) as { owner_id: string; xp: number; streak_days: number }[];

  const students = enrollments.map((enrollment) => {
    if (enrollment.owner_kind === 'user') {
      const profile = userProfiles.find((p) => p.id === enrollment.owner_id);
      const stats = progressUsers.find((p) => p.owner_id === enrollment.owner_id);
      return {
        id: enrollment.owner_id,
        displayName: profile?.display_name ?? 'Learner',
        avatarUrl: profile?.avatar_url ?? null,
        xp: stats?.xp ?? 0,
        streak: stats?.streak_days ?? 0,
        joinedAt: enrollment.joined_at,
        ownerKind: 'user' as const,
      };
    }

    const profile = childProfiles.find((p) => p.id === enrollment.owner_id);
    const stats = progressChildren.find((p) => p.owner_id === enrollment.owner_id);
    return {
      id: enrollment.owner_id,
      displayName: profile?.nickname ?? 'Learner',
      avatarUrl: profile?.avatar_url ?? null,
      xp: stats?.xp ?? 0,
      streak: stats?.streak_days ?? 0,
      joinedAt: enrollment.joined_at,
      ownerKind: 'child' as const,
    };
  });

  return Response.json({ ok: true, students });
}
