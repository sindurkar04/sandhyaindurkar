"use client";

import type { BatchPlan } from "@/lib/prime-factorization-data";

type Props = {
  total: number;
  plan: BatchPlan;
  unitLabel: string;
};

export default function PrimeBatchSplitChart({ total, plan, unitLabel }: Props) {
  const segments: { size: number; kind: "full" | "partial" }[] = [];
  for (let i = 0; i < plan.fullBatches; i += 1) {
    segments.push({ size: plan.batchSize, kind: "full" });
  }
  if (plan.remainder > 0) {
    segments.push({ size: plan.remainder, kind: "partial" });
  }

  const maxSegments = 24;
  const condensed =
    segments.length > maxSegments
      ? [
          ...segments.slice(0, maxSegments - 1),
          {
            size: segments.slice(maxSegments - 1).reduce((sum, s) => sum + s.size, 0),
            kind: "partial" as const,
          },
        ]
      : segments;

  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
          Batch split
        </p>
        <p className="text-sm font-bold text-[color:var(--foreground)]">
          {plan.isClean
            ? `${plan.fullBatches} equal batches`
            : `${plan.fullBatches} full + 1 partial`}
        </p>
      </div>

      <div className="mt-4 flex h-14 w-full overflow-hidden rounded-md border border-[color:var(--border)] bg-white">
        {condensed.map((segment, index) => {
          const widthPercent = (segment.size / total) * 100;
          return (
            <div
              className={`h-full min-w-[2px] border-r border-white/30 last:border-r-0 ${
                segment.kind === "full" ? "bg-black" : "bg-[#d1d5db]"
              }`}
              key={`${segment.kind}-${index}`}
              style={{ width: `${widthPercent}%` }}
              title={
                segment.kind === "full"
                  ? `${plan.batchSize.toLocaleString()} ${unitLabel}`
                  : `${plan.remainder.toLocaleString()} ${unitLabel} leftover`
              }
            />
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Batch size
          </p>
          <p className="mt-1 text-lg font-black text-[color:var(--foreground)]">
            {plan.batchSize.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Full batches
          </p>
          <p className="mt-1 text-lg font-black text-[color:var(--foreground)]">
            {plan.fullBatches}
          </p>
        </div>
        <div className="col-span-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 sm:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Leftover
          </p>
          <p className="mt-1 text-lg font-black text-[color:var(--foreground)]">
            {plan.isClean ? "None" : plan.remainder.toLocaleString()}
          </p>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-[color:var(--muted)]">
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-5 rounded-sm bg-black" />
          Full batch
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-5 rounded-sm border border-black bg-[#d1d5db]" />
          Partial / leftover
        </li>
      </ul>
    </div>
  );
}
