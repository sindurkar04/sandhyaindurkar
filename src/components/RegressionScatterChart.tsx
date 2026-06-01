"use client";

import type { WeekRow } from "@/lib/regression-example-data";
import { lineY } from "@/lib/regression-example-data";

type ChartInput = "adSpendK" | "emailSendK";

type Props = {
  weeks: WeekRow[];
  input: ChartInput;
  xLabel: string;
  line: { intercept: number; slope: number };
  plannedX?: number;
  plannedY?: number;
  outlierWeek?: WeekRow;
};

export default function RegressionScatterChart({
  weeks,
  input,
  xLabel,
  line,
  plannedX,
  plannedY,
  outlierWeek,
}: Props) {
  const width = 400;
  const height = 220;
  const padLeft = 44;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 44;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const xs = weeks.map((w) => w[input]);
  const ys = weeks.map((w) => w.orders);
  const allX = [...xs, ...(plannedX !== undefined ? [plannedX] : [])];
  const allY = [...ys, ...(plannedY !== undefined ? [plannedY] : [])];

  const minX = Math.min(...allX) * 0.92;
  const maxX = Math.max(...allX) * 1.08;
  const minY = Math.min(...allY) * 0.92;
  const maxY = Math.max(...allY) * 1.08;

  const scaleX = (x: number) => padLeft + ((x - minX) / (maxX - minX || 1)) * plotWidth;
  const scaleY = (y: number) =>
    padTop + plotHeight - ((y - minY) / (maxY - minY || 1)) * plotHeight;

  const lineStartX = minX;
  const lineEndX = maxX;
  const lineStartY = lineY(lineStartX, line);
  const lineEndY = lineY(lineEndX, line);

  const isOutlierPoint = (week: WeekRow) =>
    outlierWeek !== undefined && week.week === outlierWeek.week;

  return (
    <div className="overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
      <svg
        aria-label={`Scatter plot of orders vs ${xLabel} with regression line`}
        className="mx-auto block w-full max-w-[400px]"
        height={height}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <rect
          fill="#f3f4f6"
          height={plotHeight}
          width={plotWidth}
          x={padLeft}
          y={padTop}
        />
        <line
          stroke="#111111"
          strokeWidth="2"
          x1={scaleX(lineStartX)}
          x2={scaleX(lineEndX)}
          y1={scaleY(lineStartY)}
          y2={scaleY(lineEndY)}
        />
        {weeks.map((week) => {
          const x = week[input];
          const y = week.orders;
          const holdout = week.split === "holdout";
          const outlier = isOutlierPoint(week);

          if (outlier) {
            return (
              <polygon
                fill="#111111"
                key={week.week}
                points={`${scaleX(x)},${scaleY(y) - 7} ${scaleX(x) + 6},${scaleY(y)} ${scaleX(x)},${scaleY(y) + 7} ${scaleX(x) - 6},${scaleY(y)}`}
              />
            );
          }

          return (
            <circle
              cx={scaleX(x)}
              cy={scaleY(y)}
              fill={holdout ? "#ffffff" : "#111111"}
              key={week.week}
              r={holdout ? 6 : 5}
              stroke="#111111"
              strokeWidth={holdout ? 2 : 0}
            />
          );
        })}
        {plannedX !== undefined && plannedY !== undefined && (
          <>
            <line
              stroke="#9ca3af"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              x1={scaleX(plannedX)}
              x2={scaleX(plannedX)}
              y1={scaleY(plannedY)}
              y2={padTop + plotHeight}
            />
            <line
              stroke="#9ca3af"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              x1={padLeft}
              x2={scaleX(plannedX)}
              y1={scaleY(plannedY)}
              y2={scaleY(plannedY)}
            />
            <circle
              cx={scaleX(plannedX)}
              cy={scaleY(plannedY)}
              fill="#6b7280"
              r={7}
              stroke="#111111"
              strokeWidth="2"
            />
          </>
        )}
        <line
          stroke="#e5e7eb"
          strokeWidth="1"
          x1={padLeft}
          x2={width - padRight}
          y1={padTop + plotHeight}
          y2={padTop + plotHeight}
        />
        <text fill="#6b7280" fontSize="12" textAnchor="middle" x={width / 2} y={height - 8}>
          {xLabel}
        </text>
        <text
          fill="#6b7280"
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90, 14, ${height / 2})`}
          x={14}
          y={height / 2}
        >
          Weekly orders
        </text>
      </svg>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[color:var(--muted)]">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#111111]" />
          History (used to fit line)
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-[#111111] bg-white" />
          Reality-check weeks
        </li>
        {outlierWeek && (
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rotate-45 bg-[#111111]" />
            Outlier week
          </li>
        )}
        {plannedX !== undefined && (
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#6b7280]" />
            Your plan (slider)
          </li>
        )}
      </ul>
    </div>
  );
}
