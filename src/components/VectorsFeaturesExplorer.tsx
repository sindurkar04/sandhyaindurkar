"use client";

import {
  SCENARIOS,
  formatNum,
  vectorNorm,
  vectorReadout,
  type ScenarioKey,
} from "@/lib/vectors-features-data";
import { useState } from "react";

export default function VectorsFeaturesExplorer() {
  const [key, setKey] = useState<ScenarioKey>("customer");
  const scenario = SCENARIOS[key];
  const norm = vectorNorm(scenario.features);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: one row as a feature vector
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Each entity is a point in feature space. Dimensions are columns; coordinates are cell values.
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
            onClick={() => setKey(scenarioKey)}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
              <th className="px-4 py-2 text-left font-bold">Entity</th>
              {scenario.features.map((f) => (
                <th className="px-4 py-2 text-right font-bold" key={f.name}>
                  {f.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 font-bold">{scenario.entityLabel}</td>
              {scenario.features.map((f) => (
                <td className="px-4 py-3 text-right font-mono" key={f.name}>
                  {formatNum(f.value, f.value < 1 ? 2 : 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Dimensions</p>
          <p className="mt-1 text-3xl font-black">{scenario.features.length}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">L2 norm</p>
          <p className="mt-1 text-3xl font-black">{formatNum(norm)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {vectorReadout(scenario)}
      </p>
    </section>
  );
}
