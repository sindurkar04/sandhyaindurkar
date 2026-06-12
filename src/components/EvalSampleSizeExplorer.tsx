"use client";

import {
  SCENARIOS,
  evalMetrics,
  evalReadout,
  formatPercent,
  reliabilityLabel,
  type ScenarioKey,
} from "@/lib/eval-sample-size-data";
import { useMemo, useState } from "react";

function verdictTone(reliability: ReturnType<typeof evalMetrics>["reliability"]): string {
  if (reliability === "thin") {
    return "border-black bg-black text-white";
  }
  if (reliability === "directional") {
    return "border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]";
  }
  return "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)]";
}

export default function EvalSampleSizeExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud_precision");
  const scenario = SCENARIOS[scenarioKey];
  const [evalN, setEvalN] = useState(scenario.defaultEvalN);

  const metrics = useMemo(() => evalMetrics(scenario, evalN), [scenario, evalN]);
  const readout = useMemo(() => evalReadout(scenario, metrics), [scenario, metrics]);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setEvalN(SCENARIOS[key].defaultEvalN);
  }

  const width = 520;
  const height = 200;
  const padX = 36;
  const plotWidth = width - padX * 2;
  const maxRate = Math.max(metrics.high * 1.12, scenario.trueMetric * 1.12, 0.15) * 100;
  const scaleX = (value: number) => padX + (value / maxRate) * plotWidth;
  const bandLeft = scaleX(metrics.low * 100);
  const bandWidth = Math.max(scaleX(metrics.high * 100) - bandLeft, 6);
  const pointX = scaleX(scenario.trueMetric * 100);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: how wide is your eval metric band?
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        A point estimate is the center. The 95% band is where the true metric likely lives given
        your labeled count. Drag eval size — effective n is flagged or positive rows, not total labels.
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
            onClick={() => selectScenario(key)}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)] sm:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Point estimate</p>
          <p className="mt-1 text-3xl font-black">{formatPercent(scenario.trueMetric)}</p>
          <p className="mt-1 text-xs opacity-80">{scenario.metricLabel}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            95% interval
          </p>
          <p className="mt-1 text-xl font-black text-[color:var(--foreground)]">
            {formatPercent(metrics.low, 1)} to {formatPercent(metrics.high, 1)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            {metrics.evalN.toLocaleString()} labeled rows · effective n = {metrics.effectiveN.toLocaleString()}
            {scenario.metricName === "precision"
              ? ` (${metrics.flaggedLabels} flagged)`
              : ` (${metrics.positiveLabels} positives)`}
          </p>
        </div>
      </div>

      <div
        className={`mt-4 inline-flex rounded-lg border px-4 py-2 text-sm font-bold ${verdictTone(metrics.reliability)}`}
      >
        {reliabilityLabel(metrics.reliability)}
      </div>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="eval-n-slider">
          Labeled eval set: {metrics.evalN.toLocaleString()} rows
        </label>
        <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
          <span>Thin band</span>
          <span>More labels</span>
        </div>
        <input
          className="mt-2 w-full accent-black"
          id="eval-n-slider"
          max={scenario.maxEvalN}
          min={scenario.minEvalN}
          onChange={(e) => setEvalN(Number(e.target.value))}
          step={20}
          type="range"
          value={metrics.evalN}
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="Confidence band around eval metric"
          className="mx-auto block w-full max-w-[520px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <rect fill="#ebe6de" height="36" width={plotWidth} x={padX} y="72" />
          <rect fill="#d1d5db" height="36" rx="2" width={bandWidth} x={bandLeft} y="72" />
          <line stroke="#111111" strokeWidth="3" x1={pointX} x2={pointX} y1="60" y2="120" />
          <circle cx={pointX} cy="90" fill="#111111" r="6" />
          <text fill="#111111" fontSize="12" fontWeight="700" textAnchor="middle" x={pointX} y="52">
            {formatPercent(scenario.trueMetric)}
          </text>
          <text fill="#6b7280" fontSize="11" fontWeight="700" textAnchor="middle" x={bandLeft} y="148">
            {formatPercent(metrics.low, 0)}
          </text>
          <text
            fill="#6b7280"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
            x={bandLeft + bandWidth}
            y="148"
          >
            {formatPercent(metrics.high, 0)}
          </text>
          <text fill="#6b7280" fontSize="12" x={padX} y={height - 12}>
            0%
          </text>
          <text fill="#6b7280" fontSize="12" textAnchor="end" x={width - padX} y={height - 12}>
            {Math.ceil(maxRate)}%
          </text>
        </svg>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-4 text-xs text-[color:var(--muted)]">
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-4 border-t-2 border-[#111111]" />
            Observed metric
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded-sm bg-[#d1d5db]" />
            95% band
          </li>
        </ul>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
