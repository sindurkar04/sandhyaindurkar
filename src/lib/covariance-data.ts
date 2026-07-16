export const COLORS = {
  points: "#2563eb",
  ellipse: "#8b5cf6",
  covCard: "#0d9488",
  corrCard: "#ea580c",
  positive: "#2563eb",
  negative: "#e11d48",
  grid: "#e5e7eb",
} as const;

export const SIGMA_X = 4;
export const SIGMA_Y = 3;
export const POINT_COUNT = 48;

/** Deterministic pseudo-random for stable scatter */
function seededNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export type ScatterPoint = { x: number; y: number };

export function generateScatter(correlation: number, count = POINT_COUNT): ScatterPoint[] {
  const r = Math.max(-0.98, Math.min(0.98, correlation));
  const points: ScatterPoint[] = [];

  for (let i = 0; i < count; i += 1) {
    const u1 = seededNoise(i + 1) * 2 - 1;
    const u2 = seededNoise(i + 100) * 2 - 1;
    const z1 = u1 * SIGMA_X;
    const z2 = u2 * SIGMA_Y;
    const x = z1;
    const y = r * z1 + Math.sqrt(1 - r * r) * z2;
    points.push({ x, y });
  }

  return points;
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function sampleCovariance(points: ScatterPoint[]): number {
  if (points.length < 2) return 0;
  const mx = mean(points.map((p) => p.x));
  const my = mean(points.map((p) => p.y));
  let sum = 0;
  for (const p of points) {
    sum += (p.x - mx) * (p.y - my);
  }
  return sum / (points.length - 1);
}

export function sampleVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  let sum = 0;
  for (const v of values) {
    sum += (v - m) ** 2;
  }
  return sum / (values.length - 1);
}

export function sampleStd(values: number[]): number {
  return Math.sqrt(sampleVariance(values));
}

export function sampleCorrelation(points: ScatterPoint[]): number {
  const cov = sampleCovariance(points);
  const sx = sampleStd(points.map((p) => p.x));
  const sy = sampleStd(points.map((p) => p.y));
  if (sx === 0 || sy === 0) return 0;
  return cov / (sx * sy);
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function covarianceReadout(correlation: number, cov: number, corr: number): string {
  const sign = correlation >= 0 ? "positive" : "negative";
  const strength =
    Math.abs(correlation) > 0.7 ? "strong" : Math.abs(correlation) > 0.35 ? "moderate" : "weak";

  return `${strength} ${sign} co-movement: Cov = ${formatNum(cov)} (${SIGMA_X} and ${SIGMA_Y} units mix), Corr = ${formatNum(corr)} (unitless, -1 to 1). Correlation normalizes covariance by spread. Diagonal of the covariance matrix holds variances.`;
}

/** Ellipse radii for overlay (2 std dev) */
export function ellipseRadii(correlation: number): { rx: number; ry: number; rotation: number } {
  const r = Math.max(-0.98, Math.min(0.98, correlation));
  const angle = r >= 0 ? -45 * Math.abs(r) : 45 * Math.abs(r);
  return {
    rx: SIGMA_X * 2 * (1 + 0.15 * Math.abs(r)),
    ry: SIGMA_Y * 2 * (1 - 0.1 * Math.abs(r)),
    rotation: angle,
  };
}
