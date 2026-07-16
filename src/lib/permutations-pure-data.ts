export const CHIP_COLORS = [
  "#2563eb",
  "#0d9488",
  "#ea580c",
  "#8b5cf6",
  "#e11d48",
  "#d97706",
] as const;

export const MAX_N = 10;

export function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

export function permutations(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

export function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString("en-US");
}

export function permutationFormulaParts(n: number, r: number): {
  nFact: number;
  denomFact: number;
  result: number;
} {
  const nFact = factorial(n);
  const denomFact = factorial(n - r);
  return { nFact, denomFact, result: nFact / denomFact };
}

export function permutationRead(n: number, r: number): string {
  const count = permutations(n, r);
  if (r === n) {
    return `P(${n},${n}) = ${n}! = ${formatCount(count)}. Every item gets a distinct position. Order matters, and you use all ${n} items.`;
  }
  return `P(${n},${r}) = ${formatCount(count)} ordered arrangements. Pick ${r} distinct slots from ${n} candidates where position 1 is not the same as position 2. Swapping two picks counts as a different outcome.`;
}

export function orderMattersExample(n: number, r: number): string {
  const p = permutations(n, r);
  const c = factorial(n) / (factorial(r) * factorial(n - r));
  if (p === c) {
    return `For n=${n} and r=${r}, permutations and combinations match because order has only one arrangement per pick set.`;
  }
  return `Same ${r} picks in a different order count separately. P(${n},${r}) = ${formatCount(p)} is ${formatCount(Math.round(p / c))}x larger than choosing the same set without caring about order.`;
}
