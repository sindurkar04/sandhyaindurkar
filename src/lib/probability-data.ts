export type ScenarioKey = "email_test" | "sales_close" | "feature_adoption";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  context: string;
  defaultSuccesses: number;
  defaultTrials: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  email_test: {
    key: "email_test",
    shortLabel: "Email test wins",
    context: "Past subject-line tests that hit the open-rate goal",
    defaultSuccesses: 17,
    defaultTrials: 40,
  },
  sales_close: {
    key: "sales_close",
    shortLabel: "Deal close rate",
    context: "Opportunities that reached closed-won last quarter",
    defaultSuccesses: 28,
    defaultTrials: 80,
  },
  feature_adoption: {
    key: "feature_adoption",
    shortLabel: "Feature adoption",
    context: "Rollouts where over 30% of active users tried the feature within a week",
    defaultSuccesses: 6,
    defaultTrials: 25,
  },
};

export function estimateProbability(successes: number, trials: number): number {
  const n = Math.max(1, trials);
  const s = Math.min(Math.max(0, successes), n);
  return s / n;
}

export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function standardErrorRate(p: number, n: number): number {
  const trials = Math.max(1, n);
  return Math.sqrt((p * (1 - p)) / trials);
}

export function stabilityRead(p: number, n: number): string {
  const se = standardErrorRate(p, n);
  const low = Math.max(0, (p - 1.96 * se) * 100);
  const high = Math.min(100, (p + 1.96 * se) * 100);
  if (n < 30) {
    return `With only ${n} trials, ${formatPercent(p)} could plausibly sit between ${low.toFixed(0)}% and ${high.toFixed(0)}%. Treat this as directional.`;
  }
  if (n < 200) {
    return `At n = ${n}, a rough 95% band is ${low.toFixed(1)}% to ${high.toFixed(1)}%. Useful for planning, not a final answer.`;
  }
  return `At n = ${n}, ${formatPercent(p)} is relatively stable. A rough band is ${low.toFixed(1)}% to ${high.toFixed(1)}%.`;
}

export function compoundIndependent(pA: number, pB: number): number {
  return pA * pB;
}
