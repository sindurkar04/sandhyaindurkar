import MathBlock from "@/components/MathBlock";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import VarianceSpreadExplorer from "@/components/VarianceSpreadExplorer";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("variance-spread-real-data");


export default function VarianceSpreadPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Variance and Spread: Why the Same Average Can Hide a Very Different Story
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Variance and spread comparison visual"
              className="h-auto w-full object-contain"
              height={900}
              src="/variance_spread.png"
              width={1600}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            The mean tells you the center of a dataset. It does not tell you how spread out the
            values are. Two groups can share the same average while behaving very differently.
          </p>
          <p>For example, average delivery time is 50 minutes for both teams:</p>
          <p className="font-bold text-[color:var(--foreground)]">
            Team A: 47, 49, 50, 51, 53 minutes
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Team B: 22, 38, 50, 62, 78 minutes
          </p>
          <p>
            Same mean. Very different experience. Team A is predictable. Team B swings between
            very fast and very slow days.
          </p>
          <p>
            Variance and spread measure that difference. They describe how far values typically
            sit from the average, which is often what people feel in practice.
          </p>

          <VarianceSpreadExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Spread measures how far values sit from the center. Two teams can share the same mean
            while having very different variance.
          </p>
          <MathBlock
            formula="variance = Σ(xᵢ − mean)² ÷ n"
            label="Variance (average squared distance from the mean)"
          >
            <p>
              For each delivery time, subtract the mean, square the gap, then average those
              squares. Squaring prevents positive and negative gaps from canceling out. Team A&apos;s
              tight cluster produces a small variance. Team B&apos;s wide swings produce a large one.
            </p>
          </MathBlock>
          <MathBlock formula="standard deviation = √variance" label="Standard deviation">
            <p>
              Take the square root of variance so the result is back in the original units (minutes,
              dollars, etc.). Team A might have σ ≈ 2 minutes. Team B might have σ ≈ 20 minutes.
              Same mean, very different reliability.
            </p>
          </MathBlock>
          <MathBlock formula="range = max − min" label="Range (quick read)">
            <p>
              The full gap from smallest to largest value. Easy to compute, but one outlier can
              stretch the range without describing the middle of the data.
            </p>
          </MathBlock>
          <p>
            Push values farther from the mean and variance grows; the mean can stay put if increases
            and decreases balance. One outlier hits variance hard because squaring amplifies large
            gaps. Shift every value by the same amount and the mean moves, but spread stays the
            same because spread describes shape, not location. On a slide, standard deviation is
            usually clearer than variance because it stays in the original units, like minutes or
            dollars.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Why the average is not enough
          </h2>
          <p>
            When values cluster tightly around the mean, outcomes feel stable. When they are
            widely scattered, the same mean can still feel risky or inconsistent.
          </p>
          <p>
            Standard deviation is a practical way to express spread. It has the same units as the
            original data, such as minutes or dollars, which makes it easier to interpret than
            variance alone.
          </p>
          <p>
            A low standard deviation means most values are close to the mean. A high standard
            deviation means wider swings. Range — the gap between the smallest and largest value
            — gives a quick sense of total spread, though it ignores everything in between.
          </p>
          <p>
            This matters because many decisions depend on consistency, not just central tendency.
            Reliability, customer trust, and operational planning all care about spread.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: delivery performance
          </h2>
          <p>
            Suppose leadership compares two teams with the same average delivery time of 50
            minutes. On paper, they look equal.
          </p>
          <BusinessCaseExplorer slug="variance-spread-real-data" />

          <p>
            Team A usually lands between 47 and 53 minutes. Planning is easier. Customers get a
            predictable experience.
          </p>
          <p>
            Team B often delivers in the 20s on some days and the 70s on others. The mean is still
            50, but the process is harder to trust and harder to staff for.
          </p>

          <p className="font-bold text-[color:var(--foreground)]">
            Mean answers: What is the typical center?
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Spread answers: How much does performance swing around that center?
          </p>
          <p>
            If you only track the mean, you might reward the volatile team and miss the operational
            cost of inconsistency. If you track spread alongside the mean, you see which team is
            actually more reliable.
          </p>

          <p>
            Variance is not just a classroom formula. It is a way to quantify uncertainty in real
            systems.
          </p>
          <p>
            In data work, spread shows up in experiment results, model error, forecast confidence,
            and quality control. Two options with the same average outcome can carry very
            different risk profiles once you look at variation.
          </p>
          <p>
            The strongest summaries usually include center and spread together: mean or median,
            plus standard deviation or a clear range. That combination tells you both where things
            tend to land and how much they move around that point.
          </p>

          <p>
            Averages are useful, but they are incomplete. They compress a full distribution into
            one number and can hide volatility that people experience every day.
          </p>
          <p>
            When you add spread to the story, you stop comparing teams, products, or time periods
            on center alone. You start asking the more useful question: not just what is typical,
            but how stable is typical?
          </p>
        </div>

        <RelatedPosts slug="variance-spread-real-data" />
      </article>
    </main>
  );
}
