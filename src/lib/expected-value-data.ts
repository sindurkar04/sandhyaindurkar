export type BetOption = {
  id: "a" | "b";
  label: string;
  costK: number;
  successRate: number;
  payoutK: number;
};

export const DEFAULT_OPTION_A: BetOption = {
  id: "a",
  label: "Big swing campaign",
  costK: 40,
  successRate: 18,
  payoutK: 320,
};

export const DEFAULT_OPTION_B: BetOption = {
  id: "b",
  label: "Steady email test",
  costK: 12,
  successRate: 42,
  payoutK: 55,
};

export function expectedValueK(option: BetOption): number {
  return (option.successRate / 100) * option.payoutK - option.costK;
}

export function expectedProfitK(option: BetOption): number {
  return expectedValueK(option);
}

export function formatMoneyK(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}$${Math.abs(value).toFixed(value % 1 === 0 ? 0 : 1)}k`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function compareRead(aEv: number, bEv: number): string {
  const diff = aEv - bEv;
  if (Math.abs(diff) < 2) {
    return "Expected values are close. Pick the one with lower downside or easier execution.";
  }
  if (diff > 0) {
    return `Option A leads by about ${formatMoneyK(diff)} in expected profit.`;
  }
  return `Option B leads by about ${formatMoneyK(Math.abs(diff))} in expected profit.`;
}

export function buildComparisonRows(a: BetOption, b: BetOption) {
  const aEv = expectedValueK(a);
  const bEv = expectedValueK(b);
  return [
    {
      option: a.label,
      cost: `$${a.costK}k`,
      successRate: formatPercent(a.successRate),
      payout: `$${a.payoutK}k if win`,
      expectedProfit: formatMoneyK(aEv),
    },
    {
      option: b.label,
      cost: `$${b.costK}k`,
      successRate: formatPercent(b.successRate),
      payout: `$${b.payoutK}k if win`,
      expectedProfit: formatMoneyK(bEv),
    },
  ];
}
