export type ScenarioKey = "deploys" | "sla" | "qa_checks";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  eventLabel: string;
  defaultP: number;
  defaultN: number;
  minN: number;
  maxN: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  deploys: {
    key: "deploys",
    shortLabel: "Deploy failures",
    headline: "Each deploy has a 2% rollback risk. Ten deploys are not 2% system risk.",
    eventLabel: "At least one rollback",
    defaultP: 0.02,
    defaultN: 10,
    minN: 1,
    maxN: 50,
  },
  sla: {
    key: "sla",
    shortLabel: "SLA breaches",
    headline: "Each region misses SLA 1% of days. How often does any region miss in a month?",
    eventLabel: "At least one SLA miss",
    defaultP: 0.01,
    defaultN: 30,
    minN: 5,
    maxN: 60,
  },
  qa_checks: {
    key: "qa_checks",
    shortLabel: "QA checks",
    headline: "Each automated check fails 5% of the time on a clean build. Run twelve checks.",
    eventLabel: "At least one check fails",
    defaultP: 0.05,
    defaultN: 12,
    minN: 1,
    maxN: 30,
  },
};

export function atLeastOne(p: number, n: number): number {
  const prob = clamp(p, 0, 1);
  const trials = Math.max(0, Math.round(n));
  return 1 - Math.pow(1 - prob, trials);
}

export function none(p: number, n: number): number {
  return 1 - atLeastOne(p, n);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function atLeastOneReadout(scenario: Scenario, p: number, n: number): string {
  const risk = atLeastOne(p, n);
  if (risk > 0.35) {
    return `P(${scenario.eventLabel}) = ${formatPct(risk)} across ${n} independent tries. The complement formula 1 − (1 − p)^n adds up faster than intuition suggests.`;
  }
  return `P(${scenario.eventLabel}) = ${formatPct(risk)}. Even a small per-trial risk compounds when you repeat the trial many times.`;
}
