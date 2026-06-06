export type Outcome = {
  id: string;
  label: string;
  probability: number;
  value: number;
};

export type EvPreset = {
  id: string;
  label: string;
  description: string;
  outcomes: Outcome[];
};

export const DEFAULT_OUTCOMES: Outcome[] = [
  { id: "big", label: "Big win", probability: 0.1, value: 100 },
  { id: "small", label: "Small win", probability: 0.35, value: 20 },
  { id: "loss", label: "Loss", probability: 0.55, value: -10 },
];

export const EV_PRESETS: EvPreset[] = [
  {
    id: "default",
    label: "Mixed bet",
    description: "Rare big win, common small wins, and frequent losses.",
    outcomes: DEFAULT_OUTCOMES,
  },
  {
    id: "lottery",
    label: "Lottery trap",
    description: "Huge jackpot with tiny probability. Looks exciting, negative on average.",
    outcomes: [
      { id: "jackpot", label: "Jackpot", probability: 0.001, value: 10000 },
      { id: "small", label: "Small prize", probability: 0.049, value: 5 },
      { id: "lose", label: "Lose ticket cost", probability: 0.95, value: -2 },
    ],
  },
  {
    id: "fair_coin",
    label: "Fair coin bet",
    description: "Win $1 or lose $1 with equal chance. EV is exactly zero.",
    outcomes: [
      { id: "win", label: "Win", probability: 0.5, value: 1 },
      { id: "lose", label: "Lose", probability: 0.5, value: -1 },
    ],
  },
  {
    id: "insurance",
    label: "Simple insurance",
    description: "Most years you pay premium; rare years you collect a large claim.",
    outcomes: [
      { id: "claim", label: "Claim year", probability: 0.05, value: 800 },
      { id: "normal", label: "Normal year", probability: 0.95, value: -50 },
    ],
  },
];

export function expectedValue(outcomes: Outcome[]): number {
  return outcomes.reduce((sum, o) => sum + o.probability * o.value, 0);
}

export function probabilitySum(outcomes: Outcome[]): number {
  return outcomes.reduce((sum, o) => sum + o.probability, 0);
}

export function normalizeProbabilities(outcomes: Outcome[]): Outcome[] {
  const total = probabilitySum(outcomes);
  if (total <= 0) return outcomes;
  return outcomes.map((o) => ({ ...o, probability: o.probability / total }));
}

export function contribution(outcome: Outcome, normalized = false, outcomes: Outcome[] = []): number {
  const p = normalized ? outcome.probability : outcome.probability / Math.max(probabilitySum(outcomes), 1);
  return p * outcome.value;
}

export function evRead(ev: number): string {
  if (ev > 0) {
    return `Expected value is +${ev.toFixed(2)}. If you repeated this bet many times, you would come out ahead on average by about ${ev.toFixed(2)} per trial.`;
  }
  if (ev < 0) {
    return `Expected value is ${ev.toFixed(2)}. On average across many repeats, this bet loses about ${Math.abs(ev).toFixed(2)} per trial even if one lucky outcome looks great.`;
  }
  return `Expected value is 0. Break-even on average. Individual outcomes still swing, but there is no long-run edge either way.`;
}

export function probabilitySumRead(total: number): string {
  if (Math.abs(total - 1) < 0.01) return "Probabilities sum to 100%. Outcome weights are valid.";
  if (total < 1) return `Probabilities sum to ${(total * 100).toFixed(0)}%. You are missing ${((1 - total) * 100).toFixed(0)}% of outcomes.`;
  return `Probabilities sum to ${(total * 100).toFixed(0)}%. Total exceeds 100%; normalize or fix inputs.`;
}
