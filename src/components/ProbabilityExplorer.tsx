"use client";

import {
  SCENARIOS,
  estimateProbability,
  formatPercent,
  stabilityRead,
  compoundIndependent,
  type ScenarioKey,
} from "@/lib/probability-data";
import { useMemo, useState } from "react";

export default function ProbabilityExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("email_test");
  const scenario = SCENARIOS[scenarioKey];
  const [successes, setSuccesses] = useState(scenario.defaultSuccesses);
  const [trials, setTrials] = useState(scenario.defaultTrials);

  const p = useMemo(() => estimateProbability(successes, trials), [successes, trials]);
  const insight = stabilityRead(p, trials);
  const compoundExample = compoundIndependent(0.42, 0.55);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setSuccesses(SCENARIOS[key].defaultSuccesses);
    setTrials(SCENARIOS[key].defaultTrials);
  }

  const maxTrials = 500;
  const maxSuccesses = Math.max(1, trials);

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: estimate a win rate from past trials
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        Probability from data is successes divided by trials. Drag both to see how the estimate
        shifts and how stable it feels at different sample sizes.
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

      <p className="mt-4 text-sm text-[color:var(--muted)]">{scenario.context}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-black bg-black px-4 py-3 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Estimated rate</p>
          <p className="mt-1 text-3xl font-black">{formatPercent(p)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Counts
          </p>
          <p className="mt-1 text-xl font-black text-[color:var(--foreground)]">
            {successes} wins / {trials} trials
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Independent chain example: 42% then 55% both hit ={" "}
            {formatPercent(compoundExample, 1)} overall
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="trials-slider">
            Trials: {trials.toLocaleString()}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="trials-slider"
            max={maxTrials}
            min={5}
            onChange={(e) => {
              const next = Number(e.target.value);
              setTrials(next);
              setSuccesses((s) => Math.min(s, next));
            }}
            step={1}
            type="range"
            value={trials}
          />
        </div>
        <div>
          <label
            className="text-sm font-bold text-[color:var(--foreground)]"
            htmlFor="successes-slider"
          >
            Successes: {successes.toLocaleString()}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="successes-slider"
            max={maxSuccesses}
            min={0}
            onChange={(e) => setSuccesses(Number(e.target.value))}
            step={1}
            type="range"
            value={successes}
          />
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--muted)]">
        {insight}
      </p>
    </section>
  );
}
