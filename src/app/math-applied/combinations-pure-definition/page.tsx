import CombinationsPureExplorer from "@/components/CombinationsPureExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("combinations-pure-definition");

export default function CombinationsPureDefinitionPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Combinations: Choosing a Set When Order Does Not Matter
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Subset selection and combination count"
              className="h-auto w-full object-contain"
              height={500}
              src="/combinations.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A combination counts how many ways you can choose a subset of size k from n items when
            order is ignored. The committee A, B, and C is the same whether you picked A first or
            C first. Only membership matters.
          </p>
          <p>
            Use combinations for feature bundles, coupon mixes, committee selection, or any problem
            where you ask &ldquo;how many distinct groups of size k?&rdquo; without ranking inside the
            group. Permutations answer a stricter question where position is part of the outcome.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            C(n,k) counts unordered subsets of size k drawn from n items.
          </p>

          <CombinationsPureExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Building blocks</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Subset view.</span>{" "}
            Each combination is one k-element subset. No slot labels, no first pick vs second pick.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Symmetry.</span>{" "}
            Choosing k to include is the same as choosing n − k to exclude. C(n,k) = C(n,n − k).
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Link to permutations.</span>{" "}
            List every ordering of a subset, then divide by k! to collapse orderings that share the
            same members.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="C(n,k) = n! / (k! (n − k)!)" label="Combination formula">
            <p>
              Start with all ordered picks P(n,k), then divide by k! because each subset appears k!
              times with different orderings.
            </p>
          </MathBlock>
          <MathBlock formula="C(n,k) = C(n, n − k)" label="Symmetry">
            <p>
              Picking 3 features out of 10 is the same count as leaving 7 features out. Both sides
              of the choice matter equally.
            </p>
          </MathBlock>
          <MathBlock formula="C(n,k) = P(n,k) / k!" label="Relationship to permutations">
            <p>
              Permutations over-count when order is irrelevant. Dividing by k! removes the reorderings
              inside each subset.
            </p>
          </MathBlock>
          <MathBlock formula="C(n,k) = C(n−1,k−1) + C(n−1,k)" label="Pascal relation (optional)">
            <p>
              Every k-subset either includes item n or it does not. That recurrence builds Pascal&apos;s
              triangle and is useful for dynamic programming counts.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Where teams get stuck
          </h2>
          <p>
            Using P(n,k) for unordered bundles and inflating option counts by k!. Ignoring symmetry
            and double-counting complements. Treating combinations with replacement (same item twice)
            as plain C(n,k). Forgetting that k = 0 and k = n each give exactly one subset.
          </p>
          <p>
            Ask whether rearranging the chosen items creates a new business outcome. If not, divide
            permutations by k!.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application
          </h2>
          <p>
            Feature subsets in a product configurator, committee picks for a review board, or coupon
            bundles with fixed size all map to C(n,k). Capacity planning for &ldquo;choose any 3 of
            8 add-ons&rdquo; is a combination count, not a ranking problem. Pair this with the
            permutations post when some flows need order and others do not.
          </p>
        </div>

        <RelatedPosts slug="combinations-pure-definition" />
      </article>
    </main>
  );
}
