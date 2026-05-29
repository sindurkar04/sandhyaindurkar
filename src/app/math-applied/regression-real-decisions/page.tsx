import DataTable from "@/components/DataTable";
import RegressionExplorerLoader from "@/components/RegressionExplorerLoader";
import {
  PRIMARY_MODEL,
  buildLeverRows,
  buildModelTrustRows,
  buildPlanningRows,
  buildRealityCheckRows,
  modelSummary,
} from "@/lib/regression-example-data";
import Image from "next/image";

const planningColumns = [
  { key: "plan" as const, header: "Plan", align: "left" as const },
  { key: "adSpendK" as const, header: "Ad ($k)", align: "right" as const },
  { key: "emailSendK" as const, header: "Email (k)", align: "right" as const },
  { key: "forecastOrders" as const, header: "Forecast orders", align: "right" as const },
  { key: "estRevenue" as const, header: "Est. revenue", align: "right" as const },
  { key: "vsPlanned" as const, header: "Vs planned", align: "left" as const },
];

const realityColumns = [
  { key: "week" as const, header: "Week", align: "left" as const },
  { key: "actualOrders" as const, header: "Actual orders", align: "right" as const },
  { key: "forecastOrders" as const, header: "Forecast", align: "right" as const },
  { key: "gap" as const, header: "Gap", align: "left" as const },
  { key: "decision" as const, header: "How to read it", align: "left" as const },
];

const trustColumns = [
  { key: "approach" as const, header: "Approach", align: "left" as const },
  { key: "avgMissOnHistory" as const, header: "Avg miss on history", align: "right" as const },
  { key: "avgMissOnRealityCheck" as const, header: "Avg miss on reality check", align: "right" as const },
  { key: "recommendation" as const, header: "Recommendation", align: "left" as const },
];

const leverColumns = [
  { key: "lever" as const, header: "If you change…", align: "left" as const },
  { key: "orderChange" as const, header: "Order impact", align: "right" as const },
  { key: "revenueChange" as const, header: "Revenue impact", align: "right" as const },
];

export default function RegressionPostPage() {
  const planningRows = buildPlanningRows(PRIMARY_MODEL);
  const realityRows = buildRealityCheckRows(PRIMARY_MODEL);
  const trustRows = buildModelTrustRows(false);
  const leverRows = buildLeverRows(PRIMARY_MODEL);

  return (
    <main className="mx-auto w-full max-w-[720px] space-y-7 px-4 py-10 sm:px-6">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Regression for Prediction -- One Real Example from Data to Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Regression line and forecast visual"
              className="h-auto w-full object-contain"
              height={500}
              src="/regression_mean.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            In business data work, regression usually means building a rule that turns inputs
            into a predicted number. You choose inputs you can measure or control (ad spend,
            email volume, price, staffing hours). The model learns weights called parameters.
            Then you use it to forecast, compare plans, and tune budgets.
          </p>
          <p>
            This is different from the phrase regression to the mean, which describes how
            extreme scores often move back toward average over time. Same word, different idea.
            Here we focus on predictive regression.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Regression answers: If inputs look like X, what outcome should we expect?
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            One real example: weekly orders for an online brand
          </h2>
          <p>
            A growth team wants to predict weekly orders from marketing inputs. They have ten
            weeks of history. Eight weeks are used to learn the pattern. Two weeks are set aside
            before anyone trusts the forecast.
          </p>

          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-4 text-sm leading-relaxed text-[color:var(--muted)]">
            <p className="font-bold text-[color:var(--foreground)]">
              What are train and holdout? (plain language)
            </p>
            <p className="mt-2">
              <span className="font-bold text-[color:var(--foreground)]">Train</span> means the
              weeks the model learned from (like studying past quizzes before a test).{" "}
              <span className="font-bold text-[color:var(--foreground)]">Holdout</span> means
              weeks you hide on purpose and only peek at after the forecast is written (like a
              final exam you did not use to study). If the forecast is close on holdout weeks,
              you can use it for next week&apos;s budget. If not, widen your range or fix the
              inputs.
            </p>
          </div>

          <RegressionExplorerLoader />

          <p className="text-sm font-bold text-[color:var(--foreground)]">{modelSummary(PRIMARY_MODEL)}</p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Business planning: three budget scenarios
          </h2>
          <p>
            The explorer sliders are for play. The table below is what you would put in a
            leadership memo: conservative, planned, and aggressive marketing, with forecast orders
            and estimated revenue.
          </p>

          <DataTable
            caption="Table 1: Next-week scenarios (full model, no outlier week)"
            columns={planningColumns}
            rows={planningRows}
          />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Reality check: did the forecast survive new weeks?
          </h2>
          <p>
            Weeks 9 and 10 were not used to draw the regression line. This table is the business
            read: how far off was the forecast, and should we still trust the model for planning?
          </p>

          <DataTable
            caption="Table 2: Holdout weeks (forecast written before seeing these results)"
            columns={realityColumns}
            rows={realityRows}
          />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Which inputs belong in the model?
          </h2>
          <p>
            Tuning is deciding which levers to include. Fewer inputs are simpler. More inputs can
            help, or can overfit when you only have a handful of weeks. The table compares average
            miss on history vs on the reality-check weeks.
          </p>

          <DataTable
            caption="Table 3: Which approach to trust for next week"
            columns={trustColumns}
            rows={trustRows}
          />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            What one unit of spend buys you
          </h2>
          <p>
            Regression coefficients turn into business levers. From the planned week baseline
            ($17k ads, 90k emails), here is the incremental lift if you move one input and hold
            the other flat.
          </p>

          <DataTable
            caption="Table 4: Incremental lift from the regression line"
            columns={leverColumns}
            rows={leverRows}
          />

          <p>
            Regression connects the math you already use to daily decisions. Correlation shows
            movement together. Sample size tells you how much to trust a read. Regression adds
            a structured forecast and parameters you can explain to finance and marketing.
          </p>
          <p>
            Strong teams show the line, the holdout check, and scenario tables. Weak teams report
            only a single predicted number with no sense of error, outliers, or alternatives.
          </p>

          <p>
            Regression is a large topic, but one worked example carries most of the habit. Start
            with a clear outcome, pick inputs you can defend, fit on enough history, keep some
            data back to test, watch how outliers pull the line, then use predictions for
            planning. That workflow is what regression is for in real work.
          </p>
        </div>
      </article>
    </main>
  );
}
