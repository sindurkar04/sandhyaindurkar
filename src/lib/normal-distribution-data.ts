export type ScenarioKey = "delivery_time" | "order_value" | "support_wait";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  unit: string;
  defaultMu: number;
  defaultSigma: number;
  compareMu: number;
  compareSigma: number;
};

export const COLORS = {
  blue: "#2563eb",
  teal: "#0d9488",
  orange: "#ea580c",
  violet: "#8b5cf6",
  rose: "#e11d48",
  amber: "#d97706",
  grid: "#e2e8f0",
} as const;

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  delivery_time: {
    key: "delivery_time",
    shortLabel: "Delivery time",
    headline: "Most orders cluster near the mean. Sigma sets how wide the bell spreads.",
    unit: "min",
    defaultMu: 45,
    defaultSigma: 8,
    compareMu: 52,
    compareSigma: 12,
  },
  order_value: {
    key: "order_value",
    shortLabel: "Order value",
    headline: "Revenue per order often looks bell-shaped in the middle of the range.",
    unit: "$",
    defaultMu: 68,
    defaultSigma: 15,
    compareMu: 68,
    compareSigma: 25,
  },
  support_wait: {
    key: "support_wait",
    shortLabel: "Support wait",
    headline: "Queue times center on a mean with predictable tail behavior when normal approx holds.",
    unit: "min",
    defaultMu: 12,
    defaultSigma: 4,
    compareMu: 10,
    compareSigma: 3,
  },
};

export function normalPdf(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const z = (x - mu) / sigma;
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

export function empiricalRule(sigma: number): { one: number; two: number; three: number } {
  return { one: sigma, two: 2 * sigma, three: 3 * sigma };
}

export function formatNum(value: number, digits = 1): string {
  return value.toFixed(digits);
}

export function normalReadout(mu: number, sigma: number, unit: string): string {
  return `Mean ${formatNum(mu)} ${unit}, sigma ${formatNum(sigma)} ${unit}. About 68% fall within +/-1 sigma, 95% within +/-2, and 99.7% within +/-3 when the normal model fits.`;
}
