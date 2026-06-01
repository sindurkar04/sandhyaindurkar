"use client";

import { useMemo, useState } from "react";

const TEAM_A = {
  name: "Team A",
  subtitle: "Predictable",
  values: [47, 49, 50, 51, 53],
  tone: "muted" as const,
};

const TEAM_B = {
  name: "Team B",
  subtitle: "Volatile",
  values: [22, 38, 50, 62, 78],
  tone: "volatile" as const,
};

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  const avg = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function formatMinutes(value: number): string {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)} min`;
}

type TeamChartProps = {
  team: typeof TEAM_A | typeof TEAM_B;
  chartMin: number;
  chartMax: number;
  highlighted: boolean;
};

function TeamChart({ team, chartMin, chartMax, highlighted }: TeamChartProps) {
  const meanValue = mean(team.values);
  const stdDev = standardDeviation(team.values);
  const range = Math.max(...team.values) - Math.min(...team.values);
  const chartSpan = chartMax - chartMin;
  const chartHeight = 160;
  const barWidth = 36;
  const barGap = 10;
  const chartWidth = team.values.length * barWidth + (team.values.length - 1) * barGap + 24;

  const scaleY = (value: number) =>
    chartHeight - ((value - chartMin) / chartSpan) * chartHeight;

  return (
    <div
      className={`rounded-lg border p-4 transition ${
        highlighted
          ? "border-black bg-[color:var(--surface-strong)]"
          : "border-[color:var(--border)] bg-[color:var(--surface)]"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[color:var(--foreground)]">{team.name}</p>
          <p className="text-xs text-[color:var(--muted)]">{team.subtitle}</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
          Mean {formatMinutes(meanValue)}
        </p>
      </div>

      <svg
        aria-label={`${team.name} delivery times chart`}
        className="mx-auto mt-4"
        height={chartHeight + 44}
        role="img"
        viewBox={`0 0 ${chartWidth} ${chartHeight + 44}`}
        width={chartWidth}
      >
        <line
          stroke="#9ca3af"
          strokeDasharray="4 4"
          strokeWidth="1.5"
          x1="8"
          x2={chartWidth - 8}
          y1={scaleY(meanValue)}
          y2={scaleY(meanValue)}
        />

        {team.values.map((value, index) => {
          const x = 12 + index * (barWidth + barGap);
          const barHeight = ((value - chartMin) / chartSpan) * chartHeight;
          const y = chartHeight - barHeight;
          const isExtreme =
            team.tone === "volatile" &&
            (value === Math.min(...team.values) || value === Math.max(...team.values));

          return (
            <g key={`${team.name}-${value}-${index}`}>
              <rect
                fill={isExtreme ? "#111111" : "#d1d5db"}
                height={barHeight}
                rx="3"
                width={barWidth}
                x={x}
                y={y}
              />
              <text
                fill="#111111"
                fontSize="12"
                fontWeight="700"
                textAnchor="middle"
                x={x + barWidth / 2}
                y={y - 5}
              >
                {value}
              </text>
              <text
                fill="#6b7280"
                fontSize="9"
                textAnchor="middle"
                x={x + barWidth / 2}
                y={chartHeight + 14}
              >
                D{index + 1}
              </text>
            </g>
          );
        })}
      </svg>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <dt className="font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Std dev
          </dt>
          <dd className="mt-1 font-bold text-[color:var(--foreground)]">
            {formatMinutes(stdDev)}
          </dd>
        </div>
        <div>
          <dt className="font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Range
          </dt>
          <dd className="mt-1 font-bold text-[color:var(--foreground)]">
            {formatMinutes(range)}
          </dd>
        </div>
        <div>
          <dt className="font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Days
          </dt>
          <dd className="mt-1 font-bold text-[color:var(--foreground)]">5</dd>
        </div>
      </dl>
    </div>
  );
}

export default function DeliveryPerformanceViz() {
  const [focus, setFocus] = useState<"both" | "a" | "b">("both");

  const chartMin = 15;
  const chartMax = 85;

  const comparison = useMemo(() => {
    const meanA = mean(TEAM_A.values);
    const meanB = mean(TEAM_B.values);
    const stdA = standardDeviation(TEAM_A.values);
    const stdB = standardDeviation(TEAM_B.values);
    return { meanA, meanB, stdA, stdB };
  }, []);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Delivery performance: same mean, different reliability
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
        Leadership sees matching averages. Customers and planners feel different levels of
        consistency. Compare five delivery days side by side.
      </p>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-center text-sm font-bold text-[color:var(--foreground)]">
        Both teams average {formatMinutes(comparison.meanA)} — spread is not the same
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {(
          [
            { id: "both" as const, label: "Show both" },
            { id: "a" as const, label: "Highlight Team A" },
            { id: "b" as const, label: "Highlight Team B" },
          ] as const
        ).map((option) => (
          <button
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              focus === option.id
                ? "bg-black text-white"
                : "border border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            }`}
            key={option.id}
            onClick={() => setFocus(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        className={`mt-5 grid gap-4 ${focus === "both" ? "md:grid-cols-2" : "grid-cols-1"}`}
      >
        {(focus === "both" || focus === "a") && (
          <TeamChart
            chartMax={chartMax}
            chartMin={chartMin}
            highlighted={focus === "a"}
            team={TEAM_A}
          />
        )}
        {(focus === "both" || focus === "b") && (
          <TeamChart
            chartMax={chartMax}
            chartMin={chartMin}
            highlighted={focus === "b"}
            team={TEAM_B}
          />
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
        Team A stays within about {formatMinutes(comparison.stdA)} of the mean (std. dev). Team B
        swings about {formatMinutes(comparison.stdB)} — more than{" "}
        {Math.round(comparison.stdB / comparison.stdA)}x wider — even though both averages are{" "}
        {formatMinutes(comparison.meanA)}.
      </p>
    </section>
  );
}
