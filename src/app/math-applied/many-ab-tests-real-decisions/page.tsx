import MathBlock from "@/components/MathBlock";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import ManyAbTestsExplorer from "@/components/ManyAbTestsExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("many-ab-tests-real-decisions");

export default function ManyAbTestsPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          When Everything Wins Once: Running Many A/B Tests
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Many A/B tests and false winner probability"
              className="h-auto w-full object-contain"
              height={500}
              src="/many_ab_tests.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            One A/B test at 95% confidence accepts a 5% false alarm rate when there is no real lift.
            Run twenty independent null tests and luck adds up. The chance of at least one false
            winner crosses 50% even when nothing actually works.
          </p>
          <p>
            Growth teams feel this every quarter: a sprint full of tests, a few winners, and a
            roadmap built on noise. The single-test readout posts still apply. This post is about
            what changes when you run many of them at once.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Multiple tests answer: If nothing worked, how many false wins should we still expect?
          </p>

          <ManyAbTestsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="P(false win on one null test) ≈ α  (often 5%)"
            label="Per-test false alarm"
          >
            <p>
              α is the threshold you set per test. At 5%, a true null still looks like a winner
              about one time in twenty.
            </p>
          </MathBlock>
          <MathBlock
            formula="P(≥1 false win) = 1 − (1 − α)^n"
            label="Across n independent tests"
          >
            <p>
              With α = 0.05 and n = 20: 1 − 0.95^20 ≈ 64%. You are more likely than not to see at
              least one false winner if every test is a null.
            </p>
          </MathBlock>
          <MathBlock
            formula="expected false wins = n × α"
            label="Average false alarms"
          >
            <p>
              Twenty tests at 5% produce about one false win on average. Some quarters you see
              zero, some you see two or three. That is why pre-registering a primary metric matters.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: experiment sprints
          </h2>
          <p>
            Name one primary metric before the sprint. Treat secondary tests as directional. Hold
            winners to the same interval overlap and sample size bar as a single test. When many
            tests run at once, skepticism scales with n.
          </p>
          <BusinessCaseExplorer slug="many-ab-tests-real-decisions" />

          <p>
            False wins are not a reason to stop testing. They are a reason to rank evidence before
            you ship a bundle of changes that never really worked.
          </p>
        </div>

        <RelatedPosts slug="many-ab-tests-real-decisions" />
      </article>
    </main>
  );
}
