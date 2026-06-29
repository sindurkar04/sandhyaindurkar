export type ScenarioKey = "quadratic" | "logistic_loss";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  defaultLr: number;
  defaultStart: number;
  optimum: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  quadratic: {
    key: "quadratic",
    shortLabel: "Squared error bowl",
    headline: "Gradient descent rolls downhill on a smooth loss surface toward one minimum.",
    defaultLr: 0.15,
    defaultStart: -1.2,
    optimum: 2.5,
  },
  logistic_loss: {
    key: "logistic_loss",
    shortLabel: "Logistic loss",
    headline: "Classification training uses a smooth loss; each step nudges weights toward lower error.",
    defaultLr: 0.2,
    defaultStart: -2,
    optimum: 1.8,
  },
};

export const COLORS = {
  curve: "#6366f1",
  fill: "#c7d2fe",
  path: "#f97316",
  point: "#8b5cf6",
  grid: "#e2e8f0",
  min: "#22c55e",
} as const;

export function quadraticLoss(w: number, optimum: number): number {
  return 0.5 * (w - optimum) ** 2;
}

export function quadraticGrad(w: number, optimum: number): number {
  return w - optimum;
}

export function logisticDemoLoss(w: number, optimum: number): number {
  return Math.log(1 + Math.exp(-(w - optimum) * 2));
}

export function logisticDemoGrad(w: number, optimum: number): number {
  const z = -(w - optimum) * 2;
  const s = 1 / (1 + Math.exp(-z));
  return -2 * (1 - s);
}

export function lossFn(scenario: Scenario, w: number): number {
  return scenario.key === "quadratic" ? quadraticLoss(w, scenario.optimum) : logisticDemoLoss(w, scenario.optimum);
}

export function gradFn(scenario: Scenario, w: number): number {
  return scenario.key === "quadratic" ? quadraticGrad(w, scenario.optimum) : logisticDemoGrad(w, scenario.optimum);
}

export type GdStep = { w: number; loss: number };

export function runGradientDescent(
  scenario: Scenario,
  start: number,
  lr: number,
  steps: number,
): GdStep[] {
  const path: GdStep[] = [{ w: start, loss: lossFn(scenario, start) }];
  let w = start;
  for (let i = 0; i < steps; i += 1) {
    w -= lr * gradFn(scenario, w);
    path.push({ w, loss: lossFn(scenario, w) });
  }
  return path;
}

export function formatNum(n: number, d = 2): string {
  return n.toFixed(d);
}

export function gdReadout(scenario: Scenario, lr: number, path: GdStep[]): string {
  const last = path[path.length - 1];
  const dist = Math.abs(last.w - scenario.optimum);
  if (lr > 0.45) {
    return `Learning rate ${formatNum(lr)} is too high: the path overshoots and oscillates. Lower lr for stable convergence.`;
  }
  if (dist < 0.08) {
    return `Converged near the minimum (w ≈ ${formatNum(last.w)}). In real training, mini-batches and Adam-style optimizers adapt this step size.`;
  }
  return `After ${path.length - 1} steps at lr = ${formatNum(lr)}, w = ${formatNum(last.w)}. Still ${formatNum(dist)} from optimum. Increase steps or adjust learning rate.`;
}
