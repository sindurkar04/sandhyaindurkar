"use client";

import {
  SCENARIOS,
  angleFromCorrelation,
  formatNum,
  isNearOrthogonal,
  orthogonalityReadout,
  type ScenarioKey,
} from "@/lib/orthogonality-data";
import { useState } from "react";

export default function OrthogonalityExplorer() {
  const [key, setKey] = useState<ScenarioKey>("ab_test_inputs");
  const scenario = SCENARIOS[key];
  const [correlation, setCorrelation] = useState(scenario.defaultCorrelation * 100);
  const r = correlation / 100;
  const angle = angleFromCorrelation(r);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: correlation as angle between feature vectors
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Orthogonal features (90° apart) carry independent signal. Parallel features share the same story.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((scenarioKey) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              key === scenarioKey
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            key={scenarioKey}
            onClick={() => {
              setKey(scenarioKey);
              setCorrelation(SCENARIOS[scenarioKey].defaultCorrelation * 100);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold" htmlFor="corr">
          Correlation r: {formatNum(correlation, 0)}%
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="corr"
          max={99}
          min={-99}
          onChange={(e) => setCorrelation(Number(e.target.value))}
          type="range"
          value={correlation}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Angle from orthogonal</p>
          <p className="mt-1 text-3xl font-black">{formatNum(angle)}°</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Read</p>
          <p className="mt-1 text-lg font-black">{isNearOrthogonal(r) ? "Near orthogonal" : "Overlapping signal"}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {orthogonalityReadout(scenario, r)}
      </p>
    </section>
  );
}
