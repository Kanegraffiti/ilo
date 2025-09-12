import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.LEADERBOARD_ADMIN_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const supabase = supabaseServer();
  // Simplified: clear table
  await supabase.from('leaderboards').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  return Response.json({ ok: true });
}
