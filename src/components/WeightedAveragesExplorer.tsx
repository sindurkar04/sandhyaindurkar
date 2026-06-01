"use client";

import {
  SCENARIOS,
  formatCount,
  formatRate,
  simpleAverageRate,
  weightedAverageRate,
  weightedRead,
  type ScenarioKey,
} from "@/lib/weighted-averages-data";
import { useMemo, useState } from "react";

export default function WeightedAveragesExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("regional_csat");
  const scenario = SCENARIOS[scenarioKey];

  const simple = useMemo(() => simpleAverageRate(scenario.segments), [scenario.segments]);
  const weighted = useMemo(() => weightedAverageRate(scenario.segments), [scenario.segments]);
  const insight = weightedRead(simple, weighted);
  const totalCount = scenario.segments.reduce((sum, row) => sum + row.count, 0);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: simple average vs weighted rollup
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Averaging segment rates treats a small region like a large one. Weight by volume to get the
        true company-wide number.
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

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] text-left">
              <th className="py-2 pr-4 font-bold text-[color:var(--foreground)]">Segment</th>
              <th className="py-2 pr-4 text-right font-bold text-[color:var(--foreground)]">
                {scenario.metricLabel}
              </th>
              <th className="py-2 text-right font-bold text-[color:var(--foreground)]">Volume</th>
            </tr>
          </thead>
          <tbody>
            {scenario.segments.map((row) => (
              <tr className="border-b border-[color:var(--border)]" key={row.label}>
                <td className="py-3 pr-4 text-[color:var(--muted)]">{row.label}</td>
                <td className="py-3 pr-4 text-right font-bold text-[color:var(--foreground)]">
                  {formatRate(row.rate)}
                </td>
                <td className="py-3 text-right text-[color:var(--muted)]">
                  {formatCount(row.count)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Simple average
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatRate(simple)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">Mean of segment rates</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">
            Weighted average
          </p>
          <p className="mt-1 text-3xl font-black">{formatRate(weighted)}</p>
          <p className="mt-1 text-xs opacity-80">n = {formatCount(totalCount)} total</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Gap
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {(simple - weighted >= 0 ? "+" : "") + (simple - weighted).toFixed(1)} pts
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">simple minus weighted</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base text-[color:var(--muted)]">
        {insight}
      </p>
    </section>
  );
}
