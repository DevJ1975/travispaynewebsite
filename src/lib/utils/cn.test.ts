import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('de-duplicates conflicting tailwind utilities (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('drops falsy conditional classes', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });
});
