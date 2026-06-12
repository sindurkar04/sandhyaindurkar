"use client";

import {
  SCENARIOS,
  formatPct,
  screeningCounts,
  screeningReadout,
  type ScenarioKey,
} from "@/lib/sensitivity-specificity-data";
import { useState } from "react";

export default function SensitivitySpecificityExplorer() {
  const [key, setKey] = useState<ScenarioKey>("fraud");
  const base = SCENARIOS[key];
  const [prevalence, setPrevalence] = useState(base.prevalence * 100);
  const [sensitivity, setSensitivity] = useState(base.sensitivity * 100);
  const [specificity, setSpecificity] = useState(base.specificity * 100);

  const scenario = {
    ...base,
    prevalence: prevalence / 100,
    sensitivity: sensitivity / 100,
    specificity: specificity / 100,
  };
  const counts = screeningCounts(scenario);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: the 2x2 screening table
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Sensitivity and specificity describe the test. Positive predictive value describes what a
        positive flag means in your population.
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
              setPrevalence(s.prevalence * 100);
              setSensitivity(s.sensitivity * 100);
              setSpecificity(s.specificity * 100);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{base.headline}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <div>
            <label className="text-sm font-bold" htmlFor="prev">Prevalence: {prevalence.toFixed(1)}%</label>
            <input className="mt-2 w-full accent-black" id="prev" max={10} min={0.5} onChange={(e) => setPrevalence(Number(e.target.value))} step={0.5} type="range" value={prevalence} />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="sens">Sensitivity: {sensitivity.toFixed(0)}%</label>
            <input className="mt-2 w-full accent-black" id="sens" max={99} min={50} onChange={(e) => setSensitivity(Number(e.target.value))} type="range" value={sensitivity} />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="spec">Specificity: {specificity.toFixed(0)}%</label>
            <input className="mt-2 w-full accent-black" id="spec" max={99} min={50} onChange={(e) => setSpecificity(Number(e.target.value))} type="range" value={specificity} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-left">
                <th className="pb-2 pr-2" />
                <th className="pb-2 pr-2 font-bold">Test +</th>
                <th className="pb-2 font-bold">Test -</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[color:var(--border)]">
                <td className="py-2 pr-2 font-bold">Actually +</td>
                <td className="py-2 pr-2">{counts.tp} TP</td>
                <td className="py-2">{counts.fn} FN</td>
              </tr>
              <tr>
                <td className="py-2 pr-2 font-bold">Actually -</td>
                <td className="py-2 pr-2">{counts.fp} FP</td>
                <td className="py-2">{counts.tn} TN</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            PPV (precision): {formatPct(counts.precision)} · NPV: {formatPct(counts.npv)}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {screeningReadout(scenario, counts)}
      </p>
    </section>
  );
}
