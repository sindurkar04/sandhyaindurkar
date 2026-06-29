"use client";

import {
  LOSS_COLORS,
  LOSS_LABELS,
  curvePoints,
  formatNum,
  lossAt,
  lossReadout,
  type LossKey,
} from "@/lib/classification-loss-functions-data";
import { useMemo, useState } from "react";

const W = 360;
const H = 220;
const PAD = 40;

export default function ClassificationLossExplorer() {
  const [trueLabel, setTrueLabel] = useState<0 | 1>(1);
  const [predicted, setPredicted] = useState(62);
  const [activeLosses] = useState<LossKey[]>(["cross_entropy", "hinge", "zero_one"]);

  const p = predicted / 100;
  const curves = useMemo(
    () =>
      activeLosses.map((key) => ({
        key,
        points: curvePoints(trueLabel, key),
      })),
    [trueLabel, activeLosses],
  );

  const xScale = (prob: number) => PAD + prob * (W - PAD * 2);
  const yScale = (loss: number) => PAD + (1 - loss / 4) * (H - PAD * 2);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: why training uses smooth loss, not accuracy
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Drag predicted probability. Cross-entropy and hinge penalize confident mistakes; 0-1 loss is flat
        almost everywhere.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {([0, 1] as const).map((y) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              trueLabel === y ? "bg-black text-white" : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)]"
            }`}
            key={y}
            onClick={() => setTrueLabel(y)}
            type="button"
          >
            True label: {y === 1 ? "Positive (1)" : "Negative (0)"}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold" htmlFor="pred-p">
          Predicted probability: {predicted}%
        </label>
        <input
          className="mt-2 w-full accent-blue-600"
          id="pred-p"
          max={99}
          min={1}
          onChange={(e) => setPredicted(Number(e.target.value))}
          type="range"
          value={predicted}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-b from-slate-50 to-white p-4">
        <svg className="mx-auto block w-full max-w-[360px]" height={H} viewBox={`0 0 ${W} ${H}`} width={W}>
          {[0, 1, 2, 3, 4].map((tick) => (
            <line
              key={tick}
              stroke="#e2e8f0"
              x1={PAD}
              x2={W - PAD}
              y1={yScale(tick)}
              y2={yScale(tick)}
            />
          ))}
          {curves.map(({ key, points }) => {
            const d = points.map((pt, i) => `${i === 0 ? "M" : "L"} ${xScale(pt.p)} ${yScale(pt.loss)}`).join(" ");
            return <path d={d} fill="none" key={key} stroke={LOSS_COLORS[key]} strokeWidth={2.5} />;
          })}
          <line
            stroke="#8b5cf6"
            strokeDasharray="5 4"
            strokeWidth={2}
            x1={xScale(p)}
            x2={xScale(p)}
            y1={PAD}
            y2={H - PAD}
          />
          {activeLosses.map((key) => {
            const loss = lossAt(trueLabel, p, key);
            const displayLoss = key === "zero_one" ? loss : Math.min(loss, 4);
            return (
              <circle
                cx={xScale(p)}
                cy={yScale(displayLoss)}
                fill={LOSS_COLORS[key]}
                key={key}
                r={6}
                stroke="white"
                strokeWidth={2}
              />
            );
          })}
          <text fill="#64748b" fontSize={10} fontWeight="700" textAnchor="middle" x={W / 2} y={H - 8}>
            Predicted probability
          </text>
        </svg>
        <ul className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
          {activeLosses.map((key) => (
            <li className="flex items-center gap-1.5" key={key}>
              <span className="h-2.5 w-5 rounded-sm" style={{ background: LOSS_COLORS[key] }} />
              {LOSS_LABELS[key]}: {formatNum(lossAt(trueLabel, p, key))}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {lossReadout(trueLabel, p)}
      </p>
    </section>
  );
}
