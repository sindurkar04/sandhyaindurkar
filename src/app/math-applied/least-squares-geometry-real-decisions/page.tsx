import LeastSquaresGeometryExplorer from "@/components/LeastSquaresGeometryExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("least-squares-geometry-real-decisions");

export default function LeastSquaresGeometryPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Least Squares: Why Squared Error Picks One Best Line
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Residuals squared minimized by best fit line"
              className="h-auto w-full object-contain"
              height={500}
              src="/least_squares_geometry.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Many lines can pass near your points. Least squares picks the one that minimizes the sum
            of squared residuals. Squaring penalizes big misses more than small ones and keeps the
            math differentiable enough to solve in closed form.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Least squares answers: Which line makes the total squared prediction error smallest?
          </p>

          <LeastSquaresGeometryExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="SSE = Σ (yi − ŷi)²" label="Sum of squared errors">
            <p>Each point contributes its vertical distance to the line, squared.</p>
          </MathBlock>
          <MathBlock formula="minimize SSE over intercept and slope" label="Objective">
            <p>The best-fit line from the linear models explorer is the SSE minimizer for those points.</p>
          </MathBlock>
          <MathBlock formula="large outliers pull the line (squared penalty)" label="Sensitivity">
            <p>
              One bad week moves the line more than one modest miss. Robust methods use absolute
              error when outliers dominate.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            When you report a trend line, you are implicitly reporting the SSE-minimizing line unless
            you chose another loss on purpose. Pair with overfitting and holdout posts before you
            trust SSE on training data alone.
          </p>
        </div>

        <RelatedPosts slug="least-squares-geometry-real-decisions" />
      </article>
    </main>
  );
}
