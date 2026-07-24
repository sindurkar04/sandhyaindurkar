export const COLORS = {
  a: "#2563eb",
  b: "#0d9488",
  c: "#ea580c",
  grid: "#e5e7eb",
} as const;

export const CLASS_LABELS = ["A", "B", "C"] as const;
export const CLASS_COLORS = [COLORS.a, COLORS.b, COLORS.c] as const;

/** Numerically stable softmax with a temperature parameter. */
export function softmax(logits: number[], temperature = 1): number[] {
  const t = Math.max(0.05, temperature);
  const scaled = logits.map((z) => z / t);
  const max = Math.max(...scaled);
  const exps = scaled.map((z) => Math.exp(z - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function argmax(values: number[]): number {
  let best = 0;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] > values[best]) best = i;
  }
  return best;
}

export function softmaxReadout(
  logits: number[],
  temperature: number,
): string {
  const probs = softmax(logits, temperature);
  const winner = argmax(probs);
  const label = CLASS_LABELS[winner];
  const conf = probs[winner];
  const tempNote =
    temperature > 1.4
      ? "High temperature flattens the scores toward an even split — the model hedges."
      : temperature < 0.6
        ? "Low temperature sharpens the gap, pushing almost all weight onto the top class."
        : "At temperature 1 the raw score gaps map directly to probability gaps.";
  return `Class ${label} wins with ${formatPct(conf)}. Softmax exponentiates each score, so a small lead in raw logits becomes a larger lead in probability, and the three outputs always sum to 100%. ${tempNote}`;
}
