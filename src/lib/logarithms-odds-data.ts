export const COLORS = {
  probability: "#2563eb",
  odds: "#ea580c",
  logOdds: "#0d9488",
  feature: "#8b5cf6",
  grid: "#e5e7eb",
} as const;

export function clampProbability(p: number): number {
  return Math.max(0.01, Math.min(0.99, p));
}

export function odds(p: number): number {
  const q = clampProbability(p);
  return q / (1 - q);
}

export function logOdds(p: number): number {
  return Math.log(odds(p));
}

export function probabilityFromLogOdds(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export function logBase(x: number, base: number): number {
  return Math.log(x) / Math.log(base);
}

export function oddsMultiplierFromWeight(w: number): number {
  return Math.exp(w);
}

export function logOddsAfterFeature(baseP: number, w: number): number {
  return logOdds(baseP) + w;
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function formatPct(p: number): string {
  return `${(p * 100).toFixed(0)}%`;
}

export function formatOdds(value: number): string {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
}

/** Sample points for mapping p in (0,1) to odds and log-odds curves */
export function mappingCurve(steps = 50): { p: number; oddsVal: number; logOddsVal: number }[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const p = 0.02 + (i / steps) * 0.96;
    return { p, oddsVal: odds(p), logOddsVal: logOdds(p) };
  });
}

export function logarithmsOddsReadout(p: number, w: number): string {
  const o = odds(p);
  const lo = logOdds(p);
  const mult = oddsMultiplierFromWeight(w);
  const newLo = lo + w;
  const newP = probabilityFromLogOdds(newLo);

  return `At p = ${formatPct(p)}, odds = ${formatOdds(o)} and log-odds = ${formatNum(lo)}. Adding feature weight w = ${formatNum(w)} multiplies odds by e^w = ${formatNum(mult)} and adds w to log-odds → ${formatNum(newLo)} (p = ${formatPct(newP)}). Logistic regression is linear in log-odds.`;
}
