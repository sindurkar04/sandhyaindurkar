export type ScenarioKey = "fraud_similarity" | "support_routing" | "product_match";

export type LabeledPoint = { x: number; y: number; label: 0 | 1 };

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  class0Label: string;
  class1Label: string;
  defaultK: number;
  defaultQuery: { x: number; y: number };
  points: LabeledPoint[];
};

const FRAUD_POINTS: LabeledPoint[] = [
  { x: 0.12, y: 0.18, label: 0 },
  { x: 0.22, y: 0.28, label: 0 },
  { x: 0.18, y: 0.12, label: 0 },
  { x: 0.32, y: 0.22, label: 0 },
  { x: 0.28, y: 0.35, label: 0 },
  { x: 0.15, y: 0.32, label: 0 },
  { x: 0.72, y: 0.2, label: 0 },
  { x: 0.82, y: 0.28, label: 0 },
  { x: 0.78, y: 0.15, label: 0 },
  { x: 0.68, y: 0.32, label: 0 },
  { x: 0.75, y: 0.72, label: 1 },
  { x: 0.85, y: 0.82, label: 1 },
  { x: 0.72, y: 0.88, label: 1 },
  { x: 0.88, y: 0.68, label: 1 },
  { x: 0.28, y: 0.78, label: 1 },
  { x: 0.35, y: 0.88, label: 1 },
  { x: 0.22, y: 0.72, label: 1 },
  { x: 0.42, y: 0.82, label: 1 },
  { x: 0.55, y: 0.55, label: 1 },
  { x: 0.48, y: 0.62, label: 0 },
];

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_similarity: {
    key: "fraud_similarity",
    shortLabel: "Fraud similarity",
    headline: "Drag the new order. k-NN classifies by the closest past cases in feature space.",
    class0Label: "Legitimate",
    class1Label: "Fraud",
    defaultK: 5,
    defaultQuery: { x: 0.58, y: 0.48 },
    points: FRAUD_POINTS,
  },
  support_routing: {
    key: "support_routing",
    shortLabel: "Support routing",
    headline: "Nearest resolved tickets vote on which team should get the new ticket.",
    class0Label: "Tier 1",
    class1Label: "Tier 2",
    defaultK: 3,
    defaultQuery: { x: 0.45, y: 0.55 },
    points: FRAUD_POINTS.map((p, i) => ({
      ...p,
      x: p.x * 0.9 + 0.05,
      y: p.y * 0.85 + 0.08,
      label: (i % 3 === 0 ? 1 : p.label) as 0 | 1,
    })),
  },
  product_match: {
    key: "product_match",
    shortLabel: "Product match",
    headline: "Find catalog items nearest to a query vector for duplicate or substitute detection.",
    class0Label: "Standard SKU",
    class1Label: "Premium SKU",
    defaultK: 7,
    defaultQuery: { x: 0.62, y: 0.35 },
    points: FRAUD_POINTS.map((p) => ({ ...p, x: 1 - p.y * 0.85, y: p.x * 0.9 })),
  },
};

export const COLORS = {
  class0: "#3b82f6",
  class0Soft: "#dbeafe",
  class1: "#f97316",
  class1Soft: "#ffedd5",
  query: "#8b5cf6",
  neighborLine: "#94a3b8",
  grid: "#e2e8f0",
} as const;

export function l2Distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export type Neighbor = {
  index: number;
  point: LabeledPoint;
  distance: number;
};

export type KnnResult = {
  neighbors: Neighbor[];
  votes0: number;
  votes1: number;
  prediction: 0 | 1;
  confidence: number;
};

export function knnClassify(
  query: { x: number; y: number },
  training: LabeledPoint[],
  k: number,
): KnnResult {
  const sorted = training
    .map((point, index) => ({ index, point, distance: l2Distance(query, point) }))
    .sort((a, b) => a.distance - b.distance);
  const neighbors = sorted.slice(0, Math.max(1, Math.min(k, training.length)));
  const votes1 = neighbors.filter((n) => n.point.label === 1).length;
  const votes0 = neighbors.length - votes1;
  const prediction = votes1 > votes0 ? 1 : votes0 > votes1 ? 0 : neighbors[0].point.label;
  const confidence = Math.max(votes0, votes1) / neighbors.length;
  return { neighbors, votes0, votes1, prediction, confidence };
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function knnReadout(scenario: Scenario, result: KnnResult, k: number): string {
  const label = result.prediction === 1 ? scenario.class1Label : scenario.class0Label;
  if (result.votes0 > 0 && result.votes1 > 0 && Math.abs(result.votes0 - result.votes1) <= 1) {
    return `k = ${k} splits the vote (${result.votes0} vs ${result.votes1}). Borderline cases need more features or a different k.`;
  }
  return `k = ${k} neighbors vote ${label} (${formatPct(result.confidence)} agreement). Distance in feature space is the whole model.`;
}
