export type ScenarioKey = "two_driver_regression" | "inventory_balance" | "mix_allocation";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  equationLabels: string[];
  /** Ax = b: 2x2 for display */
  A: number[][];
  b: number[];
  solution: number[];
  variableNames: string[];
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  two_driver_regression: {
    key: "two_driver_regression",
    shortLabel: "Two-driver fit",
    headline: "Two weeks, two levers: solve for intercept and ad slope from normal equations.",
    equationLabels: ["Sum of y = n·a + b·Σx", "Sum of xy = a·Σx + b·Σxx"],
    A: [
      [4, 10],
      [10, 30],
    ],
    b: [20, 58],
    solution: [2.5, 1.0],
    variableNames: ["intercept a", "slope b"],
  },
  inventory_balance: {
    key: "inventory_balance",
    shortLabel: "Inventory balance",
    headline: "Two warehouses, two constraints: units in = units out.",
    equationLabels: ["Store A + Store B = 500 units", "2·A + B = 800 units"],
    A: [
      [1, 1],
      [2, 1],
    ],
    b: [500, 800],
    solution: [300, 200],
    variableNames: ["Store A", "Store B"],
  },
  mix_allocation: {
    key: "mix_allocation",
    shortLabel: "Budget mix",
    headline: "Spend split across channels with cost and reach constraints.",
    equationLabels: ["Ads + Email = $10k budget", "3·Ads + Email = $22k reach index"],
    A: [
      [1, 1],
      [3, 1],
    ],
    b: [10, 22],
    solution: [6, 4],
    variableNames: ["Ads ($k)", "Email ($k)"],
  },
};

export function solve2x2(A: number[][], b: number[]): number[] | null {
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  if (Math.abs(det) < 1e-9) return null;
  const x0 = (b[0] * A[1][1] - b[1] * A[0][1]) / det;
  const x1 = (A[0][0] * b[1] - A[1][0] * b[0]) / det;
  return [x0, x1];
}

export function formatNum(value: number, digits = 1): string {
  return value.toFixed(digits);
}

export function systemReadout(scenario: Scenario): string {
  return `Solution: ${scenario.variableNames[0]} = ${formatNum(scenario.solution[0])}, ${scenario.variableNames[1]} = ${formatNum(scenario.solution[1])}. Regression with two unknowns (intercept + slope) is the same pattern: matrix A from data sums, vector b from targets.`;
}
