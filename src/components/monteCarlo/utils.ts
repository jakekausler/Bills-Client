/** Format a dollar value with K/M/B suffixes. */
export function formatDollar(value: number): string {
  const neg = value < 0;
  const abs = Math.abs(value);
  let formatted: string;
  if (abs >= 1_000_000_000) {
    formatted = `$${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    formatted = `$${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    formatted = `$${(abs / 1_000).toFixed(0)}K`;
  } else {
    formatted = `$${abs.toFixed(0)}`;
  }
  return neg ? `-${formatted}` : formatted;
}
