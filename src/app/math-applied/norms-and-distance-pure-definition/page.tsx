import MathBlock from "@/components/MathBlock";
import NormsDistanceExplorer from "@/components/NormsDistanceExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("norms-and-distance-pure-definition");

export default function NormsDistancePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Norms and Distance: How Far Apart Are Two Feature Vectors?
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="L2 distance between two points in feature space"
              className="h-auto w-full object-contain"
              height={500}
              src="/norms_distance.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Once each row is a vector, comparison becomes geometry. Anomaly detection, duplicate
            search, and clustering all ask: how far is this point from a baseline? L2 (Euclidean)
            distance is the straight-line gap. L1 sums absolute coordinate differences and is less
            sensitive to one wild dimension.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Norms answer: What is the length of one vector? Distance answers: How far apart are two
            vectors in feature space?
          </p>

          <NormsDistanceExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="||v||₂ = √(Σ vi²)" label="L2 norm">
            <p>Length of a vector. Same formula as the hypotenuse in n dimensions.</p>
          </MathBlock>
          <MathBlock formula="d₂(a, b) = ||a − b||₂" label="L2 distance">
            <p>Euclidean distance between two points. Default for embeddings when vectors are normalized.</p>
          </MathBlock>
          <MathBlock formula="d₁(a, b) = Σ |ai − bi|" label="L1 distance">
            <p>Manhattan distance. One outlier coordinate adds linearly, not quadratically.</p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Before you flag anomalies or near-duplicates, scale features so dollars and counts sit on
            comparable ranges. Pair L2 distance with cosine when vector length varies (see the dot
            product post). State your threshold and which norm you used.
          </p>
        </div>

        <RelatedPosts slug="norms-and-distance-pure-definition" />
      </article>
    </main>
  );
}
