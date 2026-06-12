export type ScenarioKey = "fraud_rules" | "microservices" | "review_queues";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  defaultChecks: number;
  defaultFpRate: number;
  minChecks: number;
  maxChecks: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud_rules: {
    key: "fraud_rules",
    shortLabel: "Fraud rules",
    headline: "Twenty rules each fire 0.5% false positives on clean orders. Alert fatigue adds up.",
    defaultChecks: 20,
    defaultFpRate: 0.005,
    minChecks: 5,
    maxChecks: 40,
  },
  microservices: {
    key: "microservices",
    shortLabel: "Microservices",
    headline: "Each service is 99.5% healthy. Fifty services in the path tell a different story.",
    defaultChecks: 50,
    defaultFpRate: 0.005,
    minChecks: 10,
    maxChecks: 80,
  },
  review_queues: {
    key: "review_queues",
    shortLabel: "Review queues",
    headline: "Each classifier flags 3% of clean tickets. Stack four models on the same ticket.",
    defaultChecks: 4,
    defaultFpRate: 0.03,
    minChecks: 2,
    maxChecks: 10,
  },
};

export function anyAlert(fpRate: number, checks: number): number {
  const p = clamp(fpRate, 0, 1);
  const n = Math.max(0, Math.round(checks));
  return 1 - Math.pow(1 - p, n);
}

export function expectedFalseAlerts(fpRate: number, checks: number, volume: number): number {
  return volume * anyAlert(fpRate, checks);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function stackingReadout(scenario: Scenario, fpRate: number, checks: number): string {
  const systemRate = anyAlert(fpRate, checks);
  const perCheck = formatPct(fpRate);
  if (systemRate > 0.15) {
    return `${checks} checks at ${perCheck} each → ${formatPct(systemRate)} chance at least one fires on a clean case. Rare per-rule risk is not rare at system level.`;
  }
  return `At ${checks} checks, system-level false alert risk is ${formatPct(systemRate)} even though each check is only ${perCheck}.`;
}
