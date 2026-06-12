export type ScenarioKey = "coin" | "roulette" | "sales_streak";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  pWin: number;
  streakLabel: string;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  coin: {
    key: "coin",
    shortLabel: "Fair coin",
    headline: "Five tails in a row does not make heads more likely on flip six.",
    pWin: 0.5,
    streakLabel: "Heads",
  },
  roulette: {
    key: "roulette",
    shortLabel: "Roulette",
    headline: "Red four times does not load the wheel toward black on spin five.",
    pWin: 0.486,
    streakLabel: "Red",
  },
  sales_streak: {
    key: "sales_streak",
    shortLabel: "Sales quota",
    headline: "A rep misses three weeks. That does not guarantee a bounce-back week.",
    pWin: 0.42,
    streakLabel: "Hit quota",
  },
};

export function streakProbability(pWin: number, streakLen: number, wantWin: boolean): number {
  const p = clamp(pWin, 0, 1);
  const q = wantWin ? p : 1 - p;
  return Math.pow(q, Math.max(0, streakLen));
}

export function nextTrialProbability(pWin: number): number {
  return clamp(pWin, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function gamblersReadout(scenario: Scenario, streakLen: number): string {
  const streakP = streakProbability(scenario.pWin, streakLen, true);
  const nextP = nextTrialProbability(scenario.pWin);
  return `A ${streakLen}-win streak has probability ${formatPct(streakP)}. The next trial is still ${formatPct(nextP)}. Past outcomes do not change a fair process.`;
}
