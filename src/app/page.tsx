import Image from "next/image";
import { homeMetadata } from "@/lib/metadata";

export const metadata = homeMetadata;

const storyParagraphs = [
  "Growing up, I thought I wasn't good at math. Most of what I learned felt abstract, and I couldn't see how it connected to anything outside the classroom.",
  "That changed when I started working in data science. I found myself using the same concepts I had struggled with before, but now they showed up in real decisions. I began to see how things perform, what drives outcomes, and what actually matters. Once I could see the application, the ideas started to make sense. I used to feel the same way about cooking. It always seemed difficult, time consuming, and not something I naturally enjoyed. I preferred quick solutions and did not think of it as something I would take the time to learn properly.",
  "That started to shift over time. Cooking turned out to be less about complexity and more about paying attention to timing, texture, and small adjustments. In a similar way, math became easier once I could see how it works in practice. When things feel real, they become easier to understand.",
  "I am currently based in New York, and I have become increasingly interested in how people learn and apply complex ideas, not just in work but in everyday life.",
  "This site is where I write about what I am learning through math, work, and food.",
];

const storyIntro = storyParagraphs.slice(0, 2);
const storyContinuation = storyParagraphs.slice(2);

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-[390px_minmax(0,1fr)] lg:items-start">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
              <Image
                alt="Portrait of Sandhya Indurkar"
                className="h-auto w-full object-contain"
                height={1000}
                priority
                src="/sandhya_headshot.png"
                width={900}
              />
            </div>
          </div>

          <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
            <p className="text-xs font-bold tracking-[0.18em] text-[color:var(--muted)]">
              MY STORY
            </p>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              Hi, I&apos;m Sandhya.
            </h1>
            {storyIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="space-y-5 border-t border-[color:var(--border)] pt-7 text-[17px] leading-8 text-[color:var(--muted)]">
          {storyContinuation.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 border-t border-[color:var(--border)] pt-8 md:grid-cols-2">
        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="border-b border-[color:var(--border)] bg-[#f5f1eb]">
            <img
              alt="Math, Applied: charts, summaries, and decisions from data"
              className="h-auto w-full"
              src="/math_applied_home.svg"
            />
          </div>
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-black tracking-tight text-[color:var(--foreground)]">
              Math, Applied
            </h2>
            <p className="leading-relaxed text-[color:var(--muted)]">
              Practical writing on how mathematical concepts shape real-world decisions and systems.
            </p>
            <a className="inline-flex text-sm font-bold text-[color:var(--foreground)] underline" href="/math-applied">
              View posts
            </a>
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
          <div className="border-b border-[color:var(--border)] bg-[#f5f1eb]">
            <img
              alt="Learning Through Food: cooking as applied learning"
              className="h-auto w-full"
              src="/learning_through_food_home.svg"
            />
          </div>
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-black tracking-tight text-[color:var(--foreground)]">
              Learning Through Food
            </h2>
            <p className="leading-relaxed text-[color:var(--muted)]">
              Cooking posts focused on process, precision, and what each dish teaches in practice.
            </p>
            <a className="inline-flex text-sm font-bold text-[color:var(--foreground)] underline" href="/learning-through-food">
              View posts
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
