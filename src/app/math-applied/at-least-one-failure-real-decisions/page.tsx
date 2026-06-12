import AtLeastOneExplorer from "@/components/AtLeastOneExplorer";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("at-least-one-failure-real-decisions");

export default function AtLeastOneFailurePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          At Least One Failure: When Small Risks Compound
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Many trials with at least one failure probability"
              className="h-auto w-full object-contain"
              height={500}
              src="/at_least_one.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Each deploy might have a 2% rollback chance. Each day a region might miss SLA with 1%
            probability. Each check might fail on a clean build 5% of the time. None of those sound
            alarming alone.
          </p>
          <p>
            Repeat the trial many times and the question becomes whether at least one failure
            happens. That probability grows faster than linear intuition suggests.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            At-least-one probability answers: If we repeat this risky trial n times, what are the
            odds something goes wrong at least once?
          </p>

          <AtLeastOneExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(none) = (1 − p)^n" label="All clean">
            <p>Independent trials all succeed with probability 1 minus p, raised to the n power.</p>
          </MathBlock>
          <MathBlock formula="P(at least one) = 1 − (1 − p)^n" label="Complement trick">
            <p>
              Easier to count the chance that nothing bad happens, then subtract from 100%. Ten
              deploys at p = 2% give about 18% chance of at least one rollback, not 2%.
            </p>
          </MathBlock>
          <MathBlock formula="p small, n large → risk approaches 1" label="Compounding">
            <p>
              Many low-probability trials push system risk up. Reliability planning and on-call
              staffing should use the system-level read, not the per-trial rate alone.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: release risk
          </h2>
          <p>
            Engineering leads often quote per-deploy failure rates while product plans ten releases
            per sprint. Convert to at-least-one risk before you promise stability. Same math applies
            to SLA misses across regions and flaky checks in CI.
          </p>
          <BusinessCaseExplorer slug="at-least-one-failure-real-decisions" />

          <p>
            The habit: when someone says the per-event risk is small, ask how many independent
            events you run in the planning window. Report both numbers.
          </p>
        </div>

        <RelatedPosts slug="at-least-one-failure-real-decisions" />
      </article>
    </main>
  );
}
