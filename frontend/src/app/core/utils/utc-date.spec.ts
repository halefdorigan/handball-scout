import { localWallTimeToUtc, utcToLocalWallTime } from './utc-date';

describe('localWallTimeToUtc', () => {
  it('returns a UTC ISO string for a device-local wall time', () => {
    expect(localWallTimeToUtc('2026-09-18T14:30')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('round-trips through utcToLocalWallTime back to the same wall time', () => {
    const wallTime = '2026-09-18T14:30';
    expect(utcToLocalWallTime(localWallTimeToUtc(wallTime))).toBe(wallTime);
  });

  it('passes through invalid values unchanged', () => {
    expect(localWallTimeToUtc('not-a-date')).toBe('not-a-date');
  });
});

describe('utcToLocalWallTime', () => {
  it('returns the device-local wall time for a UTC instant', () => {
    const iso = '2026-09-18T17:30:00.000Z';
    const wallTime = utcToLocalWallTime(iso);
    expect(wallTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(new Date(wallTime).toISOString()).toBe(iso);
  });

  it('passes through invalid values unchanged', () => {
    expect(utcToLocalWallTime('not-a-date')).toBe('not-a-date');
  });
});