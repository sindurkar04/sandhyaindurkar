"use client";

import {
  SCENARIOS,
  formatPercent,
  ratesFromStrictness,
  strictnessLabel,
  tradeoffVerdict,
  type ScenarioKey,
} from "@/lib/false-alarm-data";
import { useMemo, useState } from "react";

export default function FalseAlarmExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("checkout_test");
  const scenario = SCENARIOS[scenarioKey];
  const [strictness, setStrictness] = useState(scenario.defaultStrictness);

  const { falseAlarm, missedWin } = useMemo(
    () => ratesFromStrictness(strictness),
    [strictness],
  );
  const readout = useMemo(
    () => tradeoffVerdict(falseAlarm, missedWin, scenario),
    [falseAlarm, missedWin, scenario],
  );

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setStrictness(SCENARIOS[key].defaultStrictness);
  }

  const width = 420;
  const height = 180;
  const padX = 48;
  const barWidth = 120;
  const plotHeight = 100;
  const baseY = 130;
  const maxRate = 75;
  const barHeight = (rate: number) => (rate / maxRate) * plotHeight;

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: balance false alarms and missed wins
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        Drag the decision bar from loose to strict. A tighter bar cuts false alarms but raises
        missed wins. The counts below update as you move the slider.
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
            onClick={() => selectScenario(key)}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="strictness-slider">
            Decision bar: {strictnessLabel(strictness)} ({strictness})
          </label>
          <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
            <span>Loose (ship more)</span>
            <span>Strict (wait more)</span>
          </div>
          <input
            className="mt-2 w-full accent-black"
            id="strictness-slider"
            max={100}
            min={0}
            onChange={(e) => setStrictness(Number(e.target.value))}
            step={1}
            type="range"
            value={strictness}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-black bg-black px-4 py-3 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">False alarm rate</p>
          <p className="mt-1 text-3xl font-black">{formatPercent(falseAlarm)}</p>
          <p className="mt-1 text-sm opacity-90">
            ~{Math.round(falseAlarm)} of 100 null tests would ship
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Missed win rate
          </p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">
            {formatPercent(missedWin)}
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            ~{Math.round(missedWin)} of 100 real wins would never ship
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="False alarm vs missed win rates"
          className="mx-auto block w-full max-w-[420px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <text fill="#6b7280" fontSize="11" fontWeight="700" x={padX} y="36">
            False alarms
          </text>
          <rect
            fill="#111111"
            height={barHeight(falseAlarm)}
            rx="4"
            width={barWidth}
            x={padX}
            y={baseY - barHeight(falseAlarm)}
          />
          <text
            fill="#111111"
            fontSize="16"
            fontWeight="800"
            textAnchor="middle"
            x={padX + barWidth / 2}
            y={baseY - barHeight(falseAlarm) - 10}
          >
            {formatPercent(falseAlarm)}
          </text>

          <text fill="#6b7280" fontSize="11" fontWeight="700" x={width - padX - barWidth} y="36">
            Missed wins
          </text>
          <rect
            fill="#9ca3af"
            height={barHeight(missedWin)}
            rx="4"
            width={barWidth}
            x={width - padX - barWidth}
            y={baseY - barHeight(missedWin)}
          />
          <text
            fill="#111111"
            fontSize="16"
            fontWeight="800"
            textAnchor="middle"
            x={width - padX - barWidth / 2}
            y={baseY - barHeight(missedWin) - 10}
          >
            {formatPercent(missedWin)}
          </text>
        </svg>
        <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
          Bars resize as you move the decision bar
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-4">
          <p className="text-sm font-bold text-[color:var(--foreground)]">If you ship too eagerly</p>
          <p className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">
            {scenario.costOfFalseAlarm}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-4">
          <p className="text-sm font-bold text-[color:var(--foreground)]">If you wait too long</p>
          <p className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">
            {scenario.costOfMissedWin}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-xl border border-black bg-black px-5 py-5 text-white">
        <p className="text-lg font-black">{readout.verdict}</p>
        <p className="text-base leading-relaxed opacity-95">{readout.falseAlarmLine}</p>
        <p className="text-base leading-relaxed opacity-95">{readout.missedWinLine}</p>
        <p className="border-t border-white/20 pt-3 text-base font-bold leading-relaxed">
          {readout.pickLine}
        </p>
      </div>
    </section>
  );
}
