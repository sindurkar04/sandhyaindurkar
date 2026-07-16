export type ScenarioKey = "customer_similarity" | "product_match" | "fraud_profile";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  feature1Label: string;
  feature2Label: string;
  feature1Unit: string;
  feature2Unit: string;
  defaultPointA: [number, number];
  defaultPointB: [number, number];
  defaultMean1: number;
  defaultSd1: number;
  defaultMean2: number;
  defaultSd2: number;
};

export const COLORS = {
  blue: "#2563eb",
  teal: "#0d9488",
  orange: "#ea580c",
  violet: "#8b5cf6",
  rose: "#e11d48",
  amber: "#d97706",
  grid: "#e2e8f0",
  axis: "#94a3b8",
} as const;

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  customer_similarity: {
    key: "customer_similarity",
    shortLabel: "Customer match",
    headline: "Revenue in dollars dwarfs session counts. Distance follows the loud feature.",
    feature1Label: "Revenue",
    feature2Label: "Sessions",
    feature1Unit: "$",
    feature2Unit: "sessions",
    defaultPointA: [120, 45],
    defaultPointB: [180, 52],
    defaultMean1: 150,
    defaultSd1: 40,
    defaultMean2: 50,
    defaultSd2: 12,
  },
  product_match: {
    key: "product_match",
    shortLabel: "Product vectors",
    headline: "Page views and price sit on different scales. k-NN picks the wrong neighbor without scaling.",
    feature1Label: "Price",
    feature2Label: "Page views",
    feature1Unit: "$",
    feature2Unit: "views",
    defaultPointA: [29, 1200],
    defaultPointB: [35, 1450],
    defaultMean1: 32,
    defaultSd1: 8,
    defaultMean2: 1300,
    defaultSd2: 350,
  },
  fraud_profile: {
    key: "fraud_profile",
    shortLabel: "Fraud profile",
    headline: "Transaction amount dominates login count in raw space. Z-scores balance the vote.",
    feature1Label: "Amount",
    feature2Label: "Logins",
    feature1Unit: "$",
    feature2Unit: "logins",
    defaultPointA: [420, 3],
    defaultPointB: [510, 5],
    defaultMean1: 480,
    defaultSd1: 90,
    defaultMean2: 4,
    defaultSd2: 1.5,
  },
};

export function zScore(value: number, mean: number, sd: number): number {
  if (sd <= 0) return 0;
  return (value - mean) / sd;
}

export function minMaxScale(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return (value - min) / (max - min);
}

export function l2Distance(a: [number, number], b: [number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function scalingReadout(
  rawDist: number,
  zDist: number,
  scenario: Scenario,
): string {
  const ratio = rawDist > 0 ? zDist / rawDist : 0;
  if (ratio < 0.5) {
    return `Raw L2 distance is ${formatNum(rawDist)} because ${scenario.feature1Label} gaps dominate. After z-scoring, L2 drops to ${formatNum(zDist)} and both features share influence.`;
  }
  return `Z-scored L2 is ${formatNum(zDist)} versus raw ${formatNum(rawDist)}. Comparable scales let distance and k-NN reflect both ${scenario.feature1Label} and ${scenario.feature2Label}.`;
}
