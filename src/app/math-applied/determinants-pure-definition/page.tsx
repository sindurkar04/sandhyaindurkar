import DeterminantsPureExplorer from "@/components/DeterminantsPureExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("determinants-pure-definition");

export default function DeterminantsPureDefinitionPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Determinants: Area Scale Factor of a Linear Map
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Parallelogram area and 2x2 determinant"
              className="h-auto w-full object-contain"
              height={500}
              src="/determinants.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            The determinant of a square matrix is a single number that summarizes how a linear
            transformation stretches, flips, or collapses space. In two dimensions, it is the signed
            area of the parallelogram spanned by the column vectors. In three dimensions, it
            becomes a signed volume.
          </p>
          <p>
            det = 0 means the map squashes dimension: two different inputs can land on the same
            output. That is singularity. Non-zero determinant means the system has a unique inverse,
            which is what you need before trusting a unique solution to Ax = b.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            |det| tells you how much area (or volume) scales. Sign tells you if orientation flips.
          </p>

          <DeterminantsPureExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Building blocks</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Column vectors.</span>{" "}
            Each column of a 2x2 matrix is a direction in the plane. Together they sweep out a
            parallelogram anchored at the origin.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Signed area.</span>{" "}
            Positive determinant keeps orientation. Negative determinant reflects the shape. Zero
            determinant collapses area to a line or point.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Invertibility.</span>{" "}
            Non-singular matrices can be undone. Singular matrices lose information, like parallel
            constraints that do not pin down a unique answer.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="det [[a,b],[c,d]] = ad − bc" label="2×2 determinant">
            <p>
              Multiply down the main diagonal, subtract the cross diagonal. This is the signed area
              of the parallelogram built from columns (a,c) and (b,d).
            </p>
          </MathBlock>
          <MathBlock formula="|det| = area scale factor in 2D" label="Geometric meaning">
            <p>
              A unit square maps to a region whose area equals |det|. det = 2 doubles area. det = 0.5
              shrinks area by half.
            </p>
          </MathBlock>
          <MathBlock formula="det = 0 ⟹ singular (not invertible)" label="Collapse">
            <p>
              Parallel column vectors give zero area. The linear system has either no solution or
              infinitely many, not a unique one.
            </p>
          </MathBlock>
          <MathBlock formula="det(AB) = det(A) × det(B)" label="Product rule intuition">
            <p>
              Apply transformation A, then B. Area scales by det(A), then again by det(B). The
              combined scale is the product. Helpful when reasoning about chained feature transforms.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Where teams get stuck
          </h2>
          <p>
            Treating determinant as a mysterious symbol instead of a scale factor. Checking only
            whether det is positive without looking at magnitude. Ignoring near-zero determinants in
            numeric systems where columns are almost parallel. Confusing determinant with matrix
            size or row count.
          </p>
          <p>
            In practice, a tiny |det| signals ill-conditioning: small input changes can swing outputs
            wildly, even before you hit exact zero.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application
          </h2>
          <p>
            When feature transforms chain together, the volume of reachable outcomes scales with
            products of determinants. Invertibility checks mirror whether a model system has a
            unique calibration. The matrices and linear systems post names Ax = b; this post explains
            when that system has a stable, reversible geometry behind it.
          </p>
        </div>

        <RelatedPosts slug="determinants-pure-definition" />
      </article>
    </main>
  );
}
