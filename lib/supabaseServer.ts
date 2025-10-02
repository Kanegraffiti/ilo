import { createClient } from '@supabase/supabase-js';
import { ensureEnv } from './env';

export const supabaseServer = () =>
  createClient(
    ensureEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'),
    ensureEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: { persistSession: false },
    }
  );
