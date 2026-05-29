export type ScenarioKey = "startup_portfolio" | "app_reviews" | "fund_track_record";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  survivorsLabel: string;
  fullLabel: string;
  survivorSize: number;
  fullSize: number;
  survivorSuccessRate: number;
  fullSuccessRate: number;
  droppedGroup: string;
  businessRead: string;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  startup_portfolio: {
    key: "startup_portfolio",
    shortLabel: "Startup headlines",
    headline: "Are most new startups still thriving?",
    survivorsLabel: "Startups still operating (visible)",
    fullLabel: "All startups that launched in the cohort",
    survivorSize: 120,
    fullSize: 1_000,
    survivorSuccessRate: 88,
    fullSuccessRate: 34,
    droppedGroup: "Startups that shut down or never got press coverage",
    businessRead:
      "You only hear from survivors. The visible cohort looks healthy while most launches quietly fail.",
  },
  app_reviews: {
    key: "app_reviews",
    shortLabel: "App store reviews",
    headline: "Do users love the product?",
    survivorsLabel: "Users who left a public review",
    fullLabel: "All active users",
    survivorSize: 840,
    fullSize: 45_000,
    survivorSuccessRate: 81,
    fullSuccessRate: 52,
    droppedGroup: "Silent users (often neutral or unhappy, rarely motivated to review)",
    businessRead:
      "Review stars describe reviewers, not everyone. Happy power users shout; frustrated users often just leave.",
  },
  fund_track_record: {
    key: "fund_track_record",
    shortLabel: "Fund performance",
    headline: "Did this strategy beat the market?",
    survivorsLabel: "Funds still reporting results",
    fullLabel: "All funds that started the strategy",
    survivorSize: 18,
    fullSize: 60,
    survivorSuccessRate: 72,
    fullSuccessRate: 38,
    droppedGroup: "Funds that closed or stopped reporting after poor returns",
    businessRead:
      "Closed funds vanish from league tables. The published track record keeps winners in view.",
  },
};

export function successCount(rate: number, size: number): number {
  return Math.round((rate / 100) * size);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}

export function gapPoints(survivors: number, full: number): number {
  return Math.round(survivors - full);
}

export function survivorshipRead(gap: number): string {
  if (gap >= 40) {
    return "The survivor slice overstates success by a wide margin. Ask what dropped out before you copy the playbook.";
  }
  if (gap >= 20) {
    return "Survivors look meaningfully better than the full cohort. Pair headline rates with who is no longer in the data.";
  }
  return "There is still a gap between visible winners and the full population. Always ask who exited the dataset.";
}
