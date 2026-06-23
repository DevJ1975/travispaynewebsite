import { describe, expect, it } from 'vitest';
import { formatStat, parseStatValue } from './countup';

describe('parseStatValue', () => {
  it('parses a trailing suffix', () => {
    expect(parseStatValue('30+')).toEqual({ prefix: '', value: 30, suffix: '+', decimals: 0 });
  });

  it('parses a currency prefix and unit suffix', () => {
    expect(parseStatValue('$261M')).toEqual({ prefix: '$', value: 261, suffix: 'M', decimals: 0 });
  });

  it('tracks decimal places', () => {
    expect(parseStatValue('4.5x')).toEqual({ prefix: '', value: 4.5, suffix: 'x', decimals: 1 });
  });

  it('returns null when there is no number', () => {
    expect(parseStatValue('Grammy')).toBeNull();
  });
});

describe('formatStat', () => {
  it('reassembles prefix, value, and suffix', () => {
    const parsed = parseStatValue('$261M')!;
    expect(formatStat(parsed, 130)).toBe('$130M');
  });

  it('respects decimal places', () => {
    const parsed = parseStatValue('4.5x')!;
    expect(formatStat(parsed, 2.25)).toBe('2.3x');
  });
});
