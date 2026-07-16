"use client";

import {
  COLORS,
  clampProbability,
  formatNum,
  formatOdds,
  formatPct,
  logOdds,
  logOddsAfterFeature,
  logarithmsOddsReadout,
  mappingCurve,
  odds,
  oddsMultiplierFromWeight,
  probabilityFromLogOdds,
} from "@/lib/logarithms-odds-data";
import { useMemo, useState } from "react";

const CHART_W = 360;
const CHART_H = 160;
const PAD = 32;

function pToX(p: number, plotW: number): number {
  return PAD + p * plotW;
}

function oddsToY(o: number, plotH: number, maxOdds: number): number {
  const clamped = Math.min(o, maxOdds);
  return PAD + plotH - (clamped / maxOdds) * plotH;
}

function logToY(z: number, plotH: number, zMin: number, zMax: number): number {
  const t = (z - zMin) / (zMax - zMin);
  return PAD + plotH - t * plotH;
}

export default function LogarithmsOddsExplorer() {
  const [pPct, setPPct] = useState(40);
  const [wTenths, setWTenths] = useState(5);

  const p = pPct / 100;
  const w = wTenths / 10;
  const o = odds(p);
  const lo = logOdds(p);
  const mult = oddsMultiplierFromWeight(w);
  const newLo = logOddsAfterFeature(p, w);
  const newP = probabilityFromLogOdds(newLo);

  const curve = useMemo(() => mappingCurve(), []);
  const maxOdds = 20;
  const zMin = -4;
  const zMax = 4;
  const plotW = CHART_W - PAD * 2;
  const plotH = CHART_H - PAD * 2;

  const oddsPath = curve
    .filter((pt) => pt.oddsVal <= maxOdds)
    .map((pt, i) => {
      const sx = pToX(pt.p, plotW);
      const sy = oddsToY(pt.oddsVal, plotH, maxOdds);
      return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
    })
    .join(" ");

  const logPath = curve
    .map((pt, i) => {
      const sx = pToX(pt.p, plotW);
      const sy = logToY(pt.logOddsVal, plotH, zMin, zMax);
      return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
    })
    .join(" ");

  const markerX = pToX(clampProbability(p), plotW);
  const oddsY = oddsToY(o, plotH, maxOdds);
  const logY = logToY(lo, plotH, zMin, zMax);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: probability, odds, and log-odds on one slider
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Probability lives on (0, 1). Odds stretch to infinity as p approaches 1. Log-odds turn
        multiplication into addition, which is why logistic models stay linear in features.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="log-p">
            Probability p: {formatPct(p)}
          </label>
          <input
            className="mt-2 w-full accent-[#ea580c]"
            id="log-p"
            max={95}
            min={5}
            onChange={(e) => setPPct(Number(e.target.value))}
            type="range"
            value={pPct}
          />
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="log-w">
            Feature weight w: {formatNum(w)}
          </label>
          <input
            className="mt-2 w-full accent-[#8b5cf6]"
            id="log-w"
            max={20}
            min={-20}
            onChange={(e) => setWTenths(Number(e.target.value))}
            type="range"
            value={wTenths}
          />
          <p className="mt-1 text-xs font-bold text-[color:var(--muted)]">
            e^w = {formatNum(mult)} (odds multiplier)
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-orange-50/50 to-orange-100/30 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            odds = p / (1 - p)
          </p>
          <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
            <rect fill="#fff" height={plotH} opacity={0.6} width={plotW} x={PAD} y={PAD} />
            <path d={oddsPath} fill="none" stroke={COLORS.odds} strokeWidth={2.5} />
            <circle cx={markerX} cy={oddsY} fill={COLORS.odds} r={6} />
            <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={10} fontWeight={700} x={CHART_W / 2} y={CHART_H - 6} textAnchor="middle">
              p
            </text>
          </svg>
          <p className="mt-2 text-center text-2xl font-black" style={{ color: COLORS.odds }}>
            {formatOdds(o)}
          </p>
        </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-teal-50/50 to-teal-100/30 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            log-odds = log(odds)
          </p>
          <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
            <rect fill="#fff" height={plotH} opacity={0.6} width={plotW} x={PAD} y={PAD} />
            <line stroke={COLORS.grid} strokeDasharray="4 3" x1={PAD} x2={PAD + plotW} y1={logToY(0, plotH, zMin, zMax)} y2={logToY(0, plotH, zMin, zMax)} />
            <path d={logPath} fill="none" stroke={COLORS.logOdds} strokeWidth={2.5} />
            <circle cx={markerX} cy={logY} fill={COLORS.logOdds} r={6} />
            <circle cx={pToX(newP, plotW)} cy={logToY(newLo, plotH, zMin, zMax)} fill={COLORS.feature} opacity={0.85} r={5} />
            <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={10} fontWeight={700} x={CHART_W / 2} y={CHART_H - 6} textAnchor="middle">
              p
            </text>
          </svg>
          <p className="mt-2 text-center text-2xl font-black" style={{ color: COLORS.logOdds }}>
            {formatNum(lo)}
          </p>
          <p className="text-center text-sm font-bold text-[color:var(--muted)]">
            + w = {formatNum(newLo)} → p = {formatPct(newP)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.probability, background: `${COLORS.probability}10` }}>
          <p className="text-xs font-bold uppercase tracking-[0.08em]">p</p>
          <p className="text-2xl font-black">{formatPct(p)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.odds, background: `${COLORS.odds}10` }}>
          <p className="text-xs font-bold uppercase tracking-[0.08em]">odds</p>
          <p className="text-2xl font-black">{formatOdds(o)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.logOdds, background: `${COLORS.logOdds}10` }}>
          <p className="text-xs font-bold uppercase tracking-[0.08em]">log-odds</p>
          <p className="text-2xl font-black">{formatNum(lo)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {logarithmsOddsReadout(p, w)}
      </p>
    </section>
  );
}
