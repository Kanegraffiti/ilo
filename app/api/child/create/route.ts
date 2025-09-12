import { supabaseServer } from '@/lib/supabaseServer';
import { childSchema } from '@/lib/zodSchemas';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json();
  const payload = childSchema.parse(body);
  const supabase = supabaseServer();
  await supabase.from('child_profiles').insert(payload);
  return Response.json({ ok: true });
}
