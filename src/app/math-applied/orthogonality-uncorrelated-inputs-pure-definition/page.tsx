import MathBlock from "@/components/MathBlock";
import OrthogonalityExplorer from "@/components/OrthogonalityExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("orthogonality-uncorrelated-inputs-pure-definition");

export default function OrthogonalityPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Orthogonality: When Two Features Carry Separate Signal
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Two perpendicular feature vectors in vector space"
              className="h-auto w-full object-contain"
              height={500}
              src="/orthogonality.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            In vector space, orthogonal directions share no overlap. For standardized features,
            zero correlation means the inputs point at a 90° angle. Regression can assign credit
            cleanly because each column explains a different slice of variance. High correlation
            means nearly parallel vectors and shared credit.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Orthogonality answers: Are these inputs independent enough that each coefficient reads
            as its own lever?
          </p>

          <OrthogonalityExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="a · b = 0 ⟺ a ⊥ b" label="Orthogonal vectors">
            <p>Dot product zero when vectors are perpendicular. No shared directional component.</p>
          </MathBlock>
          <MathBlock formula="corr(Xi, Xj) = 0 ⟹ near orthogonal (standardized)" label="Uncorrelated columns">
            <p>On centered, scaled features, zero correlation matches orthogonality in feature space.</p>
          </MathBlock>
          <MathBlock formula="cos(θ) = r when ||a|| = ||b|| = 1" label="Correlation as angle">
            <p>r = 1 means parallel (same story). r = 0 means orthogonal (separate signal).</p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Randomized A/B arms give near-orthogonal treatment flags. Correlated KPIs like revenue
            and order count do not. Check correlation heatmaps before you interpret multi-driver
            regression. When r is high, see multicollinearity and ridge posts.
          </p>
        </div>

        <RelatedPosts slug="orthogonality-uncorrelated-inputs-pure-definition" />
      </article>
    </main>
  );
}
