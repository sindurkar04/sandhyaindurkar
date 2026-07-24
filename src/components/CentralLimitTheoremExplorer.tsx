"use client";

import {
  BASE_SHAPES,
  type BaseShape,
  COLORS,
  baseHistogram,
  baseMean,
  cltReadout,
  formatNum,
  sampleMeanHistogram,
} from "@/lib/central-limit-theorem-data";
import { useMemo, useState } from "react";

const W = 340;
const H = 200;
const PAD_X = 20;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;
const BINS = 24;

function Histogram({
  data,
  color,
  caption,
  meanFrac,
}: {
  data: number[];
  color: string;
  caption: string;
  meanFrac: number;
}) {
  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const maxProb = Math.max(...data, 0.0001);
  const barW = plotW / data.length;
  const meanX = PAD_X + meanFrac * plotW;

  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
      <svg aria-hidden="true" className="mx-auto block w-full" viewBox={`0 0 ${W} ${H}`}>
        <line stroke={COLORS.grid} x1={PAD_X} x2={W - PAD_X} y1={PAD_TOP + plotH} y2={PAD_TOP + plotH} />
        {data.map((prob, i) => {
          const h = (prob / maxProb) * plotH;
          const x = PAD_X + i * barW;
          return (
            <rect
              fill={color}
              height={h}
              key={i}
              opacity={0.85}
              width={Math.max(1, barW - 1)}
              x={x + 0.5}
              y={PAD_TOP + plotH - h}
            />
          );
        })}
        <line
          stroke={COLORS.normal}
          strokeDasharray="4 3"
          strokeWidth={1.5}
          x1={meanX}
          x2={meanX}
          y1={PAD_TOP}
          y2={PAD_TOP + plotH}
        />
        <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={10} fontWeight={700} x={W / 2} y={H - 6} textAnchor="middle">
          {caption}
        </text>
      </svg>
    </div>
  );
}

export default function CentralLimitTheoremExplorer() {
  const [shape, setShape] = useState<BaseShape>("skewed");
  const [sampleSize, setSampleSize] = useState(10);

  const base = useMemo(() => baseHistogram(shape, BINS), [shape]);
  const meansHist = useMemo(
    () => sampleMeanHistogram(shape, sampleSize, BINS),
    [shape, sampleSize],
  );
  const popMean = useMemo(() => baseMean(shape), [shape]);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: a lopsided population, a bell-shaped average
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Pick any population shape on the left. The right panel is the distribution of the sample
        mean when you repeatedly average n draws. Raise n and watch it tighten into a bell.
      </p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div className="flex flex-wrap gap-2">
          {BASE_SHAPES.map((s) => (
            <button
              className={`rounded-full border px-3 py-1.5 text-sm font-bold transition ${
                shape === s.id
                  ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "border-[color:var(--border)] text-[color:var(--muted)] hover:border-[color:var(--border-strong)]"
              }`}
              key={s.id}
              onClick={() => setShape(s.id)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-bold text-[color:var(--foreground)]" htmlFor="clt-n">
          Sample size (n): {sampleSize}
        </label>
        <input
          className="mt-2 w-full accent-[#2563eb]"
          id="clt-n"
          max={60}
          min={1}
          onChange={(e) => setSampleSize(Number(e.target.value))}
          type="range"
          value={sampleSize}
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Histogram caption="Population (raw values)" color={COLORS.base} data={base} meanFrac={popMean} />
        <Histogram caption={`Mean of ${sampleSize} draws`} color={COLORS.sample} data={meansHist} meanFrac={popMean} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.normal, background: `${COLORS.normal}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Center of both</p>
          <p className="mt-1 text-2xl font-black">{formatNum(popMean)}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">Population mean, unchanged by averaging.</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.sample, background: `${COLORS.sample}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Spread shrinks by</p>
          <p className="mt-1 text-2xl font-black">÷ √{sampleSize} ≈ {formatNum(Math.sqrt(sampleSize))}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">Standard error = sigma / sqrt(n).</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {cltReadout(shape, sampleSize)}
      </p>
    </section>
  );
}
