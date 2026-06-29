"use client";

import {
  COLORS,
  SCENARIOS,
  accuracy,
  splitsForDepth,
  treeReadout,
  type ScenarioKey,
} from "@/lib/decision-trees-classification-data";
import { useMemo, useState } from "react";

const W = 360;
const H = 300;
const PAD = 36;

function toSvg(x: number, y: number) {
  return { sx: PAD + x * (W - PAD * 2), sy: PAD + (1 - y) * (H - PAD * 2) };
}

export default function DecisionTreesClassificationExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud_rules");
  const scenario = SCENARIOS[scenarioKey];
  const [depth, setDepth] = useState(scenario.defaultDepth);

  const splits = useMemo(() => splitsForDepth(depth), [depth]);
  const acc = useMemo(() => accuracy(scenario.points, splits), [scenario.points, splits]);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: axis splits carve readable regions
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Increase tree depth to add vertical and horizontal rules. Each split is a policy line ops can audit.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              scenarioKey === key ? "bg-black text-white" : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)]"
            }`}
            key={key}
            onClick={() => {
              setScenarioKey(key);
              setDepth(SCENARIOS[key].defaultDepth);
            }}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_180px]">
        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-blue-50/40 to-orange-50/40 p-3">
          <svg className="mx-auto block w-full max-w-[360px]" height={H} viewBox={`0 0 ${W} ${H}`} width={W}>
            <rect fill="#f8fafc" height={H - PAD * 2} width={W - PAD * 2} x={PAD} y={PAD} />
            {splits.map((split, i) => {
              if (split.axis === "x") {
                const { sx } = toSvg(split.value, 0);
                return (
                  <line
                    key={i}
                    stroke={COLORS.split}
                    strokeDasharray="6 4"
                    strokeWidth={2}
                    x1={sx}
                    x2={sx}
                    y1={PAD}
                    y2={H - PAD}
                  />
                );
              }
              const { sy } = toSvg(0, split.value);
              return (
                <line
                  key={i}
                  stroke={COLORS.split}
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  x1={PAD}
                  x2={W - PAD}
                  y1={sy}
                  y2={sy}
                />
              );
            })}
            {scenario.points.map((p, i) => {
              const { sx, sy } = toSvg(p.x, p.y);
              return (
                <circle
                  cx={sx}
                  cy={sy}
                  fill={p.label === 1 ? COLORS.class1 : COLORS.class0}
                  key={i}
                  r={8}
                  stroke="white"
                  strokeWidth={1.5}
                />
              );
            })}
          </svg>
          <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
            {scenario.featureX} (horizontal) · {scenario.featureY} (vertical) · Purple = splits
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
            <label className="text-sm font-bold" htmlFor="depth">
              Tree depth: {depth}
            </label>
            <input
              className="mt-2 w-full accent-violet-600"
              id="depth"
              max={4}
              min={0}
              onChange={(e) => setDepth(Number(e.target.value))}
              type="range"
              value={depth}
            />
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Train accuracy</p>
            <p className="mt-1 text-3xl font-black text-[color:var(--foreground)]">{(acc * 100).toFixed(0)}%</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{splits.length} split(s)</p>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {treeReadout(scenario, depth, acc)}
      </p>
    </section>
  );
}
