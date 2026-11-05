export function parseEventTime(time: string): string | null {
  const match = time.trim().match(/^(\d{1,2})(?::([0-5]\d))?\s*(am|pm)?(?:\s+onwards)?$/i);
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = match[2] ?? '00';
  const period = match[3]?.toLowerCase();

  if (period) {
    if (hour < 1 || hour > 12) return null;
    hour = hour % 12 + (period === 'pm' ? 12 : 0);
  } else if (hour > 23) {
    return null;
  }

  return `${String(hour).padStart(2, '0')}:${minute}`;
}
