"use client";

import DataTable from "@/components/DataTable";
import {
  POINTS,
  bestFit,
  interceptMeaning,
  lineRead,
  pointRows,
  predict,
  residual,
} from "@/lib/linear-models-data";
import { CHART_GRID, CHART_LINE, CHART_REFERENCE } from "@/lib/chart-colors";
import { useMemo, useState } from "react";

const WIDTH = 600;
const HEIGHT = 280;
const PAD = 48;

const tableColumns = [
  { key: "label" as const, header: "Point", align: "left" as const },
  { key: "x" as const, header: "x", align: "right" as const },
  { key: "actual" as const, header: "Actual y", align: "right" as const },
  { key: "predicted" as const, header: "Predicted y", align: "right" as const },
  { key: "residual" as const, header: "Residual", align: "right" as const },
];

export default function LinearModelsExplorer() {
  const fit = useMemo(() => bestFit(), []);
  const [intercept, setIntercept] = useState(Number(fit.intercept.toFixed(2)));
  const [slope, setSlope] = useState(Number(fit.slope.toFixed(2)));

  const xs = POINTS.map((p) => p.x);
  const ys = POINTS.map((p) => p.y);
  const xMin = Math.min(...xs) - 0.5;
  const xMax = Math.max(...xs) + 0.5;
  const yMin = Math.min(...ys) - 1;
  const yMax = Math.max(...ys) + 1;
  const plotW = WIDTH - PAD * 2;
  const plotH = HEIGHT - PAD * 2;

  const xScale = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * plotW;
  const yScale = (y: number) => PAD + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const lineX1 = xMin;
  const lineX2 = xMax;
  const lineY1 = predict(intercept, slope, lineX1);
  const lineY2 = predict(intercept, slope, lineX2);

  const rows = pointRows(intercept, slope).map((r) => ({
    ...r,
    actual: r.actual.toFixed(2),
    predicted: r.predicted.toFixed(2),
    residual: r.residual.toFixed(2),
  }));

  const avgResidual =
    POINTS.reduce((sum, p) => sum + Math.abs(residual(p.y, predict(intercept, slope, p.x))), 0) /
    POINTS.length;

  const slopeDemoX1 = 3;
  const slopeDemoX2 = 4;
  const slopeDemoY1 = predict(intercept, slope, slopeDemoX1);
  const slopeDemoY2 = predict(intercept, slope, slopeDemoX2);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: intercept, slope, and residuals on a line
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        A linear model is y = a + bx. Intercept a sets where the line starts on the y-axis. Slope b
        is the change in y when x increases by 1. Residuals show how far each point sits from the
        line.
      </p>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="intercept-slider">
            Intercept (a): {intercept.toFixed(2)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="intercept-slider"
            max={6}
            min={0}
            onChange={(e) => setIntercept(Number(e.target.value))}
            step={0.1}
            type="range"
            value={intercept}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="slope-slider">
            Slope (b): {slope.toFixed(2)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="slope-slider"
            max={2}
            min={0.2}
            onChange={(e) => setSlope(Number(e.target.value))}
            step={0.05}
            type="range"
            value={slope}
          />
        </div>
        <button
          className="rounded-lg border border-[color:var(--border)] px-4 py-2 text-sm font-bold"
          onClick={() => {
            setIntercept(Number(fit.intercept.toFixed(2)));
            setSlope(Number(fit.slope.toFixed(2)));
          }}
          type="button"
        >
          Reset to best fit
        </button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <svg aria-hidden="true" className="w-full" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          <line stroke={CHART_GRID} strokeWidth={1} x1={PAD} x2={PAD} y1={PAD} y2={PAD + plotH} />
          <line stroke={CHART_GRID} strokeWidth={1} x1={PAD} x2={PAD + plotW} y1={PAD + plotH} y2={PAD + plotH} />
          <text fill={CHART_REFERENCE} fontSize={12} fontWeight={600} x={PAD + plotW - 12} y={PAD + plotH + 28}>
            x
          </text>
          <text fill={CHART_REFERENCE} fontSize={12} fontWeight={600} x={PAD - 28} y={PAD + 8}>
            y
          </text>
          <line
            stroke={CHART_LINE}
            strokeWidth={3}
            x1={xScale(lineX1)}
            x2={xScale(lineX2)}
            y1={yScale(lineY1)}
            y2={yScale(lineY2)}
          />
          <line
            stroke="#059669"
            strokeDasharray="4 3"
            strokeWidth={2}
            x1={xScale(slopeDemoX1)}
            x2={xScale(slopeDemoX2)}
            y1={yScale(slopeDemoY1)}
            y2={yScale(slopeDemoY1)}
          />
          <line
            stroke="#059669"
            strokeDasharray="4 3"
            strokeWidth={2}
            x1={xScale(slopeDemoX2)}
            x2={xScale(slopeDemoX2)}
            y1={yScale(slopeDemoY1)}
            y2={yScale(slopeDemoY2)}
          />
          <text fill="#047857" fontSize={11} fontWeight={700} x={xScale(3.5) - 10} y={yScale(slopeDemoY1) + 18}>
            +1 on x
          </text>
          <text fill="#047857" fontSize={11} fontWeight={700} x={xScale(4) + 8} y={yScale((slopeDemoY1 + slopeDemoY2) / 2)}>
            +{slope.toFixed(2)} on y
          </text>
          {POINTS.map((p) => (
            <g key={p.x}>
              <line
                stroke="#dc2626"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                x1={xScale(p.x)}
                x2={xScale(p.x)}
                y1={yScale(p.y)}
                y2={yScale(predict(intercept, slope, p.x))}
              />
              <circle cx={xScale(p.x)} cy={yScale(p.y)} fill="#111111" r={5} />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-sm font-bold text-[color:var(--foreground)]">Formula</p>
          <p className="mt-1 text-base font-bold">y = {intercept.toFixed(2)} + {slope.toFixed(2)}x</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-sm font-bold text-[color:var(--foreground)]">Average |residual|</p>
          <p className="mt-1 text-xl font-black">{avgResidual.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-sm font-bold text-[color:var(--foreground)]">At x = 0</p>
          <p className="mt-1 text-base text-[color:var(--muted)]">{interceptMeaning(intercept)}</p>
        </div>
      </div>

      <DataTable caption="Point-by-point: actual vs predicted" columns={tableColumns} rows={rows} />

      <p className="mt-4 rounded-lg border border-[color:var(--border)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {lineRead(intercept, slope)} Red dashed segments are residuals. Green brackets show slope as
        rise over a +1 step on x.
      </p>
    </section>
  );
}
