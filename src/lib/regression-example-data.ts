export type WeekRow = {
  week: number;
  adSpendK: number;
  emailSendK: number;
  orders: number;
  split: "train" | "holdout";
  note?: string;
};

export const REVENUE_PER_ORDER = 50;

export const WEEKS: WeekRow[] = [
  { week: 1, adSpendK: 10, emailSendK: 70, orders: 378, split: "train" },
  { week: 2, adSpendK: 12, emailSendK: 75, orders: 412, split: "train" },
  { week: 3, adSpendK: 14, emailSendK: 80, orders: 448, split: "train" },
  { week: 4, adSpendK: 11, emailSendK: 72, orders: 401, split: "train" },
  { week: 5, adSpendK: 16, emailSendK: 88, orders: 492, split: "train" },
  { week: 6, adSpendK: 18, emailSendK: 92, orders: 528, split: "train" },
  { week: 7, adSpendK: 15, emailSendK: 85, orders: 471, split: "train" },
  { week: 8, adSpendK: 20, emailSendK: 95, orders: 558, split: "train" },
  {
    week: 9,
    adSpendK: 13,
    emailSendK: 78,
    orders: 425,
    split: "holdout",
    note: "Reserved for reality check",
  },
  {
    week: 10,
    adSpendK: 19,
    emailSendK: 90,
    orders: 541,
    split: "holdout",
    note: "Reserved for reality check",
  },
];

/** One-off viral week: normal marketing, unusually high orders (outlier). */
export const OUTLIER_WEEK: WeekRow = {
  week: 11,
  adSpendK: 14,
  emailSendK: 74,
  orders: 640,
  split: "train",
  note: "Viral product mention (outlier)",
};

export type ModelSpec = {
  id: string;
  name: string;
  features: string[];
  intercept: number;
  adSpendCoef: number;
  emailCoef: number;
};

export function predictInputs(
  adSpendK: number,
  emailSendK: number,
  model: ModelSpec,
): number {
  return model.intercept + model.adSpendCoef * adSpendK + model.emailCoef * emailSendK;
}

export function predict(row: WeekRow, model: ModelSpec): number {
  return predictInputs(row.adSpendK, row.emailSendK, model);
}

function meanAbsoluteError(rows: WeekRow[], model: ModelSpec): number {
  if (rows.length === 0) {
    return 0;
  }
  const total = rows.reduce((sum, row) => sum + Math.abs(row.orders - predict(row, model)), 0);
  return total / rows.length;
}

export function fitLinearRegression(
  rows: WeekRow[],
  useAd: boolean,
  useEmail: boolean,
): ModelSpec {
  const n = rows.length;
  const featureCount = (useAd ? 1 : 0) + (useEmail ? 1 : 0);

  if (n === 0 || featureCount === 0) {
    const intercept =
      n === 0 ? 0 : rows.reduce((sum, row) => sum + row.orders, 0) / n;
    return {
      id: "mean_only",
      name: "Average only",
      features: [],
      intercept,
      adSpendCoef: 0,
      emailCoef: 0,
    };
  }

  const xtx: number[][] = Array.from({ length: featureCount + 1 }, () =>
    Array(featureCount + 1).fill(0),
  );
  const xty: number[] = Array(featureCount + 1).fill(0);

  for (const row of rows) {
    const x = [1];
    if (useAd) {
      x.push(row.adSpendK);
    }
    if (useEmail) {
      x.push(row.emailSendK);
    }

    for (let i = 0; i < x.length; i += 1) {
      xty[i] += x[i] * row.orders;
      for (let j = 0; j < x.length; j += 1) {
        xtx[i][j] += x[i] * x[j];
      }
    }
  }

  const coeffs = solveLinearSystem(xtx, xty);

  return {
    id: useAd && useEmail ? "full" : useAd ? "ad_only" : "email_only",
    name: useAd && useEmail ? "Ad spend + email" : useAd ? "Ad spend only" : "Email only",
    features: [
      ...(useAd ? ["Weekly ad spend ($k)"] : []),
      ...(useEmail ? ["Weekly email sends (k)"] : []),
    ],
    intercept: coeffs[0],
    adSpendCoef: useAd ? coeffs[1] : 0,
    emailCoef: useEmail ? (useAd ? coeffs[2] : coeffs[1]) : 0,
  };
}

function solveLinearSystem(matrix: number[][], values: number[]): number[] {
  const size = values.length;
  const augmented = matrix.map((row, index) => [...row, values[index]]);

  for (let pivot = 0; pivot < size; pivot += 1) {
    let maxRow = pivot;
    for (let row = pivot + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[maxRow][pivot])) {
        maxRow = row;
      }
    }

    const temp = augmented[pivot];
    augmented[pivot] = augmented[maxRow];
    augmented[maxRow] = temp;

    const pivotValue = augmented[pivot][pivot] || 1e-9;
    for (let col = pivot; col <= size; col += 1) {
      augmented[pivot][col] /= pivotValue;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === pivot) {
        continue;
      }
      const factor = augmented[row][pivot];
      for (let col = pivot; col <= size; col += 1) {
        augmented[row][col] -= factor * augmented[pivot][col];
      }
    }
  }

  return augmented.map((row) => row[size]);
}

export function trainingWeeks(includeOutlier: boolean): WeekRow[] {
  const base = WEEKS.filter((row) => row.split === "train");
  return includeOutlier ? [...base, OUTLIER_WEEK] : base;
}

export function holdoutWeeks(): WeekRow[] {
  return WEEKS.filter((row) => row.split === "holdout");
}

export function allDisplayWeeks(includeOutlier: boolean): WeekRow[] {
  const base = [...WEEKS];
  return includeOutlier ? [...base.filter((r) => r.split === "train"), OUTLIER_WEEK, ...holdoutWeeks()] : base;
}

const defaultTrain = trainingWeeks(false);
const defaultHoldout = holdoutWeeks();

export const MODEL_AD_ONLY = fitLinearRegression(defaultTrain, true, false);
export const MODEL_EMAIL_ONLY = fitLinearRegression(defaultTrain, false, true);
export const MODEL_FULL = fitLinearRegression(defaultTrain, true, true);

export const PRIMARY_MODEL = MODEL_FULL;

export function formatCoef(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}

export function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

export function modelSummary(model: ModelSpec): string {
  return `Predicted orders ≈ ${Math.round(model.intercept)} ${formatCoef(model.adSpendCoef)} × (ad $k) ${formatCoef(model.emailCoef)} × (email k)`;
}

export function revenueFromOrders(orders: number): number {
  return orders * REVENUE_PER_ORDER;
}

export const PLANNING_SCENARIOS = [
  { label: "Conservative", adSpendK: 14, emailSendK: 82 },
  { label: "Planned", adSpendK: 17, emailSendK: 90 },
  { label: "Aggressive", adSpendK: 21, emailSendK: 96 },
];

export function buildPlanningRows(model: ModelSpec = PRIMARY_MODEL) {
  return PLANNING_SCENARIOS.map((scenario) => {
    const predicted = Math.round(predictInputs(scenario.adSpendK, scenario.emailSendK, model));
    const revenue = revenueFromOrders(predicted);
    const vsPlanned =
      scenario.label === "Planned"
        ? "Baseline plan"
        : predicted > Math.round(predictInputs(17, 90, model))
          ? `+${predicted - Math.round(predictInputs(17, 90, model))} orders vs planned`
          : `${predicted - Math.round(predictInputs(17, 90, model))} orders vs planned`;

    return {
      plan: scenario.label,
      adSpendK: scenario.adSpendK,
      emailSendK: scenario.emailSendK,
      forecastOrders: predicted,
      estRevenue: formatMoney(revenue),
      vsPlanned,
    };
  });
}

export function buildRealityCheckRows(model: ModelSpec = PRIMARY_MODEL) {
  return holdoutWeeks().map((row) => {
    const predicted = Math.round(predict(row, model));
    const miss = row.orders - predicted;
    const missLabel = miss === 0 ? "On target" : miss > 0 ? `${miss} above forecast` : `${Math.abs(miss)} below forecast`;
    const read =
      Math.abs(miss) <= 25
        ? "Close enough to use for planning"
        : Math.abs(miss) <= 50
          ? "Widen your range before committing budget"
          : "Revisit inputs or recent market shift";

    return {
      week: `Week ${row.week}`,
      actualOrders: row.orders,
      forecastOrders: predicted,
      gap: missLabel,
      decision: read,
    };
  });
}

export function buildModelTrustRows(includeOutlier: boolean) {
  const train = trainingWeeks(includeOutlier);
  const holdout = holdoutWeeks();
  const models = [
    fitLinearRegression(train, true, false),
    fitLinearRegression(train, false, true),
    fitLinearRegression(train, true, true),
  ];

  return models.map((model) => {
    const trainErr = Math.round(meanAbsoluteError(train, model));
    const holdoutErr = Math.round(meanAbsoluteError(holdout, model));
    const trust =
      holdoutErr <= 30
        ? "Strong for next-week forecast"
        : holdoutErr <= 45
          ? "Usable with a safety buffer"
          : "Do not rely on this alone";

    return {
      approach: model.name,
      avgMissOnHistory: `${trainErr} orders`,
      avgMissOnRealityCheck: `${holdoutErr} orders`,
      recommendation: trust,
    };
  });
}

export function buildLeverRows(model: ModelSpec) {
  const baseAd = 17;
  const baseEmail = 90;
  const baseOrders = Math.round(predictInputs(baseAd, baseEmail, model));

  const plusAd = Math.round(predictInputs(baseAd + 1, baseEmail, model));
  const plusEmail = Math.round(predictInputs(baseAd, baseEmail + 5, model));

  return [
    {
      lever: "Add $1k ad spend (hold email flat)",
      orderChange: `+${plusAd - baseOrders} orders`,
      revenueChange: formatMoney((plusAd - baseOrders) * REVENUE_PER_ORDER),
    },
    {
      lever: "Add 5k email sends (hold ad flat)",
      orderChange: `+${plusEmail - baseOrders} orders`,
      revenueChange: formatMoney((plusEmail - baseOrders) * REVENUE_PER_ORDER),
    },
  ];
}

export function lineY(
  x: number,
  line: { intercept: number; slope: number },
): number {
  return line.intercept + line.slope * x;
}
