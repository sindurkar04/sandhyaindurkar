export type ScenarioKey = "fraud_patterns" | "churn_signals" | "support_routing";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  trainLabel: string;
  liveLabel: string;
  defaultDrift: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_patterns: {
    key: "fraud_patterns",
    shortLabel: "Fraud model",
    headline: "A new payment scam shifts — training accuracy still looks fine.",
    trainLabel: "Training period score distribution",
    liveLabel: "Live period score distribution",
    defaultDrift: 55,
  },
  churn_signals: {
    key: "churn_signals",
    shortLabel: "Churn model",
    headline: "Product changes behavior — churn scores misfire on new accounts.",
    trainLabel: "Training period churn scores",
    liveLabel: "Live period churn scores",
    defaultDrift: 50,
  },
  support_routing: {
    key: "support_routing",
    shortLabel: "Routing model",
    headline: "Ticket topics shift after a launch — escalation flags spike falsely.",
    trainLabel: "Training period escalation scores",
    liveLabel: "Live period escalation scores",
    defaultDrift: 45,
  },
};

/** drift 0 = stable, 100 = severe shift */
export function metricsFromDrift(drift: number): {
  trainAccuracy: number;
  liveAccuracy: number;
  falsePositiveRate: number;
  scoreShift: number;
} {
  const d = Math.max(0, Math.min(100, drift));
  const trainAccuracy = clamp(94 - d * 0.04, 88, 96);
  const liveAccuracy = clamp(trainAccuracy - d * 0.28, 52, 94);
  const falsePositiveRate = clamp(4 + d * 0.38, 4, 42);
  const scoreShift = d * 0.35;
  return {
    trainAccuracy: Math.round(trainAccuracy * 10) / 10,
    liveAccuracy: Math.round(liveAccuracy * 10) / 10,
    falsePositiveRate: Math.round(falsePositiveRate * 10) / 10,
    scoreShift: Math.round(scoreShift * 10) / 10,
  };
}

export function driftLabel(drift: number): string {
  if (drift < 25) {
    return "Stable";
  }
  if (drift < 55) {
    return "Moderate drift";
  }
  return "Severe drift";
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function driftReadout(
  drift: number,
  metrics: ReturnType<typeof metricsFromDrift>,
  scenario: Scenario,
): string {
  const gap = metrics.trainAccuracy - metrics.liveAccuracy;
  if (drift < 25) {
    return `Train and live performance stay close. Monitor monthly, but the ${scenario.shortLabel.toLowerCase()} still matches current behavior.`;
  }
  if (gap >= 15) {
    return `Training accuracy (${formatPercent(metrics.trainAccuracy)}) masks live drop to ${formatPercent(metrics.liveAccuracy)}. False positives hit ${formatPercent(metrics.falsePositiveRate)} — the world changed, not just noise.`;
  }
  return `Live accuracy is slipping (${formatPercent(metrics.liveAccuracy)} vs train ${formatPercent(metrics.trainAccuracy)}). Schedule retraining or threshold review before auto-rules spread bad calls.`;
}

/** Histogram-like bars for train vs live (5 bins) */
export function scoreDistribution(drift: number, live: boolean): number[] {
  const d = drift / 100;
  if (!live) {
    return [8, 14, 28, 32, 18].map((v) => v);
  }
  const shift = d * 12;
  return [
    clamp(8 + shift * 1.2, 5, 35),
    clamp(14 + shift * 0.8, 8, 30),
    clamp(28 - shift * 0.5, 12, 30),
    clamp(32 - shift * 1.1, 10, 32),
    clamp(18 - shift * 0.4, 5, 25),
  ].map((v) => Math.round(v));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
