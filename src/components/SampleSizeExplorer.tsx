"use client";

import SampleSizeStabilityChart from "@/components/SampleSizeStabilityChart";
import {
  SCENARIO_META,
  abDecisionCopy,
  buildStabilityCurve,
  conversionRate,
  formatMoney,
  formatPercent,
  formatScore,
  fullPopulationStats,
  mean,
  median,
  percentile,
  sampleAb,
  sampleCsat,
  sampleOrderValues,
  stabilityCopy,
  stabilityLabel,
  standardDeviation,
  type ScenarioKey,
} from "@/lib/sample-size-data";
import { useMemo, useState } from "react";

function formatStability(label: ReturnType<typeof stabilityLabel>): string {
  if (label === "unstable") {
    return "Unstable";
  }
  if (label === "settling") {
    return "Settling";
  }
  return "Reliable";
}

const SAMPLE_PRESETS = [
  { id: "small", label: "Small sample" },
  { id: "medium", label: "Medium sample" },
  { id: "full", label: "Full sample" },
] as const;

export default function SampleSizeExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("ab_test");
  const meta = SCENARIO_META[scenarioKey];
  const [sampleSize, setSampleSize] = useState(120);

  const clampedN = Math.min(Math.max(sampleSize, meta.minSample), meta.populationSize);

  const stabilityCurve = useMemo(() => buildStabilityCurve(scenarioKey), [scenarioKey]);
  const fullStats = useMemo(() => fullPopulationStats(scenarioKey), [scenarioKey]);

  const abSample = useMemo(() => {
    if (scenarioKey !== "ab_test") {
      return null;
    }
    return {
      control: sampleAb("control", clampedN),
      variant: sampleAb("variant", clampedN),
    };
  }, [clampedN, scenarioKey]);

  const numericSample = useMemo(() => {
    if (scenarioKey === "ab_test") {
      return [];
    }
    if (scenarioKey === "order_value") {
      return sampleOrderValues(clampedN);
    }
    return sampleCsat(clampedN);
  }, [clampedN, scenarioKey]);

  const sortedNumeric = useMemo(
    () => [...numericSample].sort((a, b) => a - b),
    [numericSample],
  );

  const controlRate = abSample ? conversionRate(abSample.control) : 0;
  const variantRate = abSample ? conversionRate(abSample.variant) : 0;
  const liftPoints = variantRate - controlRate;

  const sampleMean = mean(numericSample);
  const sampleMedian = median(sortedNumeric);
  const sampleStd = standardDeviation(numericSample);
  const sampleP90 = percentile(sortedNumeric, 90);
  const sampleMin = sortedNumeric[0] ?? 0;
  const sampleMax = sortedNumeric[sortedNumeric.length - 1] ?? 0;

  const stability = stabilityLabel(clampedN, meta.populationSize);
  const currentStabilityValue = scenarioKey === "ab_test" ? liftPoints : sampleMean;

  const valueFormatter =
    scenarioKey === "ab_test"
      ? (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)} pts`
      : scenarioKey === "order_value"
        ? formatMoney
        : (value: number) => formatScore(value);

  const referenceValue =
    scenarioKey === "ab_test" ? fullStats.lift ?? 0 : fullStats.mean ?? 0;

  const referenceLabel =
    scenarioKey === "ab_test" ? "Full population lift" : "Full population mean";

  const yLabel = scenarioKey === "ab_test" ? "Observed lift (pts)" : meta.unit;

  const takeaway = useMemo(() => {
    if (scenarioKey === "ab_test") {
      return abDecisionCopy(liftPoints, clampedN);
    }
    if (scenarioKey === "order_value" && fullStats.mean !== null) {
      const gap = sampleMean - fullStats.mean;
      if (Math.abs(gap) > 12) {
        return `Average order value reads ${formatMoney(sampleMean)} at n = ${clampedN}, about ${formatMoney(Math.abs(gap))} ${gap > 0 ? "above" : "below"} the full base. Wait before changing pricing or targets.`;
      }
      return `Average order value is near the full base at this sample size. Confirm seasonality before acting.`;
    }
    if (fullStats.mean !== null) {
      const gap = sampleMean - fullStats.mean;
      if (Math.abs(gap) > 0.35) {
        return `CSAT reads ${formatScore(sampleMean)} at n = ${clampedN} versus ${formatScore(fullStats.mean)} overall. A short survey week can overstate a process change.`;
      }
      return `CSAT is close to the long-run average. Use a longer window before restructuring support.`;
    }
    return stabilityCopy(stability);
  }, [clampedN, fullStats.mean, liftPoints, sampleMean, scenarioKey, stability]);

  function applyPreset(preset: (typeof SAMPLE_PRESETS)[number]["id"]) {
    if (preset === "small") {
      setSampleSize(meta.minSample);
    } else if (preset === "medium") {
      setSampleSize(Math.round(meta.populationSize * 0.2));
    } else {
      setSampleSize(meta.populationSize);
    }
  }

  const formatNumeric = (value: number) =>
    scenarioKey === "order_value" ? formatMoney(value) : formatScore(value);

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: how sample size changes the story
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        {meta.businessContext} Move the slider to see how noisy early reads compare to the full
        population.
      </p>

      <div className="mt-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SCENARIO_META) as ScenarioKey[]).map((key) => (
            <button
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                scenarioKey === key
                  ? "bg-black text-white"
                  : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
              }`}
              key={key}
              onClick={() => {
                setScenarioKey(key);
                setSampleSize(SCENARIO_META[key].minSample + 80);
              }}
              type="button"
            >
              {SCENARIO_META[key].shortLabel}
            </button>
          ))}
        </div>

        <div>
          <label
            className="text-sm font-bold text-[color:var(--foreground)]"
            htmlFor="sample-size-slider"
          >
            Sample size: n = {clampedN}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="sample-size-slider"
            max={meta.populationSize}
            min={meta.minSample}
            onChange={(event) => setSampleSize(Number(event.target.value))}
            step={scenarioKey === "ab_test" ? 10 : 5}
            type="range"
            value={clampedN}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                className="rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-bold text-[color:var(--muted)] transition hover:border-[color:var(--foreground)] hover:text-[color:var(--foreground)]"
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
              {scenarioKey === "ab_test" ? "Observed lift" : "Sample mean"}
            </p>
            <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
              {valueFormatter(currentStabilityValue)}
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
              {scenarioKey === "ab_test" ? "Full population lift" : "Full population mean"}
            </p>
            <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
              {valueFormatter(referenceValue)}
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
              Stability
            </p>
            <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
              {formatStability(stability)}
            </p>
          </div>
        </div>

        <SampleSizeStabilityChart
          controlRate={scenarioKey === "ab_test" ? controlRate : undefined}
          currentN={clampedN}
          currentValue={currentStabilityValue}
          points={stabilityCurve}
          referenceLabel={referenceLabel}
          referenceValue={referenceValue}
          valueFormatter={valueFormatter}
          variantRate={scenarioKey === "ab_test" ? variantRate : undefined}
          yLabel={yLabel}
        />

        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            All stats at n = {clampedN}
            {scenarioKey === "ab_test" ? " per arm" : ""}
          </p>
          {scenarioKey === "ab_test" ? (
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <StatRow label="Sample size (n)" value={`${clampedN} per arm`} />
              <StatRow label="Stability" value={formatStability(stability)} />
              <StatRow label="Control conversion" value={formatPercent(controlRate)} />
              <StatRow label="Variant conversion" value={formatPercent(variantRate)} />
              <StatRow
                label="Observed lift"
                value={`${liftPoints >= 0 ? "+" : ""}${liftPoints.toFixed(1)} pts`}
              />
              <StatRow
                label="Full population lift"
                value={`${(fullStats.lift ?? 0) >= 0 ? "+" : ""}${(fullStats.lift ?? 0).toFixed(1)} pts`}
              />
            </dl>
          ) : (
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <StatRow label="Sample size (n)" value={String(clampedN)} />
              <StatRow label="Stability" value={formatStability(stability)} />
              <StatRow label="Mean" value={formatNumeric(sampleMean)} />
              <StatRow label="Median" value={formatNumeric(sampleMedian)} />
              <StatRow label="Spread (std. dev.)" value={formatNumeric(sampleStd)} />
              <StatRow label="P90" value={formatNumeric(sampleP90)} />
              <StatRow
                label="Range"
                value={`${formatNumeric(sampleMin)} to ${formatNumeric(sampleMax)}`}
              />
              <StatRow label="Full population mean" value={formatNumeric(fullStats.mean ?? 0)} />
            </dl>
          )}
        </div>

        <p className="text-sm leading-relaxed text-[color:var(--muted)]">{takeaway}</p>
      </div>
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[color:var(--border)] pb-2 sm:block sm:border-0 sm:pb-0">
      <dt className="text-sm text-[color:var(--muted)]">{label}</dt>
      <dd className="text-sm font-bold text-[color:var(--foreground)] sm:mt-1">{value}</dd>
    </div>
  );
}
