"use client";

import {
  SCENARIOS,
  aggregateRate,
  formatRate,
  liftPoints,
  paradoxRead,
  type ScenarioKey,
} from "@/lib/simpsons-paradox-data";
import { useMemo, useState } from "react";

export default function SimpsonsParadoxExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("mobile_desktop");
  const scenario = SCENARIOS[scenarioKey];

  const aggregateControl = useMemo(
    () => aggregateRate(scenario.segments, "control"),
    [scenario.segments],
  );
  const aggregateVariant = useMemo(
    () => aggregateRate(scenario.segments, "variant"),
    [scenario.segments],
  );
  const aggLift = liftPoints(aggregateControl, aggregateVariant);
  const insight = paradoxRead(aggregateControl, aggregateVariant, scenario.segments);

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: segment wins vs aggregate loss
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        {scenario.context}. Compare each slice first, then the rolled-up rate. A different mix of
        traffic between arms can flip the overall winner.
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
            onClick={() => setScenarioKey(key)}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] text-left">
              <th className="py-2 pr-4 font-bold text-[color:var(--foreground)]">Segment</th>
              <th className="py-2 pr-4 text-right font-bold text-[color:var(--foreground)]">
                Control
              </th>
              <th className="py-2 pr-4 text-right font-bold text-[color:var(--foreground)]">
                Variant
              </th>
              <th className="py-2 text-right font-bold text-[color:var(--foreground)]">Lift</th>
            </tr>
          </thead>
          <tbody>
            {scenario.segments.map((row) => {
              const lift = liftPoints(row.controlRate, row.variantRate);
              return (
                <tr className="border-b border-[color:var(--border)]" key={row.label}>
                  <td className="py-3 pr-4 text-[color:var(--muted)]">{row.label}</td>
                  <td className="py-3 pr-4 text-right font-bold text-[color:var(--foreground)]">
                    {formatRate(row.controlRate)}
                  </td>
                  <td className="py-3 pr-4 text-right font-bold text-[color:var(--foreground)]">
                    {formatRate(row.variantRate)}
                  </td>
                  <td
                    className={`py-3 text-right font-bold ${
                      lift > 0 ? "text-[color:var(--foreground)]" : "text-[color:var(--muted)]"
                    }`}
                  >
                    {lift >= 0 ? "+" : ""}
                    {lift.toFixed(2)} pts
                  </td>
                </tr>
              );
            })}
            <tr className="bg-[color:var(--surface-strong)]">
              <td className="py-3 pr-4 font-bold text-[color:var(--foreground)]">Aggregate</td>
              <td className="py-3 pr-4 text-right font-black text-[color:var(--foreground)]">
                {formatRate(aggregateControl)}
              </td>
              <td className="py-3 pr-4 text-right font-black text-[color:var(--foreground)]">
                {formatRate(aggregateVariant)}
              </td>
              <td
                className={`py-3 text-right font-black ${
                  aggLift > 0 ? "text-[color:var(--foreground)]" : "text-[color:var(--muted)]"
                }`}
              >
                {aggLift >= 0 ? "+" : ""}
                {aggLift.toFixed(2)} pts
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--muted)]">
        {insight}
      </p>
    </section>
  );
}
