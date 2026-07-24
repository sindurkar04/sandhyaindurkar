export const COLORS = {
  base: "#94a3b8",
  sample: "#2563eb",
  normal: "#e11d48",
  grid: "#e5e7eb",
} as const;

export type BaseShape = "uniform" | "skewed" | "bimodal";

export const BASE_SHAPES: { id: BaseShape; label: string }[] = [
  { id: "uniform", label: "Uniform (flat)" },
  { id: "skewed", label: "Skewed (long tail)" },
  { id: "bimodal", label: "Bimodal (two humps)" },
];

/** Deterministic pseudo-random in [0, 1). */
function seededNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Draw one value in [0, 1] from the chosen base population shape. */
function drawBase(shape: BaseShape, seed: number): number {
  const u = seededNoise(seed);
  if (shape === "uniform") {
    return u;
  }
  if (shape === "skewed") {
    return u ** 3;
  }
  const v = seededNoise(seed + 999);
  return u < 0.5 ? v * 0.28 : 0.72 + v * 0.28;
}

export function baseMean(shape: BaseShape): number {
  const n = 4000;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    sum += drawBase(shape, i + 1);
  }
  return sum / n;
}

/** Histogram of the raw population values (probability per bin). */
export function baseHistogram(shape: BaseShape, bins = 24): number[] {
  const n = 6000;
  const counts = new Array(bins).fill(0);
  for (let i = 0; i < n; i += 1) {
    const value = Math.min(0.9999, Math.max(0, drawBase(shape, i + 1)));
    counts[Math.floor(value * bins)] += 1;
  }
  return counts.map((c) => c / n);
}

/** Histogram of the distribution of sample means for a given sample size n. */
export function sampleMeanHistogram(
  shape: BaseShape,
  sampleSize: number,
  bins = 24,
): number[] {
  const samples = 4000;
  const counts = new Array(bins).fill(0);
  let seed = 1;
  for (let s = 0; s < samples; s += 1) {
    let sum = 0;
    for (let j = 0; j < sampleSize; j += 1) {
      sum += drawBase(shape, seed);
      seed += 1;
    }
    const mean = Math.min(0.9999, Math.max(0, sum / sampleSize));
    counts[Math.floor(mean * bins)] += 1;
  }
  return counts.map((c) => c / samples);
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function cltReadout(shape: BaseShape, sampleSize: number): string {
  const label = BASE_SHAPES.find((s) => s.id === shape)?.label ?? shape;
  if (sampleSize <= 1) {
    return `At n = 1 the sample mean is just one raw draw, so it inherits the ${label.toLowerCase()} shape of the population.`;
  }
  return `The population is ${label.toLowerCase()}, yet averaging ${sampleSize} draws pulls the distribution of the mean toward a symmetric bell. Its center stays at the population mean, and its spread shrinks with the square root of ${sampleSize}.`;
}
