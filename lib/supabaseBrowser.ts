import { createClient } from '@supabase/supabase-js';
import { ensureEnv } from './env';

export const supabaseBrowser = () =>
  createClient(
    ensureEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'),
    ensureEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY'),
    {
      auth: { persistSession: true },
    }
  );
