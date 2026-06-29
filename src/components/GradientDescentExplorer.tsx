"use client";

import {
  COLORS,
  SCENARIOS,
  formatNum,
  gdReadout,
  lossFn,
  runGradientDescent,
  type ScenarioKey,
} from "@/lib/gradient-descent-optimizers-data";
import { useMemo, useState } from "react";

const W = 360;
const H = 240;
const PAD = 36;

export default function GradientDescentExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("quadratic");
  const scenario = SCENARIOS[scenarioKey];
  const [lr, setLr] = useState(scenario.defaultLr);
  const [start, setStart] = useState(scenario.defaultStart);
  const [steps, setSteps] = useState(12);

  const curve = useMemo(() => {
    const pts: { w: number; loss: number }[] = [];
    const minW = Math.min(start, scenario.optimum) - 1.5;
    const maxW = Math.max(start, scenario.optimum) + 1.5;
    for (let i = 0; i <= 60; i += 1) {
      const w = minW + ((maxW - minW) * i) / 60;
      pts.push({ w, loss: lossFn(scenario, w) });
    }
    return pts;
  }, [scenario, start]);

  const path = useMemo(() => runGradientDescent(scenario, start, lr, steps), [scenario, start, lr, steps]);

  const maxLoss = Math.max(...curve.map((c) => c.loss), 0.5);
  const minW = curve[0].w;
  const maxW = curve[curve.length - 1].w;
  const xScale = (w: number) => PAD + ((w - minW) / (maxW - minW)) * (W - PAD * 2);
  const yScale = (loss: number) => PAD + (1 - loss / maxLoss) * (H - PAD * 2);

  const curvePath = curve.map((c, i) => `${i === 0 ? "M" : "L"} ${xScale(c.w)} ${yScale(c.loss)}`).join(" ");
  const pathD = path.map((s, i) => `${i === 0 ? "M" : "L"} ${xScale(s.w)} ${yScale(s.loss)}`).join(" ");

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: gradient descent steps along the loss curve
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Each step moves opposite the gradient. Learning rate controls step size; too large oscillates.
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
              setLr(SCENARIOS[key].defaultLr);
              setStart(SCENARIOS[key].defaultStart);
            }}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-indigo-50/70 to-violet-50/40 p-4">
        <svg className="mx-auto block w-full max-w-[360px]" height={H} viewBox={`0 0 ${W} ${H}`} width={W}>
          <path d={`${curvePath} L ${xScale(maxW)} ${yScale(0)} L ${xScale(minW)} ${yScale(0)} Z`} fill={COLORS.fill} opacity={0.5} />
          <path d={curvePath} fill="none" stroke={COLORS.curve} strokeWidth={2.5} />
          <path d={pathD} fill="none" stroke={COLORS.path} strokeDasharray="6 4" strokeWidth={2} />
          {path.map((s, i) => (
            <circle
              cx={xScale(s.w)}
              cy={yScale(s.loss)}
              fill={i === 0 ? COLORS.point : i === path.length - 1 ? COLORS.min : COLORS.path}
              key={i}
              opacity={i === 0 || i === path.length - 1 ? 1 : 0.7}
              r={i === 0 || i === path.length - 1 ? 7 : 4}
              stroke="white"
              strokeWidth={1.5}
            />
          ))}
          <line
            stroke={COLORS.min}
            strokeDasharray="4 3"
            strokeWidth={1.5}
            x1={xScale(scenario.optimum)}
            x2={xScale(scenario.optimum)}
            y1={PAD}
            y2={H - PAD}
          />
        </svg>
        <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
          Purple = start · Green line = minimum · Orange path = gradient steps
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <label className="text-xs font-bold" htmlFor="lr">Learning rate: {formatNum(lr)}</label>
          <input className="mt-2 w-full accent-indigo-600" id="lr" max={0.6} min={0.02} onChange={(e) => setLr(Number(e.target.value))} step={0.02} type="range" value={lr} />
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <label className="text-xs font-bold" htmlFor="start">Start w: {formatNum(start)}</label>
          <input className="mt-2 w-full accent-violet-600" id="start" max={4} min={-4} onChange={(e) => setStart(Number(e.target.value))} step={0.1} type="range" value={start} />
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <label className="text-xs font-bold" htmlFor="steps">Steps: {steps}</label>
          <input className="mt-2 w-full accent-orange-500" id="steps" max={25} min={2} onChange={(e) => setSteps(Number(e.target.value))} type="range" value={steps} />
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {gdReadout(scenario, lr, path)}
      </p>
    </section>
  );
}
