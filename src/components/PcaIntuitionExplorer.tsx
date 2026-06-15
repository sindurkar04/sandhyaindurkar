"use client";

import {
  SCENARIOS,
  formatPct,
  pcaReadout,
  varianceExplained,
  type ScenarioKey,
} from "@/lib/pca-intuition-data";
import { useState } from "react";

export default function PcaIntuitionExplorer() {
  const [key, setKey] = useState<ScenarioKey>("kpi_dashboard");
  const scenario = SCENARIOS[key];
  const [redundancy, setRedundancy] = useState(scenario.defaultRedundancy);
  const ve = varianceExplained(scenario, redundancy);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: variance explained by principal components
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        When metrics move together, one axis can summarize most of the movement.
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
              setRedundancy(SCENARIOS[scenarioKey].defaultRedundancy);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>
      <p className="mt-2 text-sm text-[color:var(--muted)]">Metrics: {scenario.metrics.join(", ")}</p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold" htmlFor="redundancy">
          KPI redundancy: {redundancy}%
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="redundancy"
          max={95}
          min={30}
          onChange={(e) => setRedundancy(Number(e.target.value))}
          type="range"
          value={redundancy}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">PC1</p>
          <p className="mt-1 text-3xl font-black">{formatPct(ve.pc1)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">PC2</p>
          <p className="mt-1 text-3xl font-black">{formatPct(ve.pc2)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Rest</p>
          <p className="mt-1 text-3xl font-black">{formatPct(ve.rest)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {pcaReadout(scenario, redundancy, ve)}
      </p>
    </section>
  );
}
