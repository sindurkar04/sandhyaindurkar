export type ScenarioKey = "retail_holiday" | "b2b_saas" | "summer_consumer";

export type MonthPoint = {
  label: string;
  value: number;
  priorYear: number;
};

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  metricLabel: string;
  focusMonthIndex: number;
  months: MonthPoint[];
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  retail_holiday: {
    key: "retail_holiday",
    shortLabel: "Retail revenue",
    headline: "December looks down vs November — but up vs last December.",
    metricLabel: "Revenue ($M)",
    focusMonthIndex: 11,
    months: [
      { label: "Jan", value: 2.1, priorYear: 2.0 },
      { label: "Feb", value: 2.0, priorYear: 1.9 },
      { label: "Mar", value: 2.2, priorYear: 2.1 },
      { label: "Apr", value: 2.3, priorYear: 2.2 },
      { label: "May", value: 2.4, priorYear: 2.3 },
      { label: "Jun", value: 2.3, priorYear: 2.2 },
      { label: "Jul", value: 2.2, priorYear: 2.1 },
      { label: "Aug", value: 2.4, priorYear: 2.3 },
      { label: "Sep", value: 2.5, priorYear: 2.4 },
      { label: "Oct", value: 2.7, priorYear: 2.5 },
      { label: "Nov", value: 3.4, priorYear: 3.1 },
      { label: "Dec", value: 3.2, priorYear: 2.9 },
    ],
  },
  b2b_saas: {
    key: "b2b_saas",
    shortLabel: "B2B SaaS signups",
    headline: "January signups beat December — normal after holiday freeze.",
    metricLabel: "New logos",
    focusMonthIndex: 0,
    months: [
      { label: "Jan", value: 48, priorYear: 44 },
      { label: "Feb", value: 52, priorYear: 49 },
      { label: "Mar", value: 55, priorYear: 51 },
      { label: "Apr", value: 54, priorYear: 50 },
      { label: "May", value: 53, priorYear: 52 },
      { label: "Jun", value: 50, priorYear: 48 },
      { label: "Jul", value: 47, priorYear: 46 },
      { label: "Aug", value: 46, priorYear: 45 },
      { label: "Sep", value: 51, priorYear: 49 },
      { label: "Oct", value: 54, priorYear: 52 },
      { label: "Nov", value: 49, priorYear: 47 },
      { label: "Dec", value: 42, priorYear: 40 },
    ],
  },
  summer_consumer: {
    key: "summer_consumer",
    shortLabel: "Consumer app DAU",
    headline: "July DAU dips vs June — but matches last July.",
    metricLabel: "Daily active users (k)",
    focusMonthIndex: 6,
    months: [
      { label: "Jan", value: 120, priorYear: 110 },
      { label: "Feb", value: 118, priorYear: 108 },
      { label: "Mar", value: 125, priorYear: 115 },
      { label: "Apr", value: 130, priorYear: 120 },
      { label: "May", value: 135, priorYear: 125 },
      { label: "Jun", value: 140, priorYear: 128 },
      { label: "Jul", value: 128, priorYear: 118 },
      { label: "Aug", value: 125, priorYear: 116 },
      { label: "Sep", value: 132, priorYear: 122 },
      { label: "Oct", value: 138, priorYear: 128 },
      { label: "Nov", value: 142, priorYear: 132 },
      { label: "Dec", value: 145, priorYear: 135 },
    ],
  },
};

export function percentChange(current: number, baseline: number): number {
  if (baseline === 0) {
    return 0;
  }
  return ((current - baseline) / baseline) * 100;
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatMetric(value: number, label: string): string {
  if (label.includes("$")) {
    return `$${value.toFixed(1)}M`;
  }
  if (label.includes("k")) {
    return `${value}k`;
  }
  return value.toFixed(0);
}

export function seasonalityRead(
  scenario: Scenario,
  momChange: number,
  yoyChange: number,
): string {
  const month = scenario.months[scenario.focusMonthIndex];
  const momOpposite = (momChange > 0 && yoyChange < 0) || (momChange < 0 && yoyChange > 0);
  if (momOpposite) {
    return `${month.label}: ${formatChange(momChange)} vs last month but ${formatChange(yoyChange)} vs same month last year. Seasonality flipped the story.`;
  }
  if (Math.abs(momChange - yoyChange) > 8) {
    return `MoM and YoY disagree by more than 8 points. Pick the baseline that matches the business calendar.`;
  }
  return `MoM and YoY align this month. Still compare to same month last year when seasonality is strong.`;
}
