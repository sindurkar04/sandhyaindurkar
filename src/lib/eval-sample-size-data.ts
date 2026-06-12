export type ScenarioKey = "fraud_precision" | "routing_recall" | "hiring_f1";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  trueMetric: number;
  metricLabel: string;
  metricName: "precision" | "recall" | "f1";
  flagRate: number;
  prevalence: number;
  defaultEvalN: number;
  minEvalN: number;
  maxEvalN: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_precision: {
    key: "fraud_precision",
    shortLabel: "Fraud precision",
    headline: "500-row eval set, 4% flagged. Precision CI is still ±15 pp wide.",
    trueMetric: 0.68,
    metricLabel: "Precision on flagged orders",
    metricName: "precision",
    flagRate: 0.04,
    prevalence: 0.02,
    defaultEvalN: 500,
    minEvalN: 80,
    maxEvalN: 4000,
  },
  routing_recall: {
    key: "routing_recall",
    shortLabel: "Routing recall",
    headline: "800 labels but only 64 true escalations. Recall band stays noisy.",
    trueMetric: 0.74,
    metricLabel: "Recall on true escalations",
    metricName: "recall",
    flagRate: 0.12,
    prevalence: 0.08,
    defaultEvalN: 800,
    minEvalN: 100,
    maxEvalN: 5000,
  },
  hiring_f1: {
    key: "hiring_f1",
    shortLabel: "Hiring F1",
    headline: "Thin positive class in eval. F1 looks solid on 200 rows, but the interval says wait.",
    trueMetric: 0.62,
    metricLabel: "F1 on screened candidates",
    metricName: "f1",
    flagRate: 0.22,
    prevalence: 0.14,
    defaultEvalN: 400,
    minEvalN: 60,
    maxEvalN: 3000,
  },
};

export type EvalMetrics = {
  evalN: number;
  effectiveN: number;
  positiveLabels: number;
  flaggedLabels: number;
  marginOfError: number;
  low: number;
  high: number;
  reliability: "thin" | "directional" | "reliable";
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Effective n = denominator size for the metric's binomial SE */
export function effectiveSampleSize(scenario: Scenario, evalN: number): number {
  if (scenario.metricName === "precision") {
    return Math.max(1, Math.round(evalN * scenario.flagRate));
  }
  if (scenario.metricName === "recall") {
    return Math.max(1, Math.round(evalN * scenario.prevalence));
  }
  return Math.max(1, Math.round(evalN * scenario.prevalence * 0.85));
}

export function evalMetrics(scenario: Scenario, evalN: number): EvalMetrics {
  const n = clamp(evalN, scenario.minEvalN, scenario.maxEvalN);
  const effectiveN = effectiveSampleSize(scenario, n);
  const positiveLabels = Math.round(n * scenario.prevalence);
  const flaggedLabels = Math.round(n * scenario.flagRate);
  const p = scenario.trueMetric;
  const se = Math.sqrt((p * (1 - p)) / effectiveN);
  const marginOfError = 1.96 * se;

  let reliability: EvalMetrics["reliability"] = "reliable";
  if (effectiveN < 25 || marginOfError > 0.12) {
    reliability = "thin";
  } else if (effectiveN < 80 || marginOfError > 0.06) {
    reliability = "directional";
  }

  return {
    evalN: n,
    effectiveN,
    positiveLabels,
    flaggedLabels,
    marginOfError,
    low: clamp(p - marginOfError, 0, 1),
    high: clamp(p + marginOfError, 0, 1),
    reliability,
  };
}

export function marginCurve(scenario: Scenario): { evalN: number; moe: number }[] {
  const steps = [100, 200, 400, 800, 1200, 2000, 3000, 4000, 5000].filter(
    (n) => n >= scenario.minEvalN && n <= scenario.maxEvalN,
  );
  return steps.map((evalN) => ({
    evalN,
    moe: evalMetrics(scenario, evalN).marginOfError * 100,
  }));
}

export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function reliabilityLabel(r: EvalMetrics["reliability"]): string {
  if (r === "thin") {
    return "Too thin to ship";
  }
  if (r === "directional") {
    return "Directional only";
  }
  return "Reliable for policy";
}

export function evalReadout(scenario: Scenario, metrics: EvalMetrics): string {
  const moePp = (metrics.marginOfError * 100).toFixed(0);
  const denom =
    scenario.metricName === "precision"
      ? `${metrics.flaggedLabels} flagged rows`
      : `${metrics.positiveLabels} positive labels`;

  if (metrics.reliability === "thin") {
    return `${scenario.metricLabel} is ${formatPercent(scenario.trueMetric)} on paper, but ±${moePp} pp at 95% with only ${denom} in the eval set. Label more before changing thresholds or shipping the model.`;
  }
  if (metrics.reliability === "directional") {
    return `Interval ${formatPercent(metrics.low, 1)}–${formatPercent(metrics.high, 1)} on ${metrics.evalN.toLocaleString()} labels (${denom}). Good for monitoring, not enough to lock auto-policy yet.`;
  }
  return `At ${metrics.evalN.toLocaleString()} labels, ${scenario.metricLabel.toLowerCase()} is ${formatPercent(scenario.trueMetric)} ±${moePp} pp. Enough precision to compare model versions or set a threshold band.`;
}
