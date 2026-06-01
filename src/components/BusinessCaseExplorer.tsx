"use client";

import RatesVsCountsStaffingReview from "@/components/RatesVsCountsStaffingReview";
import {
  CHART_HEIGHT,
  CHART_LABEL_SIZE,
  CHART_WIDTH,
  barWidth,
  buildYScale,
  getApplicationCase,
  linePath,
  xCenter,
} from "@/lib/application-case";
import type { ApplicationCaseState, ApplicationChart } from "@/lib/application-case";
import {
  CHART_LABEL,
  CHART_LINE,
  CHART_LINE_MUTED,
  CHART_REFERENCE,
  chartColor,
  chartColorAlpha,
} from "@/lib/chart-colors";
import { useMemo, useState } from "react";

type BusinessCaseExplorerProps = {
  slug: string;
};

function defaultState(slug: string): ApplicationCaseState {
  const config = getApplicationCase(slug);
  if (!config) return {};
  const state: ApplicationCaseState = {};
  for (const slider of config.sliders) {
    state[slider.id] = slider.default;
  }
  return state;
}

function ChartPanel({ chart }: { chart: ApplicationChart }) {
  const kind = chart.kind ?? "line";
  const includeZero = kind === "bar";
  const scale = buildYScale(
    chart.values,
    kind === "bar" ? 0.12 : chart.referenceLine !== undefined ? 0.15 : 0.12,
    includeZero,
  );
  const bw = barWidth(chart.values.length);
  const zeroY = scale.zeroY();

  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
      <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">
        {chart.title}
      </p>
      <svg aria-hidden="true" className="mt-2 w-full" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}` } preserveAspectRatio="none">
        {chart.referenceLine !== undefined ? (
          <line
            stroke={CHART_REFERENCE}
            strokeDasharray="4 4"
            strokeWidth={1}
            x1={36}
            x2={CHART_WIDTH - 36}
            y1={scale.y(chart.referenceLine)}
            y2={scale.y(chart.referenceLine)}
          />
        ) : null}

        {kind === "line" ? (
          <>
            <path d={linePath(chart.values, scale)} fill="none" stroke={CHART_LINE} strokeWidth={2.5} />
            {chart.values.map((value, index) => (
              <g key={`${chart.id}-${chart.labels[index] ?? index}`}>
                <circle
                  cx={xCenter(index, chart.values.length)}
                  cy={scale.y(value)}
                  fill={index === chart.values.length - 1 ? CHART_LINE : CHART_LINE_MUTED}
                  r={index === chart.values.length - 1 ? 5 : 4}
                />
                {chart.labels[index] ? (
                  <text
                    fill={CHART_LABEL}
                    fontFamily="system-ui, sans-serif"
                    fontSize={CHART_LABEL_SIZE}
                    fontWeight={700}
                    textAnchor="middle"
                    x={xCenter(index, chart.values.length)}
                    y={CHART_HEIGHT - 4}
                  >
                    {chart.labels[index]}
                  </text>
                ) : null}
              </g>
            ))}
          </>
        ) : (
          chart.values.map((value, index) => {
            const cx = xCenter(index, chart.values.length);
            const yVal = scale.y(value);
            const yTop = Math.min(yVal, zeroY);
            const h = Math.max(Math.abs(yVal - zeroY), 2);
            const isLast = index === chart.values.length - 1;
            const base = chartColor(index);
            const color = isLast ? base : chartColorAlpha(base, 0.45);
            return (
              <g key={`${chart.id}-${chart.labels[index] ?? index}`}>
                <rect
                  fill={color}
                  height={h}
                  rx={3}
                  width={bw}
                  x={cx - bw / 2}
                  y={yTop}
                />
                {chart.labels[index] ? (
                  <text
                    fill={CHART_LABEL}
                    fontFamily="system-ui, sans-serif"
                    fontSize={CHART_LABEL_SIZE}
                    fontWeight={700}
                    textAnchor="middle"
                    x={cx}
                    y={CHART_HEIGHT - 4}
                  >
                    {chart.labels[index]}
                  </text>
                ) : null}
              </g>
            );
          })
        )}
      </svg>
      {chart.changeLabel ? (
        <p className="mt-1.5 text-sm font-bold text-[color:var(--foreground)]">{chart.changeLabel}</p>
      ) : null}
      {chart.valueFormat && chart.values.length <= 4 ? (
        <p className="mt-1.5 text-sm text-[color:var(--muted)]">
          {chart.labels
            .map((label, i) => `${label}: ${chart.valueFormat!(chart.values[i])}`)
            .join(" · ")}
        </p>
      ) : null}
    </div>
  );
}

function GenericBusinessCaseExplorer({ slug }: BusinessCaseExplorerProps) {
  const config = getApplicationCase(slug);
  const [state, setState] = useState<ApplicationCaseState>(() => defaultState(slug));

  const result = useMemo(() => {
    if (!config) return null;
    return config.compute(state);
  }, [config, state]);

  if (!config || !result) {
    return null;
  }

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-xl font-bold text-[color:var(--foreground)]">{config.title}</h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        {config.intro}
      </p>

      {config.sliders.length > 0 ? (
        <div className="mt-5 space-y-4">
          {config.sliders.map((slider) => (
            <div
              className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4"
              key={slider.id}
            >
              <label
                className="text-sm font-bold text-[color:var(--foreground)]"
                htmlFor={`${slug}-${slider.id}`}
              >
                {slider.label}:{" "}
                {slider.format
                  ? slider.format(state[slider.id] ?? slider.default)
                  : state[slider.id] ?? slider.default}
              </label>
              {(slider.lowLabel || slider.highLabel) && (
                <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
                  <span>{slider.lowLabel}</span>
                  <span>{slider.highLabel}</span>
                </div>
              )}
              <input
                className="mt-2 w-full accent-black"
                id={`${slug}-${slider.id}`}
                max={slider.max}
                min={slider.min}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    [slider.id]: Number(e.target.value),
                  }))
                }
                step={slider.step}
                type="range"
                value={state[slider.id] ?? slider.default}
              />
            </div>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-base font-bold text-[color:var(--foreground)]">{result.headline}</p>

      {result.charts.length > 0 ? (
        <div
          className={`mt-5 grid gap-4 ${
            result.charts.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {result.charts.map((chart) => (
            <ChartPanel chart={chart} key={chart.id} />
          ))}
        </div>
      ) : null}

      {result.stats.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.stats.map((stat) => (
            <div
              className={`rounded-lg border px-4 py-3 ${
                stat.emphasis
                  ? "border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--foreground)]"
                  : "border-[color:var(--border)] bg-[color:var(--surface)]"
              }`}
              key={stat.label}
            >
              <p
                className={`text-sm font-bold uppercase tracking-[0.08em] ${
                  stat.emphasis ? "text-[color:var(--foreground)]" : "text-[color:var(--muted)]"
                }`}
              >
                {stat.label}
              </p>
              <p
                className={`mt-1 text-2xl font-black ${
                  stat.emphasis ? "" : "text-[color:var(--foreground)]"
                }`}
              >
                {stat.value}
              </p>
              {stat.note ? (
                <p
                  className={`mt-1 text-sm ${stat.emphasis ? "text-[color:var(--muted)]" : "text-[color:var(--muted)]"}`}
                >
                  {stat.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {(result.actions.optimize.length > 0 ||
        result.actions.hold.length > 0 ||
        result.actions.escalateIf.length > 0) && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--foreground)]">
              Optimize (move here)
            </p>
            <ul className="mt-2 space-y-2 text-base leading-relaxed text-[color:var(--muted)]">
              {result.actions.optimize.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--foreground)]">
              Hold (do not over-react)
            </p>
            <ul className="mt-2 space-y-2 text-base leading-relaxed text-[color:var(--muted)]">
              {result.actions.hold.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-[#fecaca] bg-[#fee2e2] px-4 py-3">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#991b1b]">
              Escalate if
            </p>
            <ul className="mt-2 space-y-2 text-base leading-relaxed text-[#7f1d1d]">
              {result.actions.escalateIf.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {result.readout}
      </p>
    </section>
  );
}

export default function BusinessCaseExplorer({ slug }: BusinessCaseExplorerProps) {
  if (slug === "rates-vs-counts-real-decisions") {
    return <RatesVsCountsStaffingReview />;
  }

  return <GenericBusinessCaseExplorer slug={slug} />;
}
