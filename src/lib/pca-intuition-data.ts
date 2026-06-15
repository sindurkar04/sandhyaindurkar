export type ScenarioKey = "kpi_dashboard" | "product_survey" | "support_metrics";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  metrics: string[];
  /** variance explained by PC1 and PC2 at full correlation */
  pc1Share: number;
  pc2Share: number;
  defaultRedundancy: number;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  kpi_dashboard: {
    key: "kpi_dashboard",
    shortLabel: "KPI dashboard",
    headline: "Revenue, orders, and active users move together. One axis captures most of the story.",
    metrics: ["Revenue", "Orders", "Active users", "AOV"],
    pc1Share: 0.72,
    pc2Share: 0.18,
    defaultRedundancy: 80,
  },
  product_survey: {
    key: "product_survey",
    shortLabel: "Product survey",
    headline: "Ease, speed, and clarity scores cluster. PCA finds the combined satisfaction axis.",
    metrics: ["Ease", "Speed", "Clarity", "Design"],
    pc1Share: 0.65,
    pc2Share: 0.22,
    defaultRedundancy: 75,
  },
  support_metrics: {
    key: "support_metrics",
    shortLabel: "Support metrics",
    headline: "Wait time, reopen rate, and CSAT shift together when staffing is tight.",
    metrics: ["Wait time", "Reopens", "CSAT", "FCR"],
    pc1Share: 0.68,
    pc2Share: 0.2,
    defaultRedundancy: 70,
  },
};

export function varianceExplained(scenario: Scenario, redundancy: number): { pc1: number; pc2: number; rest: number } {
  const t = redundancy / 100;
  const pc1 = scenario.pc1Share + (1 - scenario.pc1Share) * (1 - t) * 0.15;
  const pc2 = scenario.pc2Share * t;
  const rest = Math.max(0, 1 - pc1 - pc2);
  return { pc1, pc2, rest };
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export function pcaReadout(scenario: Scenario, redundancy: number, ve: ReturnType<typeof varianceExplained>): string {
  if (ve.pc1 > 0.6) {
    return `PC1 explains ${formatPct(ve.pc1)} of variance across ${scenario.metrics.length} metrics. When KPIs are redundant, one composite score can replace a wall of charts.`;
  }
  return `Metrics are less aligned at this redundancy level. PC1 ${formatPct(ve.pc1)}, PC2 ${formatPct(ve.pc2)}. You still need multiple axes to track the business.`;
}
