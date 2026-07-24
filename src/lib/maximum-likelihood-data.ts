export const COLORS = {
  curve: "#2563eb",
  mle: "#e11d48",
  guess: "#ea580c",
  grid: "#e5e7eb",
} as const;

/** Log-likelihood of p given heads out of trials Bernoulli flips (constant term dropped). */
export function logLikelihood(p: number, heads: number, trials: number): number {
  const tails = trials - heads;
  const clamped = Math.min(0.999999, Math.max(0.000001, p));
  return heads * Math.log(clamped) + tails * Math.log(1 - clamped);
}

/** Likelihood (not log), normalized to peak at 1 for a clean plot. */
export function likelihoodCurve(
  heads: number,
  trials: number,
  steps = 100,
): { p: number; value: number }[] {
  const peak = logLikelihood(trials === 0 ? 0.5 : heads / trials, heads, trials);
  const points: { p: number; value: number }[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const p = i / steps;
    const value = Math.exp(logLikelihood(p, heads, trials) - peak);
    points.push({ p, value });
  }
  return points;
}

export function mleEstimate(heads: number, trials: number): number {
  if (trials === 0) return 0.5;
  return heads / trials;
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function formatPct(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function mleReadout(heads: number, trials: number, guess: number): string {
  const mle = mleEstimate(heads, trials);
  const llGuess = logLikelihood(guess, heads, trials);
  const llMle = logLikelihood(mle, heads, trials);
  const gap = llMle - llGuess;
  const verdict =
    Math.abs(guess - mle) < 0.02
      ? "That guess sits right at the maximum — no other value explains the data better."
      : `Your guess is ${gap.toFixed(2)} log-likelihood units below the peak, so ${formatPct(mle)} explains these flips better.`;
  return `${heads} heads in ${trials} flips. The maximum-likelihood estimate is simply heads / trials = ${formatPct(mle)}. ${verdict}`;
}
