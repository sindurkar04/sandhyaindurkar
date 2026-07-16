"use client";

import {
  COLORS,
  SCENARIOS,
  buildSymmetricMatrix,
  eigenvaluesReadout,
  eigenvaluesSymmetric,
  eigenvectorForLambda,
  formatNum,
  varianceShare,
  type ScenarioKey,
} from "@/lib/eigenvalues-data";
import { useState } from "react";

const W = 560;
const H = 320;
const PAD = 52;
const PLOT = W - PAD * 2;

function toSvg(x: number, y: number): { sx: number; sy: number } {
  const sx = PAD + ((x + 2.5) / 5) * PLOT;
  const sy = PAD + PLOT - ((y + 2.5) / 5) * PLOT;
  return { sx, sy };
}

function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  label: string,
) {
  const a = toSvg(x1, y1);
  const b = toSvg(x2, y2);
  const dx = b.sx - a.sx;
  const dy = b.sy - a.sy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = 10;
  return (
    <g key={label}>
      <line
        markerEnd={`url(#arrow-${label})`}
        stroke={color}
        strokeLinecap="round"
        strokeWidth={3}
        x1={a.sx}
        x2={b.sx - ux * 4}
        y1={a.sy}
        y2={b.sy - uy * 4}
      />
      <defs>
        <marker
          id={`arrow-${label}`}
          markerHeight={8}
          markerUnits="strokeWidth"
          markerWidth={8}
          orient="auto"
          refX={8}
          refY={4}
        >
          <path d="M0,0 L8,4 L0,8" fill={color} />
        </marker>
      </defs>
      <text
        fill={color}
        fontSize={12}
        fontWeight={700}
        textAnchor="middle"
        x={(a.sx + b.sx) / 2 + uy * 14}
        y={(a.sy + b.sy) / 2 - ux * 14}
      >
        {label}
      </text>
    </g>
  );
}

export default function EigenvaluesExplorer() {
  const [key, setKey] = useState<ScenarioKey>("kpi_covariance");
  const scenario = SCENARIOS[key];
  const [scale1, setScale1] = useState(scenario.defaultScale1 * 100);
  const [scale2, setScale2] = useState(scenario.defaultScale2 * 100);
  const [shear, setShear] = useState(scenario.defaultShear * 100);

  const a = scale1 / 100;
  const b = shear / 100;
  const d = scale2 / 100;
  const matrix = buildSymmetricMatrix(a, b, d);
  const [lambda1, lambda2] = eigenvaluesSymmetric(a, b, d);
  const v1 = eigenvectorForLambda(a, b, d, lambda1);
  const v2 = eigenvectorForLambda(a, b, d, lambda2);
  const share = varianceShare(lambda1, lambda2);

  const stretch1 = Math.min(2.2, Math.max(0.35, Math.abs(lambda1) * 0.55));
  const stretch2 = Math.min(2.2, Math.max(0.35, Math.abs(lambda2) * 0.55));

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: stretch factors along eigen-directions
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Eigenvalues tell you how much a symmetric transform stretches along each special direction.
        Arrow length tracks |λ|.
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
              const s = SCENARIOS[scenarioKey];
              setKey(scenarioKey);
              setScale1(s.defaultScale1 * 100);
              setScale2(s.defaultScale2 * 100);
              setShear(s.defaultShear * 100);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <label className="text-sm font-bold" htmlFor="scale1">
            Scale on x: {formatNum(a)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="scale1"
            max={350}
            min={20}
            onChange={(e) => setScale1(Number(e.target.value))}
            type="range"
            value={scale1}
          />
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <label className="text-sm font-bold" htmlFor="scale2">
            Scale on y: {formatNum(d)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="scale2"
            max={350}
            min={20}
            onChange={(e) => setScale2(Number(e.target.value))}
            type="range"
            value={scale2}
          />
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <label className="text-sm font-bold" htmlFor="shear">
            Shear / correlation: {formatNum(b)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="shear"
            max={150}
            min={0}
            onChange={(e) => setShear(Number(e.target.value))}
            type="range"
            value={shear}
          />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <svg aria-hidden="true" className="mx-auto w-full max-w-[560px]" viewBox={`0 0 ${W} ${H}`}>
          <rect fill="var(--surface-strong, #fafafa)" height={H} rx={8} width={W} x={0} y={0} />
          {[-2, -1, 0, 1, 2].map((t) => {
            const h = toSvg(-2.5, t);
            const v = toSvg(t, -2.5);
            const h2 = toSvg(2.5, t);
            const v2 = toSvg(t, 2.5);
            return (
              <g key={t}>
                <line stroke="#e5e7eb" strokeWidth={1} x1={h.sx} x2={h2.sx} y1={h.sy} y2={h2.sy} />
                <line stroke="#e5e7eb" strokeWidth={1} x1={v.sx} x2={v2.sx} y1={v.sy} y2={v2.sy} />
              </g>
            );
          })}
          {arrow(0, 0, 2.2, 0, COLORS.blue, "x")}
          {arrow(0, 0, 0, 2.2, COLORS.teal, "y")}
          {arrow(0, 0, v1[0] * stretch1, v1[1] * stretch1, COLORS.violet, "v1")}
          {arrow(0, 0, v2[0] * stretch2, v2[1] * stretch2, COLORS.orange, "v2")}
          <circle cx={toSvg(0, 0).sx} cy={toSvg(0, 0).sy} fill="#111" r={4} />
        </svg>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-[color:var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
              <th className="px-4 py-2 text-left font-bold">Matrix A</th>
              <th className="px-4 py-2 text-right font-bold">col 1</th>
              <th className="px-4 py-2 text-right font-bold">col 2</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--border)]">
              <td className="px-4 py-2 font-bold">row 1</td>
              <td className="px-4 py-2 text-right font-mono">{formatNum(matrix[0][0])}</td>
              <td className="px-4 py-2 text-right font-mono">{formatNum(matrix[0][1])}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">row 2</td>
              <td className="px-4 py-2 text-right font-mono">{formatNum(matrix[1][0])}</td>
              <td className="px-4 py-2 text-right font-mono">{formatNum(matrix[1][1])}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.violet }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: COLORS.violet }}>
            λ₁ (largest |λ|)
          </p>
          <p className="mt-1 text-3xl font-black">{formatNum(lambda1)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.orange }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: COLORS.orange }}>
            λ₂
          </p>
          <p className="mt-1 text-3xl font-black">{formatNum(lambda2)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            PC1-style share
          </p>
          <p className="mt-1 text-3xl font-black">{(share.pc1 * 100).toFixed(0)}%</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            PC2-style share
          </p>
          <p className="mt-1 text-3xl font-black">{(share.pc2 * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Eigenvalue magnitudes |λ|
        </p>
        <svg aria-hidden="true" className="mx-auto w-full max-w-md" viewBox="0 0 400 120">
          {[
            { label: "λ₁", value: Math.abs(lambda1), color: COLORS.violet },
            { label: "λ₂", value: Math.abs(lambda2), color: COLORS.orange },
          ].map((row, i) => {
            const maxL = Math.max(Math.abs(lambda1), Math.abs(lambda2), 0.01);
            const barW = (row.value / maxL) * 260;
            return (
              <g key={row.label}>
                <text fill="#374151" fontSize={13} fontWeight={700} x={16} y={40 + i * 44}>
                  {row.label}
                </text>
                <rect fill={row.color} height={24} opacity={0.9} rx={4} width={Math.max(barW, 8)} x={56} y={20 + i * 44} />
                <text fill="#111" fontSize={13} fontWeight={700} x={64 + barW} y={38 + i * 44}>
                  {formatNum(row.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {eigenvaluesReadout(scenario, lambda1, lambda2, share)}
      </p>
    </section>
  );
}
