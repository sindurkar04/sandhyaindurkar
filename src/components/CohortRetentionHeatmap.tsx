"use client";

import { heatmapCellStyle, type HeatmapData } from "@/lib/cohort-analysis-data";

type CohortRetentionHeatmapProps = {
  data: HeatmapData;
};

export default function CohortRetentionHeatmap({ data }: CohortRetentionHeatmapProps) {
  return (
    <div className="mt-6 space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-bold text-[color:var(--foreground)]">Cohort retention heatmap</p>
        <p className="text-sm text-[color:var(--muted)]">{data.businessLabel}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <caption className="sr-only">
            Retention heatmap by signup cohort and weeks since signup. Darker cells mean higher
            retention.
          </caption>
          <thead>
            <tr>
              <th
                className="border-b border-r border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]"
                scope="col"
              >
                Cohort
              </th>
              {data.periodLabels.map((label) => (
                <th
                  className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)] px-2 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]"
                  key={label}
                  scope="col"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rates.map((row, rowIndex) => (
              <tr key={data.cohortLabels[rowIndex]}>
                <th
                  className="border-b border-r border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-left font-bold text-[color:var(--foreground)]"
                  scope="row"
                >
                  {data.cohortLabels[rowIndex]}
                </th>
                {row.map((rate, colIndex) => {
                  const style = heatmapCellStyle(rate);
                  return (
                    <td
                      className="border-b border-[color:var(--border)] px-2 py-2 text-center font-bold tabular-nums"
                      key={`${data.cohortLabels[rowIndex]}-${data.periodLabels[colIndex]}`}
                      style={style}
                    >
                      {rate}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[color:var(--muted)]">
        <span>Lower retention</span>
        <div className="flex h-3 flex-1 max-w-[200px] overflow-hidden rounded-full border border-[color:var(--border)]">
          <div className="h-full flex-1 bg-[color:var(--surface-strong)]" />
          <div className="h-full flex-1 bg-[#9ca3af]" />
          <div className="h-full flex-1 bg-[#6b7280]" />
          <div className="h-full flex-1 bg-black" />
        </div>
        <span>Higher retention</span>
      </div>

      <p className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm leading-relaxed text-[color:var(--muted)]">
        {data.readout}
      </p>
    </div>
  );
}
