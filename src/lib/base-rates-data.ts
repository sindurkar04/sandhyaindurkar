export type ScenarioKey = "fraud_flag" | "hiring_screen" | "support_escalation";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  baseLabel: string;
  signalLabel: string;
  defaultBaseRate: number;
  defaultTruePositiveRate: number;
  defaultFalsePositiveRate: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_flag: {
    key: "fraud_flag",
    shortLabel: "Fraud alerts",
    baseLabel: "Share of orders that are actually fraud",
    signalLabel: "Model flags an order",
    defaultBaseRate: 2,
    defaultTruePositiveRate: 90,
    defaultFalsePositiveRate: 8,
  },
  hiring_screen: {
    key: "hiring_screen",
    shortLabel: "Hiring screen",
    baseLabel: "Share of applicants who would succeed on the job",
    signalLabel: "Candidate passes the screen",
    defaultBaseRate: 12,
    defaultTruePositiveRate: 75,
    defaultFalsePositiveRate: 25,
  },
  support_escalation: {
    key: "support_escalation",
    shortLabel: "Escalation risk",
    baseLabel: "Tickets that truly need escalation",
    signalLabel: "Auto-routing flags high risk",
    defaultBaseRate: 8,
    defaultTruePositiveRate: 70,
    defaultFalsePositiveRate: 15,
  },
};

/** P(condition | signal) via Bayes with base rate and test accuracy. Rates in percent. */
export function posteriorGivenSignal(
  baseRatePercent: number,
  truePositivePercent: number,
  falsePositivePercent: number,
): number {
  const base = baseRatePercent / 100;
  const tp = truePositivePercent / 100;
  const fp = falsePositivePercent / 100;
  const signalRate = base * tp + (1 - base) * fp;
  if (signalRate <= 0) {
    return 0;
  }
  return (base * tp) / signalRate;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function posteriorRead(
  posterior: number,
  baseRate: number,
  scenario: Scenario,
): string {
  if (posterior < baseRate * 1.5 && baseRate < 10) {
    return `Even with a positive ${scenario.signalLabel.toLowerCase()}, only about ${formatPercent(posterior)} are truly in the target group. Most flagged cases are still false alarms when the base rate is ${formatPercent(baseRate)}.`;
  }
  if (posterior > 50) {
    return `A positive signal is meaningful here: about ${formatPercent(posterior)} of flagged cases are real. Still pair with human review when stakes are high.`;
  }
  return `After a positive signal, the updated chance is ${formatPercent(posterior)}, up from a ${formatPercent(baseRate)} base rate. Better, but not certainty.`;
}
