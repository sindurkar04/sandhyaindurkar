import DependentChainsExplorer from "@/components/DependentChainsExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("dependent-probability-chains-real-decisions");

export default function DependentChainsPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Dependent Chains: Funnel Math Without Bogus Independence
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Two-step probability chain with conditional second step"
              className="h-auto w-full object-contain"
              height={500}
              src="/dependent_chains.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Product funnels, sales pipelines, and onboarding flows are chains of steps. Step two
            often depends on step one. Users who never signed up cannot activate. Prospects who
            never booked a demo cannot close.
          </p>
          <p>
            Multiplying two headline rates as if they were independent inflates or deflates the
            joint outcome. The correct path probability uses the conditional rate on the people who
            actually reached step two.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Dependent chains answer: What fraction complete the full path when step two only applies
            after step one?
          </p>

          <DependentChainsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(A and B) = P(A) × P(B | A)" label="General product rule">
            <p>
              When B depends on A, use P(B | A), not P(B) from the whole population. Independence
              is the special case where P(B | A) = P(B).
            </p>
          </MathBlock>
          <MathBlock formula="funnel end-to-end = P(step1) × P(step2 | step1)" label="Two-step funnel">
            <p>
              Signup then activate: 40% sign up and 55% of signups activate gives 22% end-to-end,
              not 40% times a unrelated activation rate across all visitors.
            </p>
          </MathBlock>
          <MathBlock formula="tree paths add; each path multiplies" label="Longer chains">
            <p>
              For three steps, multiply along each branch: P(s1) × P(s2|s1) × P(s3|s1,s2). Report
              conditional conversion per step in dashboards so teams see where drop-off happens.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Growth reviews often cite step-two conversion without reminding the room that it
            conditions on step one. Ops planning from a bogus joint rate misallocates effort. Fix the
            denominator before you fix the copy on step two.
          </p>
          <p>
            The habit: every funnel slide shows conditional step rates and the joint path rate
            computed correctly. Pair with the independence post when someone multiplies unrelated
            probabilities across a journey.
          </p>
        </div>

        <RelatedPosts slug="dependent-probability-chains-real-decisions" />
      </article>
    </main>
  );
}
