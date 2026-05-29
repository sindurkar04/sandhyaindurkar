export type ScenarioKey = "sales" | "support" | "ads";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  unit: string;
  context: string;
  populationMean: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  sales: {
    key: "sales",
    shortLabel: "Sales reps",
    unit: "deals closed",
    context: "Monthly deals closed per rep on a team of twenty",
    populationMean: 14,
  },
  support: {
    key: "support",
    shortLabel: "Support agents",
    unit: "tickets resolved",
    context: "Weekly tickets resolved per agent",
    populationMean: 48,
  },
  ads: {
    key: "ads",
    shortLabel: "Ad campaigns",
    unit: "ROAS index",
    context: "Return on ad spend index across campaigns",
    populationMean: 100,
  },
};

function seededNoise(index: number, salt: number): number {
  const value = Math.sin((index + 1) * (12.9898 + salt)) * 43758.5453;
  return value - Math.floor(value);
}

export type PerformerRow = {
  id: number;
  week1: number;
  week2: number;
  group: "top" | "middle" | "bottom";
};

export function buildPerformers(scenarioKey: ScenarioKey): PerformerRow[] {
  const scenario = SCENARIOS[scenarioKey];
  const mean = scenario.populationMean;

  const week1 = Array.from({ length: 20 }, (_, index) => {
    const skill = mean + (seededNoise(index, 1) - 0.5) * mean * 0.35;
    const noise = (seededNoise(index, 2) - 0.5) * mean * 0.25;
    return Math.max(1, Math.round(skill + noise));
  });

  const sortedIndices = week1
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value);

  const topSet = new Set(sortedIndices.slice(0, 5).map((row) => row.index));
  const bottomSet = new Set(sortedIndices.slice(-5).map((row) => row.index));

  return week1.map((w1, index) => {
    const skill = mean + (seededNoise(index, 3) - 0.5) * mean * 0.35;
    const noise = (seededNoise(index, 4) - 0.5) * mean * 0.25;
    const w2 = Math.max(1, Math.round(skill + noise));

    let group: PerformerRow["group"] = "middle";
    if (topSet.has(index)) {
      group = "top";
    } else if (bottomSet.has(index)) {
      group = "bottom";
    }

    return { id: index + 1, week1: w1, week2: w2, group };
  });
}

export function groupAverage(rows: PerformerRow[], group: PerformerRow["group"], week: "week1" | "week2") {
  const subset = rows.filter((row) => row.group === group);
  if (subset.length === 0) {
    return 0;
  }
  return subset.reduce((sum, row) => sum + row[week], 0) / subset.length;
}

export function overallAverage(rows: PerformerRow[], week: "week1" | "week2") {
  return rows.reduce((sum, row) => sum + row[week], 0) / rows.length;
}

export function formatScore(value: number, decimals = 0): string {
  return value.toFixed(decimals);
}
