export const COLORS = {
  curve: "#7c3aed",
  parent: "#64748b",
  left: "#2563eb",
  right: "#ea580c",
  gain: "#0d9488",
  grid: "#e5e7eb",
} as const;

/** Binary entropy in bits for a class fraction p (of the positive class). */
export function binaryEntropy(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
}

export function entropyCurve(steps = 100): { p: number; h: number }[] {
  const points: { p: number; h: number }[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const p = i / steps;
    points.push({ p, h: binaryEntropy(p) });
  }
  return points;
}

export type Split = {
  parentP: number;
  leftFraction: number;
  leftP: number;
  rightP: number;
};

/** A split is described by the parent positive rate and how a chosen feature partitions rows. */
export function buildSplit(
  parentP: number,
  leftFraction: number,
  leftP: number,
): Split {
  const rightFraction = 1 - leftFraction;
  // Right child positive count is whatever is left over so totals stay consistent.
  const totalPositive = parentP;
  const leftPositive = leftFraction * leftP;
  const rightPositive = Math.min(
    rightFraction,
    Math.max(0, totalPositive - leftPositive),
  );
  const rightP = rightFraction > 0 ? rightPositive / rightFraction : 0;
  return { parentP, leftFraction, leftP, rightP };
}

export function informationGain(split: Split): number {
  const parentH = binaryEntropy(split.parentP);
  const childH =
    split.leftFraction * binaryEntropy(split.leftP) +
    (1 - split.leftFraction) * binaryEntropy(split.rightP);
  return parentH - childH;
}

export function weightedChildEntropy(split: Split): number {
  return (
    split.leftFraction * binaryEntropy(split.leftP) +
    (1 - split.leftFraction) * binaryEntropy(split.rightP)
  );
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function formatPct(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function entropyReadout(split: Split): string {
  const parentH = binaryEntropy(split.parentP);
  const gain = informationGain(split);
  const quality =
    gain > 0.5 ? "a strong split" : gain > 0.15 ? "a useful split" : "a weak split";
  return `The parent node carries ${formatNum(parentH)} bits of uncertainty. After the split the weighted child entropy drops, leaving ${formatNum(gain)} bits of information gain — ${quality}. A tree greedily picks the feature with the highest gain.`;
}
