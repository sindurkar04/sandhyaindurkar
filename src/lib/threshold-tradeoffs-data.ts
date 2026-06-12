export type ScenarioKey = "fraud_block" | "content_flag" | "hiring_screen";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  dailyVolume: number;
  baseRate: number;
  defaultThreshold: number;
  defaultCapacity: number;
  fpCost: number;
  fnCost: number;
  fpLabel: string;
  fnLabel: string;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_block: {
    key: "fraud_block",
    shortLabel: "Fraud auto-block",
    headline: "Lower threshold catches more fraud and floods review with clean orders.",
    dailyVolume: 5000,
    baseRate: 0.02,
    defaultThreshold: 82,
    defaultCapacity: 200,
    fpCost: 45,
    fnCost: 320,
    fpLabel: "Clean order blocked",
    fnLabel: "Fraud missed",
  },
  content_flag: {
    key: "content_flag",
    shortLabel: "Content moderation",
    headline: "Tight flag rules catch policy violations. Human reviewers drown in false flags.",
    dailyVolume: 12000,
    baseRate: 0.035,
    defaultThreshold: 78,
    defaultCapacity: 350,
    fpCost: 18,
    fnCost: 210,
    fpLabel: "Clean post flagged",
    fnLabel: "Violation missed",
  },
  hiring_screen: {
    key: "hiring_screen",
    shortLabel: "Hiring screen",
    headline: "Lower bar advances more candidates. Precision drops and interviews pile up.",
    dailyVolume: 800,
    baseRate: 0.14,
    defaultThreshold: 70,
    defaultCapacity: 60,
    fpCost: 95,
    fnCost: 480,
    fpLabel: "Weak candidate advanced",
    fnLabel: "Strong hire missed",
  },
};

export type ThresholdMetrics = {
  flagged: number;
  tp: number;
  fp: number;
  fn: number;
  precision: number;
  recall: number;
  overflow: number;
  fpCostTotal: number;
  fnCostTotal: number;
  totalCost: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** threshold 0–100 maps to score cutoff; lower threshold → more flags, higher recall */
export function metricsAtThreshold(
  thresholdPct: number,
  capacity: number,
  scenario: Scenario,
): ThresholdMetrics {
  const t = clamp(thresholdPct, 55, 95) / 100;
  const totalPos = Math.round(scenario.dailyVolume * scenario.baseRate);
  const flaggedFraction = clamp(0.38 * Math.pow(1 - t + 0.08, 1.6), 0.006, 0.22);
  const recall = clamp(0.12 + 0.86 * Math.pow(1 - t + 0.12, 0.75), 0.08, 0.97);

  const flagged = Math.round(scenario.dailyVolume * flaggedFraction);
  const tp = Math.min(Math.round(totalPos * recall), flagged);
  const fp = Math.max(0, flagged - tp);
  const fn = Math.max(0, totalPos - tp);
  const precision = flagged > 0 ? tp / flagged : 0;
  const overflow = Math.max(0, flagged - capacity);
  const fpCostTotal = fp * scenario.fpCost;
  const fnCostTotal = fn * scenario.fnCost;

  return {
    flagged,
    tp,
    fp,
    fn,
    precision,
    recall,
    overflow,
    fpCostTotal,
    fnCostTotal,
    totalCost: fpCostTotal + fnCostTotal,
  };
}

export function thresholdCurve(
  scenario: Scenario,
  capacity: number,
): { threshold: number; precision: number; recall: number }[] {
  return [60, 65, 70, 75, 80, 85, 90, 95].map((threshold) => {
    const m = metricsAtThreshold(threshold, capacity, scenario);
    return { threshold, precision: m.precision, recall: m.recall };
  });
}

export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatMoney(value: number): string {
  return `$${value.toLocaleString()}`;
}

export function thresholdReadout(
  threshold: number,
  capacity: number,
  metrics: ThresholdMetrics,
  scenario: Scenario,
): string {
  if (metrics.overflow > 50) {
    return `At ${threshold}% threshold, ${metrics.flagged} cases/day exceed ${capacity} review slots (+${metrics.overflow} overflow). Precision is ${formatPercent(metrics.precision)}. Most flagged cases are false alarms. Raise threshold or add capacity before tightening policy.`;
  }
  if (metrics.precision < 0.35 && metrics.recall > 0.7) {
    return `Recall is ${formatPercent(metrics.recall)} but precision is only ${formatPercent(metrics.precision)}. You catch most positives but pay ${formatMoney(metrics.fpCostTotal)}/day in ${scenario.fpLabel.toLowerCase()} costs. Pair with calibration or raise the bar.`;
  }
  if (metrics.recall < 0.45) {
    return `High threshold (${threshold}%) keeps precision at ${formatPercent(metrics.precision)}, but recall is ${formatPercent(metrics.recall)}. ${metrics.fn} ${scenario.fnLabel.toLowerCase()} cases/day slip through (${formatMoney(metrics.fnCostTotal)} cost).`;
  }
  return `Balanced zone: precision ${formatPercent(metrics.precision)}, recall ${formatPercent(metrics.recall)}, daily cost ${formatMoney(metrics.totalCost)}. Tune threshold against ${scenario.fpLabel.toLowerCase()} vs ${scenario.fnLabel.toLowerCase()} dollar weights.`;
}
