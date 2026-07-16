"use client";

import {
  MAX_N,
  SELECT_COLORS,
  combinationRead,
  combinations,
  permutationContrastRead,
  symmetryRead,
} from "@/lib/combinations-pure-data";
import { formatCount, permutations } from "@/lib/permutations-pure-data";
import { useMemo, useState } from "react";

export default function CombinationsPureExplorer() {
  const [n, setN] = useState(8);
  const [k, setK] = useState(3);

  const safeK = Math.min(k, n);
  const comboCount = useMemo(() => combinations(n, safeK), [n, safeK]);
  const comboMirror = useMemo(() => combinations(n, n - safeK), [n, safeK]);
  const permCount = useMemo(() => permutations(n, safeK), [n, safeK]);
  const maxCompare = Math.max(comboCount, permCount, 1);

  const itemLabels = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
  const selectedIndices = Array.from({ length: safeK }, (_, i) => i);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: unordered subsets with C(n,k)
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Choose k items from n without caring which came first. The same team in a different meeting
        order is still one committee. That is the combination count.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            n items: {n}
          </label>
          <input
            className="mt-1 w-full accent-black"
            max={MAX_N}
            min={1}
            onChange={(e) => {
              const nextN = Number(e.target.value);
              setN(nextN);
              if (k > nextN) setK(nextN);
            }}
            type="range"
            value={n}
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            k chosen: {safeK}
          </label>
          <input
            className="mt-1 w-full accent-black"
            max={n}
            min={0}
            onChange={(e) => setK(Number(e.target.value))}
            type="range"
            value={safeK}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">C(n,k)</p>
          <p className="mt-1 text-3xl font-black">{formatCount(comboCount)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">C(n,n − k)</p>
          <p className="mt-1 text-3xl font-black">{formatCount(comboMirror)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(n,k)</p>
          <p className="mt-1 text-3xl font-black">{formatCount(permCount)}</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Grid view: one subset of {safeK} from {n} (order ignored)
        </p>
        <div className="flex flex-wrap gap-3">
          {itemLabels.map((label, i) => {
            const selected = selectedIndices.includes(i);
            return (
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-black transition-all duration-300 ${
                  selected ? "border-transparent text-white" : "border-[color:var(--border)] text-[color:var(--foreground)]"
                }`}
                key={label}
                style={{
                  backgroundColor: selected ? SELECT_COLORS[i % SELECT_COLORS.length] : "transparent",
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {[
            { indices: selectedIndices, label: `{${selectedIndices.map((i) => itemLabels[i]).join(", ")}}` },
            ...(safeK >= 2 && n >= 3
              ? [{ indices: [0, 2].slice(0, safeK), label: `{${[0, 2].slice(0, safeK).map((i) => itemLabels[i]).join(", ")}}` }]
              : []),
          ].map((subset) => (
            <div
              className="rounded-lg border-2 border-dashed px-3 py-2"
              key={subset.label}
              style={{ borderColor: SELECT_COLORS[subset.indices[0] % SELECT_COLORS.length] }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">One subset</p>
              <div className="mt-1 flex gap-1">
                {subset.indices.map((i) => (
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white"
                    key={`${subset.label}-${i}`}
                    style={{ backgroundColor: SELECT_COLORS[i % SELECT_COLORS.length] }}
                  >
                    {itemLabels[i]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Highlighted circles are in the subset. Rearrange them and the subset count stays the same.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Symmetry: choosing k to include equals choosing n − k to exclude
        </p>
        <svg aria-hidden="true" className="mx-auto w-full max-w-xl" viewBox="0 0 520 180">
          <circle cx={160} cy={90} fill="#eff6ff" opacity={0.9} r={68} stroke="#2563eb" strokeWidth={2} />
          <circle cx={360} cy={90} fill="#ecfdf5" opacity={0.9} r={68} stroke="#0d9488" strokeWidth={2} />
          <path
            d="M 260 30 A 68 68 0 0 1 260 150 A 68 68 0 0 1 260 30 Z"
            fill="#8b5cf6"
            opacity={0.35}
          />
          <text fill="#1d4ed8" fontSize={13} fontWeight={700} textAnchor="middle" x={120} y={94}>
            k in
          </text>
          <text fill="#0f766e" fontSize={13} fontWeight={700} textAnchor="middle" x={400} y={94}>
            n − k out
          </text>
          <text fill="#111" fontSize={14} fontWeight={700} textAnchor="middle" x={260} y={94}>
            {formatCount(comboCount)}
          </text>
        </svg>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Combinations vs permutations for the same n and k
        </p>
        <svg aria-hidden="true" className="w-full" viewBox="0 0 560 140">
          {[
            { label: "C(n,k)", value: comboCount, color: "#8b5cf6" },
            { label: "P(n,k)", value: permCount, color: "#ea580c" },
          ].map((row, i) => {
            const barW = (row.value / maxCompare) * 400;
            return (
              <g key={row.label}>
                <text fill="#374151" fontSize={13} fontWeight={700} x={16} y={48 + i * 52}>
                  {row.label}
                </text>
                <rect
                  fill={row.color}
                  height={30}
                  rx={4}
                  width={Math.max(barW, 6)}
                  x={100}
                  y={26 + i * 52}
                />
                <text fill="#111" fontSize={13} fontWeight={700} x={110 + barW + 8} y={48 + i * 52}>
                  {formatCount(row.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {combinationRead(n, safeK)} {symmetryRead(n, safeK)} {permutationContrastRead(n, safeK)}
      </p>
    </section>
  );
}
