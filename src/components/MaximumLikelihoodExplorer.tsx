"use client";

import {
  COLORS,
  formatNum,
  formatPct,
  likelihoodCurve,
  logLikelihood,
  mleEstimate,
  mleReadout,
} from "@/lib/maximum-likelihood-data";
import { useMemo, useState } from "react";

const W = 340;
const H = 240;
const PAD_X = 34;
const PAD_TOP = 16;
const PAD_BOTTOM = 34;

export default function MaximumLikelihoodExplorer() {
  const [heads, setHeads] = useState(7);
  const [trials, setTrials] = useState(10);
  const [guessPct, setGuessPct] = useState(50);

  const safeHeads = Math.min(heads, trials);
  const guess = guessPct / 100;
  const curve = useMemo(() => likelihoodCurve(safeHeads, trials), [safeHeads, trials]);
  const mle = mleEstimate(safeHeads, trials);

  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const toX = (p: number) => PAD_X + p * plotW;
  const toY = (v: number) => PAD_TOP + plotH - v * plotH;

  const path = curve
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${toX(pt.p).toFixed(1)} ${toY(pt.value).toFixed(1)}`)
    .join(" ");

  const guessValue = Math.exp(
    logLikelihood(guess, safeHeads, trials) -
      logLikelihood(trials === 0 ? 0.5 : mle, safeHeads, trials),
  );

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: which coin bias best explains the flips?
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Fix how many heads you saw out of how many flips. The curve is the likelihood of each
        possible bias p. Drag your guess and watch it climb toward the peak — the maximum-likelihood
        estimate.
      </p>

      <div className="mt-5 grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="mle-trials">
            Flips: {trials}
          </label>
          <input
            className="mt-2 w-full accent-[#2563eb]"
            id="mle-trials"
            max={60}
            min={1}
            onChange={(e) => {
              const t = Number(e.target.value);
              setTrials(t);
              if (heads > t) setHeads(t);
            }}
            type="range"
            value={trials}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="mle-heads">
            Heads: {safeHeads}
          </label>
          <input
            className="mt-2 w-full accent-[#0d9488]"
            id="mle-heads"
            max={trials}
            min={0}
            onChange={(e) => setHeads(Number(e.target.value))}
            type="range"
            value={safeHeads}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="mle-guess">
            Your guess p: {guessPct}%
          </label>
          <input
            className="mt-2 w-full accent-[#ea580c]"
            id="mle-guess"
            max={99}
            min={1}
            onChange={(e) => setGuessPct(Number(e.target.value))}
            type="range"
            value={guessPct}
          />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-blue-50/40 to-white p-3">
        <svg aria-hidden="true" className="mx-auto block w-full max-w-[340px]" viewBox={`0 0 ${W} ${H}`}>
          <line stroke={COLORS.grid} x1={PAD_X} x2={W - PAD_X} y1={PAD_TOP + plotH} y2={PAD_TOP + plotH} />
          <line stroke={COLORS.grid} x1={PAD_X} x2={PAD_X} y1={PAD_TOP} y2={PAD_TOP + plotH} />
          <path d={path} fill="none" stroke={COLORS.curve} strokeWidth={2.5} />
          <line
            stroke={COLORS.mle}
            strokeDasharray="5 4"
            strokeWidth={2}
            x1={toX(mle)}
            x2={toX(mle)}
            y1={PAD_TOP}
            y2={PAD_TOP + plotH}
          />
          <text fill={COLORS.mle} fontFamily="system-ui, sans-serif" fontSize={10} fontWeight={700} textAnchor="middle" x={toX(mle)} y={PAD_TOP + 9}>
            MLE {formatPct(mle)}
          </text>
          <line stroke={COLORS.guess} strokeWidth={2} x1={toX(guess)} x2={toX(guess)} y1={toY(guessValue)} y2={PAD_TOP + plotH} />
          <circle cx={toX(guess)} cy={toY(guessValue)} fill={COLORS.guess} r={5} />
          <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={10} fontWeight={700} x={W / 2} y={H - 4} textAnchor="middle">
            Candidate bias p (0 to 1)
          </text>
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.mle, background: `${COLORS.mle}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">MLE = heads / flips</p>
          <p className="mt-1 text-2xl font-black">{formatPct(mle)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.guess, background: `${COLORS.guess}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Your guess&apos;s likelihood</p>
          <p className="mt-1 text-2xl font-black">{formatNum(guessValue * 100, 0)}% of peak</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {mleReadout(safeHeads, trials, guess)}
      </p>
    </section>
  );
}
