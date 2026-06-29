export type ScenarioKey = "fraud_score" | "hiring_screen" | "churn_risk";

export type LabeledPoint = { x: number; y: number; label: 0 | 1 };

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  class0Label: string;
  class1Label: string;
  featureX: string;
  featureY: string;
  defaultW0: number;
  defaultW1: number;
  defaultW2: number;
  points: LabeledPoint[];
};

const BASE_POINTS: LabeledPoint[] = [
  { x: 0.15, y: 0.2, label: 0 },
  { x: 0.25, y: 0.15, label: 0 },
  { x: 0.2, y: 0.35, label: 0 },
  { x: 0.35, y: 0.25, label: 0 },
  { x: 0.3, y: 0.4, label: 0 },
  { x: 0.75, y: 0.25, label: 0 },
  { x: 0.8, y: 0.35, label: 0 },
  { x: 0.7, y: 0.15, label: 0 },
  { x: 0.78, y: 0.78, label: 1 },
  { x: 0.88, y: 0.72, label: 1 },
  { x: 0.72, y: 0.88, label: 1 },
  { x: 0.85, y: 0.85, label: 1 },
  { x: 0.25, y: 0.75, label: 1 },
  { x: 0.35, y: 0.82, label: 1 },
  { x: 0.18, y: 0.88, label: 1 },
  { x: 0.55, y: 0.55, label: 1 },
  { x: 0.5, y: 0.45, label: 0 },
  { x: 0.62, y: 0.38, label: 0 },
];

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_score: {
    key: "fraud_score",
    shortLabel: "Fraud score",
    headline: "Logistic regression draws a linear boundary and outputs a probability, not just yes/no.",
    class0Label: "Legitimate",
    class1Label: "Fraud",
    featureX: "Velocity",
    featureY: "Amount",
    defaultW0: -0.2,
    defaultW1: 2.4,
    defaultW2: 2.8,
    points: BASE_POINTS,
  },
  hiring_screen: {
    key: "hiring_screen",
    shortLabel: "Hiring screen",
    headline: "A score from 0 to 1 ranks candidates; policy picks the interview cutoff.",
    class0Label: "Pass",
    class1Label: "Advance",
    featureX: "Skills match",
    featureY: "Experience",
    defaultW0: -1.5,
    defaultW1: 3.2,
    defaultW2: 2.0,
    points: BASE_POINTS,
  },
  churn_risk: {
    key: "churn_risk",
    shortLabel: "Churn risk",
    headline: "Two usage features combine into one retention probability per account.",
    class0Label: "Retain",
    class1Label: "Churn risk",
    featureX: "Login freq.",
    featureY: "Support tickets",
    defaultW0: 0.5,
    defaultW1: -2.5,
    defaultW2: 2.2,
    points: BASE_POINTS.map((p) => ({ x: p.y, y: p.x, label: p.label })),
  },
};

export const COLORS = {
  class0: "#3b82f6",
  class1: "#f97316",
  boundary: "#8b5cf6",
  sigmoid: "#2563eb",
  grid: "#e2e8f0",
  correct: "#22c55e",
  wrong: "#ef4444",
} as const;

export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function logit(p: number): number {
  const clamped = Math.max(0.001, Math.min(0.999, p));
  return Math.log(clamped / (1 - clamped));
}

export function predictProba(x: number, y: number, w0: number, w1: number, w2: number): number {
  return sigmoid(w0 + w1 * x + w2 * y);
}

export function boundaryY(x: number, w0: number, w1: number, w2: number): number | null {
  if (Math.abs(w2) < 0.01) return null;
  return -(w0 + w1 * x) / w2;
}

export function classifyPoint(
  x: number,
  y: number,
  w0: number,
  w1: number,
  w2: number,
  cutoff: number,
): 0 | 1 {
  return predictProba(x, y, w0, w1, w2) >= cutoff ? 1 : 0;
}

export function formatPct(p: number): string {
  return `${(p * 100).toFixed(0)}%`;
}

export function formatNum(n: number, d = 2): string {
  return n.toFixed(d);
}

export function logisticReadout(
  scenario: Scenario,
  cutoff: number,
  accuracy: number,
): string {
  if (accuracy < 0.75) {
    return `Boundary at ${formatPct(cutoff)} probability misclassifies many points. Logistic regression assumes a linear separator; nonlinear patterns need trees or more features.`;
  }
  return `At cutoff ${formatPct(cutoff)}, the linear boundary separates ${formatPct(accuracy)} of training points. Output is a probability you can calibrate and threshold.`;
}

export function accuracyOnPoints(
  points: LabeledPoint[],
  w0: number,
  w1: number,
  w2: number,
  cutoff: number,
): number {
  if (points.length === 0) return 0;
  const correct = points.filter(
    (p) => classifyPoint(p.x, p.y, w0, w1, w2, cutoff) === p.label,
  ).length;
  return correct / points.length;
}
