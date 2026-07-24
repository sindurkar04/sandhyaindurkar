export const COLORS = {
  bar: "#2563eb",
  barPeak: "#7c3aed",
  meanLine: "#ea580c",
  grid: "#e5e7eb",
} as const;

export function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}

/** n choose k, computed multiplicatively to avoid overflow for our small n. */
export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const kk = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < kk; i += 1) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export function binomialPmf(n: number, p: number, k: number): number {
  return choose(n, k) * p ** k * (1 - p) ** (n - k);
}

export type Bar = { k: number; prob: number };

export function binomialDistribution(n: number, p: number): Bar[] {
  const bars: Bar[] = [];
  for (let k = 0; k <= n; k += 1) {
    bars.push({ k, prob: binomialPmf(n, p, k) });
  }
  return bars;
}

export function binomialMean(n: number, p: number): number {
  return n * p;
}

export function binomialVariance(n: number, p: number): number {
  return n * p * (1 - p);
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function binomialReadout(n: number, p: number): string {
  const mean = binomialMean(n, p);
  const sd = Math.sqrt(binomialVariance(n, p));
  const mostLikely = Math.floor((n + 1) * p);
  return `Across ${n} independent trials at ${formatPct(p, 0)} each, expect about ${formatNum(mean, 1)} successes, give or take ${formatNum(sd, 1)}. The single most likely count is ${mostLikely}. Spread is widest at p = 50% and shrinks as p heads toward 0 or 1.`;
}
