"use client";

import {
  SCENARIOS,
  formatChange,
  formatMetric,
  percentChange,
  seasonalityRead,
  type ScenarioKey,
} from "@/lib/seasonality-data";
import { useState } from "react";

export default function SeasonalityExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("retail_holiday");
  const scenario = SCENARIOS[scenarioKey];
  const focus = scenario.months[scenario.focusMonthIndex];
  const priorMonth = scenario.months[scenario.focusMonthIndex - 1];
  const momChange = priorMonth
    ? percentChange(focus.value, priorMonth.value)
    : 0;
  const yoyChange = percentChange(focus.value, focus.priorYear);
  const readout = seasonalityRead(scenario, momChange, yoyChange);

  const width = 440;
  const height = 220;
  const padX = 40;
  const padY = 28;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const values = scenario.months.map((m) => m.value);
  const yMin = Math.min(...values) * 0.92;
  const yMax = Math.max(...values) * 1.08;
  const xScale = (i: number) => padX + (i / 11) * plotW;
  const yScale = (v: number) => padY + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const linePath = scenario.months
    .map((m, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(m.value)}`)
    .join(" ");
  const priorPath = scenario.months
    .map((m, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(m.priorYear)}`)
    .join(" ");

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: same month, two baselines, two stories
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Solid line is this year. Dashed is same month last year. Compare MoM and YoY before you
        declare a win or a crisis.
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

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
        <svg aria-hidden="true" className="w-full" viewBox={`0 0 ${width} ${height}`}>
          <path d={priorPath} fill="none" stroke="#9ca3af" strokeDasharray="6 4" strokeWidth={2} />
          <path d={linePath} fill="none" stroke="#111111" strokeWidth={2.5} />
          {scenario.months.map((m, i) => (
            <circle cx={xScale(i)} cy={yScale(m.value)} fill="#111111" key={m.label} r={4} />
          ))}
          <circle
            cx={xScale(scenario.focusMonthIndex)}
            cy={yScale(focus.value)}
            fill="none"
            r={8}
            stroke="#111111"
            strokeWidth={2}
          />
        </svg>
        <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-[color:var(--muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-0.5 w-6 bg-black" /> This year
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-0.5 w-6 border-t-2 border-dashed border-[#9ca3af]" />{" "}
            Same month last year
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Focus month
          </p>
          <p className="mt-1 text-xl font-black text-[color:var(--foreground)]">
            {focus.label}: {formatMetric(focus.value, scenario.metricLabel)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            vs last month
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {priorMonth ? formatChange(momChange) : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">vs last year</p>
          <p className="mt-1 text-2xl font-black">{formatChange(yoyChange)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
