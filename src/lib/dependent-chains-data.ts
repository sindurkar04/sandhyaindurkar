export type ScenarioKey = "product_funnel" | "sales_pipeline" | "onboarding";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  step1Label: string;
  step2Label: string;
  pStep1: number;
  pStep2GivenStep1: number;
  bogusIndependent: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  product_funnel: {
    key: "product_funnel",
    shortLabel: "Signup funnel",
    headline: "40% sign up, 55% of signups activate. The funnel is not 22%.",
    step1Label: "Sign up",
    step2Label: "Activate",
    pStep1: 0.4,
    pStep2GivenStep1: 0.55,
    bogusIndependent: 0.35,
  },
  sales_pipeline: {
    key: "sales_pipeline",
    shortLabel: "Sales pipeline",
    headline: "25% book a demo, 30% of demos close. Do not multiply 25% × 30% as independent.",
    step1Label: "Book demo",
    step2Label: "Close deal",
    pStep1: 0.25,
    pStep2GivenStep1: 0.3,
    bogusIndependent: 0.18,
  },
  onboarding: {
    key: "onboarding",
    shortLabel: "Onboarding",
    headline: "60% start setup, 70% of starters finish. Conditional math beats headline averages.",
    step1Label: "Start setup",
    step2Label: "Finish setup",
    pStep1: 0.6,
    pStep2GivenStep1: 0.7,
    bogusIndependent: 0.45,
  },
};

export function jointConditional(pStep1: number, pStep2GivenStep1: number): number {
  return pStep1 * pStep2GivenStep1;
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function chainReadout(scenario: Scenario): string {
  const correct = jointConditional(scenario.pStep1, scenario.pStep2GivenStep1);
  const wrong = scenario.pStep1 * scenario.bogusIndependent;
  const gap = Math.abs(correct - wrong);
  if (gap < 0.02) {
    return `P(${scenario.step1Label} and ${scenario.step2Label}) = ${formatPct(correct)}. Here the independent shortcut is close, but still report the conditional step.`;
  }
  return `Correct: P(step1) × P(step2 | step1) = ${formatPct(correct)}. Multiplying by an unrelated ${formatPct(scenario.bogusIndependent)} rate gives ${formatPct(wrong)} and overstates the funnel by ${formatPct(gap)}.`;
}
