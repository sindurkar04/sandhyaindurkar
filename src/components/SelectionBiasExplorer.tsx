"use client";

import {
  SCENARIOS,
  formatCount,
  formatPercent,
  gapPoints,
  positiveCount,
  type ScenarioKey,
} from "@/lib/selection-bias-data";
import { useMemo, useState } from "react";

export default function SelectionBiasExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("feature_survey");
  const scenario = SCENARIOS[scenarioKey];

  const selectedPositive = useMemo(
    () => positiveCount(scenario.selectedPositiveRate, scenario.selectedSize),
    [scenario],
  );
  const fullPositive = useMemo(
    () => positiveCount(scenario.fullPositiveRate, scenario.fullSize),
    [scenario],
  );

  const gap = gapPoints(scenario.selectedPositiveRate, scenario.fullPositiveRate);

  const width = 400;
  const height = 200;
  const padX = 40;
  const barWidth = 100;
  const maxRate = Math.max(scenario.selectedPositiveRate, scenario.fullPositiveRate) * 1.15;
  const plotHeight = 120;
  const baseY = 150;

  const barHeight = (rate: number) => (rate / maxRate) * plotHeight;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: who is in the sample?
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Compare the group you measured with the full population. When the sample is self-selected,
        the headline rate can look much better than reality.
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

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Selected sample</p>
          <p className="mt-1 text-3xl font-black">{formatPercent(scenario.selectedPositiveRate)}</p>
          <p className="mt-1 text-xs opacity-80">n = {formatCount(scenario.selectedSize)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Full population
          </p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">
            {formatPercent(scenario.fullPositiveRate)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            n = {formatCount(scenario.fullSize)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Gap
          </p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">+{gap} pts</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">sample vs everyone</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="Positive rate in selected sample vs full population"
          className="mx-auto block w-full max-w-[400px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <rect
            fill="#111111"
            height={barHeight(scenario.selectedPositiveRate)}
            rx="4"
            width={barWidth}
            x={padX}
            y={baseY - barHeight(scenario.selectedPositiveRate)}
          />
          <text
            fill="#111111"
            fontSize="14"
            fontWeight="700"
            textAnchor="middle"
            x={padX + barWidth / 2}
            y={baseY - barHeight(scenario.selectedPositiveRate) - 8}
          >
            {formatPercent(scenario.selectedPositiveRate)}
          </text>
          <text
            fill="#6b7280"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
            x={padX + barWidth / 2}
            y={baseY + 20}
          >
            Selected
          </text>
          <rect
            fill="#d1d5db"
            height={barHeight(scenario.fullPositiveRate)}
            rx="4"
            stroke="#111111"
            strokeWidth="1.5"
            width={barWidth}
            x={width - padX - barWidth}
            y={baseY - barHeight(scenario.fullPositiveRate)}
          />
          <text
            fill="#111111"
            fontSize="14"
            fontWeight="700"
            textAnchor="middle"
            x={width - padX - barWidth / 2}
            y={baseY - barHeight(scenario.fullPositiveRate) - 8}
          >
            {formatPercent(scenario.fullPositiveRate)}
          </text>
          <text
            fill="#6b7280"
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
            x={width - padX - barWidth / 2}
            y={baseY + 20}
          >
            Everyone
          </text>
        </svg>
        <p className="mt-3 text-center text-xs text-[color:var(--muted)]">
          {selectedPositive.toLocaleString()} positive in sample vs{" "}
          {fullPositive.toLocaleString()} if the rate applied to all
        </p>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base text-[color:var(--muted)]">
        <span className="font-bold text-[color:var(--foreground)]">Who is missing:</span>{" "}
        {scenario.missingGroup}. {scenario.businessRead}
      </p>
    </section>
  );
}
