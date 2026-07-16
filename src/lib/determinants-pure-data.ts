export const VECTOR_COLORS = {
  first: "#0d9488",
  second: "#ea580c",
  fill: "#8b5cf6",
  singular: "#e11d48",
} as const;

export function det2x2(a: number, b: number, c: number, d: number): number {
  return a * d - b * c;
}

export function formatDet(value: number): string {
  if (Math.abs(value) < 0.001) return "0";
  return value.toFixed(2);
}

export function isSingular(det: number, tolerance = 0.05): boolean {
  return Math.abs(det) < tolerance;
}

export function signedArea(det: number): number {
  return Math.abs(det);
}

export function determinantRead(a: number, b: number, c: number, d: number): string {
  const det = det2x2(a, b, c, d);
  if (isSingular(det)) {
    return `det = ${formatDet(det)}. The two column vectors line up. The parallelogram collapses to a line or point, so area is zero. The map is not invertible.`;
  }
  const area = signedArea(det);
  const sign = det > 0 ? "positive" : "negative";
  return `det = ad − bc = ${formatDet(det)}. Signed area is ${sign}; absolute area is ${formatDet(area)}. The linear map scales 2D area by a factor of ${formatDet(Math.abs(det))}.`;
}

export function invertibilityRead(det: number): string {
  if (isSingular(det)) {
    return "Singular matrix: no unique inverse. Two different inputs can land on the same output, like parallel constraints in a system.";
  }
  return "Non-singular: the map preserves dimension. You can recover inputs from outputs, which is what solving Ax = b requires.";
}
