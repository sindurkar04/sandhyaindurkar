import MathBlock from "@/components/MathBlock";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import RatesVsCountsExplorer from "@/components/RatesVsCountsExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("rates-vs-counts-real-decisions");

export default function RatesVsCountsPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          More Tickets, Same Workload? Rates vs Counts in Real Data
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Total count rising while per-user rate stays flat"
              className="h-auto w-full object-contain"
              height={500}
              src="/rates_vs_counts.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Total support tickets can rise 30% while tickets per active user stay flat. The user base
            grew. The product is not necessarily worse. Headline counts hide the denominator.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: always ask per what before you react to a total.
          </p>
          <p>
            Counts answer how much happened. Rates answer how intense it was per user, transaction,
            or session. Dashboards that only show totals often trigger hiring and roadmap changes
            that track growth, not quality.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Rates vs counts answers: Did behavior change, or did scale change?
          </p>

          <RatesVsCountsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="total count = users × rate per user"
            label="Decompose the headline"
          >
            <p>
              If users grow 25% and rate is flat, total count grows ~25%. If rate rises 10% with
              flat users, that is a real intensity shift.
            </p>
          </MathBlock>
          <MathBlock
            formula="rate = events ÷ denominator (users, transactions, sessions)"
            label="Pick the right denominator"
          >
            <p>
              Support: tickets per active user. Fraud: alerts per thousand transactions. Growth:
              logins per monthly active user. The denominator must match the decision.
            </p>
          </MathBlock>
          <MathBlock
            formula="report count and rate together on the same slide"
            label="Habit"
          >
            <p>
              Weighted average posts cover rolling up segments. This post covers splitting volume
              from intensity before you staff a war room.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: the support staffing review
          </h2>
          <p>
            Q4 tickets hit a record. Leadership wants six new agents. Tickets per active user moved
            from 0.41 to 0.42 while users grew 15%. The intensity story is flat; the volume story is
            growth. Staff for scale, not for a phantom quality crisis.
          </p>
          <BusinessCaseExplorer slug="rates-vs-counts-real-decisions" />


          <p>
            The habit: pair every total with a rate using the denominator ops already trusts. Flag
            when count and rate diverge. Cohort analysis helps when the user mix shifts at the same
            time.
          </p>
        </div>

        <RelatedPosts slug="rates-vs-counts-real-decisions" />
      </article>
    </main>
  );
}
