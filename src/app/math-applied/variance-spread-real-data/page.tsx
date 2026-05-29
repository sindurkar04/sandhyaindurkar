import DeliveryPerformanceViz from "@/components/DeliveryPerformanceViz";
import VarianceSpreadExplorer from "@/components/VarianceSpreadExplorer";
import Image from "next/image";

export default function VarianceSpreadPostPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] space-y-7 px-4 py-10 sm:px-6">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Variance and Spread -- Why the Same Average Can Hide a Very Different Story
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

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
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
          <p>
            Team A usually lands between 47 and 53 minutes. Planning is easier. Customers get a
            predictable experience.
          </p>
          <p>
            Team B often delivers in the 20s on some days and the 70s on others. The mean is still
            50, but the process is harder to trust and harder to staff for.
          </p>

          <DeliveryPerformanceViz />

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

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The deeper takeaway</h2>
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
      </article>
    </main>
  );
}
