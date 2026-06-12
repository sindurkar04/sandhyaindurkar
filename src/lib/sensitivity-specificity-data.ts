export type ScenarioKey = "fraud" | "medical" | "content";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  population: number;
  prevalence: number;
  sensitivity: number;
  specificity: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud: {
    key: "fraud",
    shortLabel: "Fraud flag",
    headline: "90% sensitivity sounds strong until you read the false-positive column.",
    population: 10000,
    prevalence: 0.02,
    sensitivity: 0.9,
    specificity: 0.92,
  },
  medical: {
    key: "medical",
    shortLabel: "Medical screen",
    headline: "A rare condition plus a good test still yields many false alarms.",
    population: 10000,
    prevalence: 0.01,
    sensitivity: 0.95,
    specificity: 0.97,
  },
  content: {
    key: "content",
    shortLabel: "Content mod",
    headline: "High recall on policy violations can flood reviewers with clean posts.",
    population: 10000,
    prevalence: 0.04,
    sensitivity: 0.88,
    specificity: 0.9,
  },
};

export type ScreeningCounts = {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  flagged: number;
  precision: number;
  npv: number;
};

export function screeningCounts(scenario: Scenario): ScreeningCounts {
  const positives = Math.round(scenario.population * scenario.prevalence);
  const negatives = scenario.population - positives;
  const tp = Math.round(positives * scenario.sensitivity);
  const fn = positives - tp;
  const fp = Math.round(negatives * (1 - scenario.specificity));
  const tn = negatives - fp;
  const flagged = tp + fp;
  const precision = flagged > 0 ? tp / flagged : 0;
  const cleared = tn + fn;
  const npv = cleared > 0 ? tn / cleared : 0;
  return { tp, fp, fn, tn, flagged, precision, npv };
}

export function formatPct(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function screeningReadout(scenario: Scenario, counts: ScreeningCounts): string {
  return `Sensitivity ${formatPct(scenario.sensitivity)} catches most cases, but only ${formatPct(counts.precision)} of flagged rows are true positives. Positive predictive value is what reviewers feel in the queue.`;
}
