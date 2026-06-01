export type StockoutScenarioKey = "coffee_beans" | "skincare_sku" | "warehouse_spare";

export type StockoutScenario = {
  key: StockoutScenarioKey;
  shortLabel: string;
  headline: string;
  unitLabel: string;
  meanDailyDemand: number;
  stdDailyDemand: number;
  leadTimeDays: number;
  reorderPoint: number;
  minReorderPoint: number;
  maxReorderPoint: number;
};

export type StockoutSnapshot = {
  meanLeadDemand: number;
  stdLeadDemand: number;
  zScore: number;
  stockoutProbability: number;
  serviceLevel: number;
  safetyStock: number;
  expectedShortfallUnits: number;
};

export const STOCKOUT_SCENARIOS: Record<StockoutScenarioKey, StockoutScenario> = {
  coffee_beans: {
    key: "coffee_beans",
    shortLabel: "Coffee beans",
    headline: "Cafe chain restock: weekend spikes make stockouts expensive.",
    unitLabel: "bags",
    meanDailyDemand: 120,
    stdDailyDemand: 28,
    leadTimeDays: 7,
    reorderPoint: 900,
    minReorderPoint: 600,
    maxReorderPoint: 1400,
  },
  skincare_sku: {
    key: "skincare_sku",
    shortLabel: "Skincare SKU",
    headline: "Promo-driven demand: social traffic can wipe inventory in days.",
    unitLabel: "units",
    meanDailyDemand: 85,
    stdDailyDemand: 35,
    leadTimeDays: 10,
    reorderPoint: 980,
    minReorderPoint: 650,
    maxReorderPoint: 1700,
  },
  warehouse_spare: {
    key: "warehouse_spare",
    shortLabel: "Warehouse spare part",
    headline: "Low-volume critical part: stockout stops operations.",
    unitLabel: "parts",
    meanDailyDemand: 18,
    stdDailyDemand: 8,
    leadTimeDays: 14,
    reorderPoint: 320,
    minReorderPoint: 180,
    maxReorderPoint: 500,
  },
};

export function evaluateStockout(scenario: StockoutScenario, reorderPoint: number): StockoutSnapshot {
  const meanLeadDemand = scenario.meanDailyDemand * scenario.leadTimeDays;
  const stdLeadDemand = scenario.stdDailyDemand * Math.sqrt(scenario.leadTimeDays);
  const zScore = (reorderPoint - meanLeadDemand) / Math.max(stdLeadDemand, 1e-6);
  const serviceLevel = normalCdf(zScore);
  const stockoutProbability = 1 - serviceLevel;
  const safetyStock = reorderPoint - meanLeadDemand;
  const expectedShortfallUnits = Math.max(0, meanLeadDemand - reorderPoint) * stockoutProbability;

  return {
    meanLeadDemand,
    stdLeadDemand,
    zScore,
    stockoutProbability,
    serviceLevel,
    safetyStock,
    expectedShortfallUnits,
  };
}

export function curveForReorderPoints(scenario: StockoutScenario): { label: string; probability: number }[] {
  const points = [0.8, 0.9, 1, 1.1, 1.2].map((multiplier) =>
    Math.round(scenario.reorderPoint * multiplier),
  );
  return points.map((point) => ({
    label: point.toLocaleString(),
    probability: evaluateStockout(scenario, point).stockoutProbability * 100,
  }));
}

export function stockoutReadout(snapshot: StockoutSnapshot, scenario: StockoutScenario): string {
  const risk = snapshot.stockoutProbability * 100;
  if (risk >= 25) {
    return `At this reorder point, stockout risk is ${risk.toFixed(1)}% during the ${scenario.leadTimeDays}-day lead time. This is too exposed for most teams.`;
  }
  if (risk >= 10) {
    return `Stockout risk is ${risk.toFixed(1)}%. This can work for low-margin items, but watch lost sales and service complaints.`;
  }
  return `Stockout risk is ${risk.toFixed(1)}% with service level near ${(snapshot.serviceLevel * 100).toFixed(1)}%. This is usually a safer operating band.`;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax));
  return sign * y;
}
