export interface ParsedStat {
  prefix: string;
  value: number;
  suffix: string;
  decimals: number;
}

/** Splits a stat label like "30+", "$261M", "100M+" into prefix/number/suffix. */
export function parseStatValue(display: string): ParsedStat | null {
  const match = display.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  const decimals = number.includes('.') ? number.split('.')[1].length : 0;
  return { prefix, value: parseFloat(number), suffix, decimals };
}

export function formatStat(parsed: ParsedStat, current: number): string {
  return `${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`;
}
