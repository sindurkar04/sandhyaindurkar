export type ScenarioKey = "fraud" | "spam" | "churn";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  positiveLabel: string;
  negativeLabel: string;
  population: number;
  defaultPrevalence: number;
  defaultSensitivity: number;
  defaultSpecificity: number;
};

export const COLORS = {
  tp: "#0d9488",
  fp: "#ea580c",
  fn: "#e11d48",
  tn: "#2563eb",
  blue: "#2563eb",
  teal: "#0d9488",
  orange: "#ea580c",
  violet: "#8b5cf6",
  rose: "#e11d48",
  amber: "#d97706",
} as const;

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud: {
    key: "fraud",
    shortLabel: "Fraud model",
    headline: "Four boxes explain every classifier score. Counts drive precision, recall, and accuracy.",
    positiveLabel: "Fraud",
    negativeLabel: "Legit",
    population: 10000,
    defaultPrevalence: 2,
    defaultSensitivity: 90,
    defaultSpecificity: 92,
  },
  spam: {
    key: "spam",
    shortLabel: "Spam filter",
    headline: "True positives are caught spam. False positives are clean mail wrongly blocked.",
    positiveLabel: "Spam",
    negativeLabel: "Inbox",
    population: 50000,
    defaultPrevalence: 8,
    defaultSensitivity: 85,
    defaultSpecificity: 97,
  },
  churn: {
    key: "churn",
    shortLabel: "Churn risk",
    headline: "False negatives are silent churners. False positives waste retention offers.",
    positiveLabel: "Will churn",
    negativeLabel: "Will stay",
    population: 20000,
    defaultPrevalence: 12,
    defaultSensitivity: 78,
    defaultSpecificity: 88,
  },
};

export type MatrixCounts = {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
};

export type MatrixMetrics = MatrixCounts & {
  precision: number;
  recall: number;
  accuracy: number;
  flagged: number;
  cleared: number;
};

export function matrixFromRates(
  population: number,
  prevalencePercent: number,
  sensitivityPercent: number,
  specificityPercent: number,
): MatrixMetrics {
  const prevalence = prevalencePercent / 100;
  const sensitivity = sensitivityPercent / 100;
  const specificity = specificityPercent / 100;
  const positives = Math.round(population * prevalence);
  const negatives = population - positives;
  const tp = Math.round(positives * sensitivity);
  const fn = positives - tp;
  const fp = Math.round(negatives * (1 - specificity));
  const tn = negatives - fp;
  const flagged = tp + fp;
  const cleared = tn + fn;
  const precision = flagged > 0 ? tp / flagged : 0;
  const recall = positives > 0 ? tp / positives : 0;
  const accuracy = population > 0 ? (tp + tn) / population : 0;
  return { tp, fp, fn, tn, precision, recall, accuracy, flagged, cleared };
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}

export function matrixReadout(scenario: Scenario, metrics: MatrixMetrics): string {
  return `Precision ${formatPct(metrics.precision)}: of ${formatCount(metrics.flagged)} flagged rows, ${formatCount(metrics.tp)} are true ${scenario.positiveLabel.toLowerCase()}. Recall ${formatPct(metrics.recall)} catches most positives; accuracy ${formatPct(metrics.accuracy)} mixes both classes.`;
}
