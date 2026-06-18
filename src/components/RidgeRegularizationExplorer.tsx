"use client";

import {
  SCENARIOS,
  formatNum,
  ridgeCoefficients,
  ridgeReadout,
  type ScenarioKey,
} from "@/lib/ridge-regularization-data";
import { useState } from "react";

export default function RidgeRegularizationExplorer() {
  const [key, setKey] = useState<ScenarioKey>("marketing_mix");
  const scenario = SCENARIOS[key];
  const [lambda, setLambda] = useState(scenario.defaultLambda);
  const coef = ridgeCoefficients(scenario, lambda);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: ridge penalty shrinks unstable coefficients
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag λ (regularization strength). Higher λ pulls coefficients toward zero and stabilizes collinear inputs.
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
              setLambda(SCENARIOS[scenarioKey].defaultLambda);
            }}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold" htmlFor="lambda">
          Regularization λ: {lambda}%
        </label>
        <input
          className="mt-2 w-full accent-black"
          id="lambda"
          max={80}
          min={0}
          onChange={(e) => setLambda(Number(e.target.value))}
          type="range"
          value={lambda}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">{scenario.feature1}</p>
          <p className="mt-1 text-2xl font-black">{formatNum(coef.b1)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">OLS: {formatNum(coef.olsB1)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">{scenario.feature2}</p>
          <p className="mt-1 text-2xl font-black">{formatNum(coef.b2)}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">OLS: {formatNum(coef.olsB2)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {ridgeReadout(scenario, lambda, coef)}
      </p>
    </section>
  );
}
