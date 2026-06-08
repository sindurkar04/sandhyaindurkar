"use client";

import {
  SCENARIOS,
  bucketActualRates,
  calibrationLabel,
  calibrationReadout,
  formatPercent,
  type ScenarioKey,
} from "@/lib/calibration-data";
import { useMemo, useState } from "react";

export default function CalibrationExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud_flag");
  const scenario = SCENARIOS[scenarioKey];
  const [quality, setQuality] = useState(scenario.defaultQuality);

  const buckets = useMemo(
    () => bucketActualRates(quality, scenario.baseRate),
    [quality, scenario.baseRate],
  );
  const readout = useMemo(
    () => calibrationReadout(quality, buckets, scenario),
    [quality, buckets, scenario],
  );

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setQuality(SCENARIOS[key].defaultQuality);
  }

  const width = 420;
  const height = 260;
  const pad = 44;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  const xScale = (p: number) => pad + p * plotW;
  const yScale = (a: number) => pad + plotH - a * plotH;

  const perfectLine = `M ${xScale(0)} ${yScale(0)} L ${xScale(1)} ${yScale(1)}`;
  const actualPath = buckets
    .map((b, i) => `${i === 0 ? "M" : "L"} ${xScale(b.predicted)} ${yScale(b.actual)}`)
    .join(" ");

  const highBucket = buckets[buckets.length - 1];

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: reliability diagram — predicted score vs actual rate
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag calibration quality. On a perfect model, points sit on the diagonal: among orders scored
        90%, about 90% are truly positive. Overconfident models sit below the line.
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
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="quality-slider">
            Calibration quality: {calibrationLabel(quality)} ({quality})
          </label>
          <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
            <span>Overconfident (scores too high)</span>
            <span>Perfect</span>
            <span>Underconfident</span>
          </div>
          <input
            className="mt-2 w-full accent-black"
            id="quality-slider"
            max={100}
            min={0}
            onChange={(e) => setQuality(Number(e.target.value))}
            step={1}
            type="range"
            value={quality}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">
            At {formatPercent(highBucket.predicted)} {scenario.scoreLabel.toLowerCase()}
          </p>
          <p className="mt-1 text-3xl font-black">{formatPercent(highBucket.actual)}</p>
          <p className="mt-1 text-sm opacity-90">{scenario.outcomeLabel}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Calibration gap
          </p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">
            {(highBucket.gap * 100).toFixed(0)} pp
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Predicted minus actual at top bucket</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="Reliability diagram comparing predicted scores to actual rates"
          className="mx-auto block w-full max-w-[420px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <text fill="#6b7280" fontSize="10" fontWeight="700" x={pad} y={pad - 12}>
            Actual rate
          </text>
          <text fill="#6b7280" fontSize="10" fontWeight="700" textAnchor="middle" x={width / 2} y={height - 8}>
            Predicted score
          </text>
          <line
            stroke="#e5e7eb"
            strokeWidth="1"
            x1={pad}
            x2={pad}
            y1={pad}
            y2={pad + plotH}
          />
          <line
            stroke="#e5e7eb"
            strokeWidth="1"
            x1={pad}
            x2={pad + plotW}
            y1={pad + plotH}
            y2={pad + plotH}
          />
          <path d={perfectLine} fill="none" stroke="#d1d5db" strokeDasharray="6 4" strokeWidth="2" />
          <path d={actualPath} fill="none" stroke="#111111" strokeWidth="2.5" />
          {buckets.map((b) => (
            <circle
              cx={xScale(b.predicted)}
              cy={yScale(b.actual)}
              fill="#111111"
              key={b.predicted}
              r={5}
            />
          ))}
          <text fill="#9ca3af" fontSize="9" fontWeight="700" x={pad + plotW - 60} y={pad + 14}>
            perfect
          </text>
        </svg>
        <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
          Dashed diagonal = perfect calibration. Solid curve = what actually happens in each score bucket.
        </p>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
