export type Segment = {
  label: string;
  rate: number;
  count: number;
};

export type ScenarioKey = "regional_csat" | "plan_satisfaction" | "channel_conversion";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  metricLabel: string;
  segments: Segment[];
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  regional_csat: {
    key: "regional_csat",
    shortLabel: "Regional CSAT",
    headline: "Company-wide satisfaction this quarter",
    metricLabel: "CSAT",
    segments: [
      { label: "North region", rate: 88, count: 120 },
      { label: "South region", rate: 62, count: 880 },
    ],
  },
  plan_satisfaction: {
    key: "plan_satisfaction",
    shortLabel: "Plan satisfaction",
    headline: "Overall feature satisfaction score",
    metricLabel: "Satisfied",
    segments: [
      { label: "Enterprise", rate: 92, count: 80 },
      { label: "Self-serve", rate: 58, count: 920 },
    ],
  },
  channel_conversion: {
    key: "channel_conversion",
    shortLabel: "Channel conversion",
    headline: "Blended signup conversion rate",
    metricLabel: "Conversion",
    segments: [
      { label: "Paid search", rate: 9.5, count: 200 },
      { label: "Organic", rate: 3.2, count: 1_800 },
    ],
  },
};

export function simpleAverageRate(segments: Segment[]): number {
  if (segments.length === 0) {
    return 0;
  }
  const sum = segments.reduce((acc, row) => acc + row.rate, 0);
  return sum / segments.length;
}

export function weightedAverageRate(segments: Segment[]): number {
  let successes = 0;
  let total = 0;
  for (const row of segments) {
    successes += (row.rate / 100) * row.count;
    total += row.count;
  }
  return total > 0 ? (successes / total) * 100 : 0;
}

export function formatRate(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}

export function weightedRead(simple: number, weighted: number): string {
  const gap = simple - weighted;
  if (Math.abs(gap) < 0.5) {
    return "Simple and weighted averages are close here because segment sizes are balanced.";
  }
  if (gap > 0) {
    return `The simple average (${formatRate(simple)}) overstates the company rate because high performers sit in smaller groups. Weight by volume (${formatRate(weighted)}) for the true rollup.`;
  }
  return `The simple average (${formatRate(simple)}) understates the company rate because the largest segment performs better. Weight by volume (${formatRate(weighted)}) before you set targets.`;
}
