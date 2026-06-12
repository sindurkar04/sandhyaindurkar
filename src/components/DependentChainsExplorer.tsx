"use client";

import {
  SCENARIOS,
  chainReadout,
  formatPct,
  jointConditional,
  type ScenarioKey,
} from "@/lib/dependent-chains-data";
import { useState } from "react";

export default function DependentChainsExplorer() {
  const [key, setKey] = useState<ScenarioKey>("product_funnel");
  const scenario = SCENARIOS[key];
  const [pStep1, setPStep1] = useState(scenario.pStep1 * 100);
  const [pStep2Given, setPStep2Given] = useState(scenario.pStep2GivenStep1 * 100);

  const correct = jointConditional(pStep1 / 100, pStep2Given / 100);
  const wrong = (pStep1 / 100) * scenario.bogusIndependent;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: chain steps with P(step2 | step1)
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag step rates. The joint path probability is P(step1) times P(step2 | step1), not two
        unrelated marginals multiplied.
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
              setPStep1(SCENARIOS[scenarioKey].pStep1 * 100);
              setPStep2Given(SCENARIOS[scenarioKey].pStep2GivenStep1 * 100);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="step1">
            P({scenario.step1Label}): {pStep1.toFixed(0)}%
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="step1"
            max={90}
            min={5}
            onChange={(e) => setPStep1(Number(e.target.value))}
            type="range"
            value={pStep1}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="step2">
            P({scenario.step2Label} | {scenario.step1Label}): {pStep2Given.toFixed(0)}%
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="step2"
            max={95}
            min={5}
            onChange={(e) => setPStep2Given(Number(e.target.value))}
            type="range"
            value={pStep2Given}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Correct joint</p>
          <p className="mt-1 text-3xl font-black">{formatPct(correct)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">P(step1) x P(step2 | step1)</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Wrong shortcut</p>
          <p className="mt-1 text-3xl font-black">{formatPct(wrong)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Treats step2 as independent</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {chainReadout({ ...scenario, pStep1: pStep1 / 100, pStep2GivenStep1: pStep2Given / 100 })}
      </p>
    </section>
  );
}
