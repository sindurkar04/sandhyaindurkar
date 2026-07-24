"use client";

import {
  COLORS,
  binomialDistribution,
  binomialMean,
  binomialReadout,
  binomialVariance,
  formatNum,
  formatPct,
} from "@/lib/binomial-distribution-data";
import { useMemo, useState } from "react";

const W = 340;
const H = 240;
const PAD_X = 34;
const PAD_TOP = 16;
const PAD_BOTTOM = 34;

export default function BinomialDistributionExplorer() {
  const [n, setN] = useState(10);
  const [pPct, setPPct] = useState(50);

  const p = pPct / 100;
  const bars = useMemo(() => binomialDistribution(n, p), [n, p]);
  const mean = binomialMean(n, p);
  const variance = binomialVariance(n, p);
  const sd = Math.sqrt(variance);

  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const maxProb = Math.max(...bars.map((b) => b.prob), 0.0001);
  const barW = plotW / bars.length;
  const peakK = bars.reduce((best, b, i) => (b.prob > bars[best].prob ? i : best), 0);
  const meanX = PAD_X + ((mean + 0.5) / bars.length) * plotW;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: successes in n independent trials
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Set the number of trials and the success chance per trial. Each bar is the probability of
        seeing exactly that many successes. The orange line marks the expected count, n · p.
      </p>

      <div className="mt-5 grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="bin-n">
            Trials (n): {n}
          </label>
          <input
            className="mt-2 w-full accent-[#2563eb]"
            id="bin-n"
            max={30}
            min={1}
            onChange={(e) => setN(Number(e.target.value))}
            type="range"
            value={n}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="bin-p">
            Success chance (p): {pPct}%
          </label>
          <input
            className="mt-2 w-full accent-[#7c3aed]"
            id="bin-p"
            max={95}
            min={5}
            onChange={(e) => setPPct(Number(e.target.value))}
            type="range"
            value={pPct}
          />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-blue-50/40 via-violet-50/30 to-white p-3">
        <svg aria-hidden="true" className="mx-auto block w-full max-w-[340px]" viewBox={`0 0 ${W} ${H}`}>
          <line stroke={COLORS.grid} x1={PAD_X} x2={W - PAD_X} y1={PAD_TOP + plotH} y2={PAD_TOP + plotH} />
          {bars.map((bar) => {
            const h = (bar.prob / maxProb) * plotH;
            const x = PAD_X + bar.k * barW;
            const showLabel = bars.length <= 16 || bar.k % 2 === 0;
            return (
              <g key={bar.k}>
                <rect
                  fill={bar.k === peakK ? COLORS.barPeak : COLORS.bar}
                  height={h}
                  opacity={0.85}
                  rx={2}
                  width={Math.max(1, barW - 3)}
                  x={x + 1.5}
                  y={PAD_TOP + plotH - h}
                />
                {showLabel && (
                  <text
                    fill="#6b7280"
                    fontFamily="system-ui, sans-serif"
                    fontSize={9}
                    textAnchor="middle"
                    x={x + barW / 2}
                    y={PAD_TOP + plotH + 14}
                  >
                    {bar.k}
                  </text>
                )}
              </g>
            );
          })}
          <line
            stroke={COLORS.meanLine}
            strokeDasharray="5 4"
            strokeWidth={2}
            x1={meanX}
            x2={meanX}
            y1={PAD_TOP}
            y2={PAD_TOP + plotH}
          />
          <text
            fill={COLORS.meanLine}
            fontFamily="system-ui, sans-serif"
            fontSize={10}
            fontWeight={700}
            textAnchor="middle"
            x={Math.min(W - 30, Math.max(30, meanX))}
            y={PAD_TOP + 10}
          >
            mean {formatNum(mean, 1)}
          </text>
          <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={10} fontWeight={700} x={W / 2} y={H - 4} textAnchor="middle">
            Number of successes (k)
          </text>
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.meanLine, background: `${COLORS.meanLine}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Mean (n·p)</p>
          <p className="mt-1 text-2xl font-black">{formatNum(mean, 2)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.bar, background: `${COLORS.bar}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Std dev</p>
          <p className="mt-1 text-2xl font-black">{formatNum(sd, 2)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.barPeak, background: `${COLORS.barPeak}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Peak at k</p>
          <p className="mt-1 text-2xl font-black">{peakK}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">P = {formatPct(bars[peakK].prob)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {binomialReadout(n, p)}
      </p>
    </section>
  );
}
