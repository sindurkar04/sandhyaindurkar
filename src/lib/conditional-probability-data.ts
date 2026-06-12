export type ScenarioKey = "screening" | "hiring" | "support";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  labelA: string;
  labelB: string;
  pA: number;
  pB: number;
  pAandB: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  screening: {
    key: "screening",
    shortLabel: "Health screen",
    headline: "A positive test does not mean the same thing as a sick patient.",
    labelA: "Has condition",
    labelB: "Positive test",
    pA: 0.02,
    pB: 0.09,
    pAandB: 0.018,
  },
  hiring: {
    key: "hiring",
    shortLabel: "Hiring screen",
    headline: "Passing a screen is not the same as being a strong hire.",
    labelA: "Strong hire",
    labelB: "Passed screen",
    pA: 0.12,
    pB: 0.28,
    pAandB: 0.1,
  },
  support: {
    key: "support",
    shortLabel: "Support escalation",
    headline: "An escalated ticket is not the same as a truly urgent case.",
    labelA: "Truly urgent",
    labelB: "Escalated",
    pA: 0.06,
    pB: 0.14,
    pAandB: 0.045,
  },
};

export function pGivenB(pAandB: number, pB: number): number {
  if (pB <= 0) return 0;
  return pAandB / pB;
}

export function pGivenA(pAandB: number, pA: number): number {
  if (pA <= 0) return 0;
  return pAandB / pA;
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function conditionalReadout(scenario: Scenario): string {
  const pAgivenB = pGivenB(scenario.pAandB, scenario.pB);
  const pBgivenA = pGivenA(scenario.pAandB, scenario.pA);
  return `P(${scenario.labelA} | ${scenario.labelB}) = ${formatPct(pAgivenB)}, but P(${scenario.labelB} | ${scenario.labelA}) = ${formatPct(pBgivenA)}. They swap numerator and restrict to different groups.`;
}
