export type ScenarioKey = "mix_shift" | "cohort_decline" | "signup_surge";

export type CohortRow = {
  label: string;
  retentionRate: number;
  weight: number;
};

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  context: string;
  cohorts: CohortRow[];
  sliderLabel?: string;
  sliderMin?: number;
  sliderMax?: number;
  sliderDefault?: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  mix_shift: {
    key: "mix_shift",
    shortLabel: "Mix shift",
    headline: "Signup-month quality is flat; the active base got younger.",
    context: "30-day retention by signup month.",
    sliderLabel: "Share of users from Dec + Jan signups",
    sliderMin: 15,
    sliderMax: 70,
    sliderDefault: 28,
    cohorts: [
      { label: "Oct signup", retentionRate: 46, weight: 0 },
      { label: "Nov signup", retentionRate: 43, weight: 0 },
      { label: "Dec signup", retentionRate: 40, weight: 0 },
      { label: "Jan signup", retentionRate: 37, weight: 0 },
    ],
  },
  cohort_decline: {
    key: "cohort_decline",
    shortLabel: "Cohort decline",
    headline: "Each new signup month retains worse at day 30.",
    context: "Equal mix across signup months.",
    cohorts: [
      { label: "Oct signup", retentionRate: 48, weight: 25 },
      { label: "Nov signup", retentionRate: 45, weight: 25 },
      { label: "Dec signup", retentionRate: 42, weight: 25 },
      { label: "Jan signup", retentionRate: 39, weight: 25 },
    ],
  },
  signup_surge: {
    key: "signup_surge",
    shortLabel: "Signup surge",
    headline: "January doubled signups; headline retention fell with older cohorts steady.",
    context: "Marketing spike skews the blend toward low-D30 recent signups.",
    cohorts: [
      { label: "Oct signup", retentionRate: 47, weight: 15 },
      { label: "Nov signup", retentionRate: 46, weight: 15 },
      { label: "Dec signup", retentionRate: 45, weight: 20 },
      { label: "Jan signup", retentionRate: 36, weight: 50 },
    ],
  },
};

export function mixShiftWeights(recentShare: number): number[] {
  const recent = recentShare / 100;
  const mature = 1 - recent;
  return [mature * 0.45, mature * 0.55, recent * 0.48, recent * 0.52];
}

export function applyWeights(cohorts: CohortRow[], weights: number[]): CohortRow[] {
  return cohorts.map((row, index) => ({
    ...row,
    weight: Math.round(weights[index] * 1000) / 10,
  }));
}

export function weightedRetention(cohorts: CohortRow[]): number {
  const totalWeight = cohorts.reduce((sum, row) => sum + row.weight, 0);
  if (totalWeight === 0) {
    return 0;
  }
  const weighted = cohorts.reduce(
    (sum, row) => sum + row.retentionRate * row.weight,
    0,
  );
  return weighted / totalWeight;
}

export function formatRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatWeight(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function cohortRead(
  scenarioKey: ScenarioKey,
  cohorts: CohortRow[],
  overall: number,
): string {
  const rates = cohorts.map((row) => row.retentionRate);
  const declining = rates.every((rate, index) => index === 0 || rate <= rates[index - 1]);
  const mixedDecline = rates[0] > rates[rates.length - 1];

  if (scenarioKey === "mix_shift") {
    const recentWeight = cohorts[2].weight + cohorts[3].weight;
    return `Headline retention is ${formatRate(overall)} with ${formatWeight(recentWeight)} of users from recent signups. Cohort D30 rates are unchanged. Check whether the mix shifted before you blame the product.`;
  }

  if (scenarioKey === "cohort_decline") {
    return declining
      ? `Each signup month retains worse at day 30. Headline ${formatRate(overall)} reflects a real product slide, not a mix artifact.`
      : `Compare cohorts at the same age before you trust the rolled-up retention number.`;
  }

  if (scenarioKey === "signup_surge") {
    return mixedDecline
      ? `Jan signups are half the measured base at ${formatRate(cohorts[3].retentionRate)} D30 retention. Headline ${formatRate(overall)} fell even though Oct and Nov cohorts held near ${formatRate(cohorts[0].retentionRate)}.`
      : "A signup surge can move the headline without changing older cohort behavior.";
  }

  return "Split by signup cohort before you react to the headline retention rate.";
}
