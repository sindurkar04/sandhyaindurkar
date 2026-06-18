export type ScenarioKey = "customer_anomaly" | "embedding_dupes" | "ops_outlier";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  baselineLabel: string;
  pointLabel: string;
  baseline: number[];
  point: number[];
  featureLabels: string[];
  defaultThreshold: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  customer_anomaly: {
    key: "customer_anomaly",
    shortLabel: "Customer anomaly",
    headline: "L2 distance from a typical customer vector flags unusual spend and session patterns.",
    baselineLabel: "Typical customer",
    pointLabel: "Flagged account",
    featureLabels: ["Spend", "Sessions", "Orders"],
    baseline: [120, 8, 3],
    point: [890, 42, 18],
    defaultThreshold: 400,
  },
  embedding_dupes: {
    key: "embedding_dupes",
    shortLabel: "Embedding dupes",
    headline: "Small L2 distance between document embeddings suggests near-duplicate content.",
    baselineLabel: "Doc A embedding",
    pointLabel: "Doc B embedding",
    featureLabels: ["dim 1", "dim 2", "dim 3", "dim 4"],
    baseline: [0.2, 0.5, 0.8, 0.1],
    point: [0.22, 0.48, 0.79, 0.12],
    defaultThreshold: 0.15,
  },
  ops_outlier: {
    key: "ops_outlier",
    shortLabel: "Ops outlier",
    headline: "Distance from median handle-time vector spots an agent-week outlier.",
    baselineLabel: "Team median",
    pointLabel: "Agent week",
    featureLabels: ["Handle min", "Tickets", "Reopens"],
    baseline: [12, 45, 2],
    point: [38, 52, 9],
    defaultThreshold: 25,
  },
};

export function l2Norm(v: number[]): number {
  return Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
}

export function l2Distance(a: number[], b: number[]): number {
  return l2Norm(a.map((x, i) => x - (b[i] ?? 0)));
}

export function l1Distance(a: number[], b: number[]): number {
  return a.reduce((sum, x, i) => sum + Math.abs(x - (b[i] ?? 0)), 0);
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function distanceReadout(scenario: Scenario, threshold: number): string {
  const l2 = l2Distance(scenario.baseline, scenario.point);
  const l1 = l1Distance(scenario.baseline, scenario.point);
  if (l2 > threshold) {
    return `L2 distance ${formatNum(l2)} exceeds threshold ${formatNum(threshold)}. L1 distance is ${formatNum(l1)}. Scale features before comparing across tables with mixed units.`;
  }
  return `L2 distance ${formatNum(l2)} is within threshold ${formatNum(threshold)}. For embeddings, also check cosine when vector length varies.`;
}
