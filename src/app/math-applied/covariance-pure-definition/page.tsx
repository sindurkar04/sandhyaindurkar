import CovarianceExplorer from "@/components/CovarianceExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Covariance: How Two Features Move Together",
  description:
    "Covariance measures co-movement with units. Correlation normalizes by spread. Build intuition before regression and PCA.",
  path: "/math-applied/covariance-pure-definition",
  image: "/covariance.svg",
});

export default function CovariancePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Covariance: How Two Features Move Together
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Scatter plot with covariance and correlation readouts"
              className="h-auto w-full object-contain"
              height={500}
              src="/covariance.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            When revenue and order count rise together, their covariance is positive. When support
            tickets climb while satisfaction falls, covariance turns negative. Covariance captures
            direction and strength in the units of both features. Correlation rescales by each
            feature&apos;s spread so you can compare relationships across different scales.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Covariance answers: Do these two columns move together, and by how much in raw units?
          </p>

          <CovarianceExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="Cov(X, Y) = E[(X - μx)(Y - μy)]" label="Definition">
            <p>
              Average product of centered deviations. Positive when both tend above or below mean
              together. Zero when no linear co-movement (not necessarily independent).
            </p>
          </MathBlock>
          <MathBlock formula="Corr(X, Y) = Cov(X, Y) / (σx · σy)" label="Correlation">
            <p>
              Unitless measure in [-1, 1]. Same sign as covariance. Rescaling X or Y does not change
              correlation, but it does change covariance.
            </p>
          </MathBlock>
          <MathBlock
            formula="Σ = [[Var(X), Cov(X,Y)], [Cov(X,Y), Var(Y)]]"
            label="Covariance matrix"
          >
            <p>
              Diagonal entries are variances. Off-diagonal entries match. Symmetric matrix used in
              PCA, portfolio risk, and multivariate normal models.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            A correlation heatmap shows revenue vs orders at r = 0.94. That is high shared signal,
            not a license to claim causation. See{" "}
            <a
              className="font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/correlation-vs-causation-real-decisions"
            >
              correlation vs causation
            </a>
            . Near-zero correlation suggests{" "}
            <a
              className="font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/orthogonality-uncorrelated-inputs-pure-definition"
            >
              orthogonal
            </a>{" "}
            inputs. High correlation between predictors triggers{" "}
            <a
              className="font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/multicollinearity-real-decisions"
            >
              multicollinearity
            </a>{" "}
            warnings in regression.
          </p>
        </div>

        <RelatedPosts slug="covariance-pure-definition" />
      </article>
    </main>
  );
}
