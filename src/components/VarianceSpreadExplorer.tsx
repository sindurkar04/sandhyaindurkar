"use client";

import { useMemo, useState } from "react";

type DatasetKey = "steady" | "volatile";

const DATASETS: Record<DatasetKey, { label: string; values: number[] }> = {
  steady: {
    label: "Steady team",
    values: [47, 49, 50, 51, 53],
  },
  volatile: {
    label: "Volatile team",
    values: [22, 38, 50, 62, 78],
  },
};

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values: number[]): number {
  const avg = mean(values);
  return values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  return Math.sqrt(variance(values));
}

function formatMinutes(value: number): string {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} min`;
}

export default function VarianceSpreadExplorer() {
  const [dataset, setDataset] = useState<DatasetKey>("steady");
  const [spreadMultiplier, setSpreadMultiplier] = useState(1);

  const baseValues = DATASETS[dataset].values;
  const center = mean(baseValues);

  const values = useMemo(() => {
    return baseValues.map((value) => {
      const deviation = value - center;
      return Math.round(center + deviation * spreadMultiplier);
    });
  }, [baseValues, center, spreadMultiplier]);

  const meanValue = useMemo(() => mean(values), [values]);
  const stdDev = useMemo(() => standardDeviation(values), [values]);
  const range = useMemo(() => Math.max(...values) - Math.min(...values), [values]);

  const chartMax = Math.max(...values, meanValue + stdDev) * 1.1;
  const chartMin = Math.min(...values, meanValue - stdDev) * 0.9;
  const chartSpan = chartMax - chartMin;
  const chartHeight = 200;
  const barWidth = 44;
  const barGap = 16;
  const chartWidth = values.length * barWidth + (values.length - 1) * barGap + 48;

  const scaleY = (value: number) =>
    chartHeight - ((value - chartMin) / chartSpan) * chartHeight;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: same average, different spread
      </h3>
      <p className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">
        Two delivery teams can share the same mean time while feeling very different to customers.
        Increase spread to see variance rise even when the mean stays similar.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {(Object.keys(DATASETS) as DatasetKey[]).map((key) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              dataset === key
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            key={key}
            onClick={() => {
              setDataset(key);
              setSpreadMultiplier(1);
            }}
            type="button"
          >
            {DATASETS[key].label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="spread-slider">
          Spread multiplier: {spreadMultiplier.toFixed(1)}x
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="spread-slider"
          max={3}
          min={0.5}
          onChange={(event) => setSpreadMultiplier(Number(event.target.value))}
          step={0.1}
          type="range"
          value={spreadMultiplier}
        />
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          Widen or tighten how far values sit from the mean.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Mean
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatMinutes(meanValue)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Std. deviation
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatMinutes(stdDev)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Range
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatMinutes(range)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          aria-label="Bar chart of delivery times with mean and spread band"
          className="mx-auto"
          height={chartHeight + 56}
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight + 56}`}
          width={chartWidth}
        >
          <rect
            fill="var(--surface-strong)"
            height={scaleY(meanValue - stdDev) - scaleY(meanValue + stdDev)}
            width={chartWidth - 48}
            x="32"
            y={scaleY(meanValue + stdDev)}
          />
          <line
            stroke="#111111"
            strokeDasharray="6 4"
            strokeWidth="2"
            x1="24"
            x2={chartWidth - 24}
            y1={scaleY(meanValue)}
            y2={scaleY(meanValue)}
          />
          <text fill="#111111" fontSize="11" fontWeight="700" x="26" y={scaleY(meanValue) - 6}>
            Mean
          </text>

          {values.map((value, index) => {
            const x = 32 + index * (barWidth + barGap);
            const barHeight = ((value - chartMin) / chartSpan) * chartHeight;
            const y = chartHeight - barHeight;
            const isExtreme =
              value === Math.min(...values) || value === Math.max(...values);

            return (
              <g key={`${value}-${index}`}>
                <rect
                  fill={isExtreme ? "#111111" : "#d1d5db"}
                  height={barHeight}
                  rx="4"
                  width={barWidth}
                  x={x}
                  y={y}
                />
                <text
                  fill="#111111"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  x={x + barWidth / 2}
                  y={y - 6}
                >
                  {formatMinutes(value)}
                </text>
                <text
                  fill="#6b7280"
                  fontSize="12"
                  textAnchor="middle"
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                >
                  Day {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
        Mean is {formatMinutes(meanValue)}. Standard deviation is {formatMinutes(stdDev)}, so
        typical days often land within about {formatMinutes(stdDev)} of the average. Range is{" "}
        {formatMinutes(range)} from fastest to slowest — a simple view of total spread.
      </p>
    </section>
  );
}
