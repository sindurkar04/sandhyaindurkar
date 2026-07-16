export const COLORS = {
  bias: "#2563eb",
  variance: "#ea580c",
  total: "#8b5cf6",
  train: "#0d9488",
  test: "#e11d48",
  sweetSpot: "#111111",
  grid: "#e5e7eb",
} as const;

export const NOISE = 5;

/** Model complexity on a 1-10 dial */
export function biasSquared(complexity: number): number {
  const c = complexity / 10;
  return Math.round((22 * Math.exp(-2.8 * c) + 1.5) * 10) / 10;
}

export function variance(complexity: number): number {
  const c = complexity / 10;
  return Math.round((1.5 + 38 * c ** 2.4) * 10) / 10;
}

export function totalError(complexity: number): number {
  return Math.round((biasSquared(complexity) + variance(complexity) + NOISE) * 10) / 10;
}

export function trainError(complexity: number): number {
  const c = complexity / 10;
  return Math.round((32 - 26 * c + 3 * c ** 2) * 10) / 10;
}

export function testError(complexity: number): number {
  const c = complexity / 10;
  return Math.round((12 + 55 * (c - 0.38) ** 2) * 10) / 10;
}

export function sweetSpotComplexity(): number {
  let best = 1;
  let bestErr = testError(1);
  for (let c = 2; c <= 10; c += 1) {
    const err = testError(c);
    if (err < bestErr) {
      bestErr = err;
      best = c;
    }
  }
  return best;
}

export const SWEET_SPOT = sweetSpotComplexity();

export type CurvePoint = { complexity: number; value: number };

export function curvePoints(
  fn: (c: number) => number,
  steps = 40,
): CurvePoint[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const complexity = 1 + (i / steps) * 9;
    return { complexity, value: fn(complexity) };
  });
}

export function formatError(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function regionLabel(complexity: number): "underfit" | "sweet" | "overfit" {
  if (complexity <= SWEET_SPOT - 2) return "underfit";
  if (complexity >= SWEET_SPOT + 2) return "overfit";
  return "sweet";
}

export function biasVarianceReadout(complexity: number): string {
  const region = regionLabel(complexity);
  const b2 = biasSquared(complexity);
  const v = variance(complexity);
  const test = testError(complexity);
  const train = trainError(complexity);
  const gap = test - train;

  if (region === "underfit") {
    return `Complexity ${complexity}/10: bias^2 is ${formatError(b2)} and still high. The model is too simple (underfit). Train ${formatError(train)}, test ${formatError(test)}. Add capacity carefully.`;
  }
  if (region === "overfit") {
    return `Complexity ${complexity}/10: variance is ${formatError(v)} and rising. Train ${formatError(train)} looks great but test ${formatError(test)} (gap ${formatError(gap)}). The model memorizes noise (overfit).`;
  }
  return `Near the sweet spot (complexity ~${SWEET_SPOT}/10): total error ${formatError(totalError(complexity))} balances bias^2 ${formatError(b2)} and variance ${formatError(v)}. Test error ${formatError(test)} is near its minimum.`;
}
