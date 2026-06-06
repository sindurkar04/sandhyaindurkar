"use client";

import {
  NORTHSIDE_SCENARIO,
  POLICY_PRESETS,
  caseReadout,
  policySnapshot,
} from "@/lib/northside-stockout-case-data";
import { curveForReorderPoints } from "@/lib/stockout-probability-data";
import { useMemo, useState } from "react";

const WIDTH = 600;
const HEIGHT = 240;
const PAD_X = 44;
const PAD_Y = 30;

export default function NorthsideStockoutCaseExplorer() {
  const [reorderPoint, setReorderPoint] = useState(900);
  const scenario = NORTHSIDE_SCENARIO;
  const snapshot = useMemo(() => policySnapshot(reorderPoint), [reorderPoint]);
  const curve = useMemo(() => curveForReorderPoints({ ...scenario, reorderPoint }), [scenario, reorderPoint]);
  const maxCurve = Math.max(...curve.map((c) => c.probability), snapshot.stockoutProbability * 100, 1);
  const plotW = WIDTH - PAD_X * 2;
  const plotH = HEIGHT - PAD_Y * 2;
  const xCenter = (i: number, count: number) => PAD_X + (i / Math.max(1, count - 1)) * plotW;
  const yValue = (v: number) => PAD_Y + plotH - (v / maxCurve) * plotH;

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Work the case: pick a reorder policy for Company X
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        The supplier needs seven days to deliver. Demand during that window is uncertain, especially
        during the festival. Move the reorder point and read stockout probability before the Monday
        decision.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {POLICY_PRESETS.map((preset) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              reorderPoint === preset.reorderPoint
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--foreground)]"
            }`}
            key={preset.id}
            onClick={() => setReorderPoint(preset.reorderPoint)}
            type="button"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-[color:var(--muted)]">
        {POLICY_PRESETS.find((p) => p.reorderPoint === reorderPoint)?.owner}:{" "}
        {POLICY_PRESETS.find((p) => p.reorderPoint === reorderPoint)?.rationale}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Mean lead-time demand
          </p>
          <p className="mt-1 text-xl font-black">{Math.round(snapshot.meanLeadDemand).toLocaleString()} bags</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Reorder point
          </p>
          <p className="mt-1 text-xl font-black">{reorderPoint.toLocaleString()} bags</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Stockout probability
          </p>
          <p className="mt-1 text-xl font-black">{(snapshot.stockoutProbability * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Service level
          </p>
          <p className="mt-1 text-xl font-black">{(snapshot.serviceLevel * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] p-4">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="northside-reorder">
          Fine-tune reorder point: {reorderPoint.toLocaleString()} bags
        </label>
        <input
          className="w-full accent-black"
          id="northside-reorder"
          max={scenario.maxReorderPoint}
          min={scenario.minReorderPoint}
          onChange={(e) => setReorderPoint(Number(e.target.value))}
          step={10}
          type="range"
          value={reorderPoint}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
          Stockout risk vs reorder level
        </p>
        <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          {curve.map((point, index) => (
            <g key={point.label}>
              <rect
                fill={Math.abs(Number(point.label.replace(/,/g, "")) - reorderPoint) < 30 ? "#2563eb" : "#93c5fd"}
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
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {caseReadout(reorderPoint)}
      </p>
    </section>
  );
}
