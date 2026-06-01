"use client";

import {
  SCENARIOS,
  estimatePower,
  formatCount,
  formatPower,
  powerLabel,
  powerRead,
  type ScenarioKey,
} from "@/lib/statistical-power-data";
import { useMemo, useState } from "react";

export default function StatisticalPowerExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("checkout_ab");
  const scenario = SCENARIOS[scenarioKey];
  const [samplePerArm, setSamplePerArm] = useState(scenario.defaultSamplePerArm);

  const power = useMemo(
    () => estimatePower(scenario.baselineRate, scenario.mdePoints, samplePerArm),
    [scenario.baselineRate, scenario.mdePoints, samplePerArm],
  );
  const readout = powerRead(power, scenario, samplePerArm);
  const label = powerLabel(power);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setSamplePerArm(SCENARIOS[key].defaultSamplePerArm);
  }

  const gaugePct = Math.round(power * 100);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: can this test detect the lift you care about?
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Power is the chance you detect a real effect before you give up. Drag sample size per arm.
        Small tests often end at &ldquo;no winner&rdquo; even when the variant works.
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

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Baseline rate
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {scenario.baselineRate}%
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Minimum detectable lift
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            +{scenario.mdePoints} pts
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Statistical power</p>
          <p className="mt-1 text-3xl font-black">{formatPower(power)}</p>
          <p className="mt-1 text-xs opacity-80">{label}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="power-sample">
            Sample size per arm: {formatCount(samplePerArm)}
          </label>
        </div>
        <input
          className="w-full accent-black"
          id="power-sample"
          max={scenario.maxSample}
          min={scenario.minSample}
          onChange={(event) => setSamplePerArm(Number(event.target.value))}
          step={500}
          type="range"
          value={samplePerArm}
        />
        <div className="h-4 overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]">
          <div
            className="h-full rounded-full bg-black transition-all"
            style={{ width: `${gaugePct}%` }}
          />
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
