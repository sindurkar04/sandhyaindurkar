"use client";

import {
  SCENARIOS,
  atLeastOne,
  atLeastOneReadout,
  formatPct,
  none,
  type ScenarioKey,
} from "@/lib/at-least-one-data";
import { useState } from "react";

export default function AtLeastOneExplorer() {
  const [key, setKey] = useState<ScenarioKey>("deploys");
  const scenario = SCENARIOS[key];
  const [p, setP] = useState(scenario.defaultP * 100);
  const [n, setN] = useState(scenario.defaultN);

  const risk = atLeastOne(p / 100, n);
  const safe = none(p / 100, n);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: P(at least one) = 1 - (1 - p)^n
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Each trial has the same small risk p. Repeating n independent trials raises the chance that
        at least one event happens.
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
              setP(s.defaultP * 100);
              setN(s.defaultN);
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
          <label className="text-sm font-bold" htmlFor="p">Per-trial risk: {p.toFixed(1)}%</label>
          <input className="mt-2 w-full accent-black" id="p" max={20} min={0.5} onChange={(e) => setP(Number(e.target.value))} step={0.5} type="range" value={p} />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="n">Number of trials: {n}</label>
          <input className="mt-2 w-full accent-black" id="n" max={scenario.maxN} min={scenario.minN} onChange={(e) => setN(Number(e.target.value))} type="range" value={n} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">At least one</p>
          <p className="mt-1 text-3xl font-black">{formatPct(risk)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">None happen</p>
          <p className="mt-1 text-3xl font-black">{formatPct(safe)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {atLeastOneReadout(scenario, p / 100, n)}
      </p>
    </section>
  );
}
