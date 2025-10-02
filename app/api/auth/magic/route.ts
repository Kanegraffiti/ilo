import { readEnv } from '@/lib/env';
import { rateLimit } from '@/lib/rateLimit';
import { emailSchema } from '@/lib/zodSchemas';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const runtime = 'edge';

const bodySchema = z.object({ email: emailSchema });

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || 'anonymous').split(',')[0]?.trim() ?? 'anonymous';
  const rawBody = await req.json().catch(() => undefined);
  const parsed = bodySchema.safeParse(rawBody);

  if (!parsed.success) {
    return Response.json({ ok: false, message: 'Please share a valid email address.' }, { status: 400 });
  }

  const { email } = parsed.data;
  const rateKey = `${ip}:${email}`;
  if (!rateLimit(rateKey, 4, 60000).ok) {
    return Response.json(
      {
        ok: false,
        message: 'We just sent a link. Please wait a minute before trying again.',
      },
      { status: 429 },
    );
  }

  const supabaseUrl = readEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL');
  const supabaseAnonKey = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY');
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables for magic link route.');
    return Response.json({ ok: false, message: 'Sign-in is unavailable right now.' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? undefined;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: origin,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error('Magic link error', error.message);
    return Response.json({ ok: false, message: 'We could not send the link. Please try again soon.' }, { status: 400 });
  }

  return Response.json({ ok: true });
}
