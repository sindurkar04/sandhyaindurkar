export type ScenarioKey = "ab_test" | "order_value" | "csat";

export type AbPopulation = {
  control: number[];
  variant: number[];
};

export type NumericPopulation = {
  values: number[];
};

export type ScenarioMeta = {
  key: ScenarioKey;
  shortLabel: string;
  title: string;
  unit: string;
  businessContext: string;
  populationSize: number;
  minSample: number;
};

export const SCENARIO_META: Record<ScenarioKey, ScenarioMeta> = {
  ab_test: {
    key: "ab_test",
    shortLabel: "A/B test",
    title: "Checkout button A/B test",
    unit: "% converted",
    businessContext:
      "A product team tests a new checkout button. The true population is only slightly better on variant. Small samples often look like a big win or a clear loss.",
    populationSize: 2000,
    minSample: 30,
  },
  order_value: {
    key: "order_value",
    shortLabel: "Order value",
    title: "Average order value review",
    unit: "USD",
    businessContext:
      "Finance reviews average order value from a stable customer base. With a handful of orders, the average can look far from the real center.",
    populationSize: 1500,
    minSample: 25,
  },
  csat: {
    key: "csat",
    shortLabel: "CSAT survey",
    title: "Weekly support CSAT",
    unit: "score",
    businessContext:
      "Support leadership tracks CSAT after a process change. A short survey week can overstate improvement or hide real decline.",
    populationSize: 1200,
    minSample: 20,
  },
};

function seededUnit(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function shuffledIndices(length: number, seed: number): number[] {
  const indices = Array.from({ length }, (_, index) => index);
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(seededUnit(seed + i) * (i + 1));
    const swap = indices[i];
    indices[i] = indices[j];
    indices[j] = swap;
  }
  return indices;
}

function buildAbPopulations(): AbPopulation {
  const control: number[] = [];
  const variant: number[] = [];

  for (let i = 0; i < 1000; i += 1) {
    control.push(seededUnit(i + 11) < 0.5 ? 1 : 0);
    variant.push(seededUnit(i + 1011) < 0.52 ? 1 : 0);
  }

  return { control, variant };
}

function buildOrderValues(): number[] {
  const values: number[] = [];
  for (let i = 0; i < 1500; i += 1) {
    const base = 72 + seededUnit(i + 31) * 26;
    const occasional = seededUnit(i + 71) > 0.96 ? 180 + seededUnit(i + 91) * 80 : 0;
    values.push(Math.round(base + occasional));
  }
  return values;
}

function buildCsatValues(): number[] {
  const values: number[] = [];
  for (let i = 0; i < 1200; i += 1) {
    const roll = seededUnit(i + 201);
    if (roll < 0.08) {
      values.push(2);
    } else if (roll < 0.2) {
      values.push(3);
    } else if (roll < 0.55) {
      values.push(4);
    } else {
      values.push(5);
    }
  }
  return values;
}

export const AB_POPULATION = buildAbPopulations();
export const ORDER_POPULATION = buildOrderValues();
export const CSAT_POPULATION = buildCsatValues();

const ORDER_INDICES = shuffledIndices(ORDER_POPULATION.length, 41);
const CSAT_INDICES = shuffledIndices(CSAT_POPULATION.length, 52);
const AB_CONTROL_INDICES = shuffledIndices(AB_POPULATION.control.length, 63);
const AB_VARIANT_INDICES = shuffledIndices(AB_POPULATION.variant.length, 74);

export function sampleAb(arm: "control" | "variant", n: number): number[] {
  const source = arm === "control" ? AB_POPULATION.control : AB_POPULATION.variant;
  const indices = arm === "control" ? AB_CONTROL_INDICES : AB_VARIANT_INDICES;
  const size = Math.min(n, source.length);
  return indices.slice(0, size).map((index) => source[index]);
}

export function sampleOrderValues(n: number): number[] {
  const size = Math.min(n, ORDER_POPULATION.length);
  return ORDER_INDICES.slice(0, size).map((index) => ORDER_POPULATION[index]);
}

export function sampleCsat(n: number): number[] {
  const size = Math.min(n, CSAT_POPULATION.length);
  return CSAT_INDICES.slice(0, size).map((index) => CSAT_POPULATION[index]);
}

export function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(sorted: number[]): number {
  if (sorted.length === 0) {
    return 0;
  }
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

export function standardDeviation(values: number[]): number {
  if (values.length < 2) {
    return 0;
  }
  const avg = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

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

export function conversionRate(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return (values.filter((value) => value === 1).length / values.length) * 100;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatMoney(value: number): string {
  return `$${value.toFixed(0)}`;
}

export function formatScore(value: number): string {
  return value.toFixed(2);
}

export type StabilityPoint = { n: number; value: number };

export function buildStabilityCurve(
  scenario: ScenarioKey,
  step = 25,
): StabilityPoint[] {
  const meta = SCENARIO_META[scenario];
  const points: StabilityPoint[] = [];

  for (let n = meta.minSample; n <= meta.populationSize; n += step) {
    if (scenario === "ab_test") {
      const control = sampleAb("control", n);
      const variant = sampleAb("variant", n);
      const lift = conversionRate(variant) - conversionRate(control);
      points.push({ n, value: lift });
    } else if (scenario === "order_value") {
      points.push({ n, value: mean(sampleOrderValues(n)) });
    } else {
      points.push({ n, value: mean(sampleCsat(n)) });
    }
  }

  return points;
}

export type StabilityLabel = "unstable" | "settling" | "reliable";

export function stabilityLabel(n: number, populationSize: number): StabilityLabel {
  const ratio = n / populationSize;
  if (ratio < 0.08) {
    return "unstable";
  }
  if (ratio < 0.25) {
    return "settling";
  }
  return "reliable";
}

export function stabilityCopy(label: StabilityLabel): string {
  if (label === "unstable") {
    return "Metrics can swing a lot at this sample size. Avoid shipping decisions from this alone.";
  }
  if (label === "settling") {
    return "The metric is starting to settle, but still check a larger sample before a major bet.";
  }
  return "The metric is closer to the full population pattern. Still pair with context and time range.";
}

export function abDecisionCopy(liftPoints: number, n: number): string {
  if (n < 80) {
    if (Math.abs(liftPoints) >= 8) {
      return "At this size, the test can look like a clear winner or loser even when the true gap is small.";
    }
    return "Early reads are noisy. Leadership might misread noise as strategy.";
  }
  if (Math.abs(liftPoints) < 3) {
    return "With more responses, the gap looks modest. That often means iterate, not a full rollout.";
  }
  return "Larger samples narrow the story. Compare against business impact, not only the headline lift.";
}

export function fullPopulationStats(scenario: ScenarioKey) {
  if (scenario === "ab_test") {
    const controlRate = conversionRate(AB_POPULATION.control);
    const variantRate = conversionRate(AB_POPULATION.variant);
    return {
      controlRate,
      variantRate,
      lift: variantRate - controlRate,
      mean: null,
      median: null,
      stdDev: null,
      p90: null,
    };
  }

  const values =
    scenario === "order_value"
      ? [...ORDER_POPULATION]
      : [...CSAT_POPULATION];
  const sorted = [...values].sort((a, b) => a - b);

  return {
    controlRate: null,
    variantRate: null,
    lift: null,
    mean: mean(values),
    median: median(sorted),
    stdDev: standardDeviation(values),
    p90: percentile(sorted, 90),
  };
}
