"use client";

import {
  COLORS,
  SCENARIOS,
  angleToVector,
  buildSymmetricMatrix,
  eigenvaluesSymmetric,
  eigenvectorForLambda,
  eigenvectorsReadout,
  formatNum,
  gridPoints,
  isNearEigenvector,
  matVec,
  type ScenarioKey,
} from "@/lib/eigenvectors-data";
import { useState } from "react";

const W = 560;
const H = 360;
const PAD = 52;
const PLOT = W - PAD * 2;

function toSvg(x: number, y: number): { sx: number; sy: number } {
  const sx = PAD + ((x + 2.2) / 4.4) * PLOT;
  const sy = PAD + PLOT - ((y + 2.2) / 4.4) * PLOT;
  return { sx, sy };
}

function drawArrow(
  from: [number, number],
  to: [number, number],
  color: string,
  dashed = false,
) {
  const a = toSvg(from[0], from[1]);
  const b = toSvg(to[0], to[1]);
  const dx = b.sx - a.sx;
  const dy = b.sy - a.sy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return (
    <line
      markerEnd="url(#vec-head)"
      stroke={color}
      strokeDasharray={dashed ? "6 4" : undefined}
      strokeLinecap="round"
      strokeWidth={3}
      x1={a.sx}
      x2={b.sx - ux * 4}
      y1={a.sy}
      y2={b.sy - uy * 4}
    />
  );
}

export default function EigenvectorsExplorer() {
  const [key, setKey] = useState<ScenarioKey>("kpi_axes");
  const scenario = SCENARIOS[key];
  const [angle, setAngle] = useState(scenario.defaultAngle);

  const { scale1, scale2, shear } = scenario;
  const matrix = buildSymmetricMatrix(scale1, scale2, shear);
  const [lambda1, lambda2] = eigenvaluesSymmetric(scale1, shear, scale2);
  const e1 = eigenvectorForLambda(scale1, shear, scale2, lambda1);
  const e2 = eigenvectorForLambda(scale1, shear, scale2, lambda2);
  const test = angleToVector(angle);
  const transformed = matVec(matrix, test);
  const onAxis = isNearEigenvector(test, e1, e2);

  const axisLen = 2;
  const testLen = 1.6;
  const tScaled: [number, number] = [test[0] * testLen, test[1] * testLen];
  const tOut: [number, number] = [transformed[0] * testLen * 0.45, transformed[1] * testLen * 0.45];

  const pts = gridPoints(0.3);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: directions that only stretch
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Eigenvectors stay on their line under A. Every other direction rotates and stretches together.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((scenarioKey) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              key === scenarioKey
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            key={scenarioKey}
            onClick={() => {
              setKey(scenarioKey);
              setAngle(SCENARIOS[scenarioKey].defaultAngle);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold" htmlFor="test-angle">
          Test vector angle: {angle}°
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="test-angle"
          max={179}
          min={0}
          onChange={(e) => setAngle(Number(e.target.value))}
          type="range"
          value={angle}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <svg aria-hidden="true" className="mx-auto w-full max-w-[560px]" viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <marker
              id="vec-head"
              markerHeight={8}
              markerUnits="strokeWidth"
              markerWidth={8}
              orient="auto"
              refX={8}
              refY={4}
            >
              <path d="M0,0 L8,4 L0,8" fill={COLORS.rose} />
            </marker>
          </defs>
          <rect fill="var(--surface-strong, #fafafa)" height={H} rx={8} width={W} x={0} y={0} />
          {[-2, -1, 0, 1, 2].map((t) => {
            const h = toSvg(-2.2, t);
            const h2 = toSvg(2.2, t);
            const v = toSvg(t, -2.2);
            const v2 = toSvg(t, 2.2);
            return (
              <g key={t}>
                <line stroke="#e5e7eb" strokeWidth={1} x1={h.sx} x2={h2.sx} y1={h.sy} y2={h2.sy} />
                <line stroke="#e5e7eb" strokeWidth={1} x1={v.sx} x2={v2.sx} y1={v.sy} y2={v2.sy} />
              </g>
            );
          })}
          {pts.map(([x, y], i) => {
            const [tx, ty] = matVec(matrix, [x, y]);
            const p = toSvg(tx * 0.55, ty * 0.55);
            return <circle cx={p.sx} cy={p.sy} fill={COLORS.teal} key={i} opacity={0.55} r={3} />;
          })}
          <line
            stroke={COLORS.violet}
            strokeWidth={2}
            x1={toSvg(-e1[0] * axisLen, -e1[1] * axisLen).sx}
            x2={toSvg(e1[0] * axisLen, e1[1] * axisLen).sx}
            y1={toSvg(-e1[0] * axisLen, -e1[1] * axisLen).sy}
            y2={toSvg(e1[0] * axisLen, e1[1] * axisLen).sy}
          />
          <line
            stroke={COLORS.orange}
            strokeWidth={2}
            x1={toSvg(-e2[0] * axisLen, -e2[1] * axisLen).sx}
            x2={toSvg(e2[0] * axisLen, e2[1] * axisLen).sx}
            y1={toSvg(-e2[0] * axisLen, -e2[1] * axisLen).sy}
            y2={toSvg(e2[0] * axisLen, e2[1] * axisLen).sy}
          />
          {drawArrow([0, 0], tScaled, COLORS.blue)}
          {drawArrow([0, 0], tOut, COLORS.rose, !onAxis)}
          <circle cx={toSvg(0, 0).sx} cy={toSvg(0, 0).sy} fill="#111" r={4} />
          <text fill={COLORS.violet} fontSize={11} fontWeight={700} x={toSvg(e1[0] * axisLen, e1[1] * axisLen).sx + 6} y={toSvg(e1[0] * axisLen, e1[1] * axisLen).sy - 4}>
            v1
          </text>
          <text fill={COLORS.orange} fontSize={11} fontWeight={700} x={toSvg(e2[0] * axisLen, e2[1] * axisLen).sx + 6} y={toSvg(e2[0] * axisLen, e2[1] * axisLen).sy - 4}>
            v2
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold">
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: COLORS.teal }} />
          Transformed grid
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-6 rounded" style={{ background: COLORS.violet }} />
          Eigenvector v1
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-6 rounded" style={{ background: COLORS.orange }} />
          Eigenvector v2
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-6 rounded" style={{ background: COLORS.blue }} />
          Test vector (before)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-6 rounded" style={{ background: COLORS.rose }} />
          After Av
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">λ₁ on v1</p>
          <p className="mt-1 text-2xl font-black">{formatNum(lambda1)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">λ₂ on v2</p>
          <p className="mt-1 text-2xl font-black">{formatNum(lambda2)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">On eigen axis?</p>
          <p className="mt-1 text-2xl font-black">{onAxis ? "Yes" : "No"}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {eigenvectorsReadout(scenario, angle, lambda1, lambda2, onAxis)}
      </p>
    </section>
  );
}
