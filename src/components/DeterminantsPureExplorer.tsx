"use client";

import {
  VECTOR_COLORS,
  determinantRead,
  det2x2,
  formatDet,
  invertibilityRead,
  isSingular,
  signedArea,
} from "@/lib/determinants-pure-data";
import { useMemo, useState } from "react";

const SCALE = 36;
const ORIGIN_X = 120;
const ORIGIN_Y = 220;

export default function DeterminantsPureExplorer() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0.5);
  const [d, setD] = useState(1.5);

  const det = useMemo(() => det2x2(a, b, c, d), [a, b, c, d]);
  const area = useMemo(() => signedArea(det), [det]);
  const singular = useMemo(() => isSingular(det), [det]);

  const v1x = a * SCALE;
  const v1y = -c * SCALE;
  const v2x = b * SCALE;
  const v2y = -d * SCALE;
  const p1x = ORIGIN_X + v1x;
  const p1y = ORIGIN_Y + v1y;
  const p2x = ORIGIN_X + v2x;
  const p2y = ORIGIN_Y + v2y;
  const p3x = ORIGIN_X + v1x + v2x;
  const p3y = ORIGIN_Y + v1y + v2y;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: 2×2 determinant as signed area
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Columns of the matrix are two vectors in the plane. Their determinant is the signed area of
        the parallelogram they span. Drag the entries and watch area grow, shrink, or collapse.
      </p>

      <div className="mt-5 grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 font-mono text-sm sm:grid-cols-2">
        <div>
          <p className="mb-2 font-sans text-xs font-bold uppercase text-[color:var(--muted)]">Matrix</p>
          <p>[{formatDet(a)}, {formatDet(b)}]</p>
          <p>[{formatDet(c)}, {formatDet(d)}]</p>
        </div>
        <div>
          <p className="mb-2 font-sans text-xs font-bold uppercase text-[color:var(--muted)]">Formula</p>
          <p>det = ad − bc</p>
          <p>= ({formatDet(a)})({formatDet(d)}) − ({formatDet(b)})({formatDet(c)})</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {[
          { label: "a", value: a, set: setA, min: -3, max: 3, step: 0.1 },
          { label: "b", value: b, set: setB, min: -3, max: 3, step: 0.1 },
          { label: "c", value: c, set: setC, min: -3, max: 3, step: 0.1 },
          { label: "d", value: d, set: setD, min: -3, max: 3, step: 0.1 },
        ].map((entry) => (
          <div key={entry.label}>
            <label className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
              {entry.label}: {formatDet(entry.value)}
            </label>
            <input
              className="mt-1 w-full accent-black"
              max={entry.max}
              min={entry.min}
              onChange={(e) => entry.set(Number(e.target.value))}
              step={entry.step}
              type="range"
              value={entry.value}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">det</p>
          <p className="mt-1 text-3xl font-black">{formatDet(det)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">|det| area</p>
          <p className="mt-1 text-3xl font-black">{formatDet(area)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Status</p>
          <p className="mt-1 text-xl font-black">{singular ? "Singular" : "Invertible"}</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Parallelogram spanned by column vectors
        </p>
        <svg aria-hidden="true" className="mx-auto w-full max-w-xl" viewBox="0 0 520 280">
          <line stroke="#e5e7eb" strokeWidth={1} x1={40} x2={500} y1={ORIGIN_Y} y2={ORIGIN_Y} />
          <line stroke="#e5e7eb" strokeWidth={1} x1={ORIGIN_X} x2={ORIGIN_X} y1={40} y2={260} />

          {singular ? (
            <line
              stroke={VECTOR_COLORS.singular}
              strokeDasharray="8 6"
              strokeWidth={4}
              x1={ORIGIN_X}
              x2={p3x}
              y1={ORIGIN_Y}
              y2={p3y}
            />
          ) : (
            <polygon
              fill={VECTOR_COLORS.fill}
              opacity={0.35}
              points={`${ORIGIN_X},${ORIGIN_Y} ${p1x},${p1y} ${p3x},${p3y} ${p2x},${p2y}`}
              stroke={VECTOR_COLORS.fill}
              strokeWidth={2}
            />
          )}

          <line
            markerEnd="url(#arrowTeal)"
            stroke={VECTOR_COLORS.first}
            strokeWidth={3}
            x1={ORIGIN_X}
            x2={p1x}
            y1={ORIGIN_Y}
            y2={p1y}
          />
          <line
            markerEnd="url(#arrowOrange)"
            stroke={VECTOR_COLORS.second}
            strokeWidth={3}
            x1={ORIGIN_X}
            x2={p2x}
            y1={ORIGIN_Y}
            y2={p2y}
          />

          <defs>
            <marker id="arrowTeal" markerHeight={8} markerWidth={8} orient="auto" refX={6} refY={3}>
              <path d="M0,0 L6,3 L0,6 Z" fill={VECTOR_COLORS.first} />
            </marker>
            <marker id="arrowOrange" markerHeight={8} markerWidth={8} orient="auto" refX={6} refY={3}>
              <path d="M0,0 L6,3 L0,6 Z" fill={VECTOR_COLORS.second} />
            </marker>
          </defs>

          <text fill={VECTOR_COLORS.first} fontSize={12} fontWeight={700} x={p1x + 6} y={p1y}>
            col 1
          </text>
          <text fill={VECTOR_COLORS.second} fontSize={12} fontWeight={700} x={p2x + 6} y={p2y}>
            col 2
          </text>
          <text fill="#111" fontSize={13} fontWeight={700} x={ORIGIN_X + 8} y={ORIGIN_Y - 10}>
            origin
          </text>
        </svg>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          {singular
            ? "Vectors are parallel or anti-parallel. Area collapses to a line."
            : "Teal and orange columns sweep out a violet region. Its signed area equals det."}
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">Area scale from |det|</p>
        <svg aria-hidden="true" className="w-full" viewBox="0 0 560 100">
          <rect
            fill="#8b5cf6"
            height={28}
            opacity={0.85}
            rx={4}
            width={Math.max(Math.min(area * 80, 420), singular ? 8 : 12)}
            x={80}
            y={36}
          />
          <text fill="#374151" fontSize={13} fontWeight={700} x={16} y={56}>
            |det|
          </text>
          <text fill="#111" fontSize={13} fontWeight={700} x={92 + Math.max(Math.min(area * 80, 420), 12)} y={56}>
            {formatDet(area)}
          </text>
        </svg>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {determinantRead(a, b, c, d)} {invertibilityRead(det)}
      </p>
    </section>
  );
}
