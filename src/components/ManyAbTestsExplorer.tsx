"use client";

import {
  SCENARIOS,
  atLeastOneFalsePositiveRate,
  expectedFalsePositives,
  formatCount,
  formatPercent,
  manyTestsRead,
  type ScenarioKey,
} from "@/lib/many-ab-tests-data";
import { useMemo, useState } from "react";

export default function ManyAbTestsExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("growth_sprint");
  const scenario = SCENARIOS[scenarioKey];
  const [testCount, setTestCount] = useState(scenario.defaultTestCount);
  const [alphaPercent, setAlphaPercent] = useState(scenario.defaultAlphaPercent);

  const atLeastOne = useMemo(
    () => atLeastOneFalsePositiveRate(testCount, alphaPercent),
    [testCount, alphaPercent],
  );
  const expectedFalse = useMemo(
    () => expectedFalsePositives(testCount, alphaPercent),
    [testCount, alphaPercent],
  );
  const insight = manyTestsRead(testCount, alphaPercent, atLeastOne);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    const next = SCENARIOS[key];
    setTestCount(next.defaultTestCount);
    setAlphaPercent(next.defaultAlphaPercent);
  }

  const barCount = Math.min(testCount, 24);
  const width = 420;
  const height = 160;
  const padX = 24;
  const gap = 6;
  const barWidth = Math.max(8, (width - padX * 2 - gap * (barCount - 1)) / barCount);

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: how many false wins should you expect?
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        Assume every test is a true null (no real lift). At 5% confidence per test, running many
        tests still produces winners by luck. Drag test count and threshold to see the odds.
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

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-black bg-black px-4 py-3 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">
            Chance of ≥1 false win
          </p>
          <p className="mt-1 text-3xl font-black">{formatPercent(atLeastOne)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Expected false wins
          </p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">
            {formatCount(expectedFalse)}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Tests run
          </p>
          <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">{testCount}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="tests-slider">
            Independent tests: {testCount}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="tests-slider"
            max={40}
            min={1}
            onChange={(e) => setTestCount(Number(e.target.value))}
            step={1}
            type="range"
            value={testCount}
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="alpha-slider">
            False alarm rate per test: {alphaPercent}%
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="alpha-slider"
            max={10}
            min={1}
            onChange={(e) => setAlphaPercent(Number(e.target.value))}
            step={1}
            type="range"
            value={alphaPercent}
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <svg
          aria-label="Many A/B tests with one highlighted false win"
          className="mx-auto block w-full max-w-[420px]"
          height={height}
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
        >
          {Array.from({ length: barCount }, (_, index) => {
            const x = padX + index * (barWidth + gap);
            const isFalseWin = index === Math.floor(barCount / 2);
            const barHeight = 40 + (index % 5) * 12;
            return (
              <rect
                fill={isFalseWin ? "#111111" : "#d1d5db"}
                height={barHeight}
                key={index}
                rx="3"
                width={barWidth}
                x={x}
                y={120 - barHeight}
              />
            );
          })}
        </svg>
        <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
          Dark bar = a null test that still looks like a winner
        </p>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--muted)]">
        {insight}
      </p>
    </section>
  );
}
