import { supabaseServer } from '@/lib/supabaseServer';
import { profileSchema } from '@/lib/zodSchemas';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json();
  const payload = profileSchema.parse(body);
  const supabase = supabaseServer();
  await supabase.from('user_profiles').upsert(payload, { onConflict: 'user_id' });
  return Response.json({ ok: true });
}
