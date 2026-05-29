"use client";

import {
  SCENARIOS,
  formatActual,
  formatReported,
  goodhartReadout,
  pressureLabel,
  scoresFromPressure,
  type ScenarioKey,
} from "@/lib/goodhart-law-data";
import { useMemo, useState } from "react";

export default function GoodhartLawExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("support_tickets");
  const scenario = SCENARIOS[scenarioKey];
  const [pressure, setPressure] = useState(scenario.defaultPressure);

  const { reported, actual } = useMemo(
    () => scoresFromPressure(pressure, scenario),
    [pressure, scenario],
  );
  const readout = useMemo(
    () => goodhartReadout(pressure, reported, actual, scenario),
    [pressure, reported, actual, scenario],
  );

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setPressure(SCENARIOS[key].defaultPressure);
  }

  const width = 420;
  const height = 200;
  const padX = 48;
  const barWidth = 120;
  const plotHeight = 110;
  const baseY = 150;

  const maxReported = scenario.maxReported * 1.1;
  const reportedHeight = (reported / maxReported) * plotHeight;
  const actualHeight = (actual / 100) * plotHeight;

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: watch the dashboard and the real outcome diverge
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        Drag target pressure: bonuses, reviews, and quotas tied to the metric. The reported number
        rises. The outcome you actually care about often falls.
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

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="pressure-slider">
            Target pressure: {pressureLabel(pressure)} ({pressure})
          </label>
          <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
            <span>Metric is informational</span>
            <span>Metric drives pay and reviews</span>
          </div>
          <input
            className="mt-2 w-full accent-black"
            id="pressure-slider"
            max={100}
            min={0}
            onChange={(e) => setPressure(Number(e.target.value))}
            step={1}
            type="range"
            value={pressure}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-black bg-black px-4 py-3 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">
            Dashboard: {scenario.metricLabel}
          </p>
          <p className="mt-1 text-3xl font-black">{formatReported(reported, scenario)}</p>
          <p className="mt-1 text-sm opacity-90">Looks better as pressure rises</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Reality: {scenario.outcomeLabel}
          </p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">
            {formatActual(actual)}
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Often slides down as pressure rises</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="Reported metric rising while actual outcome falls"
          className="mx-auto block w-full max-w-[420px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <text fill="#6b7280" fontSize="11" fontWeight="700" x={padX} y="28">
            Dashboard metric
          </text>
          <rect
            fill="#111111"
            height={reportedHeight}
            rx="4"
            width={barWidth}
            x={padX}
            y={baseY - reportedHeight}
          />
          <text
            fill="#111111"
            fontSize="15"
            fontWeight="800"
            textAnchor="middle"
            x={padX + barWidth / 2}
            y={baseY - reportedHeight - 8}
          >
            {formatReported(reported, scenario)}
          </text>

          <text fill="#6b7280" fontSize="11" fontWeight="700" x={width - padX - barWidth} y="28">
            Real outcome
          </text>
          <rect
            fill="#d1d5db"
            height={actualHeight}
            rx="4"
            stroke="#111111"
            strokeWidth="1.5"
            width={barWidth}
            x={width - padX - barWidth}
            y={baseY - actualHeight}
          />
          <text
            fill="#111111"
            fontSize="15"
            fontWeight="800"
            textAnchor="middle"
            x={width - padX - barWidth / 2}
            y={baseY - actualHeight - 8}
          >
            {formatActual(actual)}
          </text>

          <path
            d={`M ${padX + barWidth + 12} ${baseY - reportedHeight + 20} L ${width - padX - barWidth - 12} ${baseY - actualHeight - 10}`}
            stroke="#9ca3af"
            strokeDasharray="5 4"
            strokeWidth="2"
          />
        </svg>
        <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
          Dashed line: the wider the gap, the less the metric tells you
        </p>
      </div>

      <div className="mt-5 space-y-3 rounded-xl border border-black bg-black px-5 py-5 text-white">
        <p className="text-lg font-black">{readout.headline}</p>
        <p className="text-base leading-relaxed opacity-95">{readout.metricLine}</p>
        <p className="text-base leading-relaxed opacity-95">{readout.outcomeLine}</p>
        <p className="border-t border-white/20 pt-3 text-base font-bold leading-relaxed">
          {readout.rememberLine}
        </p>
      </div>
    </section>
  );
}
