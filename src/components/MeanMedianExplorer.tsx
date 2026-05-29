"use client";

import { useMemo, useState } from "react";

const BASE_ORDERS = [12, 18, 20, 22];
const DEFAULT_OUTLIER = 128;
const OUTLIER_MIN = 22;
const OUTLIER_MAX = 250;

type HighlightMode = "mean" | "median" | "both";

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatMoney(value: number): string {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 1)}`;
}

export default function MeanMedianExplorer() {
  const [includeOutlier, setIncludeOutlier] = useState(true);
  const [outlierValue, setOutlierValue] = useState(DEFAULT_OUTLIER);
  const [highlight, setHighlight] = useState<HighlightMode>("both");

  const values = useMemo(
    () => (includeOutlier ? [...BASE_ORDERS, outlierValue] : [...BASE_ORDERS]),
    [includeOutlier, outlierValue],
  );

  const meanValue = useMemo(() => mean(values), [values]);
  const medianValue = useMemo(() => median(values), [values]);
  const gap = Math.abs(meanValue - medianValue);

  const chartMax = Math.max(...values, meanValue, medianValue) * 1.15;
  const chartHeight = 200;
  const barWidth = 44;
  const barGap = 16;
  const chartWidth = values.length * barWidth + (values.length - 1) * barGap + 48;

  const scaleY = (value: number) => chartHeight - (value / chartMax) * chartHeight;

  const showMean = highlight === "mean" || highlight === "both";
  const showMedian = highlight === "median" || highlight === "both";

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: customer orders
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
        Toggle the outlier and switch what you highlight. Watch how the mean moves more than the
        median.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
            includeOutlier
              ? "bg-black text-white"
              : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
          }`}
          onClick={() => setIncludeOutlier(true)}
          type="button"
        >
          Include outlier
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
            !includeOutlier
              ? "bg-black text-white"
              : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
          }`}
          onClick={() => setIncludeOutlier(false)}
          type="button"
        >
          Typical orders only
        </button>
      </div>

      {includeOutlier && (
        <div className="mt-5">
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="outlier-slider">
            Outlier order value: {formatMoney(outlierValue)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="outlier-slider"
            max={OUTLIER_MAX}
            min={OUTLIER_MIN}
            onChange={(event) => setOutlierValue(Number(event.target.value))}
            step={1}
            type="range"
            value={outlierValue}
          />
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Drag to change the large order ($22–$250).
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {(
          [
            { id: "both" as const, label: "Show both" },
            { id: "mean" as const, label: "Highlight mean" },
            { id: "median" as const, label: "Highlight median" },
          ] as const
        ).map((option) => (
          <button
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              highlight === option.id
                ? "bg-black text-white"
                : "border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            }`}
            key={option.id}
            onClick={() => setHighlight(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Mean
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatMoney(meanValue)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Median
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatMoney(medianValue)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Gap
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatMoney(gap)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          aria-label="Bar chart of order values with mean and median reference lines"
          className="mx-auto"
          height={chartHeight + 56}
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight + 56}`}
          width={chartWidth}
        >
          {showMean && (
            <g>
              <line
                stroke="#111111"
                strokeDasharray="6 4"
                strokeWidth="2"
                x1="24"
                x2={chartWidth - 24}
                y1={scaleY(meanValue)}
                y2={scaleY(meanValue)}
              />
              <text
                fill="#111111"
                fontSize="11"
                fontWeight="700"
                x={chartWidth - 20}
                y={scaleY(meanValue) - 6}
              >
                Mean
              </text>
            </g>
          )}
          {showMedian && (
            <g>
              <line
                stroke="#6b7280"
                strokeDasharray="4 4"
                strokeWidth="2"
                x1="24"
                x2={chartWidth - 24}
                y1={scaleY(medianValue)}
                y2={scaleY(medianValue)}
              />
              <text
                fill="#6b7280"
                fontSize="11"
                fontWeight="700"
                x={chartWidth - 20}
                y={scaleY(medianValue) - 6}
              >
                Median
              </text>
            </g>
          )}

          {values.map((value, index) => {
            const x = 32 + index * (barWidth + barGap);
            const barHeight = (value / chartMax) * chartHeight;
            const y = chartHeight - barHeight;
            const isOutlier = includeOutlier && index === values.length - 1;

            return (
              <g key={`${value}-${index}`}>
                <rect
                  fill={isOutlier ? "#111111" : "#d1d5db"}
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
                  {formatMoney(value)}
                </text>
                <text
                  fill="#6b7280"
                  fontSize="10"
                  textAnchor="middle"
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                >
                  {isOutlier ? "Outlier" : `Order ${index + 1}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
        {includeOutlier
          ? `With the outlier at ${formatMoney(outlierValue)}, the mean is ${formatMoney(meanValue)} but the median stays at ${formatMoney(medianValue)}.`
          : `Without the outlier, mean and median are both ${formatMoney(meanValue)} — the story looks simple until one extreme value returns.`}
      </p>
    </section>
  );
}
