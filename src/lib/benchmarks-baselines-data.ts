export type ScenarioKey = "conversion_rate" | "monthly_revenue" | "support_csat";

export type BaselineKey = "last_month" | "last_year" | "target" | "peer";

export type BaselineRow = {
  key: BaselineKey;
  label: string;
  value: number;
};

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  metricLabel: string;
  unit: "percent" | "currency" | "score";
  current: number;
  baselines: BaselineRow[];
  contextNote: string;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  conversion_rate: {
    key: "conversion_rate",
    shortLabel: "Conversion",
    headline: "Q3 signup conversion readout for leadership",
    metricLabel: "Conversion rate",
    unit: "percent",
    current: 11.0,
    baselines: [
      { key: "last_month", label: "Last month", value: 10.1 },
      { key: "last_year", label: "Same month last year", value: 11.5 },
      { key: "target", label: "Company target", value: 12.0 },
      { key: "peer", label: "Industry peer median", value: 13.0 },
    ],
    contextNote: "Seasonality and a product launch make year-over-year the fairer read than month-over-month.",
  },
  monthly_revenue: {
    key: "monthly_revenue",
    shortLabel: "Revenue",
    headline: "Monthly revenue vs plan in the board deck",
    metricLabel: "Revenue",
    unit: "currency",
    current: 820_000,
    baselines: [
      { key: "last_month", label: "Last month", value: 780_000 },
      { key: "last_year", label: "Same month last year", value: 690_000 },
      { key: "target", label: "Plan target", value: 850_000 },
      { key: "peer", label: "Peer growth benchmark", value: 800_000 },
    ],
    contextNote: "Revenue beats last year but misses plan. The baseline you pick changes whether the slide says win or miss.",
  },
  support_csat: {
    key: "support_csat",
    shortLabel: "Support CSAT",
    headline: "Support satisfaction after a process change",
    metricLabel: "CSAT score",
    unit: "score",
    current: 78,
    baselines: [
      { key: "last_month", label: "Last month", value: 74 },
      { key: "last_year", label: "Same quarter last year", value: 81 },
      { key: "target", label: "Ops target", value: 82 },
      { key: "peer", label: "Peer benchmark", value: 80 },
    ],
    contextNote: "Month-over-month looks like improvement. Year-over-year and target both say you are still behind.",
  },
};

export function percentChange(current: number, baseline: number): number {
  if (baseline === 0) {
    return 0;
  }
  return ((current - baseline) / baseline) * 100;
}

export function pointGap(current: number, baseline: number): number {
  return current - baseline;
}

export function formatMetric(value: number, unit: Scenario["unit"]): string {
  if (unit === "currency") {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    return `$${Math.round(value / 1000)}k`;
  }
  if (unit === "percent") {
    return `${value.toFixed(1)}%`;
  }
  return `${Math.round(value)}%`;
}

export function formatComparison(
  current: number,
  baseline: number,
  unit: Scenario["unit"],
): string {
  if (unit === "percent" || unit === "score") {
    const gap = pointGap(current, baseline);
    return `${gap >= 0 ? "+" : ""}${unit === "percent" ? gap.toFixed(1) : Math.round(gap)} pts`;
  }
  const change = percentChange(current, baseline);
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export function comparisonRead(
  current: number,
  baseline: BaselineRow,
  unit: Scenario["unit"],
): { direction: "up" | "down" | "flat"; summary: string } {
  const comparison = formatComparison(current, baseline.value, unit);
  let direction: "up" | "down" | "flat" = "flat";
  if (unit === "currency") {
    direction = current > baseline.value ? "up" : current < baseline.value ? "down" : "flat";
  } else {
    direction = current > baseline.value ? "up" : current < baseline.value ? "down" : "flat";
  }

  const summary =
    direction === "up"
      ? `Ahead of ${baseline.label.toLowerCase()} (${comparison}).`
      : direction === "down"
        ? `Behind ${baseline.label.toLowerCase()} (${comparison}).`
        : `In line with ${baseline.label.toLowerCase()}.`;

  return { direction, summary };
}

export function baselineVerdict(scenario: Scenario): string {
  const vsLastMonth = comparisonRead(scenario.current, scenario.baselines[0], scenario.unit);
  const vsLastYear = comparisonRead(scenario.current, scenario.baselines[1], scenario.unit);
  const vsTarget = comparisonRead(scenario.current, scenario.baselines[2], scenario.unit);

  if (vsLastMonth.direction === "up" && vsLastYear.direction === "down") {
    return "Short-term win, long-term miss: month-over-month looks good but the longer baseline tells a different story.";
  }
  if (vsLastMonth.direction === "down" && vsLastYear.direction === "up") {
    return "Noisy month, stronger trend: do not panic on one dip if the year-over-year baseline still improves.";
  }
  if (vsTarget.direction === "down") {
    return `Headline number is ${formatMetric(scenario.current, scenario.unit)} but still below plan. Always state the baseline in the same breath as the metric.`;
  }
  return "Pick the baseline that matches the decision: ops cadence, seasonality, plan, or external peer.";
}
