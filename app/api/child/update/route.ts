import { supabaseServer } from '@/lib/supabaseServer';
import { childSchema } from '@/lib/zodSchemas';
import { z } from 'zod';

export async function POST(req: Request) {
  const body = await req.json();
  const payload = childSchema.extend({ id: z.string().uuid() }).parse(body);
  const { id, ...rest } = payload;
  const supabase = supabaseServer();
  await supabase.from('child_profiles').update(rest).eq('id', id);
  return Response.json({ ok: true });
}
