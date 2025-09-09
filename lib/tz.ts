export function formatInTz(date: string | number | Date, tz = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: tz }).format(
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  );
}
