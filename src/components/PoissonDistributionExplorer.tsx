"use client";

import {
  COLORS,
  formatNum,
  formatPct,
  poissonDistribution,
  poissonPmf,
  poissonReadout,
} from "@/lib/poisson-distribution-data";
import { useMemo, useState } from "react";

const W = 340;
const H = 240;
const PAD_X = 34;
const PAD_TOP = 16;
const PAD_BOTTOM = 34;
const MAX_K = 20;

export default function PoissonDistributionExplorer() {
  const [lambdaTenths, setLambdaTenths] = useState(30);

  const lambda = lambdaTenths / 10;
  const bars = useMemo(() => poissonDistribution(lambda, MAX_K), [lambda]);
  const sd = Math.sqrt(lambda);
  const pZero = poissonPmf(lambda, 0);

  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const maxProb = Math.max(...bars.map((b) => b.prob), 0.0001);
  const barW = plotW / bars.length;
  const peakK = bars.reduce((best, b, i) => (b.prob > bars[best].prob ? i : best), 0);
  const meanX = PAD_X + ((lambda + 0.5) / bars.length) * plotW;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: event counts in a fixed window
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Slide the average rate lambda (support tickets per hour, arrivals per minute). Each bar is
        the probability of exactly that many events in one window. Mean and variance are both lambda.
      </p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="pois-l">
          Average rate (lambda): {formatNum(lambda, 1)} events / window
        </label>
        <input
          className="mt-2 w-full accent-[#0d9488]"
          id="pois-l"
          max={150}
          min={2}
          onChange={(e) => setLambdaTenths(Number(e.target.value))}
          type="range"
          value={lambdaTenths}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-teal-50/40 via-violet-50/20 to-white p-3">
        <svg aria-hidden="true" className="mx-auto block w-full max-w-[340px]" viewBox={`0 0 ${W} ${H}`}>
          <line stroke={COLORS.grid} x1={PAD_X} x2={W - PAD_X} y1={PAD_TOP + plotH} y2={PAD_TOP + plotH} />
          {bars.map((bar) => {
            const h = (bar.prob / maxProb) * plotH;
            const x = PAD_X + bar.k * barW;
            const showLabel = bar.k % 2 === 0;
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
            lambda {formatNum(lambda, 1)}
          </text>
          <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={10} fontWeight={700} x={W / 2} y={H - 4} textAnchor="middle">
            Number of events (k)
          </text>
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.meanLine, background: `${COLORS.meanLine}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Mean = lambda</p>
          <p className="mt-1 text-2xl font-black">{formatNum(lambda, 1)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.bar, background: `${COLORS.bar}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Std dev</p>
          <p className="mt-1 text-2xl font-black">{formatNum(sd, 2)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.barPeak, background: `${COLORS.barPeak}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">P(zero events)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(pZero)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {poissonReadout(lambda)}
      </p>
    </section>
  );
}
