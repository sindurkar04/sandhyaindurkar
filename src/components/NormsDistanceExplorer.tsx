"use client";

import {
  SCENARIOS,
  distanceReadout,
  formatNum,
  l1Distance,
  l2Distance,
  type ScenarioKey,
} from "@/lib/norms-distance-data";
import { useState } from "react";

export default function NormsDistanceExplorer() {
  const [key, setKey] = useState<ScenarioKey>("customer_anomaly");
  const scenario = SCENARIOS[key];
  const [threshold, setThreshold] = useState(scenario.defaultThreshold);

  const l2 = l2Distance(scenario.baseline, scenario.point);
  const l1 = l1Distance(scenario.baseline, scenario.point);
  const flagged = l2 > threshold;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: L1 and L2 distance from a baseline vector
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Distance measures how far one feature vector sits from another. L2 is Euclidean; L1 sums absolute gaps.
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
              setThreshold(SCENARIOS[scenarioKey].defaultThreshold);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">L2 distance</p>
          <p className="mt-1 text-2xl font-black">{formatNum(l2)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">L1 distance</p>
          <p className="mt-1 text-2xl font-black">{formatNum(l1)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Verdict</p>
          <p className="mt-1 text-lg font-black">{flagged ? "Above threshold" : "Within threshold"}</p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold" htmlFor="threshold">
          Alert threshold (L2): {formatNum(threshold)}
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="threshold"
          max={scenario.defaultThreshold * 3}
          min={scenario.defaultThreshold * 0.1}
          onChange={(e) => setThreshold(Number(e.target.value))}
          step={scenario.defaultThreshold > 1 ? 1 : 0.01}
          type="range"
          value={threshold}
        />
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {distanceReadout(scenario, threshold)}
      </p>
    </section>
  );
}
