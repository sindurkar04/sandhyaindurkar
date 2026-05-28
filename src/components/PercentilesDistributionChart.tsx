"use client";

import type { Bin } from "@/lib/percentiles-data";

type ChartProps = {
  bins: Bin[];
  maxCount: number;
  chartMax: number;
  percentileValue: number;
  percentileRank: number;
  meanValue: number;
  medianValue: number;
  q1: number;
  q3: number;
  target: number;
  unit: string;
};

export default function PercentilesDistributionChart({
  bins,
  maxCount,
  chartMax,
  percentileValue,
  percentileRank,
  meanValue,
  medianValue,
  q1,
  q3,
  target,
  unit,
}: ChartProps) {
  const width = 400;
  const height = 200;
  const padLeft = 36;
  const padRight = 16;
  const padTop = 20;
  const padBottom = 44;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const scaleX = (value: number) => padLeft + (value / chartMax) * plotWidth;

  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
      <svg
        aria-label="Histogram with percentile and quartile markers"
        className="mx-auto block w-full max-w-[400px]"
        height={height}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <rect
          fill="#ebe6de"
          height={plotHeight}
          width={scaleX(q3) - scaleX(q1)}
          x={scaleX(q1)}
          y={padTop}
        />
        <text fill="#6b7280" fontSize="9" x={scaleX(q1)} y={padTop - 6}>
          Q1 to Q3
        </text>

        {bins.map((bin) => {
          const x = scaleX(bin.start) + 1;
          const barWidth = Math.max(scaleX(bin.end) - scaleX(bin.start) - 2, 4);
          const barHeight = (bin.count / maxCount) * plotHeight;
          const y = padTop + plotHeight - barHeight;
          const belowPercentile = bin.midpoint <= percentileValue;

          return (
            <rect
              fill={belowPercentile ? "#111111" : "#d1d5db"}
              height={barHeight}
              key={`${bin.start}-${bin.end}`}
              rx="2"
              width={barWidth}
              x={x}
              y={y}
            />
          );
        })}

        <line
          stroke="#9ca3af"
          strokeDasharray="4 4"
          strokeWidth="1.5"
          x1={scaleX(target)}
          x2={scaleX(target)}
          y1={padTop}
          y2={padTop + plotHeight}
        />
        <line
          stroke="#6b7280"
          strokeDasharray="3 3"
          strokeWidth="1.5"
          x1={scaleX(medianValue)}
          x2={scaleX(medianValue)}
          y1={padTop}
          y2={padTop + plotHeight}
        />
        <line
          stroke="#9ca3af"
          strokeDasharray="5 4"
          strokeWidth="1.5"
          x1={scaleX(meanValue)}
          x2={scaleX(meanValue)}
          y1={padTop}
          y2={padTop + plotHeight}
        />
        <line
          stroke="#111111"
          strokeWidth="2"
          x1={scaleX(percentileValue)}
          x2={scaleX(percentileValue)}
          y1={padTop}
          y2={padTop + plotHeight}
        />

        <text fill="#6b7280" fontSize="9" x={scaleX(target) + 2} y={padTop + 12}>
          {unit} target
        </text>
        <text
          fill="#111111"
          fontSize="9"
          fontWeight="700"
          x={scaleX(percentileValue) + 2}
          y={padTop + 24}
        >
          P{percentileRank}
        </text>

        <line
          stroke="#e5e7eb"
          strokeWidth="1"
          x1={padLeft}
          x2={width - padRight}
          y1={padTop + plotHeight}
          y2={padTop + plotHeight}
        />
        <text fill="#6b7280" fontSize="10" textAnchor="middle" x={width / 2} y={height - 8}>
          Value ({unit})
        </text>
      </svg>

      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[color:var(--muted)]">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-sm bg-[#111111]" />
          At or below P{percentileRank}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-sm bg-[#d1d5db]" />
          Above P{percentileRank}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t-2 border-[#111111]" />
          Selected percentile
        </li>
      </ul>
    </div>
  );
}
