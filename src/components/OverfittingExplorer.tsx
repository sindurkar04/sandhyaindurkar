"use client";

import {
  SCENARIOS,
  chartPoints,
  errorsFromComplexity,
  formatError,
  overfitRead,
  type ScenarioKey,
} from "@/lib/overfitting-data";
import { useMemo, useState } from "react";

export default function OverfittingExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("weekly_orders");
  const scenario = SCENARIOS[scenarioKey];
  const [complexity, setComplexity] = useState(scenario.defaultComplexity);

  const { trainError, holdoutError } = useMemo(
    () => errorsFromComplexity(complexity),
    [complexity],
  );
  const points = useMemo(() => chartPoints(complexity), [complexity]);
  const readout = overfitRead(complexity, trainError, holdoutError);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setComplexity(SCENARIOS[key].defaultComplexity);
  }

  const width = 420;
  const height = 200;
  const padX = 36;
  const padY = 24;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const yMin = 38;
  const yMax = 64;
  const xScale = (x: number) => padX + (x / 11) * plotW;
  const yScale = (y: number) => padY + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const fitPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x)} ${yScale(p.y)}`).join(" ");

  const maxErr = 35;
  const trainH = (trainError / maxErr) * 100;
  const holdoutH = (holdoutError / maxErr) * 100;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: train error falls while holdout error rises
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag model complexity. A flexible curve hugs training history. Holdout weeks tell you if
        the forecast will survive new data.
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="complexity-slider">
            Model complexity: {complexity} / 10
          </label>
        </div>
        <input
          className="w-full accent-black"
          id="complexity-slider"
          max={10}
          min={1}
          onChange={(event) => setComplexity(Number(event.target.value))}
          type="range"
          value={complexity}
        />
        <div className="flex justify-between text-xs font-bold text-[color:var(--muted)]">
          <span>Simple (few parameters)</span>
          <span>Flexible (many parameters)</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Training weeks (model fit)
          </p>
          <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${width} ${height}`}>
            {points.map((p) =>
              p.actual !== undefined ? (
                <circle
                  cx={xScale(p.x)}
                  cy={yScale(p.actual)}
                  fill="#111111"
                  key={`a-${p.x}`}
                  r={4}
                />
              ) : null,
            )}
            <path d={fitPath} fill="none" stroke="#111111" strokeWidth={complexity >= 6 ? 2.5 : 2} />
          </svg>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
              <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Train error</p>
              <p className="mt-1 text-2xl font-black">{formatError(trainError)}</p>
            </div>
            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
                Holdout error
              </p>
              <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
                {formatError(holdoutError)}
              </p>
            </div>
          </div>
          <div className="flex h-32 items-end justify-center gap-8 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 pb-3 pt-6">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-16 rounded-t-md bg-black"
                style={{ height: `${trainH}%`, minHeight: "8px" }}
              />
              <span className="text-xs font-bold text-[color:var(--muted)]">Train</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-16 rounded-t-md bg-[#6b7280]"
                style={{ height: `${holdoutH}%`, minHeight: "8px" }}
              />
              <span className="text-xs font-bold text-[color:var(--muted)]">Holdout</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
