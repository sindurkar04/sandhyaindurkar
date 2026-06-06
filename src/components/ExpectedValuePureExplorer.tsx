"use client";

import {
  EV_PRESETS,
  evRead,
  expectedValue,
  normalizeProbabilities,
  probabilitySum,
  probabilitySumRead,
  type Outcome,
} from "@/lib/expected-value-pure-data";
import { chartColor } from "@/lib/chart-colors";
import { useMemo, useState } from "react";

const CHART_W = 560;
const CHART_H = 200;

export default function ExpectedValuePureExplorer() {
  const [presetId, setPresetId] = useState("default");
  const preset = EV_PRESETS.find((p) => p.id === presetId) ?? EV_PRESETS[0];
  const [outcomes, setOutcomes] = useState<Outcome[]>(preset.outcomes);

  function loadPreset(id: string) {
    const next = EV_PRESETS.find((p) => p.id === id);
    if (!next) return;
    setPresetId(id);
    setOutcomes(next.outcomes.map((o) => ({ ...o })));
  }

  const normalized = useMemo(() => normalizeProbabilities(outcomes), [outcomes]);
  const ev = useMemo(() => expectedValue(normalized), [normalized]);
  const probTotal = useMemo(() => probabilitySum(outcomes), [outcomes]);
  const contributions = normalized.map((o) => ({
    ...o,
    contrib: o.probability * o.value,
  }));
  const maxAbs = Math.max(...contributions.map((c) => Math.abs(c.contrib)), Math.abs(ev), 1);
  const maxVal = Math.max(...outcomes.map((o) => Math.abs(o.value)), 1);

  function updateOutcome(id: string, patch: Partial<Outcome>) {
    setOutcomes((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: build expected value from outcomes
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        List every outcome, assign a probability to each, assign a numeric value. Expected value is
        the probability-weighted average: EV = sum of (p x value). One flashy upside does not help if
        its probability is tiny.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {EV_PRESETS.map((p) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              presetId === p.id
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--foreground)]"
            }`}
            key={p.id}
            onClick={() => loadPreset(p.id)}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-[color:var(--muted)]">{preset.description}</p>

      <div className="mt-5 space-y-4">
        {outcomes.map((outcome, index) => {
          const norm = normalized.find((o) => o.id === outcome.id)!;
          const contrib = norm.probability * outcome.value;
          return (
            <div className="rounded-lg border border-[color:var(--border)] p-4" key={outcome.id}>
              <p className="text-sm font-bold text-[color:var(--foreground)]">{outcome.label}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
                    Probability: {(outcome.probability * 100).toFixed(0)}%
                  </label>
                  <input
                    className="mt-1 w-full accent-black"
                    max={100}
                    min={0}
                    onChange={(e) =>
                      updateOutcome(outcome.id, { probability: Number(e.target.value) / 100 })
                    }
                    step={1}
                    type="range"
                    value={Math.round(outcome.probability * 100)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
                    Value: {outcome.value}
                  </label>
                  <input
                    className="mt-1 w-full accent-black"
                    max={12000}
                    min={-30}
                    onChange={(e) => updateOutcome(outcome.id, { value: Number(e.target.value) })}
                    step={1}
                    type="range"
                    value={outcome.value}
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Contribution: {(norm.probability * 100).toFixed(1)}% x {outcome.value} ={" "}
                <span className="font-bold text-[color:var(--foreground)]">{contrib.toFixed(2)}</span>
              </p>
              <div className="mt-2 h-3 overflow-hidden rounded bg-[#f3f4f6]">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${(Math.abs(contrib) / maxAbs) * 100}%`,
                    backgroundColor: chartColor(index),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Contribution bars: each outcome&apos;s p x value
        </p>
        <svg aria-hidden="true" className="w-full" viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
          {contributions.map((c, i) => {
            const barW = (Math.abs(c.contrib) / maxAbs) * 360;
            const y = 30 + i * 42;
            return (
              <g key={c.id}>
                <text fill="#374151" fontSize={12} fontWeight={600} x={8} y={y + 14}>
                  {c.label}
                </text>
                <rect
                  fill={c.contrib >= 0 ? chartColor(i) : "#fca5a5"}
                  height={22}
                  rx={3}
                  width={Math.max(barW, 2)}
                  x={120}
                  y={y}
                />
                <text fill="#111" fontSize={12} fontWeight={700} x={128 + barW + 6} y={y + 15}>
                  {c.contrib.toFixed(2)}
                </text>
              </g>
            );
          })}
          <line stroke="#111" strokeDasharray="5 4" strokeWidth={2} x1={120} x2={480} y1={175} y2={175} />
          <text fill="#111" fontSize={13} fontWeight={700} x={120} y={192}>
            EV = {ev.toFixed(2)} (sum of contributions)
          </text>
        </svg>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)] p-4">
        <p className="mb-3 text-sm font-bold text-[color:var(--foreground)]">
          Outcome values on a number line (bar height = probability)
        </p>
        <svg aria-hidden="true" className="w-full" viewBox="0 0 560 140">
          <line stroke="#9ca3af" strokeWidth={2} x1={40} x2={520} y1={100} y2={100} />
          {outcomes.map((o, i) => {
            const norm = normalized.find((x) => x.id === o.id)!;
            const x = 40 + ((o.value + maxVal) / (2 * maxVal)) * 480;
            const h = norm.probability * 80;
            return (
              <g key={o.id}>
                <rect
                  fill={chartColor(i)}
                  height={h}
                  opacity={0.85}
                  width={14}
                  x={x - 7}
                  y={100 - h}
                />
                <text fill="#374151" fontSize={10} textAnchor="middle" x={x} y={118}>
                  {o.value}
                </text>
              </g>
            );
          })}
          <line stroke="#111" strokeWidth={3} x1={40 + ((ev + maxVal) / (2 * maxVal)) * 480} x2={40 + ((ev + maxVal) / (2 * maxVal)) * 480} y1={20} y2={105} />
          <text fill="#111" fontSize={12} fontWeight={700} x={44 + ((ev + maxVal) / (2 * maxVal)) * 480} y={16}>
            EV
          </text>
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Expected value
          </p>
          <p className="mt-1 text-3xl font-black">{ev.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Probability sum
          </p>
          <p className="mt-1 text-3xl font-black">{(probTotal * 100).toFixed(0)}%</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{probabilitySumRead(probTotal)}</p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-[color:var(--border)]">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] bg-[#fafafa]">
              <th className="px-4 py-2 font-bold">Outcome</th>
              <th className="px-4 py-2 font-bold">p</th>
              <th className="px-4 py-2 font-bold">Value</th>
              <th className="px-4 py-2 font-bold">p x value</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((c) => (
              <tr className="border-b border-[color:var(--border)]" key={c.id}>
                <td className="px-4 py-2">{c.label}</td>
                <td className="px-4 py-2">{(c.probability * 100).toFixed(1)}%</td>
                <td className="px-4 py-2">{c.value}</td>
                <td className="px-4 py-2 font-bold">{c.contrib.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2 font-bold" colSpan={3}>
                Expected value (sum)
              </td>
              <td className="px-4 py-2 font-black">{ev.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {evRead(ev)}
      </p>
    </section>
  );
}
