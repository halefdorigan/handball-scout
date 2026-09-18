export function localWallTimeToUtc(wallTime: string): string {
  const date = new Date(wallTime);

  if (Number.isNaN(date.getTime())) return wallTime;

  return date.toISOString();
}

export function utcToLocalWallTime(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .substring(0, 16);
}