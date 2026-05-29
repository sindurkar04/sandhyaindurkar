export type ScenarioKey = "mobile_desktop" | "region_split" | "plan_tier";

export type SegmentRow = {
  label: string;
  controlRate: number;
  variantRate: number;
  controlN: number;
  variantN: number;
};

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  context: string;
  segments: SegmentRow[];
};

function rate(successes: number, trials: number): number {
  return trials > 0 ? (successes / trials) * 100 : 0;
}

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  mobile_desktop: {
    key: "mobile_desktop",
    shortLabel: "Mobile vs desktop",
    context: "New checkout flow A/B test split by device type",
    segments: [
      {
        label: "Mobile",
        controlRate: rate(420, 5000),
        variantRate: rate(480, 5000),
        controlN: 5000,
        variantN: 5000,
      },
      {
        label: "Desktop",
        controlRate: rate(600, 5000),
        variantRate: rate(650, 5000),
        controlN: 5000,
        variantN: 5000,
      },
    ],
  },
  region_split: {
    key: "region_split",
    shortLabel: "US vs EU",
    context: "Pricing experiment with different traffic mix by region",
    segments: [
      {
        label: "US",
        controlRate: rate(310, 4000),
        variantRate: rate(340, 4000),
        controlN: 4000,
        variantN: 4000,
      },
      {
        label: "EU",
        controlRate: rate(180, 2000),
        variantRate: rate(210, 2000),
        controlN: 2000,
        variantN: 2000,
      },
    ],
  },
  plan_tier: {
    key: "plan_tier",
    shortLabel: "Free vs paid users",
    context: "Feature tooltip test with uneven segment sizes",
    segments: [
      {
        label: "Free plan",
        controlRate: rate(90, 3000),
        variantRate: rate(105, 3000),
        controlN: 3000,
        variantN: 3000,
      },
      {
        label: "Paid plan",
        controlRate: rate(200, 1000),
        variantRate: rate(215, 1000),
        controlN: 1000,
        variantN: 1000,
      },
    ],
  },
};

export function aggregateRate(segments: SegmentRow[], arm: "control" | "variant"): number {
  let successes = 0;
  let trials = 0;
  for (const row of segments) {
    const rate = arm === "control" ? row.controlRate : row.variantRate;
    const n = arm === "control" ? row.controlN : row.variantN;
    successes += (rate / 100) * n;
    trials += n;
  }
  return trials > 0 ? (successes / trials) * 100 : 0;
}

export function formatRate(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function liftPoints(control: number, variant: number): number {
  return variant - control;
}

export function paradoxRead(
  aggregateControl: number,
  aggregateVariant: number,
  segments: SegmentRow[],
): string {
  const aggLift = liftPoints(aggregateControl, aggregateVariant);
  const segmentLifts = segments.map((s) => liftPoints(s.controlRate, s.variantRate));
  const allSegmentsFavorVariant = segmentLifts.every((l) => l > 0);
  const aggregateFavorsControl = aggLift < 0;

  if (allSegmentsFavorVariant && aggregateFavorsControl) {
    return "Simpson's paradox: variant wins in every segment but loses overall. The mix of traffic changed between arms.";
  }
  if (segmentLifts.every((l) => l < 0) && aggLift > 0) {
    return "Simpson's paradox: control wins in every segment but variant wins overall. Check who entered each arm.";
  }
  return "Segment and aggregate stories align here, but always compare slices before rolling up.";
}
