export type ScenarioKey = "marketing_mix" | "hiring_model" | "ops_drivers";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  feature1: string;
  feature2: string;
  overlap: number;
  defaultLambda: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  marketing_mix: {
    key: "marketing_mix",
    shortLabel: "Marketing mix",
    headline: "Ridge shrinks unstable ad and search coefficients when both channels correlate.",
    feature1: "Ad spend",
    feature2: "Branded search",
    overlap: 0.9,
    defaultLambda: 35,
  },
  hiring_model: {
    key: "hiring_model",
    shortLabel: "Hiring model",
    headline: "Penalty term keeps experience and seniority coefficients from exploding together.",
    feature1: "Years exp.",
    feature2: "Seniority",
    overlap: 0.85,
    defaultLambda: 40,
  },
  ops_drivers: {
    key: "ops_drivers",
    shortLabel: "Ops drivers",
    headline: "Regularization stabilizes handle time and ticket count betas on short history.",
    feature1: "Handle time",
    feature2: "Ticket count",
    overlap: 0.8,
    defaultLambda: 30,
  },
};

export type RidgeCoefs = {
  b1: number;
  b2: number;
  olsB1: number;
  olsB2: number;
};

export function ridgeCoefficients(scenario: Scenario, lambdaPct: number): RidgeCoefs {
  const t = scenario.overlap;
  const lam = lambdaPct / 100;
  const olsB1 = 1.4 - 1.1 * t;
  const olsB2 = 0.3 + 1.2 * t;
  const shrink = 1 / (1 + lam * 3);
  return {
    olsB1,
    olsB2,
    b1: olsB1 * shrink,
    b2: olsB2 * shrink,
  };
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function ridgeReadout(scenario: Scenario, lambdaPct: number, coef: RidgeCoefs): string {
  const spread = Math.abs(coef.b1 - coef.b2);
  if (lambdaPct < 15) {
    return `λ ≈ 0: OLS-style coefficients (${formatNum(coef.b1)}, ${formatNum(coef.b2)}) stay unstable with ${scenario.feature1} and ${scenario.feature2} overlap.`;
  }
  if (spread < 0.35) {
    return `λ = ${lambdaPct}% shrinks both coefficients toward zero. Magnitudes stabilize but interpretability as clean driver credit is still limited.`;
  }
  return `Ridge at λ = ${lambdaPct}% reduces coefficient swing vs OLS (${formatNum(coef.olsB1)}, ${formatNum(coef.olsB2)}). Better for prediction than causal attribution.`;
}
