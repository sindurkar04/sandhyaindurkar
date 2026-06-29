export type LossKey = "cross_entropy" | "hinge" | "zero_one";

export const LOSS_COLORS: Record<LossKey, string> = {
  cross_entropy: "#2563eb",
  hinge: "#059669",
  zero_one: "#dc2626",
};

export const LOSS_LABELS: Record<LossKey, string> = {
  cross_entropy: "Cross-entropy",
  hinge: "Hinge",
  zero_one: "0-1 (misclassify)",
};

export function crossEntropyLoss(y: 0 | 1, p: number): number {
  const clamped = Math.max(1e-6, Math.min(1 - 1e-6, p));
  return y === 1 ? -Math.log(clamped) : -Math.log(1 - clamped);
}

export function hingeLoss(y: 0 | 1, p: number): number {
  const margin = y === 1 ? p : 1 - p;
  return Math.max(0, 1 - margin);
}

export function zeroOneLoss(y: 0 | 1, p: number, cutoff = 0.5): number {
  const pred = p >= cutoff ? 1 : 0;
  return pred === y ? 0 : 1;
}

export function lossAt(y: 0 | 1, p: number, key: LossKey): number {
  if (key === "cross_entropy") return crossEntropyLoss(y, p);
  if (key === "hinge") return hingeLoss(y, p);
  return zeroOneLoss(y, p);
}

export function curvePoints(y: 0 | 1, key: LossKey, steps = 50): { p: number; loss: number }[] {
  const pts: { p: number; loss: number }[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const p = i / steps;
    let loss = lossAt(y, p, key);
    if (key === "zero_one") loss = Math.min(loss, 1.2);
    if (key === "cross_entropy") loss = Math.min(loss, 4);
    if (key === "hinge") loss = Math.min(loss, 2);
    pts.push({ p, loss });
  }
  return pts;
}

export function formatNum(n: number, d = 2): string {
  return n.toFixed(d);
}

export function lossReadout(y: 0 | 1, p: number): string {
  const ce = crossEntropyLoss(y, p);
  const h = hingeLoss(y, p);
  const z = zeroOneLoss(y, p);
  if (z === 1) {
    return `At predicted ${(p * 100).toFixed(0)}%, the model misclassifies (0-1 loss = 1). Cross-entropy is still ${formatNum(ce)} and provides a gradient to learn from.`;
  }
  if (p > 0.85 || p < 0.15) {
    return `Confident and correct: cross-entropy ${formatNum(ce)} is low. This is what training rewards.`;
  }
  return `Uncertain prediction (p = ${(p * 100).toFixed(0)}%): cross-entropy ${formatNum(ce)} is higher than hinge ${formatNum(h)}. Smooth losses guide optimizers; 0-1 loss does not.`;
}
