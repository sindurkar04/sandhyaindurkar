"use client";

import {
  SCENARIOS,
  anyAlert,
  expectedFalseAlerts,
  formatPct,
  stackingReadout,
  type ScenarioKey,
} from "@/lib/stacking-rare-risks-data";
import { useState } from "react";

export default function StackingRareRisksExplorer() {
  const [key, setKey] = useState<ScenarioKey>("fraud_rules");
  const scenario = SCENARIOS[key];
  const [checks, setChecks] = useState(scenario.defaultChecks);
  const [fpRate, setFpRate] = useState(scenario.defaultFpRate * 100);
  const volume = 5000;

  const systemRate = anyAlert(fpRate / 100, checks);
  const falseAlerts = expectedFalseAlerts(fpRate / 100, checks, volume);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: many rare checks on one case
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Each check has a small false-positive rate. Stack enough checks and clean cases start
        triggering alerts.
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
              const s = SCENARIOS[scenarioKey];
              setChecks(s.defaultChecks);
              setFpRate(s.defaultFpRate * 100);
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
          <label className="text-sm font-bold" htmlFor="checks">Checks stacked: {checks}</label>
          <input className="mt-2 w-full accent-black" id="checks" max={scenario.maxChecks} min={scenario.minChecks} onChange={(e) => setChecks(Number(e.target.value))} type="range" value={checks} />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="fp">False positive per check: {fpRate.toFixed(2)}%</label>
          <input className="mt-2 w-full accent-black" id="fp" max={10} min={0.1} onChange={(e) => setFpRate(Number(e.target.value))} step={0.1} type="range" value={fpRate} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">System false alert rate</p>
          <p className="mt-1 text-3xl font-black">{formatPct(systemRate)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Expected false alerts</p>
          <p className="mt-1 text-3xl font-black">{Math.round(falseAlerts).toLocaleString()}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">On {volume.toLocaleString()} clean cases</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {stackingReadout(scenario, fpRate / 100, checks)}
      </p>
    </section>
  );
}
