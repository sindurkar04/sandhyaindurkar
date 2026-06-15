"use client";

import {
  bestFit,
  leastSquaresReadout,
  totalSquaredError,
} from "@/lib/least-squares-geometry-data";
import { useMemo, useState } from "react";

export default function LeastSquaresGeometryExplorer() {
  const fit = useMemo(() => bestFit(), []);
  const [intercept, setIntercept] = useState(Number(fit.intercept.toFixed(2)));
  const [slope, setSlope] = useState(Number(fit.slope.toFixed(2)));

  const sse = totalSquaredError(intercept, slope);
  const bestSse = totalSquaredError(fit.intercept, fit.slope);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: total squared error as you move the line
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Each point contributes (actual − predicted)². Least squares minimizes the sum.
      </p>

      <div className="mt-5 space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div>
          <label className="text-sm font-bold" htmlFor="ls-intercept">
            Intercept: {intercept.toFixed(2)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="ls-intercept"
            max={5}
            min={0}
            onChange={(e) => setIntercept(Number(e.target.value))}
            step={0.1}
            type="range"
            value={intercept}
          />
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="ls-slope">
            Slope: {slope.toFixed(2)}
          </label>
          <input
            className="mt-2 w-full accent-black"
            id="ls-slope"
            max={1.5}
            min={0.5}
            onChange={(e) => setSlope(Number(e.target.value))}
            step={0.05}
            type="range"
            value={slope}
          />
        </div>
        <button
          className="rounded-lg bg-black px-4 py-2 text-sm font-bold text-white"
          onClick={() => {
            setIntercept(Number(fit.intercept.toFixed(2)));
            setSlope(Number(fit.slope.toFixed(2)));
          }}
          type="button"
        >
          Reset to best fit
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Your SSE</p>
          <p className="mt-1 text-3xl font-black">{sse.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Minimum SSE</p>
          <p className="mt-1 text-3xl font-black">{bestSse.toFixed(2)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {leastSquaresReadout(intercept, slope)}
      </p>
    </section>
  );
}
