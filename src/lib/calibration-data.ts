export type ScenarioKey = "fraud_flag" | "hiring_screen" | "support_escalation";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  scoreLabel: string;
  outcomeLabel: string;
  baseRate: number;
  defaultQuality: number;
};

export const SCORE_BUCKETS = [0.1, 0.3, 0.5, 0.7, 0.9] as const;

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_flag: {
    key: "fraud_flag",
    shortLabel: "Fraud scores",
    headline: "Orders scored 90% fraud are only ~55% fraud after review.",
    scoreLabel: "Model fraud score",
    outcomeLabel: "Share that are actually fraud",
    baseRate: 0.02,
    defaultQuality: 25,
  },
  hiring_screen: {
    key: "hiring_screen",
    shortLabel: "Hiring scores",
    headline: "Candidates scored 80% likely to succeed fail the job half the time.",
    scoreLabel: "Model success score",
    outcomeLabel: "Share who truly succeed on the job",
    baseRate: 0.12,
    defaultQuality: 30,
  },
  support_escalation: {
    key: "support_escalation",
    shortLabel: "Escalation scores",
    headline: "Tickets scored high risk often do not need escalation.",
    scoreLabel: "Model escalation score",
    outcomeLabel: "Share that truly need escalation",
    baseRate: 0.08,
    defaultQuality: 28,
  },
};

/** calibrationQuality 0 = overconfident, 50 = perfect, 100 = underconfident */
export function actualRateForPredicted(
  predicted: number,
  calibrationQuality: number,
  baseRate: number,
): number {
  const q = Math.max(0, Math.min(100, calibrationQuality));
  if (q === 50) {
    return predicted;
  }
  if (q < 50) {
    const factor = (50 - q) / 50;
    return clamp(predicted * (1 - factor * 0.5) + baseRate * (factor * 0.35), 0.01, 0.99);
  }
  const factor = (q - 50) / 50;
  return clamp(predicted * (1 + factor * 0.22), 0.01, 0.99);
}

export function bucketActualRates(
  calibrationQuality: number,
  baseRate: number,
): { predicted: number; actual: number; gap: number }[] {
  return SCORE_BUCKETS.map((predicted) => {
    const actual = actualRateForPredicted(predicted, calibrationQuality, baseRate);
    return {
      predicted,
      actual,
      gap: predicted - actual,
    };
  });
}

export function calibrationLabel(quality: number): string {
  if (quality >= 45 && quality <= 55) {
    return "Well calibrated";
  }
  if (quality < 45) {
    return "Overconfident";
  }
  return "Underconfident";
}

export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function calibrationReadout(
  quality: number,
  buckets: { predicted: number; actual: number; gap: number }[],
  scenario: Scenario,
): string {
  const highBucket = buckets[buckets.length - 1];
  const gapPct = highBucket.gap * 100;
  if (quality >= 45 && quality <= 55) {
    return `Scores track reality across buckets. A ${formatPercent(highBucket.predicted)} score means about ${formatPercent(highBucket.actual)} are truly positive — safe for threshold rules.`;
  }
  if (quality < 45) {
    return `At ${formatPercent(highBucket.predicted)} predicted, only ${formatPercent(highBucket.actual)} are truly positive — a ${Math.abs(gapPct).toFixed(0)} pp gap. Auto-${scenario.outcomeLabel.toLowerCase().includes("fraud") ? "block" : "approve"} rules built on raw scores will misfire even if ranking is useful.`;
  }
  return `Scores are conservative: ${formatPercent(highBucket.predicted)} predicted maps to ${formatPercent(highBucket.actual)} actual. You may under-react unless thresholds account for underconfidence.`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
