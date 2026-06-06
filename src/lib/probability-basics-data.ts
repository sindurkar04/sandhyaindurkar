export type CoinScenario = "fair_coin" | "biased_coin" | "deck_draw" | "rain_traffic";

export type ScenarioConfig = {
  key: CoinScenario;
  shortLabel: string;
  headline: string;
  pA: number;
  pB: number;
  pAandB: number;
  independent: boolean;
  labelA: string;
  labelB: string;
  labelBoth: string;
  note: string;
};

export const SCENARIOS: Record<CoinScenario, ScenarioConfig> = {
  fair_coin: {
    key: "fair_coin",
    shortLabel: "Two fair coins",
    headline: "Flip two fair coins. What is the chance both land heads?",
    pA: 0.5,
    pB: 0.5,
    pAandB: 0.25,
    independent: true,
    labelA: "Heads on coin 1",
    labelB: "Heads on coin 2",
    labelBoth: "Both heads",
    note: "Classic independent case: each flip does not affect the other.",
  },
  biased_coin: {
    key: "biased_coin",
    shortLabel: "Biased + fair",
    headline: "Coin 1 lands heads 70% of the time. Coin 2 is fair.",
    pA: 0.7,
    pB: 0.5,
    pAandB: 0.35,
    independent: true,
    labelA: "Heads on biased coin",
    labelB: "Heads on fair coin",
    labelBoth: "Both heads",
    note: "Different single-event rates still multiply when events are independent.",
  },
  deck_draw: {
    key: "deck_draw",
    shortLabel: "Deck without replacement",
    headline: "Draw two aces from a deck without putting the first card back.",
    pA: 4 / 52,
    pB: 3 / 51,
    pAandB: (4 / 52) * (3 / 51),
    independent: false,
    labelA: "First card is ace",
    labelB: "Second card is ace (given first was ace)",
    labelBoth: "Both cards are aces",
    note: "Removing a card changes the deck. The second draw depends on the first.",
  },
  rain_traffic: {
    key: "rain_traffic",
    shortLabel: "Rain and traffic",
    headline: "Rainy days and heavy traffic on the same commute.",
    pA: 0.3,
    pB: 0.4,
    pAandB: 0.22,
    independent: false,
    labelA: "Morning is rainy",
    labelB: "Traffic is heavy",
    labelBoth: "Rainy and heavy traffic",
    note: "Rain raises traffic odds. P(A and B) is higher than P(A) x P(B) would suggest if you treated them as independent.",
  },
};

export function productIfIndependent(pA: number, pB: number): number {
  return pA * pB;
}

export function complement(p: number): number {
  return 1 - p;
}

export function formatPct(p: number): string {
  return `${(p * 100).toFixed(1)}%`;
}

export function independenceRead(scenario: ScenarioConfig): string {
  const product = productIfIndependent(scenario.pA, scenario.pB);
  if (scenario.independent) {
    return `Independent events: P(A and B) = P(A) x P(B) = ${formatPct(scenario.pA)} x ${formatPct(scenario.pB)} = ${formatPct(product)}. That matches the joint probability ${formatPct(scenario.pAandB)}. ${scenario.note}`;
  }
  const gap = scenario.pAandB - product;
  const direction = gap > 0 ? "higher" : "lower";
  return `Not independent: P(A and B) = ${formatPct(scenario.pAandB)} is ${direction} than P(A) x P(B) = ${formatPct(product)}. ${scenario.note}`;
}

export type CoinCell = { label: string; pA: boolean; pB: boolean; probability: number };

export function coinSampleSpace(): CoinCell[] {
  return [
    { label: "HH", pA: true, pB: true, probability: 0.25 },
    { label: "HT", pA: true, pB: false, probability: 0.25 },
    { label: "TH", pA: false, pB: true, probability: 0.25 },
    { label: "TT", pA: false, pB: false, probability: 0.25 },
  ];
}
