export function readEnv(primary: string, ...fallbacks: string[]): string | undefined {
  const keys = [primary, ...fallbacks];
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

export function ensureEnv(primary: string, ...fallbacks: string[]): string {
  const value = readEnv(primary, ...fallbacks);
  if (!value) {
    const fallbackList = fallbacks.length ? ` (or ${fallbacks.join(', ')})` : '';
    throw new Error(`Missing required environment variable ${primary}${fallbackList}.`);
  }
  return value;
}

export const readSupabaseUrl = () => readEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL');
export const readSupabaseAnonKey = () => readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY');
export const readSupabaseServiceRoleKey = () => readEnv('SUPABASE_SERVICE_ROLE_KEY');
