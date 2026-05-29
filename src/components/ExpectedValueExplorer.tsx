"use client";

import {
  DEFAULT_OPTION_A,
  DEFAULT_OPTION_B,
  compareRead,
  expectedValueK,
  formatMoneyK,
  formatPercent,
  type BetOption,
} from "@/lib/expected-value-data";
import { useMemo, useState } from "react";

function OptionCard({
  option,
  onChange,
  highlight,
}: {
  option: BetOption;
  onChange: (next: BetOption) => void;
  highlight: boolean;
}) {
  const ev = expectedValueK(option);

  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight ? "border-black bg-black text-white" : "border-[color:var(--border)] bg-[color:var(--surface-strong)]"
      }`}
    >
      <p className={`text-sm font-bold ${highlight ? "opacity-90" : "text-[color:var(--foreground)]"}`}>
        {option.label}
      </p>
      <p className={`mt-2 text-3xl font-black tabular-nums ${highlight ? "" : "text-[color:var(--foreground)]"}`}>
        {formatMoneyK(ev)}
      </p>
      <p className={`mt-1 text-xs ${highlight ? "opacity-80" : "text-[color:var(--muted)]"}`}>
        expected profit
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.1em]" htmlFor={`${option.id}-cost`}>
            Cost: ${option.costK}k
          </label>
          <input
            className="mt-1 w-full accent-black"
            id={`${option.id}-cost`}
            max={80}
            min={5}
            onChange={(e) => onChange({ ...option, costK: Number(e.target.value) })}
            step={1}
            type="range"
            value={option.costK}
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.1em]" htmlFor={`${option.id}-p`}>
            Win chance: {formatPercent(option.successRate)}
          </label>
          <input
            className="mt-1 w-full accent-black"
            id={`${option.id}-p`}
            max={80}
            min={5}
            onChange={(e) => onChange({ ...option, successRate: Number(e.target.value) })}
            step={1}
            type="range"
            value={option.successRate}
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.1em]" htmlFor={`${option.id}-pay`}>
            Payout if win: ${option.payoutK}k
          </label>
          <input
            className="mt-1 w-full accent-black"
            id={`${option.id}-pay`}
            max={500}
            min={20}
            onChange={(e) => onChange({ ...option, payoutK: Number(e.target.value) })}
            step={5}
            type="range"
            value={option.payoutK}
          />
        </div>
      </div>
      <p className={`mt-3 text-xs ${highlight ? "opacity-80" : "text-[color:var(--muted)]"}`}>
        EV = ({formatPercent(option.successRate)} × ${option.payoutK}k) − ${option.costK}k
      </p>
    </div>
  );
}

export default function ExpectedValueExplorer() {
  const [optionA, setOptionA] = useState(DEFAULT_OPTION_A);
  const [optionB, setOptionB] = useState(DEFAULT_OPTION_B);

  const evA = useMemo(() => expectedValueK(optionA), [optionA]);
  const evB = useMemo(() => expectedValueK(optionB), [optionB]);
  const aWins = evA >= evB;

  return (
    <section className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: compare two bets
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--muted)]">
        Expected value blends upside, chance, and cost. A big swing can lose on average even when
        the jackpot sounds exciting. Drag the sliders on each option.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <OptionCard highlight={aWins} onChange={setOptionA} option={optionA} />
        <OptionCard highlight={!aWins} onChange={setOptionB} option={optionB} />
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--muted)]">
        {compareRead(evA, evB)}
      </p>
    </section>
  );
}
