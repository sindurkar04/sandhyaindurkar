export type ScenarioKey = "growth_sprint" | "pricing_tests" | "onboarding_tweaks";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  defaultTestCount: number;
  defaultAlphaPercent: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  growth_sprint: {
    key: "growth_sprint",
    shortLabel: "Growth sprint",
    headline: "Team runs many homepage tests in one quarter",
    defaultTestCount: 20,
    defaultAlphaPercent: 5,
  },
  pricing_tests: {
    key: "pricing_tests",
    shortLabel: "Pricing tests",
    headline: "Several price points tested on different segments",
    defaultTestCount: 12,
    defaultAlphaPercent: 5,
  },
  onboarding_tweaks: {
    key: "onboarding_tweaks",
    shortLabel: "Onboarding tweaks",
    headline: "PM ships a batch of small copy and layout tests",
    defaultTestCount: 8,
    defaultAlphaPercent: 5,
  },
};

/** P(at least one false positive) when all tests are truly null. */
export function atLeastOneFalsePositiveRate(testCount: number, alphaPercent: number): number {
  const n = Math.max(1, Math.round(testCount));
  const alpha = alphaPercent / 100;
  return 1 - (1 - alpha) ** n;
}

/** Expected number of false positives under null. */
export function expectedFalsePositives(testCount: number, alphaPercent: number): number {
  return testCount * (alphaPercent / 100);
}

export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatCount(value: number, digits = 1): string {
  return value.toFixed(digits);
}

export function manyTestsRead(
  testCount: number,
  alphaPercent: number,
  atLeastOne: number,
): string {
  const expected = expectedFalsePositives(testCount, alphaPercent);
  if (atLeastOne >= 0.5) {
    return `With ${testCount} independent null tests at ${alphaPercent}% each, you have about a ${formatPercent(atLeastOne)} chance of celebrating at least one false win. Expected false alarms: ~${formatCount(expected)}.`;
  }
  if (testCount >= 10) {
    return `Even with no real lifts, expect ~${formatCount(expected)} false wins on average. Pre-register primary metrics or adjust for multiple tests before you ship.`;
  }
  return `Fewer tests mean fewer false alarms, but each "winner" still needs interval overlap and sample size checks before rollout.`;
}
