import BaseRatesExplorer from "@/components/BaseRatesExplorer";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("base-rates-real-decisions");


export default function BaseRatesPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Base Rates and Updating Beliefs: Rare Events, Loud Alerts
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Base rate before and after a positive signal"
              className="h-auto w-full object-contain"
              height={500}
              src="/base_rates.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A fraud model flags an order. A resume screen passes a candidate. A support ticket gets
            routed as high risk. Each signal feels strong. But if the underlying rate is rare, most
            flagged cases can still be false alarms.
          </p>
          <p>
            The base rate is how common the thing is before you see any signal. Only 2% of orders
            might be fraud. A 90% accurate alert still leaves plenty of clean orders in the flagged
            pile when fraud is that uncommon.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Base rates answer: How common is this outcome in the full population, before this alert
            fired?
          </p>

          <BaseRatesExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="P(A | signal) = P(signal | A) × P(A) ÷ P(signal)"
            label="Bayes: update after a positive signal"
          >
            <p>
              P(A) is the base rate. P(signal | A) is true positive rate. P(signal) mixes real hits
              and false alarms. The explorer computes the posterior when a signal fires.
            </p>
          </MathBlock>
          <MathBlock
            formula="P(signal) = P(A) × TP + (1 − P(A)) × FP"
            label="Why false alarms dominate when A is rare"
          >
            <p>
              With 2% fraud, 90% true positives, and 8% false positives on clean orders, most
              alerts still come from the huge pool of legitimate orders. The updated chance after an
              alert is far below 90%.
            </p>
          </MathBlock>
          <p>
            Better test accuracy helps, but it cannot erase a very low base rate by itself. You
            also need context: seasonality, segment, and what action you take on a flag. Updating
            beliefs is not skepticism. It is matching confidence to how common the outcome really
            is.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application: fraud alerts</h2>
          <p>
            Risk and trust teams calibrate review queues. Recruiting teams pair screens with
            structured follow-ups instead of treating a pass as a hire. Support leaders set
            escalation rules that account for how often tickets truly need tier-two help.
          </p>
          <BusinessCaseExplorer slug="base-rates-real-decisions" />

          <p>
            The habit is stating the base rate out loud before you react to a dashboard alert. Then
            ask what a positive signal actually buys you. That keeps scarce reviewer time on cases
            where the math supports action.
          </p>
        </div>

        <RelatedPosts slug="base-rates-real-decisions" />
      </article>
    </main>
  );
}
