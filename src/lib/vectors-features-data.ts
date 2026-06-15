export type ScenarioKey = "customer" | "product" | "support_ticket";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  entityLabel: string;
  features: { name: string; value: number }[];
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  customer: {
    key: "customer",
    shortLabel: "Customer row",
    headline: "One customer = one vector: orders, spend, sessions, days since last visit.",
    entityLabel: "Customer #4821",
    features: [
      { name: "Orders (30d)", value: 4 },
      { name: "Spend ($)", value: 220 },
      { name: "Sessions", value: 12 },
      { name: "Days idle", value: 3 },
    ],
  },
  product: {
    key: "product",
    shortLabel: "Product row",
    headline: "One SKU = one vector: price, margin, units sold, return rate.",
    entityLabel: "SKU-1092",
    features: [
      { name: "Price ($)", value: 45 },
      { name: "Margin (%)", value: 38 },
      { name: "Units sold", value: 890 },
      { name: "Return rate (%)", value: 2.1 },
    ],
  },
  support_ticket: {
    key: "support_ticket",
    shortLabel: "Ticket row",
    headline: "One ticket = one vector: wait time, messages, sentiment score, priority.",
    entityLabel: "Ticket #7734",
    features: [
      { name: "Wait (min)", value: 18 },
      { name: "Messages", value: 6 },
      { name: "Sentiment", value: -0.4 },
      { name: "Priority (1-5)", value: 3 },
    ],
  },
};

export function vectorNorm(features: { value: number }[]): number {
  return Math.sqrt(features.reduce((sum, f) => sum + f.value * f.value, 0));
}

export function formatNum(value: number, digits = 1): string {
  return value.toFixed(digits);
}

export function vectorReadout(scenario: Scenario): string {
  const dim = scenario.features.length;
  const norm = vectorNorm(scenario.features);
  return `${scenario.entityLabel} is a ${dim}-dimensional vector. Each column is a coordinate. The L2 norm (length) is ${formatNum(norm)} in raw units, so scale features before comparing rows across tables.`;
}
