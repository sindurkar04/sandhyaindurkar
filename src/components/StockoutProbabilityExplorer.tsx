"use client";

import {
  STOCKOUT_SCENARIOS,
  curveForReorderPoints,
  evaluateStockout,
  stockoutReadout,
  type StockoutScenarioKey,
} from "@/lib/stockout-probability-data";
import { useMemo, useState } from "react";

const WIDTH = 560;
const HEIGHT = 240;
const PAD_X = 44;
const PAD_Y = 30;

export default function StockoutProbabilityExplorer() {
  const [scenarioKey, setScenarioKey] = useState<StockoutScenarioKey>("coffee_beans");
  const scenario = STOCKOUT_SCENARIOS[scenarioKey];
  const [reorderPoint, setReorderPoint] = useState(scenario.reorderPoint);

  const snapshot = useMemo(
    () => evaluateStockout(scenario, reorderPoint),
    [scenario, reorderPoint],
  );
  const curve = useMemo(() => curveForReorderPoints(scenario), [scenario]);
  const maxCurve = Math.max(...curve.map((c) => c.probability), snapshot.stockoutProbability * 100, 1);

  const plotW = WIDTH - PAD_X * 2;
  const plotH = HEIGHT - PAD_Y * 2;
  const xCenter = (i: number, count: number) => PAD_X + (i / Math.max(1, count - 1)) * plotW;
  const yValue = (v: number) => PAD_Y + plotH - (v / maxCurve) * plotH;

  function selectScenario(key: StockoutScenarioKey) {
    setScenarioKey(key);
    setReorderPoint(STOCKOUT_SCENARIOS[key].reorderPoint);
  }

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: reorder point vs stockout probability
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Set a reorder point and see the probability of running out during supplier lead time.
        This helps inventory decisions move from gut feel to explicit risk.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(STOCKOUT_SCENARIOS) as StockoutScenarioKey[]).map((key) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              scenarioKey === key
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--foreground)]"
            }`}
            key={key}
            onClick={() => selectScenario(key)}
            type="button"
          >
            {STOCKOUT_SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-base font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Lead-time demand
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {Math.round(snapshot.meanLeadDemand).toLocaleString()} {scenario.unitLabel}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Reorder point
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {reorderPoint.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Stockout probability
          </p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">
            {(snapshot.stockoutProbability * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="reorder-point-slider">
          Reorder point: {reorderPoint.toLocaleString()} {scenario.unitLabel}
        </label>
        <input
          className="w-full accent-black"
          id="reorder-point-slider"
          max={scenario.maxReorderPoint}
          min={scenario.minReorderPoint}
          onChange={(e) => setReorderPoint(Number(e.target.value))}
          step={5}
          type="range"
          value={reorderPoint}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
          Stockout risk curve (%)
        </p>
        <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          {curve.map((point, index) => (
            <g key={point.label}>
              <rect
                fill={index === 2 ? "#2563eb" : "#93c5fd"}
                height={Math.max(2, plotH - (yValue(point.probability) - PAD_Y))}
                rx={3}
                width={34}
                x={xCenter(index, curve.length) - 17}
                y={yValue(point.probability)}
              />
              <text
                fill="#374151"
                fontFamily="system-ui, sans-serif"
                fontSize={12}
                fontWeight={700}
                textAnchor="middle"
                x={xCenter(index, curve.length)}
                y={HEIGHT - 6}
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Lower reorder points look efficient, but risk stockouts. Higher points reduce risk but tie
          up more inventory.
        </p>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {stockoutReadout(snapshot, scenario)}
      </p>
    </section>
  );
}
