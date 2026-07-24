"use client";

import {
  CLASS_COLORS,
  CLASS_LABELS,
  argmax,
  formatNum,
  formatPct,
  softmax,
  softmaxReadout,
} from "@/lib/softmax-data";
import { useMemo, useState } from "react";

export default function SoftmaxExplorer() {
  const [logits, setLogits] = useState<number[]>([2, 1, 0.5]);
  const [tempTenths, setTempTenths] = useState(10);

  const temperature = tempTenths / 10;
  const probs = useMemo(() => softmax(logits, temperature), [logits, temperature]);
  const winner = argmax(probs);

  const setLogit = (index: number, value: number) => {
    setLogits((prev) => prev.map((z, i) => (i === index ? value : z)));
  };

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: raw scores into a probability distribution
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Three classes, three raw scores (logits). Softmax exponentiates and normalizes so the
        outputs are positive and sum to 100%. Temperature controls how sharp or hedged the result is.
      </p>

      <div className="mt-5 grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 sm:grid-cols-3">
        {logits.map((z, i) => (
          <div key={CLASS_LABELS[i]}>
            <label className="text-sm font-bold" htmlFor={`sm-${i}`} style={{ color: CLASS_COLORS[i] }}>
              Class {CLASS_LABELS[i]} score: {formatNum(z, 1)}
            </label>
            <input
              className="mt-2 w-full"
              id={`sm-${i}`}
              max={50}
              min={-50}
              onChange={(e) => setLogit(i, Number(e.target.value) / 10)}
              style={{ accentColor: CLASS_COLORS[i] }}
              type="range"
              value={z * 10}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="sm-temp">
          Temperature: {formatNum(temperature, 1)}
        </label>
        <input
          className="mt-2 w-full accent-[#7c3aed]"
          id="sm-temp"
          max={30}
          min={2}
          onChange={(e) => setTempTenths(Number(e.target.value))}
          type="range"
          value={tempTenths}
        />
        <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
          <span>0.2 (sharp)</span>
          <span>1.0 (default)</span>
          <span>3.0 (flat)</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {probs.map((prob, i) => (
          <div key={CLASS_LABELS[i]}>
            <div className="flex items-center justify-between text-sm font-bold">
              <span style={{ color: CLASS_COLORS[i] }}>
                Class {CLASS_LABELS[i]} {i === winner ? "(top)" : ""}
              </span>
              <span className="text-[color:var(--foreground)]">{formatPct(prob)}</span>
            </div>
            <div className="mt-1 h-5 w-full overflow-hidden rounded-full bg-[color:var(--surface-strong)]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${prob * 100}%`, background: CLASS_COLORS[i] }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {softmaxReadout(logits, temperature)}
      </p>
    </section>
  );
}
