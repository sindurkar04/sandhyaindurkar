"use client";

import {
  SCENARIOS,
  coefficientsAtOverlap,
  collinearityReadout,
  formatNum,
  type ScenarioKey,
} from "@/lib/multicollinearity-data";
import { useState } from "react";

export default function MulticollinearityExplorer() {
  const [key, setKey] = useState<ScenarioKey>("marketing_levers");
  const scenario = SCENARIOS[key];
  const [overlap, setOverlap] = useState(scenario.defaultOverlap);
  const coef = coefficientsAtOverlap(scenario, overlap);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: overlapping features in one regression
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag feature overlap. When two inputs move together, coefficient credit becomes unstable.
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
              setOverlap(SCENARIOS[scenarioKey].defaultOverlap);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold" htmlFor="overlap">
          Feature overlap: {overlap}%
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="overlap"
          max={100}
          min={20}
          onChange={(e) => setOverlap(Number(e.target.value))}
          type="range"
          value={overlap}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">{scenario.feature1} coef</p>
          <p className="mt-1 text-3xl font-black">{formatNum(coef.b1)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">{scenario.feature2} coef</p>
          <p className="mt-1 text-3xl font-black">{formatNum(coef.b2)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {collinearityReadout(scenario, overlap, coef)}
      </p>
    </section>
  );
}
