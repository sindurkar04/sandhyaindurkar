export const COLORS = {
  bar: "#0d9488",
  barPeak: "#7c3aed",
  meanLine: "#ea580c",
  grid: "#e5e7eb",
} as const;

/** Poisson PMF P(X = k) = lambda^k e^-lambda / k!, computed iteratively for stability. */
export function poissonPmf(lambda: number, k: number): number {
  if (k < 0) return 0;
  let term = Math.exp(-lambda);
  for (let i = 1; i <= k; i += 1) {
    term = (term * lambda) / i;
  }
  return term;
}

export type Bar = { k: number; prob: number };

export function poissonDistribution(lambda: number, maxK?: number): Bar[] {
  const upper = maxK ?? Math.max(10, Math.ceil(lambda + 4 * Math.sqrt(lambda) + 2));
  const bars: Bar[] = [];
  for (let k = 0; k <= upper; k += 1) {
    bars.push({ k, prob: poissonPmf(lambda, k) });
  }
  return bars;
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function poissonReadout(lambda: number): string {
  const sd = Math.sqrt(lambda);
  const pZero = poissonPmf(lambda, 0);
  return `With an average rate of ${formatNum(lambda, 1)} events per window, the count varies by about ${formatNum(sd, 1)} (variance equals the mean). Roughly ${formatPct(pZero, 1)} of windows see zero events. As lambda grows the shape drifts toward a bell curve.`;
}
