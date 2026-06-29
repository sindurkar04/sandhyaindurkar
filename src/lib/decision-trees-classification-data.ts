export type ScenarioKey = "fraud_rules" | "hiring_screen" | "routing";

export type LabeledPoint = { x: number; y: number; label: 0 | 1 };

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  class0Label: string;
  class1Label: string;
  featureX: string;
  featureY: string;
  defaultDepth: number;
  points: LabeledPoint[];
};

const POINTS: LabeledPoint[] = [
  { x: 0.12, y: 0.2, label: 0 },
  { x: 0.22, y: 0.28, label: 0 },
  { x: 0.18, y: 0.12, label: 0 },
  { x: 0.32, y: 0.22, label: 0 },
  { x: 0.28, y: 0.38, label: 0 },
  { x: 0.72, y: 0.22, label: 0 },
  { x: 0.82, y: 0.18, label: 0 },
  { x: 0.78, y: 0.32, label: 0 },
  { x: 0.75, y: 0.75, label: 1 },
  { x: 0.85, y: 0.82, label: 1 },
  { x: 0.72, y: 0.88, label: 1 },
  { x: 0.28, y: 0.78, label: 1 },
  { x: 0.35, y: 0.85, label: 1 },
  { x: 0.22, y: 0.72, label: 1 },
  { x: 0.55, y: 0.58, label: 1 },
  { x: 0.48, y: 0.42, label: 0 },
  { x: 0.62, y: 0.35, label: 0 },
  { x: 0.4, y: 0.55, label: 1 },
];

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_rules: {
    key: "fraud_rules",
    shortLabel: "Fraud rules",
    headline: "Each split is an if-then rule ops can read: amount high AND velocity high.",
    class0Label: "Approve",
    class1Label: "Review",
    featureX: "Amount",
    featureY: "Velocity",
    defaultDepth: 2,
    points: POINTS,
  },
  hiring_screen: {
    key: "hiring_screen",
    shortLabel: "Hiring screen",
    headline: "Trees surface readable policies for recruiters and compliance review.",
    class0Label: "Decline",
    class1Label: "Interview",
    featureX: "Skills",
    featureY: "Experience",
    defaultDepth: 2,
    points: POINTS,
  },
  routing: {
    key: "routing",
    shortLabel: "Ticket routing",
    headline: "Nested thresholds route tickets without a black-box score.",
    class0Label: "Tier 1",
    class1Label: "Tier 2",
    featureX: "Complexity",
    featureY: "Urgency",
    defaultDepth: 3,
    points: POINTS.map((p) => ({ ...p, x: p.y, y: p.x })),
  },
};

export const COLORS = {
  class0: "#3b82f6",
  class0Region: "rgba(59, 130, 246, 0.12)",
  class1: "#f97316",
  class1Region: "rgba(249, 115, 22, 0.12)",
  split: "#8b5cf6",
  grid: "#e2e8f0",
} as const;

export type Split = {
  axis: "x" | "y";
  value: number;
  depth: number;
};

/** Simple axis-aligned splits for visualization */
export function splitsForDepth(depth: number): Split[] {
  const candidates: Split[] = [
    { axis: "x", value: 0.45, depth: 1 },
    { axis: "y", value: 0.5, depth: 2 },
    { axis: "x", value: 0.65, depth: 3 },
    { axis: "y", value: 0.72, depth: 4 },
  ];
  return candidates.filter((s) => s.depth <= depth);
}

export function predictTree(x: number, y: number, splits: Split[]): 0 | 1 {
  let label: 0 | 1 = 0;
  for (const split of splits) {
    const coord = split.axis === "x" ? x : y;
    if (coord >= split.value) label = 1;
  }
  if (x > 0.55 && y > 0.6) label = 1;
  if (x < 0.35 && y < 0.45) label = 0;
  return label;
}

export function accuracy(points: LabeledPoint[], splits: Split[]): number {
  const correct = points.filter((p) => predictTree(p.x, p.y, splits) === p.label).length;
  return correct / points.length;
}

export function treeReadout(scenario: Scenario, depth: number, acc: number): string {
  if (depth === 0) {
    return "Depth 0: one majority-class prediction. No rules yet.";
  }
  if (depth >= 3 && acc > 0.85) {
    return `Depth ${depth} fits training data well (${(acc * 100).toFixed(0)}% on this sample). Watch overfitting on thin regions.`;
  }
  return `Depth ${depth} adds ${depth} axis-aligned split(s). Readable for ${scenario.class0Label} vs ${scenario.class1Label}; deeper trees memorize noise.`;
}
