import GoodhartLawExplorer from "@/components/GoodhartLawExplorer";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("goodhart-law-real-decisions");

export default function GoodhartLawPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          You Hit the Target and Missed the Point: Goodhart&apos;s Law
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Dashboard metric rises while real outcome falls"
              className="h-auto w-full object-contain"
              height={500}
              src="/goodhart_law.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Goodhart&apos;s law is the trap where a stand-in number stops standing in for what you
            care about. Teams optimize the chart because the chart is what gets rewarded. Tickets
            close faster. Calls pile up. Click rates spike. Meanwhile satisfaction, revenue, and
            trust quietly slide.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: when the measure becomes the target, it stops measuring what
            matters.
          </p>
          <p>
            That is different from a bad metric chosen once. Goodhart is what happens after bonuses,
            rankings, and OKRs lock onto that metric. People are rational. They hit the number you
            pay them to hit.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Goodhart&apos;s law answers: Is the dashboard green because we are winning, or because
            we learned to game the proxy?
          </p>

          <GoodhartLawExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="proxy metric ≠ the outcome you care about"
            label="Two different numbers"
          >
            <p>
              Tickets closed per hour is a proxy. Customer satisfaction is the outcome. They often
              move together at first. Under heavy target pressure, the proxy keeps rising while the
              outcome falls.
            </p>
          </MathBlock>
          <MathBlock
            formula="incentive pressure ↑  →  reported metric ↑  and  true outcome ↓"
            label="The usual pattern"
          >
            <p>
              Not every team games metrics on purpose. Pressure makes the easiest path to the target
              the path of least resistance: rush, reclassify, cherry-pick, or shallow wins.
            </p>
          </MathBlock>
          <MathBlock
            formula="watch the gap = reported metric − true outcome (conceptually)"
            label="Early warning"
          >
            <p>
              When the dashboard and customer reality diverge, the metric is still a number. It just
              is not your number anymore. Track the outcome beside the proxy, not instead of
              thinking about proxies.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: support team targets
          </h2>
          <p>
            A support org bonuses on tickets closed per hour. The line goes up in weekly reviews.
            CSAT and reopen rates worsen at the same time. Leadership celebrates throughput until
            churn spikes in the next quarter.
          </p>
          <BusinessCaseExplorer slug="goodhart-law-real-decisions" />

          <p>
            Fix: pair the proxy with the outcome in every review (closes and satisfaction), rotate
            spot checks, and cap how much one metric alone can drive pay. If you must pick one
            number for a bonus, pick the outcome and use proxies as diagnostics only.
          </p>
          <p>
            The memorable test: if your team hit the metric tomorrow with a shortcut everyone would
            regret, would you still call it success? If not, you are looking at Goodhart, not a bad
            week.
          </p>
        </div>

        <RelatedPosts slug="goodhart-law-real-decisions" />
      </article>
    </main>
  );
}
