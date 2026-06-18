export type ScenarioKey = "ab_test_inputs" | "independent_kpis" | "correlated_features";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  feature1: string;
  feature2: string;
  defaultCorrelation: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  ab_test_inputs: {
    key: "ab_test_inputs",
    shortLabel: "Clean experiment",
    headline: "Randomized arms give near-orthogonal inputs. Coefficients read cleanly.",
    feature1: "Variant A flag",
    feature2: "Variant B flag",
    defaultCorrelation: 0.05,
  },
  independent_kpis: {
    key: "independent_kpis",
    shortLabel: "Independent KPIs",
    headline: "Low correlation means features point in different directions in vector space.",
    feature1: "Support CSAT",
    feature2: "Infra uptime",
    defaultCorrelation: 0.12,
  },
  correlated_features: {
    key: "correlated_features",
    shortLabel: "Correlated features",
    headline: "High correlation means nearly parallel vectors. Regression credit gets shared.",
    feature1: "Revenue",
    feature2: "Orders",
    defaultCorrelation: 0.94,
  },
};

export function angleFromCorrelation(r: number): number {
  const clamped = Math.max(-1, Math.min(1, r));
  return (Math.acos(Math.abs(clamped)) * 180) / Math.PI;
}

export function isNearOrthogonal(r: number): boolean {
  return Math.abs(r) < 0.25;
}

export function formatNum(value: number, digits = 0): string {
  return value.toFixed(digits);
}

export function orthogonalityReadout(scenario: Scenario, correlation: number): string {
  const angle = angleFromCorrelation(correlation);
  if (isNearOrthogonal(correlation)) {
    return `Correlation ${formatNum(correlation * 100)}% → angle ~${formatNum(angle)}° from orthogonal. ${scenario.feature1} and ${scenario.feature2} carry separate signal; coefficients are easier to read.`;
  }
  if (Math.abs(correlation) > 0.8) {
    return `Correlation ${formatNum(correlation * 100)}% → vectors nearly parallel (~${formatNum(angle)}° from orthogonal). Treat as one combined driver or use ridge.`;
  }
  return `Moderate correlation ${formatNum(correlation * 100)}%. Some overlap in the signal both features carry.`;
}
