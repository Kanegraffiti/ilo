const hits = new Map<string, { count: number; ts: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const entry = hits.get(key) || { count: 0, ts: now };
  if (now - entry.ts > windowMs) {
    entry.count = 0;
    entry.ts = now;
  }
  entry.count++;
  hits.set(key, entry);
  return { ok: entry.count <= limit };
}
