export type DatasetKey = "support_wait" | "latency_ms" | "order_size";

export type DatasetConfig = {
  key: DatasetKey;
  label: string;
  unit: string;
  description: string;
  values: number[];
};

export const DATASETS: Record<DatasetKey, DatasetConfig> = {
  support_wait: {
    key: "support_wait",
    label: "Support wait times",
    unit: "min",
    description: "Minutes customers waited before an agent picked up.",
    values: [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 22, 28, 35, 45, 62],
  },
  latency_ms: {
    key: "latency_ms",
    label: "API latency",
    unit: "ms",
    description: "Response times in milliseconds for one endpoint.",
    values: [12, 18, 21, 24, 28, 31, 35, 38, 42, 45, 49, 53, 58, 63, 71, 82, 95, 110],
  },
  order_size: {
    key: "order_size",
    label: "Order sizes",
    unit: "units",
    description: "Units per order in a skewed retail mix.",
    values: [1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6, 8, 10, 12, 15, 20, 28, 45],
  },
};

export const SAMPLE_VALUES = DATASETS.latency_ms.values;

export function sorted(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function percentile(values: number[], p: number): number {
  const s = sorted(values);
  if (s.length === 0) return 0;
  const rank = (p / 100) * (s.length - 1);
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  if (low === high) return s[low];
  const weight = rank - low;
  return s[low] * (1 - weight) + s[high] * weight;
}

export function quartiles(values: number[]): { q1: number; q2: number; q3: number; min: number; max: number } {
  const s = sorted(values);
  return {
    min: s[0],
    max: s[s.length - 1],
    q1: percentile(values, 25),
    q2: percentile(values, 50),
    q3: percentile(values, 75),
  };
}

export function cumulativeAt(values: number[], x: number): number {
  const s = sorted(values);
  const count = s.filter((v) => v <= x).length;
  return (count / s.length) * 100;
}

export function cumulativeCurve(values: number[]): { x: number; pct: number }[] {
  const s = sorted(values);
  return s.map((x, i) => ({ x, pct: ((i + 1) / s.length) * 100 }));
}

export function histogramBins(values: number[], binCount = 6): { start: number; end: number; count: number }[] {
  const s = sorted(values);
  const min = s[0];
  const max = s[s.length - 1];
  const span = Math.max(max - min, 1);
  const width = span / binCount;
  return Array.from({ length: binCount }, (_, i) => {
    const start = min + i * width;
    const end = i === binCount - 1 ? max + 0.001 : start + width;
    const count = s.filter((v) => v >= start && (i === binCount - 1 ? v <= end : v < end)).length;
    return { start, end, count };
  });
}

export function percentileRead(p: number, value: number, unit: string): string {
  return `P${p} is about ${value.toFixed(0)} ${unit}. Roughly ${p}% of observations fall at or below that cutoff, and ${100 - p}% sit above it.`;
}

export function mean(values: number[]): number {
  return values.reduce((s, v) => s + v, 0) / Math.max(values.length, 1);
}

export function median(values: number[]): number {
  return percentile(values, 50);
}
