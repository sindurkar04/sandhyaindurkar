"use client";

import {
  SCENARIOS,
  formatNum,
  systemReadout,
  type ScenarioKey,
} from "@/lib/matrices-systems-data";
import { useState } from "react";

export default function MatricesSystemsExplorer() {
  const [key, setKey] = useState<ScenarioKey>("two_driver_regression");
  const scenario = SCENARIOS[key];
  const [A, setA] = useState(scenario.A.map((row) => [...row]));
  const [b, setB] = useState([...scenario.b]);

  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  const x0 = Math.abs(det) > 1e-9 ? (b[0] * A[1][1] - b[1] * A[0][1]) / det : NaN;
  const x1 = Math.abs(det) > 1e-9 ? (A[0][0] * b[1] - A[1][0] * b[0]) / det : NaN;

  function selectScenario(scenarioKey: ScenarioKey) {
    setKey(scenarioKey);
    setA(SCENARIOS[scenarioKey].A.map((row) => [...row]));
    setB([...SCENARIOS[scenarioKey].b]);
  }

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: Ax = b in 2×2 form
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Two equations, two unknowns. Regression normal equations use the same structure with more rows.
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
            onClick={() => selectScenario(scenarioKey)}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 font-mono text-sm sm:grid-cols-2">
        <div>
          <p className="mb-2 font-sans text-xs font-bold uppercase text-[color:var(--muted)]">Matrix A</p>
          <p>[{formatNum(A[0][0])}, {formatNum(A[0][1])}]</p>
          <p>[{formatNum(A[1][0])}, {formatNum(A[1][1])}]</p>
        </div>
        <div>
          <p className="mb-2 font-sans text-xs font-bold uppercase text-[color:var(--muted)]">Vector b</p>
          <p>[{formatNum(b[0])}]</p>
          <p>[{formatNum(b[1])}]</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">{scenario.variableNames[0]}</p>
          <p className="mt-1 text-3xl font-black">{Number.isNaN(x0) ? "—" : formatNum(x0)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">{scenario.variableNames[1]}</p>
          <p className="mt-1 text-3xl font-black">{Number.isNaN(x1) ? "—" : formatNum(x1)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {Number.isNaN(x0) ? "Determinant near zero: no unique solution (parallel constraints)." : systemReadout(scenario)}
      </p>
    </section>
  );
}
