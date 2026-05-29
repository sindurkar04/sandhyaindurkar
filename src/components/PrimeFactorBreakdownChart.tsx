"use client";

import type { PrimeFactor } from "@/lib/prime-factorization-data";
import { formatFactorization, formatFactorTerm } from "@/lib/prime-factorization-data";

type Props = {
  factors: PrimeFactor[];
  total: number;
};

export default function PrimeFactorBreakdownChart({ factors, total }: Props) {
  const formula = formatFactorization(factors);

  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 sm:p-5">
      <p className="text-center text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
        Prime building blocks
      </p>
      <p className="mt-2 text-center text-2xl font-black tracking-tight text-[color:var(--foreground)]">
        {total.toLocaleString()} = {formula}
      </p>

      <div className="mt-6 space-y-4">
        {factors.map((factor) => (
          <div className="flex flex-wrap items-center gap-3" key={factor.prime}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-sm font-black text-white">
              {factor.prime}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: factor.exponent }).map((_, index) => (
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold ${
                    index === factor.exponent - 1
                      ? "bg-black text-white"
                      : "border border-[color:var(--border-strong)] bg-white text-[color:var(--foreground)]"
                  }`}
                  key={`${factor.prime}-${index}`}
                >
                  {factor.prime}
                </span>
              ))}
            </div>
            <span className="text-sm font-bold text-[color:var(--muted)]">
              {formatFactorTerm(factor.prime, factor.exponent)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[color:var(--muted)]">
        <span className="font-bold text-[color:var(--foreground)]">Multiply</span>
        <span>all groups</span>
        <span className="font-bold text-[color:var(--foreground)]">=</span>
        <span className="rounded-md bg-black px-2 py-0.5 font-bold text-white">
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
