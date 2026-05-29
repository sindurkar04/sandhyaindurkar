export type PrimeFactor = {
  prime: number;
  exponent: number;
};

export type ScenarioKey = "data_pipeline" | "shift_hours" | "event_tickets";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  total: number;
  unitLabel: string;
  context: string;
  goodBatches: number[];
  badBatches: number[];
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  data_pipeline: {
    key: "data_pipeline",
    shortLabel: "Data pipeline",
    total: 10_000,
    unitLabel: "records",
    context: "Nightly ETL job processing customer records",
    goodBatches: [100, 200, 250, 500],
    badBatches: [300, 700, 1_200],
  },
  shift_hours: {
    key: "shift_hours",
    shortLabel: "Shift planning",
    total: 2_520,
    unitLabel: "hours",
    context: "Monthly labor hours to split across teams",
    goodBatches: [84, 105, 126, 210],
    badBatches: [100, 160, 200],
  },
  event_tickets: {
    key: "event_tickets",
    shortLabel: "Event tickets",
    total: 1_800,
    unitLabel: "tickets",
    context: "Seating blocks for a venue rollout",
    goodBatches: [60, 90, 100, 150],
    badBatches: [64, 110, 250],
  },
};

export function primeFactors(n: number): PrimeFactor[] {
  let value = Math.max(2, Math.floor(n));
  const factors: PrimeFactor[] = [];

  for (let prime = 2; prime * prime <= value; prime += 1) {
    if (value % prime !== 0) {
      continue;
    }
    let exponent = 0;
    while (value % prime === 0) {
      value /= prime;
      exponent += 1;
    }
    factors.push({ prime, exponent });
  }

  if (value > 1) {
    factors.push({ prime: value, exponent: 1 });
  }

  return factors;
}

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

export function toSuperscript(value: number): string {
  return String(value)
    .split("")
    .map((digit) => SUPERSCRIPT_DIGITS[digit] ?? digit)
    .join("");
}

export function formatFactorTerm(prime: number, exponent: number): string {
  if (exponent === 1) {
    return String(prime);
  }
  return `${prime}${toSuperscript(exponent)}`;
}

export function formatFactorization(factors: PrimeFactor[]): string {
  if (factors.length === 0) {
    return "1";
  }
  return factors.map((f) => formatFactorTerm(f.prime, f.exponent)).join(" × ");
}

export function formatFactorizationPlain(n: number): string {
  return formatFactorization(primeFactors(n));
}

export type BatchPlan = {
  batchSize: number;
  fullBatches: number;
  remainder: number;
  isClean: boolean;
  partialLoadPercent: number;
};

export function batchPlan(total: number, batchSize: number): BatchPlan {
  if (batchSize <= 0) {
    return { batchSize, fullBatches: 0, remainder: total, isClean: false, partialLoadPercent: 0 };
  }
  const fullBatches = Math.floor(total / batchSize);
  const remainder = total % batchSize;
  const isClean = remainder === 0;
  const partialLoadPercent =
    remainder === 0 ? 100 : Math.round((remainder / batchSize) * 100);

  return { batchSize, fullBatches, remainder, isClean, partialLoadPercent };
}

export function cleanDivisors(total: number, min = 50, max = 2_000): number[] {
  const divisors: number[] = [];
  for (let d = min; d <= Math.min(max, total); d += 1) {
    if (total % d === 0) {
      divisors.push(d);
    }
  }
  return divisors;
}

export function businessRead(plan: BatchPlan): string {
  if (plan.isClean) {
    return `${plan.fullBatches} equal batches, no straggler job`;
  }
  if (plan.partialLoadPercent <= 15) {
    return `Small tail batch (${plan.remainder} left) adds scheduling overhead`;
  }
  if (plan.partialLoadPercent <= 40) {
    return `Partial batch runs at ${plan.partialLoadPercent}% load, wastes worker time`;
  }
  return `Large leftover (${plan.remainder}) forces a costly partial run`;
}

export function buildBatchComparisonRows(
  total: number,
  batchSizes: number[],
  kind: "clean" | "messy",
) {
  return batchSizes.map((batchSize) => {
    const plan = batchPlan(total, batchSize);
    return {
      batchSize,
      batches: plan.isClean ? `${plan.fullBatches}` : `${plan.fullBatches} + partial`,
      leftover: plan.isClean ? "None" : `${plan.remainder}`,
      read: kind === "clean" ? "Clean split" : businessRead(plan),
    };
  });
}

export function factorInsight(total: number, factors: PrimeFactor[]): string {
  const distinct = factors.length;
  const maxExp = Math.max(...factors.map((f) => f.exponent), 0);

  if (distinct >= 2 && maxExp >= 2) {
    return `${total.toLocaleString()} mixes ${factors.map((f) => f.prime).join(" and ")}. That gives you many even batch sizes without awkward remainders.`;
  }
  if (distinct === 1) {
    return `${total.toLocaleString()} is a pure power of ${factors[0].prime}. Batch sizes should be powers of ${factors[0].prime} or products that divide evenly.`;
  }
  return `Break ${total.toLocaleString()} into factors first, then pick batch sizes that divide the total.`;
}
