"use client";

import {
  SCENARIOS,
  formatRate,
  readInterval,
  wilsonInterval,
  type ScenarioKey,
} from "@/lib/confidence-intervals-data";
import { useMemo, useState } from "react";

export default function ConfidenceIntervalsExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("conversion");
  const scenario = SCENARIOS[scenarioKey];
  const [rate, setRate] = useState(scenario.defaultRate);
  const [sampleSize, setSampleSize] = useState(scenario.defaultSample);

  const interval = useMemo(
    () => wilsonInterval(rate, sampleSize),
    [rate, sampleSize],
  );

  const width = 400;
  const height = 160;
  const padX = 36;
  const plotWidth = width - padX * 2;
  const maxRate = Math.max(interval.high * 1.15, rate * 1.15, 10);
  const scaleX = (value: number) => padX + (value / maxRate) * plotWidth;
  const bandLeft = scaleX(interval.low);
  const bandWidth = Math.max(scaleX(interval.high) - bandLeft, 4);
  const pointX = scaleX(interval.point);

  const insight = readInterval(interval, sampleSize, scenario.populationRate);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setRate(SCENARIOS[key].defaultRate);
    setSampleSize(SCENARIOS[key].defaultSample);
  }

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: how wide is the range?
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        A point estimate is the center. A 95% confidence interval is the range where the true rate
        likely lives given your sample size. Drag rate and n to see the band widen or tighten.
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

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-black bg-black px-4 py-3 text-white sm:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Point estimate</p>
          <p className="mt-1 text-3xl font-black">{formatRate(rate)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            95% interval
          </p>
          <p className="mt-1 text-xl font-black text-[color:var(--foreground)]">
            {formatRate(interval.low)} to {formatRate(interval.high)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Long-run rate for this metric: ~{formatRate(scenario.populationRate)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="rate-slider">
            {scenario.metricLabel}: {formatRate(rate)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="rate-slider"
            max={scenario.key === "csat" ? 95 : 15}
            min={scenario.key === "csat" ? 40 : 0.5}
            onChange={(e) => setRate(Number(e.target.value))}
            step={scenario.key === "csat" ? 1 : 0.1}
            type="range"
            value={rate}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="n-slider">
            Sample size: {sampleSize.toLocaleString()}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="n-slider"
            max={5000}
            min={50}
            onChange={(e) => setSampleSize(Number(e.target.value))}
            step={50}
            type="range"
            value={sampleSize}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="Confidence interval band around point estimate"
          className="mx-auto block w-full max-w-[400px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <rect
            fill="#ebe6de"
            height="36"
            width={plotWidth}
            x={padX}
            y="72"
          />
          <rect fill="#d1d5db" height="36" rx="2" width={bandWidth} x={bandLeft} y="72" />
          <line stroke="#111111" strokeWidth="3" x1={pointX} x2={pointX} y1="60" y2="120" />
          <circle cx={pointX} cy="90" fill="#111111" r="6" />
          <line stroke="#9ca3af" strokeDasharray="4 4" strokeWidth="1.5" x1={scaleX(scenario.populationRate)} x2={scaleX(scenario.populationRate)} y1="60" y2="120" />
          <text fill="#6b7280" fontSize="10" x={padX} y={height - 12}>
            0%
          </text>
          <text fill="#6b7280" fontSize="10" textAnchor="end" x={width - padX} y={height - 12}>
            {Math.ceil(maxRate)}%
          </text>
        </svg>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-4 text-xs text-[color:var(--muted)]">
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-4 border-t-2 border-[#111111]" />
            Sample rate
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-5 rounded-sm bg-[#d1d5db]" />
            95% band
          </li>
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-4 border-t border-dashed border-[#9ca3af]" />
            Long-run rate
          </li>
        </ul>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--muted)]">
        {insight}
      </p>
    </section>
  );
}
