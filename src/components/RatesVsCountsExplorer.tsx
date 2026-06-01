"use client";

import {
  SCENARIOS,
  formatRate,
  formatTotal,
  quarterChange,
  ratesVsCountsRead,
  totalEvents,
  type ScenarioKey,
} from "@/lib/rates-vs-counts-data";
import { useState } from "react";

export default function RatesVsCountsExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("support_tickets");
  const scenario = SCENARIOS[scenarioKey];
  const [quarterIndex, setQuarterIndex] = useState(scenario.defaultQuarterIndex);

  const current = scenario.quarters[quarterIndex];
  const prior = scenario.quarters[quarterIndex - 1];
  const currentTotal = totalEvents(current.users, current.eventsPerUser);
  const priorTotal = prior ? totalEvents(prior.users, prior.eventsPerUser) : currentTotal;

  const countChange = prior ? quarterChange(currentTotal, priorTotal) : 0;
  const rateChange = prior ? quarterChange(current.eventsPerUser, prior.eventsPerUser) : 0;
  const readout = ratesVsCountsRead(scenario, quarterIndex, countChange, rateChange);

  const totals = scenario.quarters.map((q) => totalEvents(q.users, q.eventsPerUser));
  const rates = scenario.quarters.map((q) => q.eventsPerUser);
  const maxTotal = Math.max(...totals);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const ratePad = (maxRate - minRate) * 0.15 || 0.01;

  const width = 480;
  const height = 200;
  const padX = 36;
  const padY = 24;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;
  const barGap = plotW / scenario.quarters.length;
  const xCenter = (i: number) => padX + barGap * i + barGap / 2;
  const yRate = (v: number) =>
    padY + plotH - ((v - (minRate - ratePad)) / (maxRate - minRate + ratePad * 2)) * plotH;

  const minTotal = Math.min(...totals);
  const totalPad = (maxTotal - minTotal) * 0.08 || maxTotal * 0.05;
  const yTotal = (v: number) =>
    padY + plotH - ((v - (minTotal - totalPad)) / (maxTotal - minTotal + totalPad * 2)) * plotH;

  const totalPath = scenario.quarters
    .map((q, i) => {
      const total = totalEvents(q.users, q.eventsPerUser);
      return `${i === 0 ? "M" : "L"} ${xCenter(i)} ${yTotal(total)}`;
    })
    .join(" ");

  const ratePath = scenario.quarters
    .map((q, i) => `${i === 0 ? "M" : "L"} ${xCenter(i)} ${yRate(q.eventsPerUser)}`)
    .join(" ");

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: total count up, rate per user flat
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Left: total volume line rising quarter over quarter. Right: per-user rate line stays flat.
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
            onClick={() => {
              setScenarioKey(key);
              setQuarterIndex(SCENARIOS[key].defaultQuarterIndex);
            }}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {scenario.quarters.map((q, index) => (
          <button
            className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
              quarterIndex === index
                ? "bg-black text-white"
                : "border border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            key={q.label}
            onClick={() => setQuarterIndex(index)}
            type="button"
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            {scenario.countLabel}
          </p>
          <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${width} ${height}`}>
            <path d={totalPath} fill="none" stroke="#111111" strokeWidth={2.5} />
            {scenario.quarters.map((q, index) => {
              const total = totalEvents(q.users, q.eventsPerUser);
              const isFocus = index === quarterIndex;
              return (
                <g key={q.label}>
                  <circle
                    cx={xCenter(index)}
                    cy={yTotal(total)}
                    fill={isFocus ? "#111111" : "#9ca3af"}
                    r={isFocus ? 6 : 4}
                  />
                  <text
                    fill="#6b7280"
                    fontFamily="system-ui, sans-serif"
                    fontSize={12}
                    fontWeight={700}
                    textAnchor="middle"
                    x={xCenter(index)}
                    y={height - 4}
                  >
                    {q.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            {scenario.rateLabel}
          </p>
          <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${width} ${height}`}>
            <line
              stroke="#e5e7eb"
              strokeWidth={1}
              x1={padX}
              x2={width - padX}
              y1={yRate((minRate + maxRate) / 2)}
              y2={yRate((minRate + maxRate) / 2)}
            />
            <path d={ratePath} fill="none" stroke="#111111" strokeWidth={2.5} />
            {scenario.quarters.map((q, index) => {
              const isFocus = index === quarterIndex;
              return (
                <g key={q.label}>
                  <circle
                    cx={xCenter(index)}
                    cy={yRate(q.eventsPerUser)}
                    fill={isFocus ? "#111111" : "#9ca3af"}
                    r={isFocus ? 6 : 4}
                  />
                  <text
                    fill="#6b7280"
                    fontFamily="system-ui, sans-serif"
                    fontSize={12}
                    fontWeight={700}
                    textAnchor="middle"
                    x={xCenter(index)}
                    y={height - 4}
                  >
                    {q.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">
            {scenario.countLabel}
          </p>
          <p className="mt-1 text-2xl font-black">{formatTotal(currentTotal, scenario)}</p>
          {prior ? (
            <p className="mt-1 text-xs opacity-80">
              {countChange >= 0 ? "+" : ""}
              {countChange.toFixed(0)}% vs prior quarter
            </p>
          ) : null}
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            {scenario.rateLabel}
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatRate(current.eventsPerUser, scenario)}
          </p>
          {prior ? (
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              {rateChange >= 0 ? "+" : ""}
              {rateChange.toFixed(1)}% vs prior quarter
            </p>
          ) : null}
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Active users / transactions
          </p>
          <p className="mt-1 text-xl font-black text-[color:var(--foreground)]">
            {current.users.toLocaleString()}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
