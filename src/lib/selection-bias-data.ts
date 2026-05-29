export type ScenarioKey = "feature_survey" | "beta_program" | "win_back";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  selectedLabel: string;
  fullLabel: string;
  selectedSize: number;
  fullSize: number;
  selectedPositiveRate: number;
  fullPositiveRate: number;
  missingGroup: string;
  businessRead: string;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  feature_survey: {
    key: "feature_survey",
    shortLabel: "Feature survey",
    headline: "Do customers love the new dashboard?",
    selectedLabel: "Responded to email survey",
    fullLabel: "All active customers",
    selectedSize: 420,
    fullSize: 12_000,
    selectedPositiveRate: 76,
    fullPositiveRate: 41,
    missingGroup: "Customers who ignore surveys (often less engaged or less satisfied)",
    businessRead: "Survey respondents are not a random slice. They skew toward power users.",
  },
  beta_program: {
    key: "beta_program",
    shortLabel: "Beta program",
    headline: "Should we launch this workflow tool?",
    selectedLabel: "Beta volunteers",
    fullLabel: "Full customer base",
    selectedSize: 180,
    fullSize: 8_500,
    selectedPositiveRate: 82,
    fullPositiveRate: 38,
    missingGroup: "Customers who never opt into betas (often less technical, less patient)",
    businessRead: "Beta lovers are a self-selected group. They tolerate rough edges others will not.",
  },
  win_back: {
    key: "win_back",
    shortLabel: "Churn interviews",
    headline: "Why did people leave?",
    selectedLabel: "Churned users who agreed to interview",
    fullLabel: "All churned users",
    selectedSize: 65,
    fullSize: 2_400,
    selectedPositiveRate: 58,
    fullPositiveRate: 22,
    missingGroup: "Churned users who refused interviews (often the angriest or busiest)",
    businessRead: "Interview samples miss the silent majority. You hear the polite leavers, not all leavers.",
  },
};

export function positiveCount(rate: number, size: number): number {
  return Math.round((rate / 100) * size);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatCount(value: number): string {
  return value.toLocaleString();
}

export function gapPoints(selected: number, full: number): number {
  return Math.round(selected - full);
}
