export type ScenarioKey = "marketing_levers" | "hiring_signals" | "ops_metrics";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  feature1: string;
  feature2: string;
  correlation: number;
  defaultOverlap: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  marketing_levers: {
    key: "marketing_levers",
    shortLabel: "Marketing levers",
    headline: "Ad spend and branded search move together. Coefficients flip sign when both are in the model.",
    feature1: "Ad spend",
    feature2: "Branded search",
    correlation: 0.92,
    defaultOverlap: 85,
  },
  hiring_signals: {
    key: "hiring_signals",
    shortLabel: "Hiring signals",
    headline: "Years of experience and seniority title overlap. Which gets credit for performance?",
    feature1: "Years exp.",
    feature2: "Seniority",
    correlation: 0.88,
    defaultOverlap: 80,
  },
  ops_metrics: {
    key: "ops_metrics",
    shortLabel: "Ops metrics",
    headline: "Handle time and ticket count per agent rise together. Driver attribution gets unstable.",
    feature1: "Handle time",
    feature2: "Tickets closed",
    correlation: 0.85,
    defaultOverlap: 75,
  },
};

export type Coefficients = {
  b1: number;
  b2: number;
  unstable: boolean;
};

/** overlap 0-100 scales how collinear the two features are */
export function coefficientsAtOverlap(scenario: Scenario, overlap: number): Coefficients {
  const t = overlap / 100;
  const r = scenario.correlation * t;
  const b1 = 1.2 - 0.9 * r;
  const b2 = 0.4 + 1.1 * r;
  const unstable = Math.abs(r) > 0.75;
  return { b1, b2, unstable };
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function collinearityReadout(scenario: Scenario, overlap: number, coef: Coefficients): string {
  const r = scenario.correlation * (overlap / 100);
  if (coef.unstable) {
    return `${scenario.feature1} and ${scenario.feature2} correlate at ~${formatNum(r * 100, 0)}%. Coefficients swap magnitude and can change sign with small data changes. Drop one feature or combine them.`;
  }
  return `Correlation ~${formatNum(r * 100, 0)}%. Coefficients are still readable, but watch overlap before trusting driver rankings.`;
}
