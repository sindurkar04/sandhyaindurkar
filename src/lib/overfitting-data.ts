export type ScenarioKey = "weekly_orders" | "ad_spend" | "churn_model";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  context: string;
  defaultComplexity: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  weekly_orders: {
    key: "weekly_orders",
    shortLabel: "Weekly orders",
    headline: "Finance trusts a wiggly forecast that memorized last quarter.",
    context: "Ops team fits weekly order history to plan inventory.",
    defaultComplexity: 7,
  },
  ad_spend: {
    key: "ad_spend",
    shortLabel: "Ad spend ROI",
    headline: "Marketing adds five channel dials; training ROI looks perfect.",
    context: "Growth models return on ad spend with many interaction terms.",
    defaultComplexity: 8,
  },
  churn_model: {
    key: "churn_model",
    shortLabel: "Churn score",
    headline: "Data science ships a churn model with 96% training accuracy.",
    context: "Retention team scores accounts for outreach.",
    defaultComplexity: 9,
  },
};

/** complexity 1 = simple (2 params), 10 = very flexible */
export function errorsFromComplexity(complexity: number): {
  trainError: number;
  holdoutError: number;
} {
  const c = Math.max(1, Math.min(10, complexity));
  const trainError = Math.max(3, 28 - c * 2.4);
  const holdoutError = 18 + Math.max(0, c - 4) ** 1.6 * 2.2;
  return {
    trainError: Math.round(trainError * 10) / 10,
    holdoutError: Math.round(holdoutError * 10) / 10,
  };
}

export function formatError(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function overfitRead(
  complexity: number,
  trainError: number,
  holdoutError: number,
): string {
  const gap = holdoutError - trainError;
  if (complexity <= 4 && gap < 8) {
    return `Train and holdout errors stay close. A simpler model is enough for this decision.`;
  }
  if (gap >= 15) {
    return `Holdout error is ${formatError(holdoutError)} vs train ${formatError(trainError)}. The model is memorizing history, not forecasting new weeks.`;
  }
  if (gap >= 8) {
    return `Gap is widening. Try fewer variables or a simpler curve before you share the forecast.`;
  }
  return `Monitor the train vs holdout gap as you add complexity.`;
}

/** Synthetic weekly points + fitted curve height at x for SVG */
const BASE_POINTS = [42, 45, 44, 48, 51, 49, 53, 55, 52, 58, 56, 60];

export function chartPoints(complexity: number): { x: number; y: number; actual?: number }[] {
  const c = Math.max(1, Math.min(10, complexity));
  return BASE_POINTS.map((actual, index) => {
    const x = index;
    const noise =
      c >= 6
        ? Math.sin(index * (c * 0.9)) * (c - 4) * 1.2 + Math.cos(index * 1.7) * (c - 5) * 0.8
        : 0;
    const trend = 42 + index * 1.5;
    const fit = trend + noise;
    return { x, y: fit, actual };
  });
}
