"use client";

import {
  COLORS,
  SWEET_SPOT,
  biasSquared,
  biasVarianceReadout,
  curvePoints,
  formatError,
  regionLabel,
  testError,
  totalError,
  trainError,
  variance,
} from "@/lib/bias-variance-tradeoff-data";
import { useMemo, useState } from "react";

const W = 480;
const H = 260;
const PAD = { top: 20, right: 16, bottom: 36, left: 44 };
const Y_MAX = 45;

function xScale(c: number, plotW: number): number {
  return PAD.left + ((c - 1) / 9) * plotW;
}

function yScale(v: number, plotH: number): number {
  return PAD.top + plotH - (v / Y_MAX) * plotH;
}

function pathFromCurve(
  points: { complexity: number; value: number }[],
  plotW: number,
  plotH: number,
): string {
  return points
    .map((pt, i) => {
      const sx = xScale(pt.complexity, plotW);
      const sy = yScale(pt.value, plotH);
      return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
    })
    .join(" ");
}

export default function BiasVarianceTradeoffExplorer() {
  const [complexity, setComplexity] = useState(SWEET_SPOT);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const biasPts = useMemo(() => curvePoints(biasSquared), []);
  const varPts = useMemo(() => curvePoints(variance), []);
  const totalPts = useMemo(() => curvePoints(totalError), []);
  const trainPts = useMemo(() => curvePoints(trainError), []);
  const testPts = useMemo(() => curvePoints(testError), []);

  const b2 = biasSquared(complexity);
  const v = variance(complexity);
  const total = totalError(complexity);
  const train = trainError(complexity);
  const test = testError(complexity);
  const region = regionLabel(complexity);
  const sweetX = xScale(SWEET_SPOT, plotW);
  const markerX = xScale(complexity, plotW);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: bias^2, variance, and the U-shaped test error
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag model complexity. Bias falls and variance rises. Total expected error is their sum plus
        noise. Train error keeps dropping while test error bottoms out, then climbs.
      </p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="bv-complexity">
          Model complexity: {complexity} / 10
          {region === "sweet" ? (
            <span className="ml-2 rounded bg-[#8b5cf6]/15 px-2 py-0.5 text-xs font-bold text-[#8b5cf6]">
              sweet spot
            </span>
          ) : null}
        </label>
        <input
          className="mt-2 w-full accent-[#2563eb]"
          id="bv-complexity"
          max={10}
          min={1}
          onChange={(e) => setComplexity(Number(e.target.value))}
          type="range"
          value={complexity}
        />
        <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
          <span>Underfit (too simple)</span>
          <span>Overfit (too flexible)</span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-blue-50/40 via-violet-50/30 to-orange-50/40 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
          Decomposition vs complexity
        </p>
        <svg aria-hidden="true" className="mt-2 w-full min-w-[320px]" viewBox={`0 0 ${W} ${H}`}>
          {[0, 10, 20, 30, 40].map((tick) => (
            <g key={tick}>
              <line
                stroke={COLORS.grid}
                strokeWidth={1}
                x1={PAD.left}
                x2={W - PAD.right}
                y1={yScale(tick, plotH)}
                y2={yScale(tick, plotH)}
              />
              <text
                fill="#6b7280"
                fontFamily="system-ui, sans-serif"
                fontSize={10}
                fontWeight={700}
                x={PAD.left - 6}
                y={yScale(tick, plotH) + 4}
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          ))}
          <path d={pathFromCurve(biasPts, plotW, plotH)} fill="none" stroke={COLORS.bias} strokeWidth={2.5} />
          <path d={pathFromCurve(varPts, plotW, plotH)} fill="none" stroke={COLORS.variance} strokeWidth={2.5} />
          <path d={pathFromCurve(totalPts, plotW, plotH)} fill="none" stroke={COLORS.total} strokeWidth={3} />
          <line
            stroke={COLORS.sweetSpot}
            strokeDasharray="4 4"
            strokeWidth={1.5}
            x1={sweetX}
            x2={sweetX}
            y1={PAD.top}
            y2={PAD.top + plotH}
          />
          <circle cx={markerX} cy={yScale(total, plotH)} fill={COLORS.total} r={5} />
          <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={11} fontWeight={700} x={W / 2} y={H - 8} textAnchor="middle">
            Model complexity
          </text>
        </svg>
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded" style={{ background: COLORS.bias }} /> bias^2</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded" style={{ background: COLORS.variance }} /> variance</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded" style={{ background: COLORS.total }} /> total error</span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-teal-50/40 to-rose-50/40 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
          Train vs test error
        </p>
        <svg aria-hidden="true" className="mt-2 w-full min-w-[320px]" viewBox={`0 0 ${W} ${H}`}>
          {[0, 10, 20, 30, 40].map((tick) => (
            <line
              key={`t-${tick}`}
              stroke={COLORS.grid}
              strokeWidth={1}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yScale(tick, plotH)}
              y2={yScale(tick, plotH)}
            />
          ))}
          <path d={pathFromCurve(trainPts, plotW, plotH)} fill="none" stroke={COLORS.train} strokeWidth={2.5} />
          <path d={pathFromCurve(testPts, plotW, plotH)} fill="none" stroke={COLORS.test} strokeWidth={2.5} />
          <line
            stroke={COLORS.sweetSpot}
            strokeDasharray="4 4"
            strokeWidth={1.5}
            x1={markerX}
            x2={markerX}
            y1={PAD.top}
            y2={PAD.top + plotH}
          />
          <circle cx={markerX} cy={yScale(train, plotH)} fill={COLORS.train} r={5} />
          <circle cx={markerX} cy={yScale(test, plotH)} fill={COLORS.test} r={5} />
        </svg>
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded" style={{ background: COLORS.train }} /> train</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded" style={{ background: COLORS.test }} /> test</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border-2 px-3 py-2" style={{ borderColor: COLORS.bias, background: `${COLORS.bias}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-80">bias^2</p>
          <p className="text-xl font-black">{formatError(b2)}</p>
        </div>
        <div className="rounded-lg border-2 px-3 py-2" style={{ borderColor: COLORS.variance, background: `${COLORS.variance}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-80">variance</p>
          <p className="text-xl font-black">{formatError(v)}</p>
        </div>
        <div className="rounded-lg border-2 px-3 py-2" style={{ borderColor: COLORS.total, background: `${COLORS.total}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-80">total</p>
          <p className="text-xl font-black">{formatError(total)}</p>
        </div>
        <div className="rounded-lg border-2 px-3 py-2" style={{ borderColor: COLORS.train, background: `${COLORS.train}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-80">train</p>
          <p className="text-xl font-black">{formatError(train)}</p>
        </div>
        <div className="rounded-lg border-2 px-3 py-2" style={{ borderColor: COLORS.test, background: `${COLORS.test}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-80">test</p>
          <p className="text-xl font-black">{formatError(test)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {biasVarianceReadout(complexity)}
      </p>
    </section>
  );
}
