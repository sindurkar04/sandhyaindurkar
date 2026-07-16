export type ScenarioKey = "disease_screen" | "fraud_alert" | "content_flag";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  eventALabel: string;
  eventBLabel: string;
  defaultPrior: number;
  defaultSensitivity: number;
  defaultFalsePositive: number;
};

export const COLORS = {
  blue: "#2563eb",
  teal: "#0d9488",
  orange: "#ea580c",
  violet: "#8b5cf6",
  rose: "#e11d48",
  amber: "#d97706",
} as const;

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  disease_screen: {
    key: "disease_screen",
    shortLabel: "Disease screen",
    headline: "A positive test updates belief, but the prior base rate still sets the starting point.",
    eventALabel: "Has disease",
    eventBLabel: "Positive test",
    defaultPrior: 2,
    defaultSensitivity: 95,
    defaultFalsePositive: 8,
  },
  fraud_alert: {
    key: "fraud_alert",
    shortLabel: "Fraud alert",
    headline: "High sensitivity does not mean every alert is fraud. Bayes folds in how rare fraud is.",
    eventALabel: "Is fraud",
    eventBLabel: "Model alert",
    defaultPrior: 1.5,
    defaultSensitivity: 92,
    defaultFalsePositive: 6,
  },
  content_flag: {
    key: "content_flag",
    shortLabel: "Content flag",
    headline: "Moderation queues need the posterior read: what a flag means after base rate and error rates.",
    eventALabel: "Policy violation",
    eventBLabel: "Auto flag",
    defaultPrior: 4,
    defaultSensitivity: 88,
    defaultFalsePositive: 12,
  },
};

export type BayesBreakdown = {
  prior: number;
  likelihood: number;
  marginal: number;
  posterior: number;
  priorPos: number;
  falsePos: number;
  truePos: number;
};

export function bayesBreakdown(
  priorPercent: number,
  sensitivityPercent: number,
  falsePositivePercent: number,
): BayesBreakdown {
  const prior = priorPercent / 100;
  const sensitivity = sensitivityPercent / 100;
  const falsePositive = falsePositivePercent / 100;
  const truePos = prior * sensitivity;
  const falsePos = (1 - prior) * falsePositive;
  const marginal = truePos + falsePos;
  const posterior = marginal > 0 ? truePos / marginal : 0;
  return {
    prior,
    likelihood: sensitivity,
    marginal,
    posterior,
    priorPos: prior,
    falsePos,
    truePos,
  };
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function bayesReadout(scenario: Scenario, breakdown: BayesBreakdown): string {
  return `P(${scenario.eventALabel} | ${scenario.eventBLabel}) = ${formatPct(breakdown.posterior)}. Prior was ${formatPct(breakdown.prior)}; the positive signal raised belief, but ${formatPct(1 - breakdown.posterior)} of positives are still false alarms at these rates.`;
}
