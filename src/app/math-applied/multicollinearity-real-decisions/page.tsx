import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import MulticollinearityExplorer from "@/components/MulticollinearityExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("multicollinearity-real-decisions");

export default function MulticollinearityPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Multicollinearity: When Two Drivers Share the Same Story
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Two nearly parallel feature vectors in regression"
              className="h-auto w-full object-contain"
              height={500}
              src="/multicollinearity.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Regression wants to split credit across inputs. When ad spend and branded search move
            together, the model cannot tell which lever caused the lift. Coefficients become unstable:
            small data changes flip signs or swap magnitude.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Multicollinearity answers: Are my inputs redundant enough that driver rankings are not
            trustworthy?
          </p>

          <MulticollinearityExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="high correlation between columns of X" label="Collinear features">
            <p>Columns of the design matrix point in nearly the same direction in feature space.</p>
          </MathBlock>
          <MathBlock formula="coefficients sensitive to small data changes" label="Unstable β">
            <p>Drop one row or add a week and β1, β2 can swing even when predictions stay similar.</p>
          </MathBlock>
          <MathBlock formula="fix: drop, combine, or regularize" label="What to do">
            <p>
              Keep one of the twins, build a composite index, or use ridge penalty. Do not interpret
              each coefficient as a clean causal lever.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: marketing attribution
          </h2>
          <p>
            Two channels rise in the same campaign weeks. The regression still forecasts, but
            coefficient signs are not a budget allocation guide. Check correlation before you present
            driver slides to leadership.
          </p>
          <BusinessCaseExplorer slug="multicollinearity-real-decisions" />

          <p>
            The habit: plot feature correlation before trusting multi-driver regression. Pair with
            overfitting when you have many correlated KPIs and short history.
          </p>
        </div>

        <RelatedPosts slug="multicollinearity-real-decisions" />
      </article>
    </main>
  );
}
