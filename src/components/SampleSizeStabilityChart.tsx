"use client";

import type { StabilityPoint } from "@/lib/sample-size-data";
import { formatPercent } from "@/lib/sample-size-data";

type Props = {
  points: StabilityPoint[];
  currentN: number;
  currentValue: number;
  yLabel: string;
  valueFormatter: (value: number) => string;
  referenceValue?: number;
  referenceLabel?: string;
  controlRate?: number;
  variantRate?: number;
};

export default function SampleSizeStabilityChart({
  points,
  currentN,
  currentValue,
  yLabel,
  valueFormatter,
  referenceValue,
  referenceLabel,
  controlRate,
  variantRate,
}: Props) {
  const width = 400;
  const height = 188;
  const padLeft = 44;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 36;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const yValues = points.map((point) => point.value);
  const allY =
    referenceValue === undefined ? yValues : [...yValues, referenceValue, currentValue];
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const yPad = (maxY - minY) * 0.15 || 1;

  const minN = points[0]?.n ?? currentN;
  const maxN = points[points.length - 1]?.n ?? currentN;

  const scaleX = (n: number) => padLeft + ((n - minN) / (maxN - minN || 1)) * plotWidth;
  const scaleY = (value: number) =>
    padTop + plotHeight - ((value - minY + yPad) / (maxY - minY + yPad * 2 || 1)) * plotHeight;

  const polyline = points.map((point) => `${scaleX(point.n)},${scaleY(point.value)}`).join(" ");

  const showAbBars =
    controlRate !== undefined && variantRate !== undefined;

  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
      {showAbBars && (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
              Control
            </p>
            <p className="mt-1 text-xl font-black text-[color:var(--foreground)]">
              {formatPercent(controlRate)}
            </p>
          </div>
          <div className="rounded-lg border border-black bg-black px-3 py-2 text-center text-white">
            <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Variant</p>
            <p className="mt-1 text-xl font-black">{formatPercent(variantRate)}</p>
          </div>
        </div>
      )}

      <svg
        aria-label="How the metric changes as sample size grows"
        className="mx-auto block w-full max-w-[400px]"
        height={height}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <line
          stroke="#e5e7eb"
          strokeWidth="1"
          x1={padLeft}
          x2={width - padRight}
          y1={padTop + plotHeight}
          y2={padTop + plotHeight}
        />
        {referenceValue !== undefined && (
          <>
            <line
              stroke="#9ca3af"
              strokeDasharray="5 4"
              strokeWidth="1.5"
              x1={padLeft}
              x2={width - padRight}
              y1={scaleY(referenceValue)}
              y2={scaleY(referenceValue)}
            />
            <text fill="#6b7280" fontSize="9" x={padLeft + 2} y={scaleY(referenceValue) - 4}>
              {referenceLabel}
            </text>
          </>
        )}
        <polyline fill="none" points={polyline} stroke="#111111" strokeWidth="2" />
        <circle cx={scaleX(currentN)} cy={scaleY(currentValue)} fill="#111111" r="5" />
        <text fill="#6b7280" fontSize="12" textAnchor="middle" x={width / 2} y={height - 6}>
          Sample size (n)
        </text>
        <text
          fill="#6b7280"
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90, 12, ${height / 2})`}
          x={12}
          y={height / 2}
        >
          {yLabel}
        </text>
      </svg>
    </div>
  );
}
