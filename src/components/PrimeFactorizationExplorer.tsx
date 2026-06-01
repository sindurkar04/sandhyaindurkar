"use client";

import PrimeBatchSplitChart from "@/components/PrimeBatchSplitChart";
import PrimeFactorBreakdownChart from "@/components/PrimeFactorBreakdownChart";
import {
  SCENARIOS,
  batchPlan,
  businessRead,
  factorInsight,
  formatFactorization,
  primeFactors,
  type ScenarioKey,
} from "@/lib/prime-factorization-data";
import { useMemo, useState } from "react";

export default function PrimeFactorizationExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("data_pipeline");
  const [batchSize, setBatchSize] = useState(250);

  const scenario = SCENARIOS[scenarioKey];
  const factors = useMemo(() => primeFactors(scenario.total), [scenario.total]);
  const factorization = useMemo(() => formatFactorization(factors), [factors]);
  const plan = useMemo(() => batchPlan(scenario.total, batchSize), [scenario.total, batchSize]);
  const insight = useMemo(() => factorInsight(scenario.total, factors), [scenario.total, factors]);

  const batchMin = 50;
  const batchMax = Math.min(1_500, scenario.total);

  function applyBatch(size: number) {
    setBatchSize(size);
  }

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setBatchSize(SCENARIOS[key].goodBatches[2] ?? SCENARIOS[key].goodBatches[0]);
  }

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: break the total, then pick a batch size
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Prime factorization shows how a total is built. Clean batch sizes divide it with nothing
        left over. Drag the slider or tap a preset to compare a clean split vs a messy partial
        tail.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Total</p>
          <p className="mt-1 text-3xl font-black tabular-nums">
            {scenario.total.toLocaleString()}
          </p>
          <p className="mt-1 text-xs opacity-80">{scenario.unitLabel}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Factorization
          </p>
          <p className="mt-1 text-xl font-black text-[color:var(--foreground)]">{factorization}</p>
          <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted)]">{insight}</p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            1. Scenario
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  scenarioKey === key
                    ? "bg-black text-white"
                    : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)] hover:bg-[color:var(--surface)]"
                }`}
                key={key}
                onClick={() => selectScenario(key)}
                type="button"
              >
                {SCENARIOS[key].shortLabel}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-[color:var(--muted)]">{scenario.context}</p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            2. How the number is built
          </p>
          <div className="mt-3">
            <PrimeFactorBreakdownChart factors={factors} total={scenario.total} />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            3. Batch size
          </p>
          <div className="mt-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
            <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="batch-slider">
              Batch size: {batchSize.toLocaleString()} {scenario.unitLabel}
            </label>
            <input
              className="mt-3 w-full accent-black"
              id="batch-slider"
              max={batchMax}
              min={batchMin}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              step={1}
              type="range"
              value={batchSize}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="w-full text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
                Clean splits
              </span>
              {scenario.goodBatches.map((size) => (
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    batchSize === size
                      ? "bg-black text-white"
                      : "border border-[color:var(--border)] bg-white text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                  }`}
                  key={`good-${size}`}
                  onClick={() => applyBatch(size)}
                  type="button"
                >
                  {size.toLocaleString()}
                </button>
              ))}
              <span className="mt-2 w-full text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
                Messy picks
              </span>
              {scenario.badBatches.map((size) => (
                <button
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    batchSize === size
                      ? "bg-[#6b7280] text-white"
                      : "border border-[color:var(--border)] bg-white text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                  }`}
                  key={`bad-${size}`}
                  onClick={() => applyBatch(size)}
                  type="button"
                >
                  {size.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            4. What the split looks like
          </p>
          <div className="mt-3 space-y-3">
            <PrimeBatchSplitChart plan={plan} total={scenario.total} unitLabel={scenario.unitLabel} />
            <p
              className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${
                plan.isClean
                  ? "border-black bg-black text-white"
                  : "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--muted)]"
              }`}
            >
              {plan.isClean ? (
                <>
                  <span className="font-bold">Clean split.</span> {plan.fullBatches} jobs each
                  handle {plan.batchSize.toLocaleString()} {scenario.unitLabel} with no straggler
                  batch.
                </>
              ) : (
                <>
                  <span className="font-bold text-[color:var(--foreground)]">Partial tail.</span>{" "}
                  {businessRead(plan)} Last batch is only {plan.partialLoadPercent}% full.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
