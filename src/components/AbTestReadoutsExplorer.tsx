"use client";

import { wilsonInterval } from "@/lib/confidence-intervals-data";
import {
  SCENARIOS,
  formatRate,
  liftPoints,
  intervalsOverlap,
  shipRead,
  type ScenarioKey,
} from "@/lib/ab-test-readouts-data";
import { useMemo, useState } from "react";

export default function AbTestReadoutsExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("checkout_button");
  const scenario = SCENARIOS[scenarioKey];
  const [controlRate, setControlRate] = useState(scenario.defaultControlRate);
  const [variantRate, setVariantRate] = useState(scenario.defaultVariantRate);
  const [nPerArm, setNPerArm] = useState(scenario.defaultNPerArm);

  const controlInterval = useMemo(
    () => wilsonInterval(controlRate, nPerArm),
    [controlRate, nPerArm],
  );
  const variantInterval = useMemo(
    () => wilsonInterval(variantRate, nPerArm),
    [variantRate, nPerArm],
  );
  const lift = liftPoints(controlRate, variantRate);
  const overlap = intervalsOverlap(
    controlInterval.low,
    controlInterval.high,
    variantInterval.low,
    variantInterval.high,
  );
  const readout = shipRead(controlRate, variantRate, nPerArm, scenario.minLiftToShip);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    const s = SCENARIOS[key];
    setControlRate(s.defaultControlRate);
    setVariantRate(s.defaultVariantRate);
    setNPerArm(s.defaultNPerArm);
  }

  const width = 420;
  const height = 180;
  const padX = 40;
  const plotWidth = width - padX * 2;
  const maxRate = Math.max(controlInterval.high, variantInterval.high, controlRate, variantRate) * 1.2;
  const scaleX = (value: number) => padX + (value / maxRate) * plotWidth;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: read an A/B test without p-value jargon
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Compare observed lift to your minimum bar and check whether the 95% bands overlap. Overlap
        means the result is still compatible with no real difference.
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

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Control
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatRate(controlRate)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            {formatRate(controlInterval.low)} to {formatRate(controlInterval.high)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Variant
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatRate(variantRate)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            {formatRate(variantInterval.low)} to {formatRate(variantInterval.high)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Lift</p>
          <p className="mt-1 text-2xl font-black">
            {lift >= 0 ? "+" : ""}
            {lift.toFixed(1)} pts
          </p>
          <p className="mt-1 text-xs opacity-80">
            Min to ship: {scenario.minLiftToShip.toFixed(1)} pts
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="control-slider">
            Control {scenario.metricLabel.toLowerCase()}: {formatRate(controlRate)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="control-slider"
            max={25}
            min={1}
            onChange={(e) => setControlRate(Number(e.target.value))}
            step={0.1}
            type="range"
            value={controlRate}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="variant-slider">
            Variant {scenario.metricLabel.toLowerCase()}: {formatRate(variantRate)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="variant-slider"
            max={25}
            min={1}
            onChange={(e) => setVariantRate(Number(e.target.value))}
            step={0.1}
            type="range"
            value={variantRate}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="n-slider">
            Users per arm: {nPerArm.toLocaleString()}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="n-slider"
            max={5000}
            min={100}
            onChange={(e) => setNPerArm(Number(e.target.value))}
            step={50}
            type="range"
            value={nPerArm}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="Control and variant confidence intervals"
          className="mx-auto block w-full max-w-[420px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          <text fill="#6b7280" fontSize="11" fontWeight="700" x={padX} y="36">
            Control
          </text>
          <rect
            fill="#d1d5db"
            height="20"
            rx="2"
            width={Math.max(scaleX(controlInterval.high) - scaleX(controlInterval.low), 4)}
            x={scaleX(controlInterval.low)}
            y="42"
          />
          <line
            stroke="#111111"
            strokeWidth="3"
            x1={scaleX(controlRate)}
            x2={scaleX(controlRate)}
            y1="34"
            y2="70"
          />

          <text fill="#6b7280" fontSize="11" fontWeight="700" x={padX} y="96">
            Variant
          </text>
          <rect
            fill="#9ca3af"
            height="20"
            rx="2"
            width={Math.max(scaleX(variantInterval.high) - scaleX(variantInterval.low), 4)}
            x={scaleX(variantInterval.low)}
            y="102"
          />
          <line
            stroke="#111111"
            strokeWidth="3"
            x1={scaleX(variantRate)}
            x2={scaleX(variantRate)}
            y1="94"
            y2="130"
          />
        </svg>
        <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
          95% bands {overlap ? "overlap" : "do not overlap"}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
        <p className="text-sm font-bold">{readout.verdict}</p>
        <p className="mt-1 text-sm opacity-90">{readout.detail}</p>
      </div>
    </section>
  );
}
