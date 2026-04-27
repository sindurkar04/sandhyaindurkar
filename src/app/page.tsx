import Image from "next/image";

const storyParagraphs = [
  "Growing up, I thought I wasn't good at math. Most of what I learned felt abstract, and I couldn't see how it connected to anything outside the classroom.",
  "That changed when I started working in data science. I found myself using the same concepts I had struggled with before, but now they showed up in real decisions. I began to see how things perform, what drives outcomes, and what actually matters. Once I could see the application, the ideas started to make sense.",
  "I used to feel the same way about cooking. It always seemed difficult, time consuming, and not something I naturally enjoyed. I preferred quick solutions and did not think of it as something I would take the time to learn properly.",
  "That started to shift over time. Cooking turned out to be less about complexity and more about paying attention to timing, texture, and small adjustments. In a similar way, math became easier once I could see how it works in practice. When things feel real, they become easier to understand.",
  "I am currently based in New York, and I have become increasingly interested in how people learn and apply complex ideas, not just in work but in everyday life.",
  "This site is where I write about what I am learning through math, work, and food.",
];

export default function Home() {
  return (
    <main className="w-full">
      <section className="border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              My Story
            </p>
            <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)]">
              <Image
                alt="Portrait of Sandhya Indurkar"
                className="h-full max-h-[700px] w-full object-cover"
                height={1000}
                priority
                src="/sandhya_headshot.png"
                width={900}
              />
            </div>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Based in New York, I write about turning abstract ideas into practical understanding.
            </p>
          </div>

          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 sm:p-8">
            <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              My Story
            </h1>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-[color:var(--foreground)]">
              A personal journal on making complex ideas practical through data, work, and food.
            </p>
            <p className="mt-5 text-base leading-relaxed text-[color:var(--muted)]">
              I write about the intersection of analytical thinking and everyday learning, with stories that are practical, clear, and grounded in real experience.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#222]"
                href="/math-applied"
              >
                Read Math, Applied
              </a>
              <a
                className="inline-flex rounded-full border border-[color:var(--border-strong)] px-5 py-2.5 text-sm font-bold text-[color:var(--foreground)] transition hover:bg-white"
                href="/learning-through-food"
              >
                Explore Learning Through Food
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <h2 className="text-2xl font-black tracking-tight text-[color:var(--foreground)] sm:text-3xl">
          My Story
        </h2>
        <div className="mt-6 grid gap-6 text-[17px] leading-8 text-[color:var(--muted)] lg:grid-cols-2">
          {storyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="grid gap-5 px-4 pb-8 sm:px-6 md:grid-cols-2 lg:px-8 lg:pb-10">
        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Journal
          </p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-[color:var(--foreground)]">
            Math, Applied
          </h3>
          <p className="mt-3 leading-relaxed text-[color:var(--muted)]">
            Exploring how math and data shape real-world decisions through practical stories and breakdowns.
          </p>
          <a
            className="mt-5 inline-flex rounded-full bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-[#222]"
            href="/math-applied"
          >
            View posts
          </a>
        </article>

        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Journal
          </p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-[color:var(--foreground)]">
            Learning Through Food
          </h3>
          <p className="mt-3 leading-relaxed text-[color:var(--muted)]">
            Lessons from dishes I am learning and what each one teaches about process, patience, and adaptation.
          </p>
          <a
            className="mt-5 inline-flex rounded-full bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-[#222]"
            href="/learning-through-food"
          >
            View stories
          </a>
        </article>
      </section>
    </main>
  );
}
