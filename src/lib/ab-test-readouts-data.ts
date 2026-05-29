import { wilsonInterval } from "@/lib/confidence-intervals-data";

export type ScenarioKey = "checkout_button" | "onboarding_copy" | "pricing_page";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  metricLabel: string;
  defaultControlRate: number;
  defaultVariantRate: number;
  defaultNPerArm: number;
  minLiftToShip: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  checkout_button: {
    key: "checkout_button",
    shortLabel: "Checkout button",
    metricLabel: "Conversion rate",
    defaultControlRate: 3.2,
    defaultVariantRate: 3.9,
    defaultNPerArm: 1200,
    minLiftToShip: 0.3,
  },
  onboarding_copy: {
    key: "onboarding_copy",
    shortLabel: "Onboarding copy",
    metricLabel: "Activation rate",
    defaultControlRate: 18.5,
    defaultVariantRate: 19.4,
    defaultNPerArm: 400,
    minLiftToShip: 1.0,
  },
  pricing_page: {
    key: "pricing_page",
    shortLabel: "Pricing layout",
    metricLabel: "Trial start rate",
    defaultControlRate: 6.1,
    defaultVariantRate: 6.0,
    defaultNPerArm: 250,
    minLiftToShip: 0.5,
  },
};

export function formatRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function liftPoints(control: number, variant: number): number {
  return variant - control;
}

export function intervalsOverlap(
  lowA: number,
  highA: number,
  lowB: number,
  highB: number,
): boolean {
  return !(highA < lowB || highB < lowA);
}

export function shipRead(
  controlRate: number,
  variantRate: number,
  nPerArm: number,
  minLift: number,
): { verdict: string; detail: string } {
  const control = wilsonInterval(controlRate, nPerArm);
  const variant = wilsonInterval(variantRate, nPerArm);
  const lift = liftPoints(controlRate, variantRate);
  const overlap = intervalsOverlap(control.low, control.high, variant.low, variant.high);

  if (lift < minLift && overlap) {
    return {
      verdict: "Wait or gather more data",
      detail: `Observed lift is ${lift >= 0 ? "+" : ""}${lift.toFixed(1)} pts and the 95% bands overlap. The variant is not clearly ahead of control yet.`,
    };
  }
  if (overlap) {
    return {
      verdict: "Directional only",
      detail: `Variant leads by ${lift >= 0 ? "+" : ""}${lift.toFixed(1)} pts on paper, but intervals still overlap. A few hundred more users per arm could settle it.`,
    };
  }
  if (lift >= minLift) {
    return {
      verdict: "Strong case to ship",
      detail: `Variant beats control by ${lift.toFixed(1)} pts and the 95% bands do not overlap. That clears a ${minLift.toFixed(1)} pt bar with separation.`,
    };
  }
  return {
    verdict: "Variant ahead but thin",
    detail: `Bands separated, but lift (${lift.toFixed(1)} pts) is below your ${minLift.toFixed(1)} pt minimum. Consider cost and reversibility before a full rollout.`,
  };
}
