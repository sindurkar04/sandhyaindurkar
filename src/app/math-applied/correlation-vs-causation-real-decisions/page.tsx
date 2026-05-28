import CorrelationCausationExplorer from "@/components/CorrelationCausationExplorer";
import Image from "next/image";

export default function CorrelationVsCausationPostPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] space-y-7 px-4 py-10 sm:px-6">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Correlation Isn&apos;t Causation -- How Linked Data Misleads Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Correlation versus causation scatter visual"
              className="h-auto w-full object-contain"
              height={500}
              src="/correlation_causation.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            When two metrics move together, it is tempting to say one causes the other. Dashboards
            make this easy: you see a line going up, another line going up, and a strong correlation
            coefficient. The story writes itself.
          </p>
          <p>
            Correlation only answers one question: do these two variables tend to rise and fall
            together? It does not tell you whether changing one will change the other.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Correlation is a pattern. Causation is a claim about what happens when you intervene.
          </p>
          <p>
            That distinction sounds academic until it drives budget decisions, product bets, or
            policy changes. Teams often act on correlated metrics and later discover the lever they
            pulled was not the real driver.
          </p>

          <CorrelationCausationExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Why correlation breaks intuition
          </h2>
          <p>
            Two variables can correlate for three common reasons, and only one is direct causation.
            X might cause Y. Y might cause X. Or a third factor Z might drive both.
          </p>
          <p>
            The third case is the most common in real data. Seasonality, product launches, user
            segments, and operational constraints create shared movement that looks like a causal
            link.
          </p>
          <p>
            This is different from a weak correlation. Even a very strong r can be completely
            non-causal. The math is doing its job. The interpretation is where teams get hurt.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: marketing and revenue
          </h2>
          <p>
            Imagine weekly ad spend and weekly revenue correlate at r = +0.85. Leadership concludes
            that increasing ads will reliably increase revenue.
          </p>
          <p>
            But several launch weeks appear in the same period. During those weeks, the company
            spent more on ads and also sold more because of the launch itself. Ads and revenue moved
            together, yet part of the lift may have happened even at the same spend level.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Correlation answers: Do these metrics move together?
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Causation answers: If we change X, what happens to Y?
          </p>
          <p>
            Those are different planning questions. Budgeting as if every correlated dollar of ad
            spend caused incremental revenue can overfund channels that are riding along with
            something else.
          </p>
          <p>
            The same pattern appears in product analytics: feature usage and retention may rise
            together because engaged users both adopt features and stay longer, not because the
            feature itself caused retention for everyone.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The deeper takeaway</h2>
          <p>
            Good data work treats correlation as a signal to investigate, not a conclusion to ship.
            Before acting, teams ask what else could explain the pattern, whether cause precedes
            effect, and whether a controlled test is possible.
          </p>
          <p>
            In practice, the strongest decisions combine observational correlation with design:
            hold other factors steady, measure confounders, and run experiments when stakes are high.
            When experiments are not possible, be explicit about uncertainty instead of hiding it
            behind a high r.
          </p>
          <p>
            Correlation is cheap to compute and easy to communicate. Causal claims are harder, but
            that difficulty is the point. It forces you to name the mechanism, the timing, and the
            alternative explanations before you scale a change.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Closing</h2>
          <p>
            Most costly mistakes in analytics are not calculation errors. They come from treating
            correlation as proof.
          </p>
          <p>
            When you separate pattern from intervention, you make better bets: you stop asking only
            what moves together and start asking what you can actually change. That shift is what
            turns a chart into a decision you can defend.
          </p>
        </div>
      </article>
    </main>
  );
}
