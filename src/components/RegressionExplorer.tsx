"use client";

import RegressionScatterChart from "@/components/RegressionScatterChart";
import {
  OUTLIER_WEEK,
  allDisplayWeeks,
  fitLinearRegression,
  formatCoef,
  formatMoney,
  holdoutWeeks,
  modelSummary,
  predictInputs,
  revenueFromOrders,
  trainingWeeks,
} from "@/lib/regression-example-data";
import { useMemo, useState } from "react";

type ChartInput = "adSpendK" | "emailSendK";

const AD_MIN = 8;
const AD_MAX = 24;
const EMAIL_MIN = 60;
const EMAIL_MAX = 110;

export default function RegressionExplorer() {
  const [includeOutlier, setIncludeOutlier] = useState(false);
  const [chartInput, setChartInput] = useState<ChartInput>("adSpendK");
  const [adSpendK, setAdSpendK] = useState(17);
  const [emailSendK, setEmailSendK] = useState(90);

  const train = useMemo(() => trainingWeeks(includeOutlier), [includeOutlier]);
  const holdout = useMemo(() => holdoutWeeks(), []);
  const model = useMemo(() => fitLinearRegression(train, true, true), [train]);
  const displayWeeks = useMemo(() => allDisplayWeeks(includeOutlier), [includeOutlier]);

  const predicted = useMemo(
    () => Math.round(predictInputs(adSpendK, emailSendK, model)),
    [adSpendK, emailSendK, model],
  );

  const estRevenue = useMemo(() => revenueFromOrders(predicted), [predicted]);

  const chartWeeks = useMemo(
    () => displayWeeks.filter((w) => w.split === "train" || w.split === "holdout"),
    [displayWeeks],
  );

  const scatterLine = useMemo(() => {
    if (chartInput === "adSpendK") {
      return {
        intercept: model.intercept + model.emailCoef * emailSendK,
        slope: model.adSpendCoef,
      };
    }
    return {
      intercept: model.intercept + model.adSpendCoef * adSpendK,
      slope: model.emailCoef,
    };
  }, [model, chartInput, adSpendK, emailSendK]);

  const chartXLabel =
    chartInput === "adSpendK" ? "Weekly ad spend ($k)" : "Weekly email sends (k)";

  const plannedX = chartInput === "adSpendK" ? adSpendK : emailSendK;
  const plannedY = predicted;

  const holdoutAvgMiss = useMemo(() => {
    if (holdout.length === 0) {
      return 0;
    }
    const total = holdout.reduce(
      (sum, row) => sum + Math.abs(row.orders - Math.round(predictInputs(row.adSpendK, row.emailSendK, model))),
      0,
    );
    return Math.round(total / holdout.length);
  }, [holdout, model]);

  const modelWithoutOutlier = useMemo(
    () => fitLinearRegression(trainingWeeks(false), true, true),
    [],
  );
  const predictedNoOutlier = Math.round(predictInputs(adSpendK, emailSendK, modelWithoutOutlier));
  const outlierShift = predicted - predictedNoOutlier;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: move the inputs, watch the forecast
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        The line is fit on eight weeks of history. Weeks 9 and 10 were held back before anyone
        looked at the forecast (a reality check, not used to draw the line). Drag ad spend and
        email volume to see predicted orders and revenue.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--foreground)]">
          <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">Forecast orders</p>
          <p className="mt-1 text-3xl font-black tabular-nums">{predicted}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Est. revenue
          </p>
          <p className="mt-1 text-3xl font-black tabular-nums text-[color:var(--foreground)]">
            {formatMoney(estRevenue)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">at $50 per order</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Reality-check avg miss
          </p>
          <p className="mt-1 text-3xl font-black tabular-nums text-[color:var(--foreground)]">
            {holdoutAvgMiss}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">orders on weeks 9–10</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-bold text-[color:var(--foreground)]">{modelSummary(model)}</p>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            1. Chart view
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                chartInput === "adSpendK"
                  ? "bg-black text-white"
                  : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
              }`}
              onClick={() => setChartInput("adSpendK")}
              type="button"
            >
              Ad spend vs orders
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                chartInput === "emailSendK"
                  ? "bg-black text-white"
                  : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
              }`}
              onClick={() => setChartInput("emailSendK")}
              type="button"
            >
              Email sends vs orders
            </button>
          </div>
        </div>

        <RegressionScatterChart
          input={chartInput}
          line={scatterLine}
          outlierWeek={includeOutlier ? OUTLIER_WEEK : undefined}
          plannedX={plannedX}
          plannedY={plannedY}
          weeks={chartWeeks}
          xLabel={chartXLabel}
        />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            2. Plan next week
          </p>
          <div className="mt-3 space-y-4">
            <div>
              <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="ad-slider">
                Ad spend: ${adSpendK}k
              </label>
              <input
                className="mt-2 w-full accent-black"
                id="ad-slider"
                max={AD_MAX}
                min={AD_MIN}
                onChange={(e) => setAdSpendK(Number(e.target.value))}
                step={1}
                type="range"
                value={adSpendK}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="email-slider">
                Email sends: {emailSendK}k
              </label>
              <input
                className="mt-2 w-full accent-black"
                id="email-slider"
                max={EMAIL_MAX}
                min={EMAIL_MIN}
                onChange={(e) => setEmailSendK(Number(e.target.value))}
                step={1}
                type="range"
                value={emailSendK}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            3. Outlier week
          </p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Week 11 is a viral spike: normal marketing, unusually high orders. One point can tilt
            the whole line.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                !includeOutlier
                  ? "bg-black text-white"
                  : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
              }`}
              onClick={() => setIncludeOutlier(false)}
              type="button"
            >
              Without outlier
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                includeOutlier
                  ? "bg-black text-white"
                  : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
              }`}
              onClick={() => setIncludeOutlier(true)}
              type="button"
            >
              Include outlier
            </button>
          </div>
          {includeOutlier && (
            <p className="mt-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base text-[color:var(--muted)]">
              With the outlier in the fit, your plan shifts by{" "}
              <span className="font-bold text-[color:var(--foreground)]">
                {outlierShift >= 0 ? "+" : ""}
                {outlierShift} orders
              </span>{" "}
              vs the same sliders without it. Ad coef {formatCoef(model.adSpendCoef)}, email coef{" "}
              {formatCoef(model.emailCoef)}.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
