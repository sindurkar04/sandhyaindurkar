"use client";

import {
  SCENARIOS,
  conditionalReadout,
  formatPct,
  pGivenA,
  pGivenB,
  type ScenarioKey,
} from "@/lib/conditional-probability-data";
import { useState } from "react";

export default function ConditionalProbabilityExplorer() {
  const [key, setKey] = useState<ScenarioKey>("screening");
  const scenario = SCENARIOS[key];
  const pAgivenB = pGivenB(scenario.pAandB, scenario.pB);
  const pBgivenA = pGivenA(scenario.pAandB, scenario.pA);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: P(A | B) is not P(B | A)
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Conditional probability restricts you to cases where B already happened. Swapping A and B
        changes the denominator.
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(A)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(scenario.pA)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{scenario.labelA}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(B)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(scenario.pB)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{scenario.labelB}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(A | B)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(pAgivenB)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Given {scenario.labelB}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">P(B | A)</p>
          <p className="mt-1 text-2xl font-black">{formatPct(pBgivenA)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Given {scenario.labelA}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {conditionalReadout(scenario)}
      </p>
    </section>
  );
}
