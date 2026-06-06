import MathBlock from "@/components/MathBlock";
import LinearModelsExplorer from "@/components/LinearModelsExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("linear-models-slope-intuition");

export default function LinearModelsPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Linear Models: y = a + bx in Plain Math
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Line through points with slope and intercept"
              className="h-auto w-full object-contain"
              height={500}
              src="/linear_models.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A linear model is a straight-line relationship between x and y. Intercept a is where
            the line crosses the y-axis when x = 0. Slope b is the change in y when x increases
            by 1. Residuals show how far each actual point sits from the line.
          </p>
          <p>
            Linear models are simple on purpose. They trade flexibility for clarity: one number
            for baseline level, one number for rate of change. Many forecasting and benchmarking
            workflows start here before adding seasonality or nonlinear curves.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            One extra unit of x moves y by b, not by the full line height.
          </p>

          <LinearModelsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Reading the line</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Intercept (a).</span>{" "}
            Predicted y when x is zero. In weekly growth data, it is the starting level before x
            weeks of change accumulate.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Slope (b).</span>{" "}
            Rise over run. If b = 0.85, each +1 on x adds 0.85 to y on average. The green brackets
            in the explorer show that step visually.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Residual.</span>{" "}
            Actual minus predicted. Points above the line have positive residuals; below is negative.
            Smaller residuals on average mean the line fits better.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="y = a + bx" label="Linear model">
            <p>a is intercept, b is slope. x is the input; y is the output you predict.</p>
          </MathBlock>
          <MathBlock formula="ŷ = a + bx" label="Prediction">
            <p>
              ŷ (y-hat) is the value on the line. For x = 4, plug into the formula to get the
              predicted y.
            </p>
          </MathBlock>
          <MathBlock formula="residual = y − ŷ" label="Residual">
            <p>Good fit means smaller residuals on average, not zero residual on every point.</p>
          </MathBlock>
          <MathBlock formula="b = Δy / Δx for a straight line" label="Slope as rate">
            <p>
              Slope is constant on a line. That is why one number summarizes the x-to-y rate of
              change.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Best fit in one sentence
          </h2>
          <p>
            Given several points, the best-fit line minimizes squared residuals overall. The explorer
            reset button snaps back to that line. Moving intercept or slope by hand shows how misfit
            grows when the line no longer tracks the cloud of points.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application
          </h2>
          <p>
            This is the core behind regression forecasts, benchmark trends, and driver-based planning
            before you add business context. The applied regression post adds holdouts, uncertainty,
            and decision rules on top of this plain line.
          </p>
        </div>

        <RelatedPosts slug="linear-models-slope-intuition" />
      </article>
    </main>
  );
}
