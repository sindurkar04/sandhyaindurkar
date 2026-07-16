"use client";

import {
  COLORS,
  SCENARIOS,
  bayesBreakdown,
  bayesReadout,
  formatPct,
  type ScenarioKey,
} from "@/lib/bayes-theorem-data";
import { useMemo, useState } from "react";

const CHART_W = 360;
const CHART_H = 220;
const PAD = 24;

export default function BayesTheoremExplorer() {
  const [key, setKey] = useState<ScenarioKey>("disease_screen");
  const scenario = SCENARIOS[key];
  const [prior, setPrior] = useState(scenario.defaultPrior);
  const [sensitivity, setSensitivity] = useState(scenario.defaultSensitivity);
  const [falsePositive, setFalsePositive] = useState(scenario.defaultFalsePositive);

  function selectScenario(scenarioKey: ScenarioKey) {
    const s = SCENARIOS[scenarioKey];
    setKey(scenarioKey);
    setPrior(s.defaultPrior);
    setSensitivity(s.defaultSensitivity);
    setFalsePositive(s.defaultFalsePositive);
  }

  const breakdown = useMemo(
    () => bayesBreakdown(prior, sensitivity, falsePositive),
    [prior, sensitivity, falsePositive],
  );

  const plotW = CHART_W - PAD * 2;
  const barW = plotW / 3 - 12;
  const maxH = CHART_H - PAD * 2 - 40;
  const priorH = breakdown.prior * maxH;
  const likelihoodH = breakdown.likelihood * maxH;
  const posteriorH = breakdown.posterior * maxH;

  const stackTotal = breakdown.truePos + breakdown.falsePos;
  const trueShare = stackTotal > 0 ? breakdown.truePos / stackTotal : 0;
  const falseShare = stackTotal > 0 ? breakdown.falsePos / stackTotal : 0;
  const stackH = 100;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: prior, likelihood, and posterior
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Bayes combines what you believed before the signal with how often the signal appears when the
        event is true or false. Drag sliders to see P(disease | positive) update.
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
            <label className="text-sm font-bold" htmlFor="prior">
              Prior P({scenario.eventALabel}): {prior.toFixed(1)}%
            </label>
            <input
              className="mt-2 w-full accent-black"
              id="prior"
              max={20}
              min={0.5}
              onChange={(e) => setPrior(Number(e.target.value))}
              step={0.5}
              type="range"
              value={prior}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="sens">
              Sensitivity P({scenario.eventBLabel} | {scenario.eventALabel}): {sensitivity.toFixed(0)}%
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
            <label className="text-sm font-bold" htmlFor="fpr">
              False positive P({scenario.eventBLabel} | not {scenario.eventALabel}): {falsePositive.toFixed(0)}%
            </label>
            <input
              className="mt-2 w-full accent-black"
              id="fpr"
              max={30}
              min={1}
              onChange={(e) => setFalsePositive(Number(e.target.value))}
              type="range"
              value={falsePositive}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Prior</p>
            <p className="mt-1 text-2xl font-black" style={{ color: COLORS.rose }}>
              {formatPct(breakdown.prior)}
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Posterior</p>
            <p className="mt-1 text-2xl font-black" style={{ color: COLORS.blue }}>
              {formatPct(breakdown.posterior)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Bayes components
          </p>
          <svg
            aria-label="Bar chart of prior, likelihood, and posterior"
            className="mx-auto block w-full max-w-[360px]"
            height={CHART_H}
            role="img"
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            width={CHART_W}
          >
            <rect fill={COLORS.rose} height={priorH} opacity="0.85" rx="6" width={barW} x={PAD} y={CHART_H - PAD - priorH} />
            <rect fill={COLORS.teal} height={likelihoodH} opacity="0.85" rx="6" width={barW} x={PAD + barW + 12} y={CHART_H - PAD - likelihoodH} />
            <rect fill={COLORS.blue} height={posteriorH} opacity="0.85" rx="6" width={barW} x={PAD + (barW + 12) * 2} y={CHART_H - PAD - posteriorH} />
            <text fill={COLORS.rose} fontSize="11" fontWeight="700" textAnchor="middle" x={PAD + barW / 2} y={CHART_H - 8}>
              Prior
            </text>
            <text fill={COLORS.teal} fontSize="11" fontWeight="700" textAnchor="middle" x={PAD + barW + 12 + barW / 2} y={CHART_H - 8}>
              Likelihood
            </text>
            <text fill={COLORS.blue} fontSize="11" fontWeight="700" textAnchor="middle" x={PAD + (barW + 12) * 2 + barW / 2} y={CHART_H - 8}>
              Posterior
            </text>
            <text fill="#111" fontSize="11" fontWeight="800" textAnchor="middle" x={PAD + barW / 2} y={CHART_H - PAD - priorH - 6}>
              {formatPct(breakdown.prior)}
            </text>
            <text fill="#111" fontSize="11" fontWeight="800" textAnchor="middle" x={PAD + barW + 12 + barW / 2} y={CHART_H - PAD - likelihoodH - 6}>
              {formatPct(breakdown.likelihood)}
            </text>
            <text fill="#111" fontSize="11" fontWeight="800" textAnchor="middle" x={PAD + (barW + 12) * 2 + barW / 2} y={CHART_H - PAD - posteriorH - 6}>
              {formatPct(breakdown.posterior)}
            </text>
          </svg>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            P(positive): true vs false
          </p>
          <svg
            aria-label="Stacked bar of true and false positives"
            className="mx-auto block w-full max-w-[200px]"
            height={140}
            role="img"
            viewBox="0 0 200 140"
            width={200}
          >
            <rect fill={COLORS.teal} height={trueShare * stackH} rx="4" width="80" x="60" y={20 + stackH - trueShare * stackH} />
            <rect fill={COLORS.orange} height={falseShare * stackH} rx="4" width="80" x="60" y={20 + stackH - trueShare * stackH - falseShare * stackH} />
            <text fill={COLORS.teal} fontSize="11" fontWeight="700" textAnchor="middle" x="100" y="134">
              True pos {formatPct(trueShare)}
            </text>
            <text fill={COLORS.orange} fontSize="11" fontWeight="700" textAnchor="middle" x="100" y="14">
              False pos {formatPct(falseShare)}
            </text>
          </svg>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {bayesReadout(scenario, breakdown)}
      </p>
    </section>
  );
}
