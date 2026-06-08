"use client";

import {
  SCENARIOS,
  driftLabel,
  driftReadout,
  formatPercent,
  metricsFromDrift,
  scoreDistribution,
  type ScenarioKey,
} from "@/lib/concept-drift-data";
import { useMemo, useState } from "react";

export default function ConceptDriftExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud_patterns");
  const scenario = SCENARIOS[scenarioKey];
  const [drift, setDrift] = useState(scenario.defaultDrift);

  const metrics = useMemo(() => metricsFromDrift(drift), [drift]);
  const trainBars = useMemo(() => scoreDistribution(drift, false), [drift]);
  const liveBars = useMemo(() => scoreDistribution(drift, true), [drift]);
  const readout = useMemo(
    () => driftReadout(drift, metrics, scenario),
    [drift, metrics, scenario],
  );

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setDrift(SCENARIOS[key].defaultDrift);
  }

  const maxBar = Math.max(...trainBars, ...liveBars, 1);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: training metrics hold while live performance slides
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag drift severity. Score distributions shift in production. Training accuracy stays high
        while live accuracy and false-positive rates worsen.
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
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="drift-slider">
            Concept drift: {driftLabel(drift)} ({drift})
          </label>
          <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
            <span>Stable world</span>
            <span>Behavior shifted</span>
          </div>
          <input
            className="mt-2 w-full accent-black"
            id="drift-slider"
            max={100}
            min={0}
            onChange={(e) => setDrift(Number(e.target.value))}
            step={1}
            type="range"
            value={drift}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Train accuracy</p>
          <p className="mt-1 text-2xl font-black">{formatPercent(metrics.trainAccuracy)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Live accuracy
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatPercent(metrics.liveAccuracy)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Live false-positive rate
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatPercent(metrics.falsePositiveRate)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {[
          { label: scenario.trainLabel, bars: trainBars, tone: "bg-black" },
          { label: scenario.liveLabel, bars: liveBars, tone: "bg-[#6b7280]" },
        ].map(({ label, bars, tone }) => (
          <div
            className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4"
            key={label}
          >
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
              {label}
            </p>
            <div className="mt-4 flex h-28 items-end justify-between gap-2 px-1">
              {bars.map((value, index) => (
                <div className="flex flex-1 flex-col items-center gap-1" key={label + index}>
                  <div
                    className={`w-full rounded-t-md ${tone}`}
                    style={{ height: `${(value / maxBar) * 100}%`, minHeight: "6px" }}
                  />
                  <span className="text-[10px] font-bold text-[color:var(--muted)]">
                    {["Low", "", "Mid", "", "High"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
