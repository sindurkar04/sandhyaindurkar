import MathBlock from "@/components/MathBlock";
import MeanMedianExplorer from "@/components/MeanMedianExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("mean-vs-median-real-data");


export default function MeanVsMedianPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Average Isn&apos;t the Answer: What Mean and Median Actually Tell You in Real Data
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Mean vs median comparison visual"
              className="h-auto w-full object-contain"
              height={900}
              src="/mean_median.png"
              width={1600}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            When people summarize data, they often reach for one number: the average. In math class, that usually means the mean. You add everything up and divide by how many values you have.
          </p>
          <p>For example, five customer order values:</p>
          <p className="font-bold text-[color:var(--foreground)]">
            $12, $18, $20, $22, $128
          </p>
          <p>
            The mean is $40. That is the number most dashboards would show. It is also the number that can mislead you the fastest.
          </p>
          <p>
            The median is different. You sort the values and pick the one in the middle. For this set, the median is $20. Same data, very different story.
          </p>
          <p>
            Mean and median are not competing formulas. They answer different questions about the same list of numbers.
          </p>

          <MeanMedianExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Both summaries come from the same list. The difference is how each one treats every
            value in that list.
          </p>
          <MathBlock
            formula="mean = (x1 + x2 + ... + xn) / n"
            label="Mean (arithmetic average)"
          >
            <p>
              Add every order value, then divide by how many orders you have. In the example above,
              ($12 + $18 + $20 + $22 + $128) ÷ 5 = $40. Every dollar counts equally, including the
              $128 outlier.
            </p>
          </MathBlock>
          <MathBlock formula="median = middle value after sorting" label="Median">
            <p>
              Sort the values: $12, $18, $20, $22, $128. The middle entry is $20. Half the orders
              are at or below $20, half are at or above. One huge order does not get extra weight
              just because it is large.
            </p>
          </MathBlock>
          <p>
            Add one extreme value and the mean moves toward it while the median may barely budge.
            With more typical orders, the outlier dilutes in the mean but the median shifts only
            when the middle of the sorted list changes. Shift every value by the same amount and
            both move together. When mean and median sit far apart, you usually have a skewed tail;
            that gap is often more informative than either number alone.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Why one summary isn&apos;t enough</h2>
          <p>
            The mean is pulled toward extreme values. One very large order, one very long wait time, or one unusually high salary can move the average far from what most people actually experience.
          </p>
          <p>
            The median is more stable in those situations. It reflects the typical case, not the total spread of every value.
          </p>
          <p>
            This matters because most real decisions are not about totals. They are about what is normal, what is fair, and what most users or customers are likely to see.
          </p>
          <p>
            If you only report the mean, you can think performance is strong while most of the system is struggling. If you only report the median, you can miss real shifts driven by a small number of high-value events. You need both, plus context.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application: customer spend</h2>
          <p>Imagine you are reviewing monthly spend for a product with mostly small purchases and a few large ones.</p>
          <p>
            The mean spend might rise because a handful of customers upgraded or bought premium plans. Leadership sees growth. Marketing calls it a win.
          </p>
          <p>
            The median spend might barely move. That tells you most customers are behaving the same way they did before. Growth is concentrated, not broad.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Mean answers: What is the total per customer on average?
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Median answers: What does a typical customer look like?
          </p>
          <p>
            Those are different business questions. Using the wrong one leads to the wrong decision, such as scaling a feature that only helps your top spenders while assuming everyone benefits.
          </p>
          <p>
            The same pattern shows up in response times, delivery delays, and survey scores. One outlier can inflate the mean. The median keeps you grounded in everyday experience.
          </p>

          <p>
            Choosing between mean and median is not a technical detail. It is a decision about what you are trying to understand.
          </p>
          <p>
            Use the mean when totals matter and outliers are part of the real story you care about, such as revenue, inventory, or capacity planning.
          </p>
          <p>
            Use the median when you care about typical behavior and want a number that is not easily distorted by a few extreme values.
          </p>
          <p>
            In practice, the strongest analysis includes both. The gap between them is often more informative than either number alone. A rising mean with a flat median usually means change is concentrated. A flat mean with a falling median can mean trouble is spreading through the typical case even before totals move.
          </p>

          <p>
            Most misleading conclusions in data do not come from bad math. They come from summarizing too much into one number and picking the wrong one.
          </p>
          <p>
            Mean and median are simple tools, but they shape how teams interpret results, set targets, and decide what to fix. When you report both and explain the gap between them, you move from a vague average to a clearer picture of what is actually happening.
          </p>
        </div>

        <RelatedPosts slug="mean-vs-median-real-data" />
      </article>
    </main>
  );
}
