"use client";

import {
  STAFFING_STORIES,
  staffingChartPoints,
  staffingMetrics,
  type StaffingStoryKey,
} from "@/lib/rates-vs-counts-data";
import { useState } from "react";

const width = 480;
const height = 200;
const padX = 40;
const padY = 28;
const plotH = height - padY * 2;

function buildScale(values: number[], padRatio = 0.12) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * padRatio || max * 0.05 || 1;
  return {
    y: (v: number) => padY + plotH - ((v - (min - pad)) / (max - min + pad * 2)) * plotH,
  };
}

export default function RatesVsCountsStaffingReview() {
  const [storyKey, setStoryKey] = useState<StaffingStoryKey>("volume_growth");
  const story = STAFFING_STORIES[storyKey];
  const metrics = staffingMetrics(story);
  const points = staffingChartPoints(story);
  const plotW = width - padX * 2;
  const xCenter = (i: number) => padX + (i / (points.length - 1)) * plotW;

  const totals = points.map((p) => p.total);
  const rates = points.map((p) => p.rate);
  const users = points.map((p) => p.users);

  const totalScale = buildScale(totals);
  const rateScale = buildScale(rates, 0.25);
  const userScale = buildScale(users);

  const linePath = (values: number[], scale: { y: (v: number) => number }) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"} ${xCenter(i)} ${scale.y(v)}`).join(" ");

  const agentsForVolume = Math.max(
    1,
    Math.round((metrics.currentTotal - metrics.priorTotal) / 2500),
  );

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-xl font-bold text-[color:var(--foreground)]">
        Staffing review: what moved, what to optimize
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Compare {story.prior.label} to {story.current.label}. Charts show total tickets, tickets
        per active user, and active users. The action panel tells you which lever to pull.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(STAFFING_STORIES) as StaffingStoryKey[]).map((key) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              storyKey === key
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            key={key}
            onClick={() => setStoryKey(key)}
            type="button"
          >
            {STAFFING_STORIES[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-base font-bold text-[color:var(--foreground)]">{story.headline}</p>
      <p className="mt-1 text-base text-[color:var(--muted)]">{story.leadershipAsk}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Total tickets
          </p>
          <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${width} ${height}`}>
            <path
              d={linePath(totals, totalScale)}
              fill="none"
              stroke="#111111"
              strokeWidth={2.5}
            />
            {points.map((p, i) => (
              <g key={p.label}>
                <circle
                  cx={xCenter(i)}
                  cy={totalScale.y(p.total)}
                  fill={i === points.length - 1 ? "#111111" : "#9ca3af"}
                  r={i === points.length - 1 ? 6 : 4}
                />
                {p.label !== "…" ? (
                  <text
                    fill="#6b7280"
                    fontFamily="system-ui, sans-serif"
                    fontSize={12}
                    fontWeight={700}
                    textAnchor="middle"
                    x={xCenter(i)}
                    y={height - 4}
                  >
                    {p.label}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
          <p className="mt-1.5 text-sm font-bold text-[color:var(--foreground)]">
            {metrics.countChange >= 0 ? "+" : ""}
            {metrics.countChange.toFixed(0)}% {story.prior.label} → {story.current.label}
          </p>
        </div>

        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Tickets per active user
          </p>
          <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${width} ${height}`}>
            <line
              stroke="#e5e7eb"
              strokeWidth={1}
              x1={padX}
              x2={width - padX}
              y1={rateScale.y(story.prior.rate)}
              y2={rateScale.y(story.prior.rate)}
            />
            <path d={linePath(rates, rateScale)} fill="none" stroke="#111111" strokeWidth={2.5} />
            {points.map((p, i) => (
              <g key={p.label}>
                <circle
                  cx={xCenter(i)}
                  cy={rateScale.y(p.rate)}
                  fill={i === points.length - 1 ? "#111111" : "#9ca3af"}
                  r={i === points.length - 1 ? 6 : 4}
                />
                {p.label !== "…" ? (
                  <text
                    fill="#6b7280"
                    fontFamily="system-ui, sans-serif"
                    fontSize={12}
                    fontWeight={700}
                    textAnchor="middle"
                    x={xCenter(i)}
                    y={height - 4}
                  >
                    {p.label}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
          <p className="mt-1.5 text-sm font-bold text-[color:var(--foreground)]">
            {story.prior.rate.toFixed(2)} → {story.current.rate.toFixed(2)} (
            {metrics.rateChange >= 0 ? "+" : ""}
            {metrics.rateChange.toFixed(1)}%)
          </p>
        </div>

        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Active users
          </p>
          <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${width} ${height}`}>
            <path
              d={linePath(users, userScale)}
              fill="none"
              stroke="#111111"
              strokeWidth={2.5}
            />
            {points.map((p, i) => (
              <g key={p.label}>
                <circle
                  cx={xCenter(i)}
                  cy={userScale.y(p.users)}
                  fill={i === points.length - 1 ? "#111111" : "#9ca3af"}
                  r={i === points.length - 1 ? 6 : 4}
                />
                {p.label !== "…" ? (
                  <text
                    fill="#6b7280"
                    fontFamily="system-ui, sans-serif"
                    fontSize={12}
                    fontWeight={700}
                    textAnchor="middle"
                    x={xCenter(i)}
                    y={height - 4}
                  >
                    {p.label}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
          <p className="mt-1.5 text-sm font-bold text-[color:var(--foreground)]">
            {metrics.userChange >= 0 ? "+" : ""}
            {metrics.userChange.toFixed(0)}% {story.prior.label} → {story.current.label}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-sm font-bold uppercase tracking-[0.08em] opacity-80">Q4 total tickets</p>
          <p className="mt-1 text-2xl font-black">
            {Math.round(metrics.currentTotal).toLocaleString()}
          </p>
          <p className="mt-1.5 text-sm opacity-80">Record headline number</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Rate per user
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {story.current.rate.toFixed(2)}
          </p>
          <p className="mt-1.5 text-sm text-[color:var(--muted)]">Intensity signal</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Volume-based hires
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">~{agentsForVolume}</p>
          <p className="mt-1.5 text-sm text-[color:var(--muted)]">
            Rough agents for ticket delta (not a budget)
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
            Leadership ask
          </p>
          <p className="mt-1 text-xl font-black text-[color:var(--foreground)]">6 agents</p>
          <p className="mt-1.5 text-sm text-[color:var(--muted)]">Compare to volume math above</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--foreground)]">
            Optimize (move here)
          </p>
          <ul className="mt-2 space-y-2 text-base leading-relaxed text-[color:var(--muted)]">
            {story.optimize.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--foreground)]">
            Hold (do not over-react)
          </p>
          <ul className="mt-2 space-y-2 text-base leading-relaxed text-[color:var(--muted)]">
            {story.hold.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--foreground)]">
            Escalate if
          </p>
          <ul className="mt-2 space-y-2 text-base leading-relaxed text-[color:var(--muted)]">
            {story.escalateIf.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
