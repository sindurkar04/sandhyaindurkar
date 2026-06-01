import MathBlock from "@/components/MathBlock";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import OverfittingExplorer from "@/components/OverfittingExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("overfitting-real-decisions");

export default function OverfittingPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Model Looked Perfect on Past Data: Overfitting in Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Train error low and holdout error high"
              className="h-auto w-full object-contain"
              height={500}
              src="/overfitting.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A forecast can look excellent on the weeks you used to build it and fall apart on weeks
            you held back. The model memorized noise, seasonality quirks, and one-off promos instead
            of learning a pattern that repeats.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: if it only works on history you already saw, it is not ready for
            next month&apos;s budget.
          </p>
          <p>
            Overfitting is not a data science buzzword. It is the gap between training performance
            and holdout performance. Finance sees it when inventory plans miss. Marketing sees it when
            ROI models break after a channel mix change. Product sees it when churn scores misfire on
            new accounts.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Overfitting answers: Did we fit the past, or did we fit the future?
          </p>

          <OverfittingExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="generalization gap = holdout error − train error"
            label="The warning sign"
          >
            <p>
              Train error keeps falling as you add variables and flexibility. Holdout error often
              bottoms out, then rises. The widening gap is overfitting.
            </p>
          </MathBlock>
          <MathBlock
            formula="more parameters + short history → easier to memorize"
            label="Why it happens"
          >
            <p>
              Twelve weeks of data cannot support twenty interaction terms. Each extra dial lets the
              curve bend to fit random wiggles that will not repeat.
            </p>
          </MathBlock>
          <MathBlock
            formula="trust holdout weeks you did not use to fit the model"
            label="What to do"
          >
            <p>
              Split time: fit on early weeks, score on later weeks. Prefer simpler models when the
              holdout gap opens. Regression posts cover the mechanics; this post covers the decision
              to ship or wait.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: the forecast review
          </h2>
          <p>
            Ops presents a weekly order forecast with 4% train error. Finance asks for holdout weeks:
            error jumps to 19%. The team drops three channel interaction terms, error on holdout falls
            to 9%, train error rises slightly. That is a model you can plan inventory against.
          </p>
          <BusinessCaseExplorer slug="overfitting-real-decisions" />

          <p>
            The habit: always show train and holdout together. Cap complexity when history is short.
            Pair with sample size and confidence intervals before you lock spend.
          </p>
        </div>

        <RelatedPosts slug="overfitting-real-decisions" />
      </article>
    </main>
  );
}
