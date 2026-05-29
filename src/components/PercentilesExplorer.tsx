"use client";

import PercentilesDistributionChart from "@/components/PercentilesDistributionChart";
import {
  BIN_COUNT,
  PERCENTILE_PRESETS,
  SCENARIOS,
  buildBins,
  formatValue,
  mean,
  percentile,
  type ScenarioKey,
} from "@/lib/percentiles-data";
import { useMemo, useState } from "react";

export default function PercentilesExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("latency");
  const [percentileRank, setPercentileRank] = useState(90);

  const scenario = SCENARIOS[scenarioKey];
  const sorted = useMemo(
    () => [...scenario.values].sort((a, b) => a - b),
    [scenario.values],
  );

  const bins = useMemo(() => buildBins(scenario.values, BIN_COUNT), [scenario.values]);
  const maxCount = useMemo(() => Math.max(...bins.map((bin) => bin.count), 1), [bins]);
  const chartMax = useMemo(
    () => Math.max(...scenario.values, scenario.target) * 1.08,
    [scenario.target, scenario.values],
  );

  const percentileValue = useMemo(
    () => percentile(sorted, percentileRank),
    [percentileRank, sorted],
  );
  const meanValue = useMemo(() => mean(scenario.values), [scenario.values]);
  const medianValue = useMemo(() => percentile(sorted, 50), [sorted]);
  const q1 = useMemo(() => percentile(sorted, 25), [sorted]);
  const q3 = useMemo(() => percentile(sorted, 75), [sorted]);
  const p90Value = useMemo(() => percentile(sorted, 90), [sorted]);

  const meanBelowTarget = meanValue <= scenario.target;
  const p90BelowTarget = p90Value <= scenario.target;

  const insightMessage = useMemo(() => {
    if (meanBelowTarget && !p90BelowTarget) {
      return `The mean (${formatValue(meanValue, scenario.unit)}) meets ${scenario.targetLabel}, but P90 (${formatValue(p90Value, scenario.unit)}) does not. That is the gap leadership often misses.`;
    }
    if (!meanBelowTarget && !p90BelowTarget) {
      return `Both the mean and P90 are above ${scenario.targetLabel}. The problem shows up in every summary you check.`;
    }
    if (meanBelowTarget && p90BelowTarget) {
      return `Both the mean and P90 meet ${scenario.targetLabel} in this sample. For skewed data, try P99 to see if the worst tail still looks acceptable.`;
    }
    return `The mean is above ${scenario.targetLabel} even though P90 looks acceptable. A few very slow cases can dominate the average.`;
  }, [meanBelowTarget, meanValue, p90BelowTarget, p90Value, scenario.targetLabel, scenario.unit]);

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: read the distribution
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        Choose a dataset and a percentile. Dark bars are values at or below that percentile. The
        shaded band is the middle half of the data (Q1 to Q3).
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            1. Dataset
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
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
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            2. Percentile
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PERCENTILE_PRESETS.map((preset) => (
              <button
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  percentileRank === preset
                    ? "bg-black text-white"
                    : "border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                }`}
                key={preset}
                onClick={() => setPercentileRank(preset)}
                type="button"
              >
                P{preset}
                {preset === 25 ? " (Q1)" : ""}
                {preset === 50 ? " (median)" : ""}
                {preset === 75 ? " (Q3)" : ""}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label
              className="text-sm font-bold text-[color:var(--foreground)]"
              htmlFor="percentile-slider"
            >
              Fine-tune: P{percentileRank}
            </label>
            <input
              className="mt-2 w-full accent-black"
              id="percentile-slider"
              max={99}
              min={5}
              onChange={(event) => setPercentileRank(Number(event.target.value))}
              step={1}
              type="range"
              value={percentileRank}
            />
          </div>
        </div>

        <PercentilesDistributionChart
          bins={bins}
          chartMax={chartMax}
          maxCount={maxCount}
          meanValue={meanValue}
          medianValue={medianValue}
          percentileRank={percentileRank}
          percentileValue={percentileValue}
          q1={q1}
          q3={q3}
          target={scenario.target}
          unit={scenario.unit}
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
              P{percentileRank}
            </p>
            <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
              {formatValue(percentileValue, scenario.unit)}
            </p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              About {percentileRank}% at or below this value
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
              Mean
            </p>
            <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
              {formatValue(meanValue, scenario.unit)}
            </p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              {meanBelowTarget ? "Below" : "Above"} {scenario.targetLabel}
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
              Quartiles
            </p>
            <p className="mt-1 text-lg font-black leading-tight text-[color:var(--foreground)]">
              Q1 {formatValue(q1, scenario.unit)}
            </p>
            <p className="text-lg font-black leading-tight text-[color:var(--foreground)]">
              Q3 {formatValue(q3, scenario.unit)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Takeaway for {scenario.shortLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--foreground)]">
            {insightMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
