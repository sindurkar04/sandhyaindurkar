export type ScenarioKey = "support_tickets" | "app_logins" | "fraud_alerts";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  metricName: string;
  rateLabel: string;
  countLabel: string;
  quarters: { label: string; users: number; eventsPerUser: number }[];
  defaultQuarterIndex: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  support_tickets: {
    key: "support_tickets",
    shortLabel: "Support tickets",
    headline: "Ticket volume up 30% — but tickets per active user are flat.",
    metricName: "Support volume",
    rateLabel: "Tickets per active user",
    countLabel: "Total tickets",
    defaultQuarterIndex: 3,
    quarters: [
      { label: "Q1", users: 100000, eventsPerUser: 0.42 },
      { label: "Q2", users: 115000, eventsPerUser: 0.41 },
      { label: "Q3", users: 130000, eventsPerUser: 0.42 },
      { label: "Q4", users: 150000, eventsPerUser: 0.41 },
    ],
  },
  app_logins: {
    key: "app_logins",
    shortLabel: "App logins",
    headline: "Login count hit a record — engagement rate barely moved.",
    metricName: "Login activity",
    rateLabel: "Logins per MAU",
    countLabel: "Total logins (M)",
    defaultQuarterIndex: 3,
    quarters: [
      { label: "Q1", users: 500000, eventsPerUser: 8.2 },
      { label: "Q2", users: 540000, eventsPerUser: 8.1 },
      { label: "Q3", users: 580000, eventsPerUser: 8.3 },
      { label: "Q4", users: 620000, eventsPerUser: 8.2 },
    ],
  },
  fraud_alerts: {
    key: "fraud_alerts",
    shortLabel: "Fraud alerts",
    headline: "Alerts doubled — fraud rate per transaction unchanged.",
    metricName: "Fraud monitoring",
    rateLabel: "Alerts per 1k transactions",
    countLabel: "Total alerts",
    defaultQuarterIndex: 3,
    quarters: [
      { label: "Q1", users: 2000000, eventsPerUser: 0.08 },
      { label: "Q2", users: 2400000, eventsPerUser: 0.079 },
      { label: "Q3", users: 2800000, eventsPerUser: 0.081 },
      { label: "Q4", users: 3200000, eventsPerUser: 0.08 },
    ],
  },
};

export function totalEvents(users: number, rate: number): number {
  return users * rate;
}

export function formatRate(value: number, scenario: Scenario): string {
  if (scenario.key === "fraud_alerts") {
    return (value * 1000).toFixed(1);
  }
  if (scenario.key === "app_logins") {
    return value.toFixed(1);
  }
  return value.toFixed(2);
}

export function formatTotal(value: number, scenario: Scenario): string {
  if (scenario.key === "app_logins") {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value).toLocaleString()}`;
  }
  return value.toFixed(0);
}

export function quarterChange(current: number, prior: number): number {
  if (prior === 0) {
    return 0;
  }
  return ((current - prior) / prior) * 100;
}

export function ratesVsCountsRead(
  scenario: Scenario,
  quarterIndex: number,
  countChange: number,
  rateChange: number,
): string {
  const q = scenario.quarters[quarterIndex];
  if (Math.abs(rateChange) < 3 && Math.abs(countChange) > 10) {
    return `${q.label}: ${scenario.countLabel} ${countChange >= 0 ? "up" : "down"} ${Math.abs(countChange).toFixed(0)}% while ${scenario.rateLabel} moved ${rateChange.toFixed(1)}%. Growth in users drove the headline count.`;
  }
  if (Math.abs(rateChange) >= 5) {
    return `${scenario.rateLabel} shifted ${rateChange.toFixed(1)}%. That is a real per-user change, not just scale.`;
  }
  return `Report both ${scenario.countLabel} and ${scenario.rateLabel} so ops sees volume and intensity.`;
}

export type StaffingStoryKey = "volume_growth" | "intensity_spike" | "both_rising";

export type StaffingStory = {
  key: StaffingStoryKey;
  shortLabel: string;
  headline: string;
  prior: { label: string; users: number; rate: number };
  current: { label: string; users: number; rate: number };
  leadershipAsk: string;
  optimize: string[];
  hold: string[];
  escalateIf: string[];
};

export const STAFFING_STORIES: Record<StaffingStoryKey, StaffingStory> = {
  volume_growth: {
    key: "volume_growth",
    shortLabel: "Q4 record (this story)",
    headline: "Tickets hit a record. Rate per user barely moved. Users grew 15%.",
    prior: { label: "Q3", users: 130_000, rate: 0.41 },
    current: { label: "Q4", users: 150_000, rate: 0.42 },
    leadershipAsk: "Leadership wants six new agents.",
    optimize: [
      "Staff to total ticket volume at the new MAU level",
      "Tie hiring plan to user growth forecast, not panic on the headline",
      "Track tickets per agent against volume, not rate alone",
    ],
    hold: [
      "Product quality war room — rate is flat",
      "Blaming a broken release when intensity did not shift",
    ],
    escalateIf: [
      "Tickets per active user crosses ~0.45 for two quarters",
      "Same ticket types spike within cohorts, not just totals",
    ],
  },
  intensity_spike: {
    key: "intensity_spike",
    shortLabel: "Rate spike",
    headline: "Tickets up and tickets per user jumped — that is a real intensity shift.",
    prior: { label: "Q3", users: 130_000, rate: 0.41 },
    current: { label: "Q4", users: 132_000, rate: 0.48 },
    leadershipAsk: "Leadership still wants six new agents.",
    optimize: [
      "Self-serve deflection, help center, and top contact drivers",
      "Bug fixes and onboarding friction before defaulting to hires",
      "Segment rate by ticket type — billing vs login vs outage",
    ],
    hold: [
      "Hiring six agents before you know which flows broke",
      "Explaining it away as user growth alone",
    ],
    escalateIf: [
      "Rate stays elevated after fixes ship",
      "CSAT or reopen rate worsens with the same headcount",
    ],
  },
  both_rising: {
    key: "both_rising",
    shortLabel: "Both rising",
    headline: "Volume and rate both climbed — scale and intensity moved together.",
    prior: { label: "Q3", users: 130_000, rate: 0.41 },
    current: { label: "Q4", users: 150_000, rate: 0.46 },
    leadershipAsk: "Leadership wants six new agents plus a quality task force.",
    optimize: [
      "Split the plan: capacity for volume, product squad for rate",
      "Report two slides — MAU-driven volume vs per-user intensity",
      "Cohort table beside headline totals when signup mix shifted",
    ],
    hold: [
      "One blended “tickets are bad” narrative",
      "Choosing only hiring or only product without both views",
    ],
    escalateIf: [
      "Rate keeps rising after mix-adjusted cohort review",
      "New user cohorts show worse rate than older cohorts at same tenure",
    ],
  },
};

export function staffingMetrics(story: StaffingStory) {
  const priorTotal = totalEvents(story.prior.users, story.prior.rate);
  const currentTotal = totalEvents(story.current.users, story.current.rate);
  return {
    priorTotal,
    currentTotal,
    userChange: quarterChange(story.current.users, story.prior.users),
    rateChange: quarterChange(story.current.rate, story.prior.rate),
    countChange: quarterChange(currentTotal, priorTotal),
  };
}

export function staffingChartPoints(story: StaffingStory) {
  const { prior, current } = story;
  const midUsers = Math.round((prior.users + current.users) / 2);
  const midRate = (prior.rate + current.rate) / 2;
  return [
    { label: prior.label, users: prior.users, rate: prior.rate, total: totalEvents(prior.users, prior.rate) },
    {
      label: "…",
      users: midUsers,
      rate: midRate,
      total: totalEvents(midUsers, midRate),
    },
    {
      label: current.label,
      users: current.users,
      rate: current.rate,
      total: totalEvents(current.users, current.rate),
    },
  ];
}
