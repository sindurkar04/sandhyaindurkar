"use client";

import {
  CHIP_COLORS,
  MAX_N,
  formatCount,
  orderMattersExample,
  permutationFormulaParts,
  permutationRead,
  permutations,
} from "@/lib/permutations-pure-data";
import { useMemo, useState } from "react";

const SLOT_COLORS = ["#2563eb", "#0d9488", "#ea580c", "#8b5cf6", "#e11d48", "#d97706"];

export default function PermutationsPureExplorer() {
  const [n, setN] = useState(6);
  const [r, setR] = useState(3);

  const safeR = Math.min(r, n);
  const count = useMemo(() => permutations(n, safeR), [n, safeR]);
  const parts = useMemo(() => permutationFormulaParts(n, safeR), [n, safeR]);
  const maxBar = Math.max(parts.nFact, parts.denomFact, count, 1);

  const candidateLabels = Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: ordered arrangements with P(n,r)
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Pick r distinct positions from n candidates. First slot, second slot, and third slot are
        different outcomes even when the same people appear. That is what order means.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            n candidates: {n}
          </label>
          <input
            className="mt-1 w-full accent-black"
            max={MAX_N}
            min={1}
            onChange={(e) => {
              const nextN = Number(e.target.value);
              setN(nextN);
              if (r > nextN) setR(nextN);
            }}
            type="range"
            value={n}
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            r ranked slots: {safeR}
          </label>
          <input
            className="mt-1 w-full accent-black"
            max={n}
            min={1}
            onChange={(e) => setR(Number(e.target.value))}
            type="range"
            value={safeR}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(n,r)</p>
          <p className="mt-1 text-3xl font-black">{formatCount(count)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">n!</p>
          <p className="mt-1 text-2xl font-black">{formatCount(parts.nFact)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">(n − r)!</p>
          <p className="mt-1 text-2xl font-black">{formatCount(parts.denomFact)}</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Candidate pool (n = {n})
        </p>
        <div className="flex flex-wrap gap-2">
          {candidateLabels.map((label, i) => (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white transition-transform duration-300"
              key={label}
              style={{ backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length] }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Order matters: same letters, different permutations
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "ABC", order: [0, 1, 2], note: "A first" },
            { label: "BAC", order: [1, 0, 2], note: "B first" },
          ].map((arrangement) => (
            <div
              className="rounded-lg bg-gradient-to-br from-violet-50 to-blue-50 p-3"
              key={arrangement.label}
            >
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
                {arrangement.note}
              </p>
              <div className="flex justify-center gap-2">
                {arrangement.order.slice(0, Math.min(3, safeR)).map((idx, slot) => (
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-black text-white shadow-sm"
                    key={`${arrangement.label}-${slot}`}
                    style={{ backgroundColor: SLOT_COLORS[slot % SLOT_COLORS.length] }}
                  >
                    {candidateLabels[idx]}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-sm font-bold text-[color:var(--foreground)]">
                {arrangement.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Both use the same pool, but each ordering counts separately toward P(n,r).
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          One sample ranking: top {safeR} in order (slots matter)
        </p>
        <div className="flex flex-wrap items-end gap-3">
          {Array.from({ length: safeR }, (_, slot) => {
            const candidateIndex = slot % n;
            const height = 48 + slot * 14;
            return (
              <div className="flex flex-col items-center" key={`slot-${slot}`}>
                <div
                  className="flex w-14 items-center justify-center rounded-lg text-sm font-black text-white shadow-sm transition-all duration-500"
                  style={{
                    backgroundColor: SLOT_COLORS[slot % SLOT_COLORS.length],
                    height,
                  }}
                >
                  {candidateLabels[candidateIndex]}
                </div>
                <p className="mt-2 text-xs font-bold text-[color:var(--muted)]">#{slot + 1}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Swap two slots and you get a different permutation. ABC is not the same as BAC.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Formula building blocks: n! divided by (n − r)!
        </p>
        <svg aria-hidden="true" className="w-full" viewBox="0 0 560 200">
          {[
            { label: "n!", value: parts.nFact, color: "#2563eb" },
            { label: "(n − r)!", value: parts.denomFact, color: "#0d9488" },
            { label: "P(n,r)", value: count, color: "#ea580c" },
          ].map((row, i) => {
            const barW = (row.value / maxBar) * 360;
            return (
              <g key={row.label}>
                <text fill="#374151" fontSize={13} fontWeight={700} x={16} y={44 + i * 56}>
                  {row.label}
                </text>
                <rect
                  fill={row.color}
                  height={28}
                  rx={4}
                  width={Math.max(barW, 6)}
                  x={120}
                  y={24 + i * 56}
                />
                <text fill="#111" fontSize={13} fontWeight={700} x={130 + barW + 8} y={44 + i * 56}>
                  {formatCount(row.value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {permutationRead(n, safeR)} {orderMattersExample(n, safeR)}
      </p>
    </section>
  );
}
