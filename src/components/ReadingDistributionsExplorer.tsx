"use client";

import {
  DATASETS,
  cumulativeCurve,
  histogramBins,
  mean,
  median,
  percentile,
  percentileRead,
  quartiles,
  type DatasetKey,
} from "@/lib/reading-distributions-data";
import { CHART_LINE, CHART_LINE_MUTED, CHART_REFERENCE } from "@/lib/chart-colors";
import { useMemo, useState } from "react";

const WIDTH = 600;
const HEIGHT = 220;
const PAD = 40;

export default function ReadingDistributionsExplorer() {
  const [datasetKey, setDatasetKey] = useState<DatasetKey>("latency_ms");
  const [p, setP] = useState(90);
  const dataset = DATASETS[datasetKey];
  const values = dataset.values;
  const q = useMemo(() => quartiles(values), [values]);
  const pValue = useMemo(() => percentile(values, p), [values, p]);
  const bins = useMemo(() => histogramBins(values, 6), [values]);
  const curve = useMemo(() => cumulativeCurve(values), [values]);
  const avg = useMemo(() => mean(values), [values]);
  const med = useMemo(() => median(values), [values]);
  const maxBin = Math.max(...bins.map((b) => b.count), 1);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const plotW = WIDTH - PAD * 2;
  const plotH = HEIGHT - PAD * 2;
  const xScale = (v: number) => PAD + ((v - minVal) / Math.max(maxVal - minVal, 1)) * plotW;
  const yScale = (i: number) => PAD + plotH - (i / Math.max(curve.length - 1, 1)) * plotH;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: read percentiles, quartiles, and the full shape
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Sort the data first. Quartiles split it into four equal-count chunks. Any percentile is a
        cutoff on that sorted list. The histogram and cumulative curve show the shape, not just one
        number.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(DATASETS) as DatasetKey[]).map((key) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              datasetKey === key
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--foreground)]"
            }`}
            key={key}
            onClick={() => setDatasetKey(key)}
            type="button"
          >
            {DATASETS[key].label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-[color:var(--muted)]">{dataset.description}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Min</p>
          <p className="mt-1 text-xl font-black">{q.min.toFixed(0)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Q1 (P25)</p>
          <p className="mt-1 text-xl font-black">{q.q1.toFixed(0)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Q2 (P50)</p>
          <p className="mt-1 text-xl font-black">{q.q2.toFixed(0)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Q3 (P75)</p>
          <p className="mt-1 text-xl font-black">{q.q3.toFixed(0)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Max</p>
          <p className="mt-1 text-xl font-black">{q.max.toFixed(0)}</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">Box plot (quartiles + whiskers)</p>
        <svg aria-hidden="true" className="w-full" viewBox="0 0 560 120">
          {(() => {
            const boxScale = (v: number) => 60 + ((v - minVal) / Math.max(maxVal - minVal, 1)) * 440;
            return (
              <>
                <line stroke={CHART_REFERENCE} strokeWidth={2} x1={boxScale(q.min)} x2={boxScale(q.max)} y1={60} y2={60} />
                <line stroke={CHART_REFERENCE} strokeWidth={2} x1={boxScale(q.min)} x2={boxScale(q.min)} y1={45} y2={75} />
                <line stroke={CHART_REFERENCE} strokeWidth={2} x1={boxScale(q.max)} x2={boxScale(q.max)} y1={45} y2={75} />
                <rect
                  fill="#eff6ff"
                  height={36}
                  stroke={CHART_LINE}
                  strokeWidth={2}
                  width={boxScale(q.q3) - boxScale(q.q1)}
                  x={boxScale(q.q1)}
                  y={42}
                />
                <line stroke="#111" strokeWidth={3} x1={boxScale(q.q2)} x2={boxScale(q.q2)} y1={42} y2={78} />
                <text fill="#374151" fontSize={11} x={boxScale(q.q1) - 8} y={95}>Q1</text>
                <text fill="#374151" fontSize={11} x={boxScale(q.q2) - 8} y={95}>Q2</text>
                <text fill="#374151" fontSize={11} x={boxScale(q.q3) - 8} y={95}>Q3</text>
              </>
            );
          })()}
        </svg>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">Histogram: how often values fall in each range</p>
        <svg aria-hidden="true" className="w-full" viewBox="0 0 560 180">
          {bins.map((bin, i) => {
            const barH = (bin.count / maxBin) * 120;
            const barW = 70;
            const x = 40 + i * (barW + 12);
            return (
              <g key={`${bin.start}-${bin.end}`}>
                <rect fill={CHART_LINE_MUTED} height={barH} width={barW} x={x} y={150 - barH} />
                <text fill="#374151" fontSize={10} textAnchor="middle" x={x + barW / 2} y={168}>
                  {bin.count}
                </text>
                <text fill="#374151" fontSize={9} textAnchor="middle" x={x + barW / 2} y={14}>
                  {bin.start.toFixed(0)}-{bin.end.toFixed(0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] p-4">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="percentile-slider">
          Percentile cutoff: P{p}
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="percentile-slider"
          max={99}
          min={50}
          onChange={(e) => setP(Number(e.target.value))}
          step={1}
          type="range"
          value={p}
        />
        <p className="mt-2 text-base font-bold text-[color:var(--foreground)]">
          Cutoff: {pValue.toFixed(0)} {dataset.unit}
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Sorted values (blue = at or below P{p}) and cumulative curve
        </p>
        <svg aria-hidden="true" className="w-full" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          <polyline
            fill="none"
            points={curve.map((pt, i) => `${xScale(pt.x)},${yScale(i)}`).join(" ")}
            stroke={CHART_LINE_MUTED}
            strokeWidth={2}
          />
          {curve.map((pt, i) => (
            <circle
              cx={xScale(pt.x)}
              cy={yScale(i)}
              fill={pt.x <= pValue ? CHART_LINE : CHART_LINE_MUTED}
              key={`${pt.x}-${i}`}
              r={5}
            />
          ))}
          <line
            stroke="#dc2626"
            strokeDasharray="6 4"
            strokeWidth={2}
            x1={xScale(pValue)}
            x2={xScale(pValue)}
            y1={PAD - 8}
            y2={PAD + plotH + 8}
          />
        </svg>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-sm font-bold text-[color:var(--foreground)]">Mean vs median</p>
          <p className="mt-1 text-base text-[color:var(--muted)]">
            Mean {avg.toFixed(1)} {dataset.unit}, median {med.toFixed(1)} {dataset.unit}.
            {Math.abs(avg - med) > (maxVal - minVal) * 0.15
              ? " The gap hints at a skewed tail."
              : " They are close here, so the distribution is fairly symmetric."}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-sm font-bold text-[color:var(--foreground)]">Sorted data ({values.length} points)</p>
          <p className="mt-1 font-mono text-sm text-[color:var(--muted)]">
            {[...values].sort((a, b) => a - b).join(", ")}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {percentileRead(p, pValue, dataset.unit)}
      </p>
    </section>
  );
}
