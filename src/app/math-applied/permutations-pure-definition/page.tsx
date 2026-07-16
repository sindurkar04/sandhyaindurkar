import MathBlock from "@/components/MathBlock";
import PermutationsPureExplorer from "@/components/PermutationsPureExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("permutations-pure-definition");

export default function PermutationsPureDefinitionPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Permutations: Order Matters When You Count Arrangements
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Ordered slots and permutation count"
              className="h-auto w-full object-contain"
              height={500}
              src="/permutations.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A permutation counts how many ways you can fill ordered slots from a pool. First place,
            second place, and third place are different outcomes even when the same people appear.
            That is the difference between ranking finalists and merely naming who made the cut.
          </p>
          <p>
            Use permutations when sequence changes the outcome: podium order, seat assignments,
            password digit order, or A/B variant sequences shown in a fixed order. If you only care
            who is on the team and not who spoke first, you need combinations instead.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            P(n,r) counts ordered arrangements of r distinct picks from n items.
          </p>

          <PermutationsPureExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Building blocks</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Factorial.</span>{" "}
            n! is the product 1 x 2 x 3 x ... x n. It counts ways to line up all n items when every
            position matters.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Partial lineup.</span>{" "}
            P(n,r) fills only the first r slots. You multiply descending choices: n, then n−1, then
            n−2, until r picks are placed.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Full lineup.</span>{" "}
            When r = n, every item gets a seat. P(n,n) = n!, the number of complete orderings.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(n,r) = n! / (n − r)!" label="Permutation formula">
            <p>
              n! counts all orderings of n items. Dividing by (n − r)! removes the unused tail
              positions you are not filling.
            </p>
          </MathBlock>
          <MathBlock formula="n! = n × (n − 1) × ... × 1" label="Factorial">
            <p>
              5! = 120. Factorials grow fast. Ten items already have more than three million
              orderings.
            </p>
          </MathBlock>
          <MathBlock formula="P(n,n) = n!" label="Complete permutations">
            <p>
              Ranking every candidate with no ties is a full permutation. There is exactly one
              ordering for zero items (1 way) by convention.
            </p>
          </MathBlock>
          <MathBlock formula="Order matters: ABC ≠ BAC" label="Versus combinations">
            <p>
              The same three people in a different sequence are different permutations but one
              combination. Combinations divide out the r! orderings of each pick set.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Where teams get stuck
          </h2>
          <p>
            Treating a ranked shortlist like an unordered team. Counting seat assignments without
            caring about order, or the reverse. Forgetting that repeated digits in a PIN are a
            different problem (multiset permutations). Using n! when only the top r of n matter.
          </p>
          <p>
            A quick check: if swapping two picks changes the outcome, use permutations. If swapping
            does not change the outcome, drop to combinations.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application
          </h2>
          <p>
            Ranking top candidates for interviews, assigning numbered seats at an event, or
            counting distinct A/B/C test sequences all need ordered counts. Product teams often
            undercount variant orderings in onboarding flows. Getting P(n,r) right prevents
            surprise explosion in configuration or personalization options.
          </p>
        </div>

        <RelatedPosts slug="permutations-pure-definition" />
      </article>
    </main>
  );
}
