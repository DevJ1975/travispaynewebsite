import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats integer cents as USD', () => {
    expect(formatPrice(3500)).toBe('$35.00');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('rounds fractional cents to two decimals', () => {
    expect(formatPrice(12099)).toBe('$120.99');
  });
});
