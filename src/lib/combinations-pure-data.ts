import { factorial, formatCount, permutations } from "@/lib/permutations-pure-data";

export const MAX_N = 12;

export const SELECT_COLORS = [
  "#2563eb",
  "#0d9488",
  "#ea580c",
  "#8b5cf6",
  "#e11d48",
  "#d97706",
] as const;

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const smaller = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < smaller; i += 1) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

export function combinationFormulaParts(n: number, k: number): {
  nFact: number;
  kFact: number;
  nMinusKFact: number;
  result: number;
} {
  const nFact = factorial(n);
  const kFact = factorial(k);
  const nMinusKFact = factorial(n - k);
  return { nFact, kFact, nMinusKFact, result: combinations(n, k) };
}

export function symmetryRead(n: number, k: number): string {
  const left = combinations(n, k);
  const right = combinations(n, n - k);
  return `C(${n},${k}) = ${formatCount(left)} and C(${n},${n - k}) = ${formatCount(right)}. Choosing ${k} to include is the same count as choosing ${n - k} to leave out.`;
}

export function permutationContrastRead(n: number, k: number): string {
  const p = permutations(n, k);
  const c = combinations(n, k);
  const ratio = k > 0 ? Math.round(p / c) : 1;
  return `P(${n},${k}) = ${formatCount(p)} counts every ordering of the same ${k} picks. C(${n},${k}) = ${formatCount(c)} counts the pick set once. The ratio is ${formatCount(ratio)} = ${k}! ways to order ${k} distinct items.`;
}

export function combinationRead(n: number, k: number): string {
  const count = combinations(n, k);
  if (k === 0 || k === n) return `C(${n},${k}) = 1. Either take everyone or take no one. Only one subset at each extreme.`;
  return `C(${n},${k}) = ${formatCount(count)} unordered subsets. The same ${k} items in a different sequence still count as one combination.`;
}
