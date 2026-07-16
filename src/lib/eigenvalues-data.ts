export type ScenarioKey = "kpi_covariance" | "product_features" | "stability_check";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  defaultScale1: number;
  defaultScale2: number;
  defaultShear: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  kpi_covariance: {
    key: "kpi_covariance",
    shortLabel: "KPI covariance",
    headline: "Revenue and orders co-move. Eigenvalues rank how much each axis stretches variance.",
    defaultScale1: 2.4,
    defaultScale2: 1.1,
    defaultShear: 0.9,
  },
  product_features: {
    key: "product_features",
    shortLabel: "Product features",
    headline: "Two correlated survey scores share one dominant stretch direction.",
    defaultScale1: 1.8,
    defaultScale2: 0.6,
    defaultShear: 0.7,
  },
  stability_check: {
    key: "stability_check",
    shortLabel: "Stability check",
    headline: "When one eigenvalue dominates, small shocks stay on one axis. Balanced eigenvalues mean mixed risk.",
    defaultScale1: 1.5,
    defaultScale2: 1.4,
    defaultShear: 0.2,
  },
};

export type Matrix2x2 = [[number, number], [number, number]];

export const COLORS = {
  blue: "#2563eb",
  teal: "#0d9488",
  orange: "#ea580c",
  violet: "#8b5cf6",
  rose: "#e11d48",
} as const;

export function buildSymmetricMatrix(scale1: number, scale2: number, shear: number): Matrix2x2 {
  return [
    [scale1, shear],
    [shear, scale2],
  ];
}

export function eigenvaluesSymmetric(a: number, b: number, d: number): [number, number] {
  const trace = a + d;
  const det = a * d - b * b;
  const disc = Math.sqrt(Math.max(0, trace * trace - 4 * det));
  const raw1 = (trace + disc) / 2;
  const raw2 = (trace - disc) / 2;
  if (Math.abs(raw1) >= Math.abs(raw2)) return [raw1, raw2];
  return [raw2, raw1];
}

export function eigenvectorForLambda(a: number, b: number, d: number, lambda: number): [number, number] {
  if (Math.abs(b) < 1e-8) {
    if (Math.abs(a - lambda) < Math.abs(d - lambda)) return [1, 0];
    return [0, 1];
  }
  const vx = b;
  const vy = lambda - a;
  const norm = Math.hypot(vx, vy) || 1;
  return [vx / norm, vy / norm];
}

export function varianceShare(lambda1: number, lambda2: number): { pc1: number; pc2: number } {
  const total = Math.abs(lambda1) + Math.abs(lambda2);
  if (total === 0) return { pc1: 0.5, pc2: 0.5 };
  return { pc1: Math.abs(lambda1) / total, pc2: Math.abs(lambda2) / total };
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function eigenvaluesReadout(
  scenario: Scenario,
  lambda1: number,
  lambda2: number,
  share: ReturnType<typeof varianceShare>,
): string {
  const ratio = share.pc1;
  if (ratio > 0.75) {
    return `${scenario.headline} λ₁ = ${formatNum(lambda1)} carries ${(ratio * 100).toFixed(0)}% of stretch. One composite axis (like PC1) explains most variance.`;
  }
  if (ratio < 0.55) {
    return `λ₁ = ${formatNum(lambda1)} and λ₂ = ${formatNum(lambda2)} are closer in size. Both axes matter; no single stretch factor dominates.`;
  }
  return `λ₁ = ${formatNum(lambda1)} is the main stretch (${(ratio * 100).toFixed(0)}%). λ₂ = ${formatNum(lambda2)} captures the secondary direction.`;
}
