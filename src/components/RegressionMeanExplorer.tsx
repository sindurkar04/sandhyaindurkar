"use client";

import {
  SCENARIOS,
  buildPerformers,
  formatScore,
  groupAverage,
  overallAverage,
  type ScenarioKey,
} from "@/lib/regression-mean-data";
import { useMemo, useState } from "react";

type GroupKey = "top" | "middle" | "bottom";

const GROUPS: { key: GroupKey; label: string }[] = [
  { key: "top", label: "Top performers (week 1)" },
  { key: "middle", label: "Middle group" },
  { key: "bottom", label: "Bottom performers (week 1)" },
];

export default function RegressionMeanExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("sales");
  const scenario = SCENARIOS[scenarioKey];
  const performers = useMemo(() => buildPerformers(scenarioKey), [scenarioKey]);

  const chartMax = useMemo(() => {
    const values = performers.flatMap((row) => [row.week1, row.week2]);
    return Math.max(...values, scenario.populationMean) * 1.2;
  }, [performers, scenario.populationMean]);

  const width = 400;
  const height = 220;
  const padLeft = 44;
  const padRight = 16;
  const padTop = 24;
  const padBottom = 52;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const groupWidth = plotWidth / GROUPS.length;
  const barWidth = 28;
  const gap = 8;

  const scaleY = (value: number) =>
    padTop + plotHeight - (value / chartMax) * plotHeight;

  const meanLine = overallAverage(performers, "week2");

  const topDrop =
    groupAverage(performers, "top", "week1") - groupAverage(performers, "top", "week2");
  const bottomGain =
    groupAverage(performers, "bottom", "week2") - groupAverage(performers, "bottom", "week1");

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: star performers next period
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Week 1 identifies the top and bottom five. Week 2 is a fresh draw with the same underlying
        skill. Watch extremes move toward the team average without any coaching change.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              scenarioKey === key
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            key={key}
            onClick={() => setScenarioKey(key)}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-[color:var(--muted)]">{scenario.context}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Top group drop</p>
          <p className="mt-1 text-2xl font-black tabular-nums">
            {topDrop >= 0 ? "−" : "+"}
            {formatScore(Math.abs(topDrop), 1)} {scenario.unit}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Team average (week 2)
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatScore(meanLine, 1)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Bottom group gain
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            +{formatScore(bottomGain, 1)} {scenario.unit}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
        <svg
          aria-label="Week 1 vs week 2 scores by performance group"
          className="mx-auto block w-full max-w-[400px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <line
            stroke="#9ca3af"
            strokeDasharray="5 4"
            strokeWidth="1.5"
            x1={padLeft}
            x2={width - padRight}
            y1={scaleY(meanLine)}
            y2={scaleY(meanLine)}
          />
          {GROUPS.map((group, index) => {
            const cx = padLeft + groupWidth * index + groupWidth / 2;
            const w1 = groupAverage(performers, group.key, "week1");
            const w2 = groupAverage(performers, group.key, "week2");
            const x1 = cx - barWidth - gap / 2;
            const x2 = cx + gap / 2;
            const h1 = (w1 / chartMax) * plotHeight;
            const h2 = (w2 / chartMax) * plotHeight;
            return (
              <g key={group.key}>
                <rect
                  fill="#111111"
                  height={h1}
                  rx="3"
                  width={barWidth}
                  x={x1}
                  y={padTop + plotHeight - h1}
                />
                <rect
                  fill="#d1d5db"
                  height={h2}
                  rx="3"
                  stroke="#111111"
                  strokeWidth="1"
                  width={barWidth}
                  x={x2}
                  y={padTop + plotHeight - h2}
                />
                <text
                  fill="#6b7280"
                  fontSize="9"
                  textAnchor="middle"
                  x={cx}
                  y={height - 8}
                >
                  {group.key === "top" ? "Top" : group.key === "bottom" ? "Bottom" : "Middle"}
                </text>
              </g>
            );
          })}
          <text fill="#6b7280" fontSize="12" x={padLeft} y={padTop - 8}>
            Week 1 (black) vs week 2 (gray)
          </text>
        </svg>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base text-[color:var(--muted)]">
        Top week-1 scores often fall in week 2. Bottom scores often rise. That is regression to the
        mean, not proof that praise failed or punishment worked.
      </p>
    </section>
  );
}
