export type ScenarioKey = "checkout_ab" | "pricing_page" | "email_cta";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  baselineRate: number;
  mdePoints: number;
  defaultSamplePerArm: number;
  minSample: number;
  maxSample: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  checkout_ab: {
    key: "checkout_ab",
    shortLabel: "Checkout A/B",
    headline: "10k visitors per arm — can you detect a 1.5 point lift from 8%?",
    baselineRate: 8,
    mdePoints: 1.5,
    defaultSamplePerArm: 10000,
    minSample: 500,
    maxSample: 50000,
  },
  pricing_page: {
    key: "pricing_page",
    shortLabel: "Pricing page",
    headline: "Trial start rate 22% — need enough traffic to see a 3 point move.",
    baselineRate: 22,
    mdePoints: 3,
    defaultSamplePerArm: 8000,
    minSample: 500,
    maxSample: 40000,
  },
  email_cta: {
    key: "email_cta",
    shortLabel: "Email CTA",
    headline: "5% click rate — small lifts need large lists.",
    baselineRate: 5,
    mdePoints: 1,
    defaultSamplePerArm: 25000,
    minSample: 1000,
    maxSample: 80000,
  },
};

/** Approximate two-proportion test power (percent inputs). */
export function estimatePower(
  baselinePercent: number,
  mdePoints: number,
  samplePerArm: number,
): number {
  const p0 = baselinePercent / 100;
  const p1 = (baselinePercent + mdePoints) / 100;
  const n = Math.max(100, samplePerArm);
  const se = Math.sqrt((p0 * (1 - p0) + p1 * (1 - p1)) / n);
  if (se === 0) {
    return 0.05;
  }
  const zEffect = Math.abs(p1 - p0) / se;
  const zAlpha = 1.96;
  const z = zEffect - zAlpha;
  return Math.max(0.05, Math.min(0.99, normalCdf(z)));
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax));
  return sign * y;
}

export function formatPower(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}

export function powerRead(power: number, scenario: Scenario, samplePerArm: number): string {
  const pct = Math.round(power * 100);
  if (pct >= 80) {
    return `At ${formatCount(samplePerArm)} per arm, power is about ${pct}%. A real ${scenario.mdePoints} point lift is likely visible.`;
  }
  if (pct >= 50) {
    return `Power near ${pct}%. You might detect a ${scenario.mdePoints} point lift, but false negatives are common. Consider more traffic or a larger MDE.`;
  }
  return `Power only ${pct}%. With ${formatCount(samplePerArm)} per arm, a ${scenario.mdePoints} point lift often looks like noise. The test is underpowered.`;
}

export function powerLabel(power: number): string {
  if (power >= 0.8) {
    return "Well powered";
  }
  if (power >= 0.5) {
    return "Borderline";
  }
  return "Underpowered";
}
