"use client";

import {
  COLORS,
  SIGMA_X,
  SIGMA_Y,
  covarianceReadout,
  ellipseRadii,
  formatNum,
  generateScatter,
  sampleCorrelation,
  sampleCovariance,
  sampleVariance,
} from "@/lib/covariance-data";
import { useMemo, useState } from "react";

const W = 340;
const H = 280;
const PAD = 36;

function toSvg(x: number, y: number, plotW: number, plotH: number): { sx: number; sy: number } {
  const xMin = -8;
  const xMax = 8;
  const yMin = -7;
  const yMax = 7;
  return {
    sx: PAD + ((x - xMin) / (xMax - xMin)) * plotW,
    sy: PAD + plotH - ((y - yMin) / (yMax - yMin)) * plotH,
  };
}

export default function CovarianceExplorer() {
  const [corrPct, setCorrPct] = useState(65);

  const correlation = corrPct / 100;
  const points = useMemo(() => generateScatter(correlation), [correlation]);
  const cov = useMemo(() => sampleCovariance(points), [points]);
  const corr = useMemo(() => sampleCorrelation(points), [points]);
  const varX = useMemo(() => sampleVariance(points.map((p) => p.x)), [points]);
  const varY = useMemo(() => sampleVariance(points.map((p) => p.y)), [points]);
  const ellipse = ellipseRadii(correlation);

  const plotW = W - PAD * 2;
  const plotH = H - PAD * 2;
  const cx = PAD + plotW / 2;
  const cy = PAD + plotH / 2;
  const scaleX = plotW / 16;
  const scaleY = plotH / 14;

  const pointColor = correlation >= 0 ? COLORS.positive : COLORS.negative;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: scatter cloud, covariance, and correlation
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag correlation strength. Points tilt together or apart. Covariance mixes units; correlation
        divides by spread so it stays between -1 and 1.
      </p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="cov-r">
          Target correlation: {corrPct >= 0 ? "+" : ""}{corrPct}%
        </label>
        <input
          className="mt-2 w-full accent-[#8b5cf6]"
          id="cov-r"
          max={98}
          min={-98}
          onChange={(e) => setCorrPct(Number(e.target.value))}
          type="range"
          value={corrPct}
        />
        <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
          <span>-1 (move opposite)</span>
          <span>0 (no linear link)</span>
          <span>+1 (move together)</span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-blue-50/40 via-violet-50/30 to-rose-50/30 p-3">
        <svg aria-hidden="true" className="mx-auto block w-full max-w-[340px]" viewBox={`0 0 ${W} ${H}`}>
          <rect fill="#f8fafc" height={plotH} width={plotW} x={PAD} y={PAD} />
          <line stroke={COLORS.grid} x1={PAD} x2={PAD + plotW} y1={cy} y2={cy} />
          <line stroke={COLORS.grid} x1={cx} x2={cx} y1={PAD} y2={PAD + plotH} />
          <ellipse
            cx={cx}
            cy={cy}
            fill="none"
            rx={ellipse.rx * scaleX}
            ry={ellipse.ry * scaleY}
            stroke={COLORS.ellipse}
            strokeDasharray="6 4"
            strokeWidth={2}
            transform={`rotate(${ellipse.rotation} ${cx} ${cy})`}
          />
          {points.map((p, i) => {
            const { sx, sy } = toSvg(p.x, p.y, plotW, plotH);
            return <circle cx={sx} cy={sy} fill={pointColor} key={i} opacity={0.75} r={4} />;
          })}
          <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={11} fontWeight={700} x={W / 2} y={H - 10} textAnchor="middle">
            Feature X
          </text>
          <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={11} fontWeight={700} transform={`rotate(-90 14 ${H / 2})`} x={14} y={H / 2} textAnchor="middle">
            Feature Y
          </text>
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.covCard, background: `${COLORS.covCard}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Cov(X, Y)</p>
          <p className="mt-1 text-3xl font-black">{formatNum(cov)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Units: ({SIGMA_X}-scale) x ({SIGMA_Y}-scale). Changes if you rescale a feature.
          </p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.corrCard, background: `${COLORS.corrCard}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Corr(X, Y)</p>
          <p className="mt-1 text-3xl font-black">{formatNum(corr)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Unitless in [-1, 1]. Cov divided by sigma_X and sigma_Y.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Var(X) diagonal</p>
          <p className="text-xl font-black">{formatNum(varX)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Var(Y) diagonal</p>
          <p className="text-xl font-black">{formatNum(varY)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {covarianceReadout(correlation, cov, corr)}
      </p>
    </section>
  );
}
