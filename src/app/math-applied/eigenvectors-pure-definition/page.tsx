import EigenvectorsExplorer from "@/components/EigenvectorsExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("eigenvectors-pure-definition");

export default function EigenvectorsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Eigenvectors: Directions That Only Stretch, Not Rotate
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Eigenvectors as fixed directions under a linear transform"
              className="h-auto w-full object-contain"
              height={500}
              src="/eigenvectors.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Pick a random direction and apply a matrix: the vector usually rotates and changes length.
            Eigenvectors are the exceptions. They stay on their line; the matrix only scales them by
            the matching{" "}
            <a
              className="font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/eigenvalues-pure-definition"
            >
              eigenvalue
            </a>
            . For symmetric data matrices, those directions are orthogonal and become the principal
            axes in{" "}
            <a
              className="font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/pca-intuition-real-decisions"
            >
              PCA
            </a>
            .
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Eigenvectors answer: Which directions carry independent variance without mixing into each
            other?
          </p>

          <EigenvectorsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="Av = λv" label="Fixed direction">
            <p>
              v is an eigenvector if A sends it to a scalar multiple of itself. λ is how much length
              changes along that line.
            </p>
          </MathBlock>
          <MathBlock formula="A symmetric ⇒ orthonormal eigenvectors" label="Symmetric matrices">
            <p>
              Real symmetric A has real eigenvalues and perpendicular eigenvector pairs. That is why
              PCA axes are at right angles after centering and scaling.
            </p>
          </MathBlock>
          <MathBlock formula="PC k = eigenvector k of covariance" label="PCA link">
            <p>
              Principal components are eigenvectors of the covariance matrix ordered by eigenvalue
              size. PC1 is the direction of maximum variance.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            When three KPIs move together, they are not three independent levers. Eigenvectors name
            the axes that actually carry separate signal. Use PC1 for the combined health score, PC2
            for the secondary story, and ignore tiny components that are mostly noise. Pair this with
            the eigenvalues post to see how much each axis matters.
          </p>
        </div>

        <RelatedPosts slug="eigenvectors-pure-definition" />
      </article>
    </main>
  );
}
