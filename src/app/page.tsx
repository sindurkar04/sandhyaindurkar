import ContactSubscribeSection from "@/components/ContactSubscribeSection";
import Image from "next/image";
import PostIndexCard from "@/components/PostIndexCard";
import { homeMetadata } from "@/lib/metadata";

export const metadata = homeMetadata;

const storyParagraphs = [
  "Growing up, I thought I wasn't good at math. Most of what I learned felt abstract, and I couldn't see how it connected to anything outside the classroom.",
  "That changed when I started working in data science. I found myself using the same concepts I had struggled with before, but now they showed up in real decisions. I began to see how things perform, what drives outcomes, and what actually matters. Once I could see the application, the ideas started to make sense. I used to feel the same way about cooking. It always seemed difficult, time consuming, and not something I naturally enjoyed. I preferred quick solutions and did not think of it as something I would take the time to learn properly.",
  "That started to shift over time. Cooking turned out to be less about complexity and more about paying attention to timing, texture, and small adjustments. In a similar way, math became easier once I could see how it works in practice. When things feel real, they become easier to understand.",
  "I am currently based in New York, and I have become increasingly interested in how people learn and apply complex ideas, not just in work but in everyday life.",
  "This site is where I write about what I am learning through math, work, and food.",
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1200px] space-y-12 px-3 py-8 sm:px-5 lg:px-8">
      <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-7">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-center lg:gap-12">
        <div className="mx-auto w-full max-w-[280px] lg:mx-0">
          <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
            <Image
              alt="Portrait of Sandhya Indurkar"
              className="h-auto w-full object-cover"
              height={1000}
              priority
              src="/sandhya_headshot.png"
              width={900}
            />
          </div>
        </div>

          <div className="space-y-5 text-center lg:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Sandhya Indurkar
          </p>
            <h1 className="text-4xl font-black tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
            Math and food, applied in real life.
          </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--body)] lg:max-w-none">
            I write about how data shapes decisions at work, and what cooking teaches about
            learning by doing.
          </p>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a
                className="inline-flex items-center rounded-lg bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#222222]"
                href="/math-applied"
              >
                Explore Math, Applied
              </a>
              <a
                className="inline-flex items-center rounded-lg border border-[color:var(--border-strong)] px-5 py-2.5 text-sm font-bold text-[color:var(--foreground)] transition hover:bg-[#f9fafb]"
                href="/learning-through-food"
              >
                Explore Learning Through Food
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-7">
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-[color:var(--foreground)] sm:text-3xl">
            My story
          </h2>
        </div>
        <div className="max-w-[900px] space-y-5 text-base leading-relaxed text-[color:var(--body)]">
          {storyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-7">
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-[color:var(--foreground)] sm:text-3xl">
            Start here
          </h2>
          <p className="text-base leading-relaxed text-[color:var(--muted)]">
            Two threads on this site. Pick the one that fits what you are looking for.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PostIndexCard
            alt="Math, Applied: charts, summaries, and decisions from data"
            description="Practical posts on experiments, metrics, and traps."
            href="/math-applied"
            image="/math_applied_home.svg"
            title="Math, Applied"
          />
          <PostIndexCard
            alt="Learning Through Food: cooking as applied learning"
            description="What I learned making each dish: timing, texture, and the small decisions that matter."
            href="/learning-through-food"
            image="/learning_through_food_home.svg"
            title="Learning Through Food"
          />
        </div>

        <a
          className="flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[#fafafa] p-5 transition hover:border-[color:var(--border-strong)] hover:shadow-sm"
          href="/math-applied#ganita"
        >
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden="true"
              className="h-[4.5rem] w-12 object-cover object-top"
              src="/ganita_logo.png"
            />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-black tracking-tight text-[color:var(--foreground)]">
              Ask Ganita
            </p>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Not sure which post to read? Describe your problem and Ganita will suggest a match.
            </p>
          </div>
        </a>
      </section>

      <ContactSubscribeSection />
    </main>
  );
}
