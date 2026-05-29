export type ScenarioKey = "conversion" | "csat" | "defect";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  metricLabel: string;
  defaultRate: number;
  defaultSample: number;
  populationRate: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  conversion: {
    key: "conversion",
    shortLabel: "Checkout conversion",
    metricLabel: "Conversion rate",
    defaultRate: 4.2,
    defaultSample: 800,
    populationRate: 3.8,
  },
  csat: {
    key: "csat",
    shortLabel: "CSAT score",
    metricLabel: "Satisfied responses",
    defaultRate: 72,
    defaultSample: 120,
    populationRate: 68,
  },
  defect: {
    key: "defect",
    shortLabel: "Defect rate",
    metricLabel: "Units with defects",
    defaultRate: 2.5,
    defaultSample: 400,
    populationRate: 3.1,
  },
};

/** Wilson score interval for a proportion (95% default). */
export function wilsonInterval(
  ratePercent: number,
  sampleSize: number,
  z = 1.96,
): { low: number; high: number; point: number } {
  const n = Math.max(1, sampleSize);
  const p = Math.min(0.999, Math.max(0.001, ratePercent / 100));
  const denominator = 1 + (z * z) / n;
  const center = p + (z * z) / (2 * n);
  const margin =
    z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  const low = ((center - margin) / denominator) * 100;
  const high = ((center + margin) / denominator) * 100;
  return { low: Math.max(0, low), high: Math.min(100, high), point: ratePercent };
}

export function formatRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function intervalWidth(low: number, high: number): number {
  return high - low;
}

export function containsTrueRate(interval: { low: number; high: number }, trueRate: number): boolean {
  return trueRate >= interval.low && trueRate <= interval.high;
}

export function readInterval(
  interval: { low: number; high: number },
  sampleSize: number,
  trueRate: number,
): string {
  const inside = containsTrueRate(interval, trueRate);
  if (sampleSize < 80) {
    return inside
      ? "Very wide band. Small samples make the range huge even when the point estimate looks precise."
      : "Small sample and the true rate may sit outside this band. Wait for more data.";
  }
  if (interval.high - interval.low > 8) {
    return "Wide interval. Fine for directional reads, risky for hard targets.";
  }
  return inside
    ? "Tight enough to plan around. The true rate likely sits in this band."
    : "Point estimate looks good but the band misses the long-run rate. Do not overfit to one week.";
}
