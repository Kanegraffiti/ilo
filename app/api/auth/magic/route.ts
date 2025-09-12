import { supabaseServer } from '@/lib/supabaseServer';
import { rateLimit } from '@/lib/rateLimit';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anon';
  if (!rateLimit(ip).ok) return new Response('Too many requests', { status: 429 });
  const body = await req.json();
  const { email } = z.object({ email: z.string().email() }).parse(body);
  const supabase = supabaseServer();
  await supabase.auth.signInWithOtp({ email });
  return Response.json({ ok: true });
}
