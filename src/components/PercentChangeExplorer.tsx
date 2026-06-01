"use client";

import { useMemo, useState } from "react";

const DEFAULT_START = 100;
const DEFAULT_DROP = 50;
const DEFAULT_RECOVERY = 50;

function formatMoney(value: number): string {
  return `$${value.toFixed(value % 1 === 0 ? 0 : 1)}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

export default function PercentChangeExplorer() {
  const [startValue, setStartValue] = useState(DEFAULT_START);
  const [dropPercent, setDropPercent] = useState(DEFAULT_DROP);
  const [recoveryPercent, setRecoveryPercent] = useState(DEFAULT_RECOVERY);

  const afterDrop = useMemo(
    () => startValue * (1 - dropPercent / 100),
    [startValue, dropPercent],
  );

  const afterRecovery = useMemo(
    () => afterDrop * (1 + recoveryPercent / 100),
    [afterDrop, recoveryPercent],
  );

  const recoveryNeeded = useMemo(() => {
    if (afterDrop <= 0) {
      return 0;
    }
    return (startValue / afterDrop - 1) * 100;
  }, [afterDrop, startValue]);

  const netChangePercent = useMemo(() => {
    if (startValue <= 0) {
      return 0;
    }
    return ((afterRecovery - startValue) / startValue) * 100;
  }, [afterRecovery, startValue]);

  const bars = [
    { label: "Start", value: startValue, tone: "muted" as const },
    { label: "After drop", value: afterDrop, tone: "dark" as const },
    { label: `After +${recoveryPercent}%`, value: afterRecovery, tone: "muted" as const },
  ];

  const chartMax = Math.max(startValue, afterDrop, afterRecovery) * 1.15;
  const chartHeight = 200;
  const barWidth = 72;
  const barGap = 28;
  const chartWidth = bars.length * barWidth + (bars.length - 1) * barGap + 48;

  const scaleY = (value: number) => chartHeight - (value / chartMax) * chartHeight;

  function applyPreset(drop: number, recovery: number) {
    setDropPercent(drop);
    setRecoveryPercent(recovery);
  }

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: recovery after a drop
      </h3>
      <p className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">
        Start with a value, apply a drop, then apply a recovery. See why equal-looking percentages
        do not cancel out.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          className="rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-bold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-strong)]"
          onClick={() => applyPreset(50, 50)}
          type="button"
        >
          Classic trap: −50%, then +50%
        </button>
        <button
          className="rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-bold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-strong)]"
          onClick={() => applyPreset(20, 20)}
          type="button"
        >
          Mild: −20%, then +20%
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="start-value">
            Starting value: {formatMoney(startValue)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="start-value"
            max={500}
            min={50}
            onChange={(event) => setStartValue(Number(event.target.value))}
            step={10}
            type="range"
            value={startValue}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="drop-percent">
            Drop: {formatPercent(dropPercent)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="drop-percent"
            max={90}
            min={0}
            onChange={(event) => setDropPercent(Number(event.target.value))}
            step={1}
            type="range"
            value={dropPercent}
          />
        </div>
        <div>
          <label
            className="text-sm font-bold text-[color:var(--foreground)]"
            htmlFor="recovery-percent"
          >
            Recovery increase: {formatPercent(recoveryPercent)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="recovery-percent"
            max={100}
            min={0}
            onChange={(event) => setRecoveryPercent(Number(event.target.value))}
            step={1}
            type="range"
            value={recoveryPercent}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            After recovery
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatMoney(afterRecovery)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Net change
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatPercent(netChangePercent)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Recovery needed
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            +{formatPercent(recoveryNeeded)}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          aria-label="Bar chart showing value after a drop and partial recovery"
          className="mx-auto"
          height={chartHeight + 56}
          role="img"
          viewBox={`0 0 ${chartWidth} ${chartHeight + 56}`}
          width={chartWidth}
        >
          <line
            stroke="#9ca3af"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            x1="24"
            x2={chartWidth - 24}
            y1={scaleY(startValue)}
            y2={scaleY(startValue)}
          />
          <text fill="#6b7280" fontSize="12" fontWeight="700" x="26" y={scaleY(startValue) - 6}>
            Start level
          </text>

          {bars.map((bar, index) => {
            const x = 32 + index * (barWidth + barGap);
            const barHeight = (bar.value / chartMax) * chartHeight;
            const y = chartHeight - barHeight;
            const fill = bar.tone === "dark" ? "#111111" : "#d1d5db";

            return (
              <g key={bar.label}>
                <rect fill={fill} height={barHeight} rx="4" width={barWidth} x={x} y={y} />
                <text
                  fill="#111111"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  x={x + barWidth / 2}
                  y={y - 6}
                >
                  {formatMoney(bar.value)}
                </text>
                <text
                  fill="#6b7280"
                  fontSize="12"
                  textAnchor="middle"
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                >
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
        A {formatPercent(dropPercent)} drop from {formatMoney(startValue)} lands at{" "}
        {formatMoney(afterDrop)}. A {formatPercent(recoveryPercent)} increase from there only
        reaches {formatMoney(afterRecovery)} — not {formatMoney(startValue)}. To fully recover,
        you need a {formatPercent(recoveryNeeded)} increase from the bottom.
      </p>
    </section>
  );
}
