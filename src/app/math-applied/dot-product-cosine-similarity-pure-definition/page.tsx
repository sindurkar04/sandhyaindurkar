import DotProductCosineExplorer from "@/components/DotProductCosineExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("dot-product-cosine-similarity-pure-definition");

export default function DotProductCosinePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Dot Product and Cosine Similarity: How Aligned Are Two Vectors?
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Angle between two vectors for cosine similarity"
              className="h-auto w-full object-contain"
              height={500}
              src="/dot_product_cosine.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Search, recommendations, and RAG retrieval rank candidates by similarity to a query
            vector. Dot product counts overlapping signal and rewards long vectors. Cosine similarity
            divides by length so a short query is not drowned out by a long document.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Dot product answers: How much do these vectors point the same direction, weighted by
            magnitude? Cosine removes the magnitude part.
          </p>

          <DotProductCosineExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="a · b = Σ ai bi" label="Dot product">
            <p>Multiply matching coordinates and add. High when both vectors are large on the same features.</p>
          </MathBlock>
          <MathBlock formula="cos(θ) = (a · b) / (||a|| × ||b||)" label="Cosine similarity">
            <p>
              Range −1 to 1 for real embeddings; often 0 to 1 for nonnegative text counts. 1 means
              same direction, 0 means orthogonal.
            </p>
          </MathBlock>
          <MathBlock formula="cosine = dot product when ||a|| = ||b|| = 1" label="Unit vectors">
            <p>Many embedding pipelines normalize vectors first so dot product equals cosine.</p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Pick cosine for search and duplicate detection when document length varies. Pick dot product
            when scores are already calibrated probabilities on the same scale. Always state which
            metric ranked your top-k results.
          </p>
        </div>

        <RelatedPosts slug="dot-product-cosine-similarity-pure-definition" />
      </article>
    </main>
  );
}
