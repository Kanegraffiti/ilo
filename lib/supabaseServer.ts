import { createClient } from '@supabase/supabase-js';
import { ensureEnv } from './env';

export const supabaseServer = () =>
  createClient(
    ensureEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'),
    ensureEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: { persistSession: false },
    });
  }

  return client;
};

export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get('authorization') ?? req.headers.get('x-supabase-auth');
  const token = authHeader?.replace(/Bearer\s+/i, '').trim();
  if (!token) {
    return null;
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    console.error('Supabase auth.getUser error', error.message);
    return null;
  }

  return data.user ?? null;
}
