import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import StockoutProbabilityExplorer from "@/components/StockoutProbabilityExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("stockout-probability-real-decisions");

export default function StockoutProbabilityPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Will We Run Out? Probability of Stockout in Real Inventory Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Inventory level crossing a reorder line with stockout risk callout"
              className="h-auto w-full object-contain"
              height={500}
              src="/stockout_probability.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Inventory teams rarely ask whether stockout is possible. They ask if the risk is
            acceptable. Probability turns that into a clear decision: if we reorder at this level,
            what are the chances demand outruns supply before the next shipment arrives?
          </p>
          <p>
            Reorder too late and customers see &ldquo;out of stock&rdquo;. Reorder too early and
            cash gets trapped on shelves. The right point is a business choice, but probability makes
            the tradeoff explicit.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Better question than &ldquo;will we stock out?&rdquo;: &ldquo;what stockout risk are we
            willing to run?&rdquo;
          </p>

          <StockoutProbabilityExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="lead-time demand ≈ normal(μL, σ√L)"
            label="Demand during lead time"
          >
            <p>
              Mean demand scales with lead time. Variability scales with the square root of lead
              time. That gives a distribution of possible demand before restock arrives.
            </p>
          </MathBlock>
          <MathBlock
            formula="stockout probability = P(demand during lead time > reorder point)"
            label="Risk definition"
          >
            <p>
              Pick a reorder point and compute the area of the demand curve beyond it. That area is
              your stockout risk.
            </p>
          </MathBlock>
          <MathBlock
            formula="service level = 1 - stockout probability"
            label="Operational readout"
          >
            <p>
              Many teams set service-level targets by SKU tier, then back into reorder points that
              meet those probabilities.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: restock policy before a promotion
          </h2>
          <p>
            A skincare SKU usually sells 85 units per day, but promo weeks are volatile. Lead time is
            10 days. At a reorder point of 900, stockout risk is high enough to hurt conversion and ad
            efficiency. Raising reorder to 1,200 drops risk materially and protects campaign spend.
          </p>
          <BusinessCaseExplorer slug="stockout-probability-real-decisions" />
          <p>
            The habit: show reorder points with explicit stockout probability in planning docs. This
            keeps inventory decisions aligned with customer experience and working capital.
          </p>
        </div>

        <RelatedPosts slug="stockout-probability-real-decisions" />
      </article>
    </main>
  );
}
