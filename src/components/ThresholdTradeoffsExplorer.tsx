"use client";

import {
  SCENARIOS,
  formatMoney,
  formatPercent,
  metricsAtThreshold,
  thresholdCurve,
  thresholdReadout,
  type ScenarioKey,
} from "@/lib/threshold-tradeoffs-data";
import { useMemo, useState } from "react";

export default function ThresholdTradeoffsExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud_block");
  const scenario = SCENARIOS[scenarioKey];
  const [threshold, setThreshold] = useState(scenario.defaultThreshold);
  const [capacity, setCapacity] = useState(scenario.defaultCapacity);

  const metrics = useMemo(
    () => metricsAtThreshold(threshold, capacity, scenario),
    [threshold, capacity, scenario],
  );
  const curve = useMemo(() => thresholdCurve(scenario, capacity), [scenario, capacity]);
  const readout = useMemo(
    () => thresholdReadout(threshold, capacity, metrics, scenario),
    [threshold, capacity, metrics, scenario],
  );

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setThreshold(SCENARIOS[key].defaultThreshold);
    setCapacity(SCENARIOS[key].defaultCapacity);
  }

  const width = 520;
  const height = 260;
  const pad = 48;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  const xScale = (t: number) => pad + ((t - 60) / 35) * plotW;
  const yScale = (v: number) => pad + plotH - v * plotH;
  const precisionPath = curve
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.threshold)} ${yScale(p.precision)}`)
    .join(" ");
  const recallPath = curve
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.threshold)} ${yScale(p.recall)}`)
    .join(" ");

  const queueWidth = 360;
  const tpWidth = metrics.flagged > 0 ? (metrics.tp / metrics.flagged) * queueWidth : 0;
  const fpWidth = Math.max(0, queueWidth - tpWidth);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: precision vs recall as you move the threshold
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Lower the score cutoff to catch more positives. Precision usually falls and review queues
        grow. Drag threshold and capacity to see the tradeoff.
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Precision</p>
          <p className="mt-1 text-3xl font-black">{formatPercent(metrics.precision)}</p>
          <p className="mt-1 text-sm opacity-90">
            {metrics.tp} true positives in {metrics.flagged.toLocaleString()} flagged
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Recall</p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">
            {formatPercent(metrics.recall)}
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            {metrics.fn} missed · {formatMoney(metrics.totalCost)} daily cost
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="threshold-slider">
            Score threshold: {threshold}%
          </label>
          <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
            <span>Lower (more flags)</span>
            <span>Higher (fewer flags)</span>
          </div>
          <input
            className="mt-2 w-full accent-black"
            id="threshold-slider"
            max={95}
            min={60}
            onChange={(e) => setThreshold(Number(e.target.value))}
            step={1}
            type="range"
            value={threshold}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="capacity-slider">
            Review capacity: {capacity.toLocaleString()}/day
            {metrics.overflow > 0 ? (
              <span className="ml-2 text-[color:var(--muted)]">
                (+{metrics.overflow.toLocaleString()} overflow)
              </span>
            ) : null}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="capacity-slider"
            max={600}
            min={40}
            onChange={(e) => setCapacity(Number(e.target.value))}
            step={10}
            type="range"
            value={capacity}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="Precision and recall curves across threshold values"
          className="mx-auto block w-full max-w-[520px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <text fill="#6b7280" fontSize="11" fontWeight="700" x={pad} y={pad - 14}>
            Rate
          </text>
          <text fill="#6b7280" fontSize="11" fontWeight="700" textAnchor="middle" x={width / 2} y={height - 6}>
            Threshold
          </text>
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line
              key={`y-${tick}`}
              stroke="#f3f4f6"
              strokeWidth="1"
              x1={pad}
              x2={pad + plotW}
              y1={yScale(tick)}
              y2={yScale(tick)}
            />
          ))}
          <line stroke="#e5e7eb" strokeWidth="1.5" x1={pad} x2={pad} y1={pad} y2={pad + plotH} />
          <line stroke="#e5e7eb" strokeWidth="1.5" x1={pad} x2={pad + plotW} y1={pad + plotH} y2={pad + plotH} />
          {[60, 75, 90].map((tick) => (
            <text
              fill="#9ca3af"
              fontSize="10"
              fontWeight="700"
              key={`x-${tick}`}
              textAnchor="middle"
              x={xScale(tick)}
              y={pad + plotH + 16}
            >
              {tick}%
            </text>
          ))}
          <path d={recallPath} fill="none" stroke="#9ca3af" strokeWidth="2.5" />
          <path d={precisionPath} fill="none" stroke="#111111" strokeWidth="2.5" />
          <line
            stroke="#6b7280"
            strokeDasharray="5 4"
            strokeWidth="1.5"
            x1={xScale(threshold)}
            x2={xScale(threshold)}
            y1={pad}
            y2={pad + plotH}
          />
          <circle cx={xScale(threshold)} cy={yScale(metrics.precision)} fill="#111111" r={6} />
          <circle cx={xScale(threshold)} cy={yScale(metrics.recall)} fill="#9ca3af" r={6} />
        </svg>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-4 text-xs text-[color:var(--muted)]">
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-t-2 border-[#111111]" />
            Precision
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-t-2 border-[#9ca3af]" />
            Recall
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-4 border-t border-dashed border-[#6b7280]" />
            Your threshold
          </li>
        </ul>
      </div>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
          Flagged queue breakdown
        </p>
        <p className="mt-1 text-sm font-bold text-[color:var(--foreground)]">
          {metrics.flagged.toLocaleString()} flagged today
        </p>
        <svg
          aria-label="Stacked bar of true positives versus false positives in flagged queue"
          className="mx-auto mt-3 block w-full max-w-[400px]"
          height={40}
          role="img"
          viewBox="0 0 400 40"
          width={400}
        >
          <rect fill="#111111" height={28} rx={4} width={tpWidth} x={20} y={6} />
          <rect fill="#d1d5db" height={28} rx={4} width={fpWidth} x={20 + tpWidth} y={6} />
        </svg>
        <div className="mt-2 flex justify-center gap-6 text-xs text-[color:var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#111111]" />
            True positive ({metrics.tp})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#d1d5db]" />
            False positive ({metrics.fp})
          </span>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
