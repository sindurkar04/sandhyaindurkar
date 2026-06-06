"use client";

import {
  SCENARIOS,
  coinSampleSpace,
  complement,
  formatPct,
  independenceRead,
  productIfIndependent,
  type CoinScenario,
} from "@/lib/probability-basics-data";
import { CHART_LINE, CHART_LINE_MUTED, CHART_REFERENCE } from "@/lib/chart-colors";
import { useState } from "react";

const VENN_W = 520;
const VENN_H = 200;

export default function ProbabilityBasicsExplorer() {
  const [key, setKey] = useState<CoinScenario>("fair_coin");
  const scenario = SCENARIOS[key];
  const product = productIfIndependent(scenario.pA, scenario.pB);
  const match = Math.abs(product - scenario.pAandB) < 0.001;
  const sampleSpace = coinSampleSpace();
  const showCoinGrid = key === "fair_coin" || key === "biased_coin";

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: events, joint probability, and independence
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        An event is one outcome you care about. Joint probability is how often two events both happen.
        Independence means learning one event happened does not change the odds of the other.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as CoinScenario[]).map((scenarioKey) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              key === scenarioKey
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--foreground)]"
            }`}
            key={scenarioKey}
            onClick={() => setKey(scenarioKey)}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-base font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(A)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(scenario.pA)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{scenario.labelA}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(B)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(scenario.pB)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{scenario.labelB}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(A and B)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(scenario.pAandB)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{scenario.labelBoth}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(not A)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(complement(scenario.pA))}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Complement of A</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">Venn view: overlap is P(A and B)</p>
        <svg aria-hidden="true" className="mx-auto w-full max-w-xl" viewBox={`0 0 ${VENN_W} ${VENN_H}`}>
          <circle cx={210} cy={100} fill="#eff6ff" opacity={0.9} r={72} stroke={CHART_LINE} strokeWidth={2} />
          <circle cx={310} cy={100} fill="#ecfdf5" opacity={0.9} r={72} stroke="#059669" strokeWidth={2} />
          <path
            d="M 260 40 A 72 72 0 0 1 260 160 A 72 72 0 0 1 260 40 Z"
            fill="#c4b5fd"
            opacity={0.85}
          />
          <text fill={CHART_REFERENCE} fontSize={14} fontWeight={700} textAnchor="middle" x={170} y={104}>
            A
          </text>
          <text fill={CHART_REFERENCE} fontSize={14} fontWeight={700} textAnchor="middle" x={350} y={104}>
            B
          </text>
          <text fill="#111" fontSize={12} fontWeight={700} textAnchor="middle" x={260} y={104}>
            {formatPct(scenario.pAandB)}
          </text>
        </svg>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Compare: actual joint vs P(A) x P(B)
        </p>
        <svg aria-hidden="true" className="w-full" viewBox="0 0 560 180">
          {[scenario.pAandB, product].map((value, i) => {
            const labels = ["P(A and B)", "P(A) x P(B)"];
            const colors = [CHART_LINE, match ? CHART_LINE_MUTED : "#dc2626"];
            const barW = value * 420;
            return (
              <g key={labels[i]}>
                <text fill="#374151" fontSize={13} fontWeight={700} x={20} y={40 + i * 70}>
                  {labels[i]}
                </text>
                <rect
                  fill={colors[i]}
                  height={28}
                  rx={4}
                  width={Math.max(barW, 4)}
                  x={140}
                  y={22 + i * 70}
                />
                <text fill="#111" fontSize={14} fontWeight={700} x={150 + barW + 8} y={42 + i * 70}>
                  {formatPct(value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {showCoinGrid ? (
        <div className="mt-5 rounded-lg border border-[color:var(--border)] p-4">
          <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
            Sample space for two coin flips (four equally likely outcomes)
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {sampleSpace.map((cell) => {
              const both = cell.pA && cell.pB;
              return (
                <div
                  className={`rounded-lg border px-3 py-3 text-center ${
                    both ? "border-[#2563eb] bg-[#eff6ff]" : "border-[color:var(--border)]"
                  }`}
                  key={cell.label}
                >
                  <p className="text-lg font-black">{cell.label}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">{formatPct(cell.probability)}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-sm font-bold text-[color:var(--foreground)]">If independent: P(A) x P(B)</p>
          <p className="mt-1 text-xl font-black">{formatPct(product)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-sm font-bold text-[color:var(--foreground)]">Match?</p>
          <p className="mt-1 text-xl font-black">{match ? "Yes" : "No"}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            {match ? "Events are independent." : "Second event depends on the first or is linked."}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {independenceRead(scenario)}
      </p>
    </section>
  );
}
