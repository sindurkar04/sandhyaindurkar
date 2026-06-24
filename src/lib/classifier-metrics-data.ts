export type ScenarioKey = "fraud" | "hiring" | "safety" | "spam";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  population: number;
  prevalence: number;
  separation: number;
  defaultThreshold: number;
  precisionPriority: string;
  recallPriority: string;
  fpLabel: string;
  fnLabel: string;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  fraud: {
    key: "fraud",
    shortLabel: "Fraud block",
    headline: "Rare fraud, costly misses. Teams debate recall until the false-block queue explodes.",
    population: 10000,
    prevalence: 0.02,
    separation: 1.05,
    defaultThreshold: 72,
    precisionPriority: "Auto-block without review: every false block angers a customer.",
    recallPriority: "Manual review queue: missed fraud is dollars walking out the door.",
    fpLabel: "Clean order blocked",
    fnLabel: "Fraud missed",
  },
  hiring: {
    key: "hiring",
    shortLabel: "Hiring screen",
    headline: "Strong applicants are scarce. Low precision wastes interviewer hours.",
    population: 5000,
    prevalence: 0.12,
    separation: 0.82,
    defaultThreshold: 78,
    precisionPriority: "Interview slots: advance only candidates worth a live conversation.",
    recallPriority: "Talent pipeline: do not lose strong passive candidates to a high bar.",
    fpLabel: "Weak candidate advanced",
    fnLabel: "Strong candidate skipped",
  },
  safety: {
    key: "safety",
    shortLabel: "Safety scan",
    headline: "One miss makes headlines. Low threshold floods moderators with clean content.",
    population: 20000,
    prevalence: 0.015,
    separation: 0.95,
    defaultThreshold: 65,
    precisionPriority: "Contractor morale: false flags burn out human reviewers fast.",
    recallPriority: "Policy risk: a missed violation is reputational and legal exposure.",
    fpLabel: "Clean post flagged",
    fnLabel: "Violation missed",
  },
  spam: {
    key: "spam",
    shortLabel: "Spam filter",
    headline: "Users tolerate some spam in inbox more than losing real mail.",
    population: 15000,
    prevalence: 0.08,
    separation: 0.88,
    defaultThreshold: 80,
    precisionPriority: "Inbox trust: spam filter must not hide receipts and login codes.",
    recallPriority: "User annoyance: too much spam erodes product quality scores.",
    fpLabel: "Real email filtered",
    fnLabel: "Spam delivered",
  },
};

export type ConfusionCounts = {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  positives: number;
  negatives: number;
};

export type ClassifierMetrics = {
  counts: ConfusionCounts;
  accuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  f1: number;
  npv: number;
  fpr: number;
  fnr: number;
  balancedAccuracy: number;
  flagged: number;
  tpr: number;
  fprRate: number;
};

export type CurvePoint = {
  threshold: number;
  tpr: number;
  fpr: number;
  precision: number;
  recall: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/** Higher separation → better ranker; threshold 0–100 maps to score cutoff */
export function ratesAtThreshold(thresholdPct: number, scenario: Scenario): { tpr: number; fpr: number } {
  const cutoff = thresholdPct / 100;
  const shift = (cutoff - 0.5) * 10;
  const sep = scenario.separation;
  const tpr = clamp(sigmoid(sep * 2.2 - shift), 0.03, 0.995);
  const fpr = clamp(sigmoid(sep * 0.55 - shift), 0.005, 0.95);
  return { tpr, fpr };
}

export function confusionFromRates(
  scenario: Scenario,
  tpr: number,
  fpr: number,
): ConfusionCounts {
  const positives = Math.round(scenario.population * scenario.prevalence);
  const negatives = scenario.population - positives;
  const tp = Math.round(positives * tpr);
  const fn = Math.max(0, positives - tp);
  const fp = Math.round(negatives * fpr);
  const tn = Math.max(0, negatives - fp);
  return { tp, fp, fn, tn, positives, negatives };
}

export function metricsFromCounts(counts: ConfusionCounts): Omit<ClassifierMetrics, "tpr" | "fprRate" | "flagged"> {
  const { tp, fp, fn, tn } = counts;
  const total = tp + fp + fn + tn;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
  const npv = tn + fn > 0 ? tn / (tn + fn) : 0;
  const fpr = fp + tn > 0 ? fp / (fp + tn) : 0;
  const fnr = fn + tp > 0 ? fn / (fn + tp) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return {
    counts,
    accuracy: total > 0 ? (tp + tn) / total : 0,
    precision,
    recall,
    specificity,
    f1,
    npv,
    fpr,
    fnr,
    balancedAccuracy: (recall + specificity) / 2,
  };
}

export function metricsAtThreshold(thresholdPct: number, scenario: Scenario): ClassifierMetrics {
  const { tpr, fpr } = ratesAtThreshold(thresholdPct, scenario);
  const counts = confusionFromRates(scenario, tpr, fpr);
  const base = metricsFromCounts(counts);
  return {
    ...base,
    flagged: counts.tp + counts.fp,
    tpr,
    fprRate: fpr,
  };
}

export function thresholdCurve(scenario: Scenario): CurvePoint[] {
  const points: CurvePoint[] = [];
  for (let threshold = 5; threshold <= 95; threshold += 2) {
    const { tpr, fpr } = ratesAtThreshold(threshold, scenario);
    const counts = confusionFromRates(scenario, tpr, fpr);
    const m = metricsFromCounts(counts);
    points.push({
      threshold,
      tpr,
      fpr,
      precision: m.precision,
      recall: m.recall,
    });
  }
  return points;
}

export function aucFromRoc(curve: CurvePoint[]): number {
  let area = 0;
  for (let i = 1; i < curve.length; i += 1) {
    const prev = curve[i - 1];
    const curr = curve[i];
    const width = curr.fpr - prev.fpr;
    const height = (curr.tpr + prev.tpr) / 2;
    area += width * height;
  }
  return clamp(area, 0, 1);
}

export function nearestCurvePoint(
  svgX: number,
  svgY: number,
  curve: CurvePoint[],
  xScale: (value: number) => number,
  yScale: (value: number) => number,
  xKey: "fpr" | "recall",
  yKey: "tpr" | "precision",
): CurvePoint {
  let best = curve[0];
  let bestDist = Infinity;
  for (const point of curve) {
    const px = xScale(point[xKey]);
    const py = yScale(point[yKey]);
    const dist = (px - svgX) ** 2 + (py - svgY) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = point;
    }
  }
  return best;
}

export function formatPct(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function businessReadout(
  scenario: Scenario,
  threshold: number,
  metrics: ClassifierMetrics,
  auc: number,
): string {
  const { precision, recall, flagged, counts } = metrics;
  if (precision < 0.25 && recall > 0.75) {
    return `Threshold ${threshold}% maximizes recall (${formatPct(recall)}) but only ${formatPct(precision)} of ${flagged.toLocaleString()} flagged rows are real. ${scenario.precisionPriority}`;
  }
  if (recall < 0.4 && precision > 0.7) {
    return `Threshold ${threshold}% keeps precision at ${formatPct(precision)}, but ${counts.fn} ${scenario.fnLabel.toLowerCase()} cases slip through (recall ${formatPct(recall)}). ${scenario.recallPriority}`;
  }
  if (metrics.accuracy > 0.97 && scenario.prevalence < 0.05) {
    return `Accuracy is ${formatPct(metrics.accuracy)} but prevalence is only ${formatPct(scenario.prevalence, 1)}. A naive "predict nothing" model would score almost as high. Use precision, recall, and AUC (${formatNum(auc)}) instead.`;
  }
  return `AUC ${formatNum(auc)} summarizes ranker quality across thresholds. At ${threshold}%: precision ${formatPct(precision)}, recall ${formatPct(recall)}. Pick the operating point from ${scenario.fpLabel.toLowerCase()} vs ${scenario.fnLabel.toLowerCase()} costs, not accuracy alone.`;
}

export function precisionVsRecallGuidance(scenario: Scenario): {
  optimizePrecision: string[];
  optimizeRecall: string[];
} {
  const guides: Record<ScenarioKey, { optimizePrecision: string[]; optimizeRecall: string[] }> = {
    fraud: {
      optimizePrecision: ["Auto-block with no human review", "Customer-facing denial without appeal path"],
      optimizeRecall: ["Chargebacks dominate unit economics", "Manual review capacity exists"],
    },
    hiring: {
      optimizePrecision: ["Interview hours are expensive", "Hiring manager calendar is the bottleneck"],
      optimizeRecall: ["Talent is scarce in the role", "Passive sourcing pipeline is thin"],
    },
    safety: {
      optimizePrecision: ["Contractor burnout from false flags", "High-volume UGC with low violation rate"],
      optimizeRecall: ["Regulatory or PR risk from misses", "Escalation path exists for borderline flags"],
    },
    spam: {
      optimizePrecision: ["Transactional mail must never disappear", "Users cannot recover false deletes easily"],
      optimizeRecall: ["Spam volume hurts retention", "Users can mark spam manually as backup"],
    },
  };
  return guides[scenario.key];
}
