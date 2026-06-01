"use client";

import CohortRetentionHeatmap from "@/components/CohortRetentionHeatmap";
import {
  HEATMAP_BY_SCENARIO,
  SCENARIOS,
  applyWeights,
  cohortRead,
  formatRate,
  formatWeight,
  mixShiftWeights,
  weightedRetention,
  type ScenarioKey,
} from "@/lib/cohort-analysis-data";
import { useMemo, useState } from "react";

const RETENTION_BAR_MAX = 50;

export default function CohortAnalysisExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("mix_shift");
  const [recentShare, setRecentShare] = useState(SCENARIOS.mix_shift.sliderDefault ?? 28);

  const scenario = SCENARIOS[scenarioKey];

  const cohorts = useMemo(() => {
    if (scenarioKey !== "mix_shift") {
      return scenario.cohorts;
    }
    return applyWeights(scenario.cohorts, mixShiftWeights(recentShare));
  }, [scenario.cohorts, scenarioKey, recentShare]);

  const overall = weightedRetention(cohorts);
  const insight = cohortRead(scenarioKey, cohorts, overall);
  const heatmap = HEATMAP_BY_SCENARIO[scenarioKey];

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: headline retention vs signup cohorts
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Each row is day-30 retention for users who signed up in that month. The headline number is
        a weighted blend of those cohorts.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              scenarioKey === key
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            key={key}
            onClick={() => setScenarioKey(key)}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      {scenarioKey === "mix_shift" && scenario.sliderLabel ? (
        <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="cohort-mix-slider">
              {scenario.sliderLabel}
            </label>
            <span className="text-sm font-bold text-[color:var(--foreground)]">{recentShare}%</span>
          </div>
          <input
            className="w-full accent-black"
            id="cohort-mix-slider"
            max={scenario.sliderMax}
            min={scenario.sliderMin}
            onChange={(event) => setRecentShare(Number(event.target.value))}
            type="range"
            value={recentShare}
          />
          <div className="flex justify-between text-xs font-bold text-[color:var(--muted)]">
            <span>Mostly mature signups</span>
            <span>Mostly recent signups</span>
          </div>
        </div>
      ) : null}

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
        <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Headline retention</p>
        <p className="mt-1 text-3xl font-black">{formatRate(overall)}</p>
        <p className="mt-1 text-xs opacity-80">Weighted blend of cohort rows below</p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] text-left">
              <th className="py-2 pr-4 font-bold text-[color:var(--foreground)]">Cohort</th>
              <th className="py-2 pr-4 font-bold text-[color:var(--foreground)]">D30 retention</th>
              <th className="py-2 text-right font-bold text-[color:var(--foreground)]">Mix share</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((row) => (
              <tr className="border-b border-[color:var(--border)]" key={row.label}>
                <td className="py-3 pr-4 text-[color:var(--muted)]">{row.label}</td>
                <td className="py-3 pr-4">
                  <div className="flex min-w-[180px] items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="h-2.5 flex-1 overflow-hidden rounded-full bg-[color:var(--surface-strong)]"
                    >
                      <div
                        className="h-full rounded-full bg-black"
                        style={{
                          width: `${Math.min(100, (row.retentionRate / RETENTION_BAR_MAX) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right font-bold text-[color:var(--foreground)]">
                      {formatRate(row.retentionRate)}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right font-bold text-[color:var(--foreground)]">
                  {formatWeight(row.weight)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CohortRetentionHeatmap data={heatmap} />

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {insight}
      </p>
    </section>
  );
}
