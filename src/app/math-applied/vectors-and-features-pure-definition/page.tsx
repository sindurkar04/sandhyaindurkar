import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import VectorsFeaturesExplorer from "@/components/VectorsFeaturesExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("vectors-and-features-pure-definition");

export default function VectorsFeaturesPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Vectors and Features: One Row Is a Point in Space
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Feature vector as a point in multi-dimensional space"
              className="h-auto w-full object-contain"
              height={500}
              src="/vectors_features.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A spreadsheet row is already a vector. Each column is a dimension: spend, sessions,
            tenure, return rate. The cell values are coordinates. Machine learning, regression, and
            search all treat entities as points in this feature space.
          </p>
          <p>
            The same customer can look very different depending on which columns you include. Feature
            choice is part of the model, not just the algorithm.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Vectors answer: How do we represent one entity as a list of numbers we can compare or
            predict from?
          </p>

          <VectorsFeaturesExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="v = [x1, x2, …, xn]" label="Feature vector">
            <p>n features, n coordinates. Order matters: position i always maps to the same column.</p>
          </MathBlock>
          <MathBlock formula="||v|| = √(x1² + x2² + … + xn²)" label="L2 norm (length)">
            <p>
              Combines all coordinates into one scale. Raw units mix dollars and counts, so normalize
              before comparing lengths across tables.
            </p>
          </MathBlock>
          <MathBlock formula="design matrix X: each row = one observation" label="Data table form">
            <p>
              m rows (samples), n columns (features). Regression, clustering, and embeddings all start
              from this layout.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Before you compare customers or rank documents, write down the feature list. Changing one
            column changes the geometry. The dot product and regression posts assume you know what
            each coordinate means.
          </p>
        </div>

        <RelatedPosts slug="vectors-and-features-pure-definition" />
      </article>
    </main>
  );
}
