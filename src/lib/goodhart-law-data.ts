export type ScenarioKey = "support_tickets" | "sales_calls" | "content_clicks";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  metricLabel: string;
  outcomeLabel: string;
  defaultPressure: number;
  baseReported: number;
  maxReported: number;
  baseActual: number;
  minActual: number;
  gamingBehavior: string;
  outcomePain: string;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  support_tickets: {
    key: "support_tickets",
    shortLabel: "Support tickets",
    headline: "Team is rated on tickets closed per hour",
    metricLabel: "Tickets closed / hour",
    outcomeLabel: "Customer satisfaction",
    defaultPressure: 55,
    baseReported: 6,
    maxReported: 14,
    baseActual: 82,
    minActual: 48,
    gamingBehavior: "Agents rush closes and escalate less",
    outcomePain: "Customers reopen tickets and churn",
  },
  sales_calls: {
    key: "sales_calls",
    shortLabel: "Sales calls",
    headline: "Reps are bonused on call volume",
    metricLabel: "Calls per day",
    outcomeLabel: "Revenue per rep",
    defaultPressure: 60,
    baseReported: 28,
    maxReported: 55,
    baseActual: 74,
    minActual: 41,
    gamingBehavior: "Short boilerplate calls replace real discovery",
    outcomePain: "Pipeline looks busy but deals do not close",
  },
  content_clicks: {
    key: "content_clicks",
    shortLabel: "Content clicks",
    headline: "Editors are judged on headline click rate",
    metricLabel: "Click-through rate",
    outcomeLabel: "Reader trust / return visits",
    defaultPressure: 50,
    baseReported: 3.2,
    maxReported: 8.5,
    baseActual: 68,
    minActual: 35,
    gamingBehavior: "Clickbait titles beat useful summaries",
    outcomePain: "People click once and stop coming back",
  },
};

export function scoresFromPressure(
  pressure: number,
  scenario: Scenario,
): { reported: number; actual: number } {
  const t = Math.min(100, Math.max(0, pressure)) / 100;
  const reported = scenario.baseReported + t * (scenario.maxReported - scenario.baseReported);
  const actual = scenario.baseActual - t * (scenario.baseActual - scenario.minActual);
  return { reported, actual };
}

export function formatReported(value: number, scenario: Scenario): string {
  if (scenario.key === "content_clicks") {
    return `${value.toFixed(1)}%`;
  }
  return `${Math.round(value)}`;
}

export function formatActual(value: number): string {
  return `${Math.round(value)}%`;
}

export function pressureLabel(pressure: number): string {
  if (pressure >= 70) {
    return "High target pressure";
  }
  if (pressure <= 30) {
    return "Low target pressure";
  }
  return "Moderate target pressure";
}

export type GoodhartReadout = {
  headline: string;
  metricLine: string;
  outcomeLine: string;
  rememberLine: string;
};

export function goodhartReadout(
  pressure: number,
  reported: number,
  actual: number,
  scenario: Scenario,
): GoodhartReadout {
  const gap = Math.round(reported - actual);
  const metricText = formatReported(reported, scenario);
  const actualText = formatActual(actual);

  if (pressure >= 65 && actual <= scenario.baseActual - (scenario.baseActual - scenario.minActual) * 0.45) {
    return {
      headline: "Classic Goodhart: target hit, outcome falling",
      metricLine: `${scenario.metricLabel} looks strong at ${metricText} because ${scenario.gamingBehavior.toLowerCase()}.`,
      outcomeLine: `${scenario.outcomeLabel} dropped to ${actualText}. ${scenario.outcomePain}.`,
      rememberLine:
        "When the number becomes the goal, people optimize the number. The dashboard greens while the real outcome reddens.",
    };
  }

  if (pressure <= 35) {
    return {
      headline: "Metric still tracks the outcome (for now)",
      metricLine: `${scenario.metricLabel} is ${metricText} with light target pressure.`,
      outcomeLine: `${scenario.outcomeLabel} is still ${actualText}. The proxy and the goal mostly move together.`,
      rememberLine:
        "Goodhart shows up when rewards attach to the metric. Watch the gap between the chart and customer reality.",
    };
  }

  return {
    headline: "The gap is opening",
    metricLine: `${scenario.metricLabel} rose to ${metricText} as pressure increased.`,
    outcomeLine: `${scenario.outcomeLabel} fell to ${actualText} (${gap > 0 ? "dashboard ahead of reality" : "still aligned"}).`,
    rememberLine:
      "You hit the target and missed the point: the measure improved while the thing you actually care about slid.",
  };
}
