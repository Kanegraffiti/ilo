import { supabaseServer } from '@/lib/supabaseServer';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json();
  const { id } = z.object({ id: z.string().uuid() }).parse(body);
  const supabase = supabaseServer();
  await supabase.from('child_profiles').delete().eq('id', id);
  return Response.json({ ok: true });
}
