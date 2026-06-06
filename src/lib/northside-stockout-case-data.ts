import {
  evaluateStockout,
  type StockoutScenario,
  type StockoutSnapshot,
} from "@/lib/stockout-probability-data";

export const NORTHSIDE_SCENARIO: StockoutScenario = {
  key: "coffee_beans",
  shortLabel: "Company X",
  headline: "Festival weekend at Company X: hero espresso blend runs down fast.",
  unitLabel: "bags",
  meanDailyDemand: 132,
  stdDailyDemand: 34,
  leadTimeDays: 7,
  reorderPoint: 900,
  minReorderPoint: 700,
  maxReorderPoint: 1500,
};

export type PolicyPreset = {
  id: string;
  label: string;
  reorderPoint: number;
  owner: string;
  rationale: string;
};

export const POLICY_PRESETS: PolicyPreset[] = [
  {
    id: "status_quo",
    label: "Status quo",
    reorderPoint: 900,
    owner: "Ops (current policy)",
    rationale: "Worked on normal weeks last quarter.",
  },
  {
    id: "finance",
    label: "Finance cut",
    reorderPoint: 780,
    owner: "Finance",
    rationale: "Free cash tied up in the warehouse.",
  },
  {
    id: "marketing",
    label: "Festival buffer",
    reorderPoint: 1200,
    owner: "Marketing + Ops",
    rationale: "Protect paid traffic during the city festival.",
  },
  {
    id: "conservative",
    label: "High service",
    reorderPoint: 1350,
    owner: "GM compromise",
    rationale: "Target under 5% stockout risk for hero SKU.",
  },
];

export type PolicyRow = {
  policy: string;
  reorderPoint: string;
  stockoutRisk: string;
  serviceLevel: string;
  safetyStock: string;
  recommendation: string;
};

const MARGIN_PER_BAG = 9.5;
const HOLDING_COST_PER_BAG_DAY = 0.12;

export function policySnapshot(reorderPoint: number): StockoutSnapshot {
  return evaluateStockout(NORTHSIDE_SCENARIO, reorderPoint);
}

export function buildPolicyRows(): PolicyRow[] {
  return POLICY_PRESETS.map((preset) => {
    const snap = policySnapshot(preset.reorderPoint);
    const risk = snap.stockoutProbability * 100;
    let recommendation = "Reasonable middle ground.";
    if (risk >= 20) recommendation = "Too exposed for a hero SKU during a promo week.";
    if (risk >= 10 && risk < 20) recommendation = "Possible for low-priority SKUs, not this one.";
    if (risk < 5) recommendation = "Strong service level; watch working capital.";

    return {
      policy: preset.label,
      reorderPoint: preset.reorderPoint.toLocaleString(),
      stockoutRisk: `${risk.toFixed(1)}%`,
      serviceLevel: `${(snap.serviceLevel * 100).toFixed(1)}%`,
      safetyStock: `${Math.round(snap.safetyStock).toLocaleString()} bags`,
      recommendation,
    };
  });
}

export function estimatedStockoutCost(reorderPoint: number): number {
  const snap = policySnapshot(reorderPoint);
  return snap.expectedShortfallUnits * MARGIN_PER_BAG;
}

export function estimatedHoldingCost(reorderPoint: number): number {
  const snap = policySnapshot(reorderPoint);
  const daysHeld = NORTHSIDE_SCENARIO.leadTimeDays;
  return Math.max(0, snap.safetyStock) * HOLDING_COST_PER_BAG_DAY * daysHeld;
}

export function caseReadout(reorderPoint: number): string {
  const snap = policySnapshot(reorderPoint);
  const risk = snap.stockoutProbability * 100;
  const stockoutCost = estimatedStockoutCost(reorderPoint);
  const holdingCost = estimatedHoldingCost(reorderPoint);

  if (risk >= 18) {
    return `At ${reorderPoint.toLocaleString()} bags, stockout risk is ${risk.toFixed(1)}% during the 7-day lead time. Expected lost margin from shortfalls is about $${stockoutCost.toFixed(0)} per reorder cycle — before counting ad waste and customer complaints.`;
  }
  if (risk >= 8) {
    return `Stockout risk is ${risk.toFixed(1)}%. Holding cost on safety stock is about $${holdingCost.toFixed(0)} per cycle. This is a defensible festival buffer if marketing spend stays high.`;
  }
  return `Stockout risk drops to ${risk.toFixed(1)}% (service level ${(snap.serviceLevel * 100).toFixed(1)}%). Holding cost rises to about $${holdingCost.toFixed(0)} per cycle — the price of protecting conversion during the festival.`;
}
