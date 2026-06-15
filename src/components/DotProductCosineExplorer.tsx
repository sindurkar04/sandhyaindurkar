"use client";

import {
  SCENARIOS,
  cosineSimilarity,
  dot,
  formatNum,
  norm,
  similarityReadout,
  type ScenarioKey,
} from "@/lib/dot-product-cosine-data";
import { useState } from "react";

export default function DotProductCosineExplorer() {
  const [key, setKey] = useState<ScenarioKey>("doc_search");
  const scenario = SCENARIOS[key];
  const d = dot(scenario.query, scenario.candidate);
  const cos = cosineSimilarity(scenario.query, scenario.candidate);
  const qNorm = norm(scenario.query);
  const cNorm = norm(scenario.candidate);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: dot product vs cosine similarity
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Dot product rewards overlap and length. Cosine measures angle: how aligned are the directions?
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
            onClick={() => setKey(scenarioKey)}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 overflow-x-auto rounded-lg border border-[color:var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
              <th className="px-4 py-2 text-left font-bold">Vector</th>
              {scenario.featureLabels.map((label) => (
                <th className="px-4 py-2 text-right font-bold" key={label}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--border)]">
              <td className="px-4 py-2 font-bold">{scenario.queryLabel}</td>
              {scenario.query.map((v, i) => (
                <td className="px-4 py-2 text-right font-mono" key={i}>
                  {formatNum(v, v < 1 ? 2 : 0)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-2 font-bold">{scenario.candidateLabel}</td>
              {scenario.candidate.map((v, i) => (
                <td className="px-4 py-2 text-right font-mono" key={i}>
                  {formatNum(v, v < 1 ? 2 : 0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Dot product</p>
          <p className="mt-1 text-2xl font-black">{formatNum(d)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Cosine</p>
          <p className="mt-1 text-2xl font-black">{formatNum(cos)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">||query||</p>
          <p className="mt-1 text-2xl font-black">{formatNum(qNorm)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">||candidate||</p>
          <p className="mt-1 text-2xl font-black">{formatNum(cNorm)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {similarityReadout(scenario)}
      </p>
    </section>
  );
}
