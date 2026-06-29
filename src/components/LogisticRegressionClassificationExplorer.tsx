"use client";

import {
  COLORS,
  SCENARIOS,
  accuracyOnPoints,
  boundaryY,
  classifyPoint,
  formatNum,
  formatPct,
  logisticReadout,
  predictProba,
  sigmoid,
  type ScenarioKey,
} from "@/lib/logistic-regression-classification-data";
import { useMemo, useState } from "react";

const W = 360;
const H = 280;
const PAD = 36;

function toSvg(x: number, y: number) {
  return { sx: PAD + x * (W - PAD * 2), sy: PAD + (1 - y) * (H - PAD * 2) };
}

export default function LogisticRegressionClassificationExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud_score");
  const scenario = SCENARIOS[scenarioKey];
  const [w0, setW0] = useState(scenario.defaultW0);
  const [w1, setW1] = useState(scenario.defaultW1);
  const [w2, setW2] = useState(scenario.defaultW2);
  const [cutoff, setCutoff] = useState(50);

  const cutoffP = cutoff / 100;
  const accuracy = useMemo(
    () => accuracyOnPoints(scenario.points, w0, w1, w2, cutoffP),
    [scenario.points, w0, w1, w2, cutoffP],
  );

  const boundaryPts: string[] = [];
  for (let i = 0; i <= 20; i += 1) {
    const x = i / 20;
    const y = boundaryY(x, w0, w1, w2);
    if (y !== null && y >= 0 && y <= 1) {
      const { sx, sy } = toSvg(x, y);
      boundaryPts.push(`${boundaryPts.length === 0 ? "M" : "L"} ${sx} ${sy}`);
    }
  }
  const boundaryPath = boundaryPts.join(" ");

  const sigW = 320;
  const sigH = 120;
  const sigPad = 28;
  const sigmoidPath = Array.from({ length: 41 }, (_, i) => {
    const x = i / 40;
    const z = w0 + w1 * 0.5 + w2 * 0.5 + (x - 0.5) * 6;
    const p = sigmoid(z);
    const sx = sigPad + x * (sigW - sigPad * 2);
    const sy = sigPad + (1 - p) * (sigH - sigPad * 2);
    return `${i === 0 ? "M" : "L"} ${sx} ${sy}`;
  }).join(" ");

  function selectScenario(key: ScenarioKey) {
    const s = SCENARIOS[key];
    setScenarioKey(key);
    setW0(s.defaultW0);
    setW1(s.defaultW1);
    setW2(s.defaultW2);
  }

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: linear boundary and sigmoid probability
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Adjust weights to rotate the boundary. The cutoff turns probability into a class label.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              scenarioKey === key
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)]"
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

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-blue-50/50 to-orange-50/50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Feature space ({scenario.featureX} vs {scenario.featureY})
          </p>
          <svg className="mx-auto mt-2 block w-full max-w-[360px]" height={H} viewBox={`0 0 ${W} ${H}`} width={W}>
            <rect fill="#f8fafc" height={H - PAD * 2} width={W - PAD * 2} x={PAD} y={PAD} />
            {boundaryPath ? (
              <path d={boundaryPath} fill="none" stroke={COLORS.boundary} strokeDasharray="6 4" strokeWidth={2.5} />
            ) : null}
            {scenario.points.map((p, i) => {
              const { sx, sy } = toSvg(p.x, p.y);
              const pred = classifyPoint(p.x, p.y, w0, w1, w2, cutoffP);
              const correct = pred === p.label;
              const fill = p.label === 1 ? COLORS.class1 : COLORS.class0;
              return (
                <circle
                  cx={sx}
                  cy={sy}
                  fill={fill}
                  key={i}
                  opacity={correct ? 0.9 : 0.45}
                  r={8}
                  stroke={correct ? "white" : COLORS.wrong}
                  strokeWidth={correct ? 1.5 : 2.5}
                />
              );
            })}
          </svg>
        </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-indigo-50/60 to-white p-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Sigmoid curve</p>
          <svg className="mx-auto mt-2 block w-full max-w-[320px]" height={sigH} viewBox={`0 0 ${sigW} ${sigH}`} width={sigW}>
            <line stroke={COLORS.grid} x1={sigPad} x2={sigW - sigPad} y1={sigPad + (sigH - sigPad * 2) / 2} y2={sigPad + (sigH - sigPad * 2) / 2} />
            <path d={sigmoidPath} fill="none" stroke={COLORS.sigmoid} strokeWidth={2.5} />
            <line
              stroke="#f97316"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              x1={sigPad}
              x2={sigW - sigPad}
              y1={sigPad + (1 - cutoffP) * (sigH - sigPad * 2)}
              y2={sigPad + (1 - cutoffP) * (sigH - sigPad * 2)}
            />
          </svg>
          <p className="mt-1 text-center text-xs text-[color:var(--muted)]">Orange line = classification cutoff</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { id: "w0", label: "Bias w0", value: w0, set: setW0, min: -3, max: 3, step: 0.1 },
          { id: "w1", label: `Weight ${scenario.featureX}`, value: w1, set: setW1, min: -4, max: 4, step: 0.1 },
          { id: "w2", label: `Weight ${scenario.featureY}`, value: w2, set: setW2, min: -4, max: 4, step: 0.1 },
        ].map((slider) => (
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3" key={slider.id}>
            <label className="text-xs font-bold" htmlFor={slider.id}>
              {slider.label}: {formatNum(slider.value)}
            </label>
            <input
              className="mt-2 w-full accent-violet-600"
              id={slider.id}
              max={slider.max}
              min={slider.min}
              onChange={(e) => slider.set(Number(e.target.value))}
              step={slider.step}
              type="range"
              value={slider.value}
            />
          </div>
        ))}
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <label className="text-xs font-bold" htmlFor="cutoff">
            Cutoff: {cutoff}%
          </label>
          <input
            className="mt-2 w-full accent-orange-500"
            id="cutoff"
            max={95}
            min={5}
            onChange={(e) => setCutoff(Number(e.target.value))}
            type="range"
            value={cutoff}
          />
          <p className="mt-2 text-lg font-black text-[color:var(--foreground)]">{formatPct(accuracy)} train acc.</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {logisticReadout(scenario, cutoffP, accuracy)} Sample score at center:{" "}
        {formatPct(predictProba(0.5, 0.5, w0, w1, w2))}.
      </p>
    </section>
  );
}
