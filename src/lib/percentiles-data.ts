export type ScenarioKey = "latency" | "support" | "checkout";

export type Scenario = {
  label: string;
  shortLabel: string;
  unit: string;
  values: number[];
  target: number;
  targetLabel: string;
};

function seededNoise(index: number, salt = 0): number {
  const value = Math.sin((index + 1) * (12.9898 + salt)) * 43758.5453;
  return value - Math.floor(value);
}

function buildLatencyValues(): number[] {
  const base = [42, 45, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66];
  const tail = [95, 110, 140, 180, 240, 320];
  return [...base, ...tail].map((value, index) =>
    Math.round(value + (seededNoise(index, 1) - 0.5) * 4),
  );
}

function buildSupportValues(): number[] {
  const values: number[] = [];
  for (let day = 0; day < 24; day += 1) {
    const base = 6 + seededNoise(day, 2) * 8;
    const spike = day === 9 || day === 10 || day === 17 ? 28 + seededNoise(day, 3) * 12 : 0;
    values.push(Math.round(base + spike));
  }
  return values;
}

function buildCheckoutValues(): number[] {
  const values: number[] = [];
  for (let session = 0; session < 26; session += 1) {
    const fast = 18 + seededNoise(session, 4) * 12;
    const slow = session % 7 === 0 ? 75 + seededNoise(session, 5) * 40 : 0;
    values.push(Math.round(fast + slow));
  }
  return values;
}

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  latency: {
    label: "API response times",
    shortLabel: "API latency",
    unit: "ms",
    values: buildLatencyValues(),
    target: 80,
    targetLabel: "80 ms SLA",
  },
  support: {
    label: "Support resolution time",
    shortLabel: "Support tickets",
    unit: "hrs",
    values: buildSupportValues(),
    target: 12,
    targetLabel: "12 hr target",
  },
  checkout: {
    label: "Checkout completion time",
    shortLabel: "Checkout",
    unit: "sec",
    values: buildCheckoutValues(),
    target: 45,
    targetLabel: "45 sec target",
  },
};

export const PERCENTILE_PRESETS = [25, 50, 75, 90, 99] as const;
export const BIN_COUNT = 8;

export type Bin = { start: number; end: number; count: number; midpoint: number };

export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) {
    return 0;
  }

  const rank = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);

  if (lower === upper) {
    return sorted[lower];
  }

  const weight = rank - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function formatValue(value: number, unit: string): string {
  const rounded = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${rounded} ${unit}`;
}

export function buildBins(values: number[], binCount: number): Bin[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = span / binCount;

  return Array.from({ length: binCount }, (_, index) => {
    const start = min + index * width;
    const end = index === binCount - 1 ? max : start + width;
    const count = values.filter(
      (value) =>
        value >= start && (index === binCount - 1 ? value <= end : value < end),
    ).length;
    return { start, end, count, midpoint: (start + end) / 2 };
  });
}
