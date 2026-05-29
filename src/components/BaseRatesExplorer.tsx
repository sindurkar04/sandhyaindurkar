"use client";

import {
  SCENARIOS,
  formatPercent,
  posteriorGivenSignalPercent,
  posteriorRead,
  type ScenarioKey,
} from "@/lib/base-rates-data";
import { useMemo, useState } from "react";

export default function BaseRatesExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud_flag");
  const scenario = SCENARIOS[scenarioKey];
  const [baseRate, setBaseRate] = useState(scenario.defaultBaseRate);
  const [truePositive, setTruePositive] = useState(scenario.defaultTruePositiveRate);
  const [falsePositive, setFalsePositive] = useState(scenario.defaultFalsePositiveRate);

  const posterior = useMemo(
    () => posteriorGivenSignalPercent(baseRate, truePositive, falsePositive),
    [baseRate, truePositive, falsePositive],
  );
  const insight = posteriorRead(posterior, baseRate, scenario);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    const s = SCENARIOS[key];
    setBaseRate(s.defaultBaseRate);
    setTruePositive(s.defaultTruePositiveRate);
    setFalsePositive(s.defaultFalsePositiveRate);
  }

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: update a belief after a positive signal
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        A strong alert is not the same as a near-certain hit when the underlying rate is rare.
        Adjust base rate and test accuracy to see the updated chance after a positive signal.
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Base rate (before signal)
          </p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
            {formatPercent(baseRate)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">{scenario.baseLabel}</p>
        </div>
        <div className="rounded-lg border border-black bg-black px-4 py-3 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">
            After positive signal
          </p>
          <p className="mt-1 text-3xl font-black">{formatPercent(posterior)}</p>
          <p className="mt-1 text-xs opacity-80">{scenario.signalLabel}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="base-slider">
            Base rate: {formatPercent(baseRate)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="base-slider"
            max={40}
            min={0.5}
            onChange={(e) => setBaseRate(Number(e.target.value))}
            step={0.5}
            type="range"
            value={baseRate}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="tp-slider">
            True positive rate: {formatPercent(truePositive, 0)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="tp-slider"
            max={99}
            min={40}
            onChange={(e) => setTruePositive(Number(e.target.value))}
            step={1}
            type="range"
            value={truePositive}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="fp-slider">
            False positive rate: {formatPercent(falsePositive, 0)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="fp-slider"
            max={40}
            min={1}
            onChange={(e) => setFalsePositive(Number(e.target.value))}
            step={1}
            type="range"
            value={falsePositive}
          />
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--muted)]">
        {insight}
      </p>
    </section>
  );
}
