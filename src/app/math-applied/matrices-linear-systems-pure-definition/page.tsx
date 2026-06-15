import MatricesSystemsExplorer from "@/components/MatricesSystemsExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("matrices-linear-systems-pure-definition");

export default function MatricesSystemsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Matrices and Linear Systems: Regression Is Ax = b
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Matrix A times vector x equals vector b"
              className="h-auto w-full object-contain"
              height={500}
              src="/matrices_systems.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A matrix is a compact way to write many linear equations at once. Each row can be one
            data point constraint; each column is one unknown coefficient. Fitting a line through
            points is solving for intercept and slope that best satisfy all rows.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Linear systems answer: What values of x make Ax as close as possible to b across all
            rows?
          </p>

          <MatricesSystemsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="Ax = b" label="System form">
            <p>A holds coefficients, x holds unknowns, b holds targets or totals from data.</p>
          </MathBlock>
          <MathBlock formula="Xβ ≈ y" label="Regression notation">
            <p>
              Design matrix X (rows = weeks, columns = intercept + drivers), coefficient vector β,
              outcome vector y. Same structure as Ax = b.
            </p>
          </MathBlock>
          <MathBlock formula="normal equations: XᵀX β = Xᵀy" label="Least squares solution">
            <p>
              When rows outnumber unknowns, you solve this system instead of exact equality. That is
              what your regression code implements under the hood.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            When someone asks what regression did, say it found β that solves a linear system built
            from your data table. The linear models post draws the line; this post names the matrix
            behind it.
          </p>
        </div>

        <RelatedPosts slug="matrices-linear-systems-pure-definition" />
      </article>
    </main>
  );
}
