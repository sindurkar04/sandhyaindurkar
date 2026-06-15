import { bestFit, POINTS, totalSquaredError } from "@/lib/linear-models-data";

export type ScenarioKey = "weekly_growth" | "noisy_ops";

export const SCENARIOS: Record<ScenarioKey, { key: ScenarioKey; shortLabel: string; headline: string }> = {
  weekly_growth: {
    key: "weekly_growth",
    shortLabel: "Weekly metric",
    headline: "Each point pulls the line. Squared error makes big misses cost more.",
  },
  noisy_ops: {
    key: "noisy_ops",
    shortLabel: "Noisy ops",
    headline: "One outlier week dominates total squared error unless the line bends toward it.",
  },
};

export { POINTS, bestFit, totalSquaredError };

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function leastSquaresReadout(intercept: number, slope: number): string {
  const sse = totalSquaredError(intercept, slope);
  const fit = bestFit();
  const isBest = Math.abs(sse - totalSquaredError(fit.intercept, fit.slope)) < 0.01;
  if (isBest) {
    return `Total squared error = ${formatNum(sse)}. This is the minimum for these points. Least squares picks the line where squared residuals sum to the smallest value.`;
  }
  return `Total squared error = ${formatNum(sse)}. Best fit is ${formatNum(totalSquaredError(fit.intercept, fit.slope))}. Move intercept/slope toward the best-fit line to shrink squared residuals.`;
}
