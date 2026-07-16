"use client";

import {
  COLORS,
  SCENARIOS,
  formatCount,
  formatPct,
  matrixFromRates,
  matrixReadout,
  type ScenarioKey,
} from "@/lib/confusion-matrix-data";
import { useMemo, useState } from "react";

export default function ConfusionMatrixExplorer() {
  const [key, setKey] = useState<ScenarioKey>("fraud");
  const scenario = SCENARIOS[key];
  const [prevalence, setPrevalence] = useState(scenario.defaultPrevalence);
  const [sensitivity, setSensitivity] = useState(scenario.defaultSensitivity);
  const [specificity, setSpecificity] = useState(scenario.defaultSpecificity);

  function selectScenario(scenarioKey: ScenarioKey) {
    const s = SCENARIOS[scenarioKey];
    setKey(scenarioKey);
    setPrevalence(s.defaultPrevalence);
    setSensitivity(s.defaultSensitivity);
    setSpecificity(s.defaultSpecificity);
  }

  const metrics = useMemo(
    () => matrixFromRates(scenario.population, prevalence, sensitivity, specificity),
    [scenario.population, prevalence, sensitivity, specificity],
  );

  const maxCell = Math.max(metrics.tp, metrics.fp, metrics.fn, metrics.tn, 1);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: the 2x2 confusion matrix
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Every classifier score traces back to four counts. Adjust prevalence, sensitivity, and
        specificity to see precision, recall, and accuracy update live.
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

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <div>
            <label className="text-sm font-bold" htmlFor="prev">
              Prevalence: {prevalence.toFixed(1)}%
            </label>
            <input
              className="mt-2 w-full accent-black"
              id="prev"
              max={30}
              min={0.5}
              onChange={(e) => setPrevalence(Number(e.target.value))}
              step={0.5}
              type="range"
              value={prevalence}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="sens">
              Sensitivity (recall): {sensitivity.toFixed(0)}%
            </label>
            <input
              className="mt-2 w-full accent-black"
              id="sens"
              max={99}
              min={50}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              type="range"
              value={sensitivity}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="spec">
              Specificity: {specificity.toFixed(0)}%
            </label>
            <input
              className="mt-2 w-full accent-black"
              id="spec"
              max={99}
              min={50}
              onChange={(e) => setSpecificity(Number(e.target.value))}
              type="range"
              value={specificity}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Confusion matrix (n = {formatCount(scenario.population)})
          </p>
          <svg
            aria-label="Interactive confusion matrix grid"
            className="mx-auto block w-full max-w-[300px]"
            height={260}
            role="img"
            viewBox="0 0 300 260"
            width={300}
          >
            <text fill="#64748b" fontSize="11" fontWeight="700" textAnchor="middle" x="150" y="18">
              Predicted
            </text>
            <text fill="#64748b" fontSize="11" fontWeight="700" textAnchor="middle" x="82" y="38">
              +
            </text>
            <text fill="#64748b" fontSize="11" fontWeight="700" textAnchor="middle" x="218" y="38">
              -
            </text>
            <text fill="#64748b" fontSize="11" fontWeight="700" x="8" y="120">
              Actual
            </text>
            <text fill="#64748b" fontSize="11" fontWeight="700" x="8" y="95">
              +
            </text>
            <text fill="#64748b" fontSize="11" fontWeight="700" x="8" y="195">
              -
            </text>

            <rect
              fill={COLORS.tp}
              height={80 + (metrics.tp / maxCell) * 40}
              opacity="0.9"
              rx="8"
              width={80 + (metrics.tp / maxCell) * 40}
              x={52 - (metrics.tp / maxCell) * 20}
              y={52 - (metrics.tp / maxCell) * 20}
            />
            <text fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle" x="92" y="100">
              TP
            </text>
            <text fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle" x="92" y="118">
              {formatCount(metrics.tp)}
            </text>

            <rect
              fill={COLORS.fn}
              height={80 + (metrics.fn / maxCell) * 40}
              opacity="0.9"
              rx="8"
              width={80 + (metrics.fn / maxCell) * 40}
              x={188 - (metrics.fn / maxCell) * 20}
              y={52 - (metrics.fn / maxCell) * 20}
            />
            <text fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle" x="228" y="100">
              FN
            </text>
            <text fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle" x="228" y="118">
              {formatCount(metrics.fn)}
            </text>

            <rect
              fill={COLORS.fp}
              height={80 + (metrics.fp / maxCell) * 40}
              opacity="0.9"
              rx="8"
              width={80 + (metrics.fp / maxCell) * 40}
              x={52 - (metrics.fp / maxCell) * 20}
              y={152 - (metrics.fp / maxCell) * 20}
            />
            <text fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle" x="92" y="200">
              FP
            </text>
            <text fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle" x="92" y="218">
              {formatCount(metrics.fp)}
            </text>

            <rect
              fill={COLORS.tn}
              height={80 + (metrics.tn / maxCell) * 40}
              opacity="0.9"
              rx="8"
              width={80 + (metrics.tn / maxCell) * 40}
              x={188 - (metrics.tn / maxCell) * 20}
              y={152 - (metrics.tn / maxCell) * 20}
            />
            <text fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle" x="228" y="200">
              TN
            </text>
            <text fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle" x="228" y="218">
              {formatCount(metrics.tn)}
            </text>
          </svg>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Precision</p>
          <p className="mt-1 text-2xl font-black" style={{ color: COLORS.teal }}>
            {formatPct(metrics.precision)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Recall</p>
          <p className="mt-1 text-2xl font-black" style={{ color: COLORS.rose }}>
            {formatPct(metrics.recall)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Accuracy</p>
          <p className="mt-1 text-2xl font-black" style={{ color: COLORS.blue }}>
            {formatPct(metrics.accuracy)}
          </p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {matrixReadout(scenario, metrics)}
      </p>
    </section>
  );
}
