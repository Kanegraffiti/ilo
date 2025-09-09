import { supabaseBrowser } from './supabaseBrowser';

export async function getSignedUrl(path: string, expiresIn = 60) {
  const client = supabaseBrowser();
  const { data } = await client.storage.from('lesson-media').createSignedUrl(path, expiresIn);
  return data?.signedUrl || '';
}
