"use client";

import {
  SCENARIOS,
  formatPct,
  gamblersReadout,
  nextTrialProbability,
  streakProbability,
  type ScenarioKey,
} from "@/lib/gamblers-fallacy-data";
import { useState } from "react";

export default function GamblersFallacyExplorer() {
  const [key, setKey] = useState<ScenarioKey>("coin");
  const scenario = SCENARIOS[key];
  const [streakLen, setStreakLen] = useState(5);

  const streakP = streakProbability(scenario.pWin, streakLen, true);
  const nextP = nextTrialProbability(scenario.pWin);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: streaks do not change the next trial
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        A long run of losses feels like balance is due. For independent trials, the next probability
        stays the same.
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

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold" htmlFor="streak">
          Streak length: {streakLen} {scenario.streakLabel.toLowerCase()} in a row
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="streak"
          max={12}
          min={2}
          onChange={(e) => setStreakLen(Number(e.target.value))}
          type="range"
          value={streakLen}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Streak probability</p>
          <p className="mt-1 text-3xl font-black">{formatPct(streakP)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{streakLen} wins in a row</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Next trial</p>
          <p className="mt-1 text-3xl font-black">{formatPct(nextP)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Unchanged by the streak</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {gamblersReadout(scenario, streakLen)}
      </p>
    </section>
  );
}
