import { rateLimit } from '@/lib/rateLimit';
import { supabaseServer } from '@/lib/supabaseServer';
import { guardianSignupSchema } from '@/lib/zodSchemas';
import type { PostgrestError } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const passwordAuthEnabled =
  process.env.NEXT_PUBLIC_SUPABASE_PASSWORD_AUTH === 'true' || process.env.SUPABASE_PASSWORD_AUTH === 'true';

function firstErrorMessage(error: PostgrestError | Error | null) {
  if (!error) return undefined;
  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return undefined;
}

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || 'anonymous').split(',')[0]?.trim() ?? 'anonymous';
  const payload = await req.json().catch(() => undefined);
  const parsed = guardianSignupSchema.safeParse(payload);

  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const message =
      flattened.fieldErrors.email?.[0] ||
      flattened.fieldErrors.displayName?.[0] ||
      flattened.formErrors[0] ||
      'Please review the form and try again.';
    return Response.json({ ok: false, message }, { status: 400 });
  }

  const { email, displayName, country, password } = parsed.data;
  const rateKey = `signup:${ip}:${email}`;
  if (!rateLimit(rateKey, 3, 60000).ok) {
    return Response.json(
      { ok: false, message: 'Please wait a moment before trying again.' },
      { status: 429 },
    );
  }

  const supabase = supabaseServer();
  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? undefined;

  const shouldUsePassword = passwordAuthEnabled && Boolean(password);
  let userId: string | null = null;

  if (shouldUsePassword && password) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (error.status === 422 || error.message.toLowerCase().includes('already registered')) {
        return Response.json(
          { ok: false, message: 'That email already has an account. Try logging in instead.' },
          { status: 409 },
        );
      }

      console.error('Signup password flow error', error.message);
      return Response.json(
        { ok: false, message: 'We could not create that account. Please try again soon.' },
        { status: 400 },
      );
    }

    userId = data.user?.id ?? null;
  } else {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: origin,
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('Signup magic link error', error.message);
      return Response.json(
        { ok: false, message: 'We could not send the magic link. Please try again soon.' },
        { status: 400 },
      );
    }
  }

  if (!userId) {
    const normalizedEmail = email.trim().toLowerCase();
    let page = 1;
    const perPage = 100;

    while (!userId) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) {
        console.error('Signup lookup error', firstErrorMessage(error));
        break;
      }

      const match = data.users.find((user) => user.email?.toLowerCase() === normalizedEmail);
      if (match) {
        userId = match.id;
        break;
      }

      if (!data.nextPage || data.nextPage === page) {
        break;
      }

      page = data.nextPage;
    }
  }

  if (userId) {
    const { error } = await supabase.from('user_profiles').upsert(
      {
        user_id: userId,
        display_name: displayName,
        country: country ?? null,
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      console.error('Profile upsert error', firstErrorMessage(error));
      return Response.json(
        {
          ok: false,
          message: 'Your account was created, but we could not finish saving the profile. Please contact support.',
        },
        { status: 500 },
      );
    }
  }

  const message = shouldUsePassword
    ? 'All set! You can log in with your password anytime.'
    : 'We sent a magic link. Please check your email to finish signing in.';

  return Response.json({ ok: true, message });
}
