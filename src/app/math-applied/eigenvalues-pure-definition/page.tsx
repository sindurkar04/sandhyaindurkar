import EigenvaluesExplorer from "@/components/EigenvaluesExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("eigenvalues-pure-definition");

export default function EigenvaluesPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Eigenvalues: Stretch Factors Along Special Directions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Eigenvalues as stretch factors along principal directions"
              className="h-auto w-full object-contain"
              height={500}
              src="/eigenvalues.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Most linear transforms rotate and stretch at once. Eigenvalues are the stretch amounts
            along directions that do not rotate. For a covariance or correlation matrix, the largest
            eigenvalue tells you how much variance lives on the dominant axis. That is the same
            intuition behind PC1 variance explained.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Eigenvalues answer: How strongly does this transform amplify motion along each special
            direction?
          </p>

          <EigenvaluesExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="Av = λv" label="Eigenpair">
            <p>
              Vector v is an eigenvector. Scalar λ is its eigenvalue. Applying A to v only scales v;
              it does not turn v onto a new direction.
            </p>
          </MathBlock>
          <MathBlock formula="det(A − λI) = 0" label="Characteristic equation">
            <p>
              For a 2×2 matrix, this quadratic gives two eigenvalues (possibly equal). Solve for λ,
              then find v from (A − λI)v = 0.
            </p>
          </MathBlock>
          <MathBlock formula="|λ₁| ≥ |λ₂| ⇒ PC1-style dominance" label="Stretch and PCA">
            <p>
              On symmetric covariance matrices, eigenvalues equal variance along each principal
              component. The ratio λ₁ / (λ₁ + λ₂) matches variance explained by the first axis.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            In PCA readouts, rank eigenvalues before you trust a one-chart summary. If λ₁ explains
            most variance, a composite KPI score is reasonable. In dynamical systems, eigenvalues near
            1 mean slow decay; values above 1 mean instability. Check both the stretch and the
            direction (eigenvectors post).
          </p>
        </div>

        <RelatedPosts slug="eigenvalues-pure-definition" />
      </article>
    </main>
  );
}
