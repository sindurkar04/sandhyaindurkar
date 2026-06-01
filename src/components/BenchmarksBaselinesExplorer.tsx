"use client";

import {
  SCENARIOS,
  comparisonRead,
  baselineVerdict,
  formatMetric,
  formatComparison,
  type ScenarioKey,
} from "@/lib/benchmarks-baselines-data";
import { useMemo, useState } from "react";

export default function BenchmarksBaselinesExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("conversion_rate");
  const scenario = SCENARIOS[scenarioKey];

  const rows = useMemo(
    () =>
      scenario.baselines.map((baseline) => ({
        baseline,
        ...comparisonRead(scenario.current, baseline, scenario.unit),
        comparison: formatComparison(scenario.current, baseline.value, scenario.unit),
      })),
    [scenario],
  );
  const verdict = useMemo(() => baselineVerdict(scenario), [scenario]);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: one number, four baselines
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        The current metric stays fixed. Change the baseline and the story changes. Up vs last month
        can still be down vs last year or below plan.
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

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
        <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">
          Current {scenario.metricLabel.toLowerCase()}
        </p>
        <p className="mt-1 text-3xl font-black">{formatMetric(scenario.current, scenario.unit)}</p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] text-left">
              <th className="py-2 pr-4 font-bold text-[color:var(--foreground)]">Baseline</th>
              <th className="py-2 pr-4 text-right font-bold text-[color:var(--foreground)]">
                Baseline value
              </th>
              <th className="py-2 pr-4 text-right font-bold text-[color:var(--foreground)]">
                Change
              </th>
              <th className="py-2 text-left font-bold text-[color:var(--foreground)]">Read</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-b border-[color:var(--border)]" key={row.baseline.key}>
                <td className="py-3 pr-4 text-[color:var(--muted)]">{row.baseline.label}</td>
                <td className="py-3 pr-4 text-right font-bold text-[color:var(--foreground)]">
                  {formatMetric(row.baseline.value, scenario.unit)}
                </td>
                <td
                  className={`py-3 pr-4 text-right font-black ${
                    row.direction === "up"
                      ? "text-[color:var(--foreground)]"
                      : row.direction === "down"
                        ? "text-[color:var(--muted)]"
                        : "text-[color:var(--muted)]"
                  }`}
                >
                  {row.comparison}
                </td>
                <td className="py-3 text-[color:var(--muted)]">{row.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-3 rounded-xl border border-black bg-black px-5 py-5 text-white">
        <p className="text-lg font-black">{verdict}</p>
        <p className="text-base leading-relaxed opacity-95">{scenario.contextNote}</p>
        <p className="border-t border-white/20 pt-3 text-base font-bold leading-relaxed">
          Rule of thumb: say the number, then say compared to what.
        </p>
      </div>
    </section>
  );
}
