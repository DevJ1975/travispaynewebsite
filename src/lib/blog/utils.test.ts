import { describe, expect, it } from 'vitest';
import { formatDate, readingMinutes } from './utils';

describe('readingMinutes', () => {
  it('is at least 1 minute for short content', () => {
    expect(readingMinutes('a few words here')).toBe(1);
  });

  it('scales with word count (~200 wpm)', () => {
    const words = Array.from({ length: 600 }, () => 'word').join(' ');
    expect(readingMinutes(words)).toBe(3);
  });
});

describe('formatDate', () => {
  it('formats an ISO string', () => {
    expect(formatDate('2026-05-12T10:00:00.000Z')).toBe('May 12, 2026');
  });

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });
});
