export type ScenarioKey = "kpi_axes" | "survey_scores" | "ops_metrics";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  scale1: number;
  scale2: number;
  shear: number;
  defaultAngle: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  kpi_axes: {
    key: "kpi_axes",
    shortLabel: "KPI axes",
    headline: "Revenue and orders share variance, but each principal axis is an eigenvector direction.",
    scale1: 2.2,
    scale2: 0.9,
    shear: 0.85,
    defaultAngle: 35,
  },
  survey_scores: {
    key: "survey_scores",
    shortLabel: "Survey scores",
    headline: "Ease and speed scores rotate together; eigenvectors mark the independent summary directions.",
    scale1: 1.6,
    scale2: 0.7,
    shear: 0.6,
    defaultAngle: 60,
  },
  ops_metrics: {
    key: "ops_metrics",
    shortLabel: "Ops metrics",
    headline: "Wait time and CSAT drift on different eigenvector axes when staffing shifts.",
    scale1: 1.4,
    scale2: 1.3,
    shear: 0.35,
    defaultAngle: 15,
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

export function matVec(m: Matrix2x2, v: [number, number]): [number, number] {
  return [
    m[0][0] * v[0] + m[0][1] * v[1],
    m[1][0] * v[0] + m[1][1] * v[1],
  ];
}

export function angleToVector(deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [Math.cos(rad), Math.sin(rad)];
}

export function isNearEigenvector(
  v: [number, number],
  e1: [number, number],
  e2: [number, number],
  tol = 0.08,
): boolean {
  const cross = (a: [number, number], b: [number, number]) => Math.abs(a[0] * b[1] - a[1] * b[0]);
  return cross(v, e1) < tol || cross(v, e2) < tol;
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function eigenvectorsReadout(
  scenario: Scenario,
  angle: number,
  lambda1: number,
  lambda2: number,
  onAxis: boolean,
): string {
  if (onAxis) {
    return `At ${angle}°, your test vector aligns with an eigenvector. A stretches it by λ only; no rotation. That axis carries independent variance in PCA.`;
  }
  return `${scenario.headline} At ${angle}°, a general vector rotates and stretches. Eigenvectors at λ₁ = ${formatNum(lambda1)} and λ₂ = ${formatNum(lambda2)} are the only directions that scale cleanly.`;
}

/** Grid points in [-1, 1] for visualization */
export function gridPoints(step = 0.25): [number, number][] {
  const pts: [number, number][] = [];
  for (let x = -1; x <= 1.001; x += step) {
    for (let y = -1; y <= 1.001; y += step) {
      pts.push([x, y]);
    }
  }
  return pts;
}
