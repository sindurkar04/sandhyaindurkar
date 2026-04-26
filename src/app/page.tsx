import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-14">
      <header className="sticky top-4 z-10 mb-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)]/95 px-5 py-3 shadow-sm backdrop-blur">
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold tracking-[0.08em] text-[color:var(--accent)]">
            Sandhya Indurkar
          </p>
          <div className="flex flex-wrap gap-1 text-sm">
            <a
              className="rounded-full px-3 py-1.5 transition hover:bg-[color:var(--surface-strong)]"
              href="#home"
            >
              Home
            </a>
            <a
              className="rounded-full px-3 py-1.5 transition hover:bg-[color:var(--surface-strong)]"
              href="#math-applied"
            >
              Math, Applied
            </a>
            <a
              className="rounded-full px-3 py-1.5 transition hover:bg-[color:var(--surface-strong)]"
              href="#learning-through-food"
            >
              Learning Through Food
            </a>
          </div>
        </nav>
      </header>

      <section className="mb-8 grid gap-6 lg:grid-cols-[1.35fr,1fr]" id="home">
        <article className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-sm sm:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
            Featured Story
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            My Story
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-[color:var(--muted)]">
            From struggling with abstract math to applying it through data
            science, and from avoiding cooking to learning through it one dish
            at a time.
          </p>
          <a
            className="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-medium text-white transition hover:brightness-95"
            href="#my-story"
          >
            Read full story
          </a>
        </article>

        <aside className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
          <div className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)]">
            <Image
              alt="Sandhya Indurkar headshot"
              className="h-auto w-full object-cover"
              height={1024}
              priority
              src="/sandhya_headshot.png"
              width={1024}
            />
          </div>
          <div className="mt-5 border-t border-[color:var(--border)] pt-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">
              Based in
            </p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">New York</p>
          </div>
        </aside>
      </section>

      <section
        className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-sm sm:p-10"
        id="my-story"
      >
        <div className="space-y-5 leading-relaxed text-[color:var(--muted)]">
          <p>
            Growing up, I thought I wasn&apos;t good at math. Most of what I
            learned felt abstract, and I couldn&apos;t see how it connected to
            anything outside the classroom.
          </p>
          <p>
            That changed when I started working in data science. I found myself
            using the same concepts I had struggled with before, but now they
            showed up in real decisions. I began to see how things perform,
            what drives outcomes, and what actually matters. Once I could see
            the application, the ideas started to make sense.
          </p>
          <p>
            I used to feel the same way about cooking. It always seemed
            difficult, time consuming, and not something I naturally enjoyed. I
            preferred quick solutions and did not think of it as something I
            would take the time to learn properly.
          </p>
          <p>
            That started to shift over time. Cooking turned out to be less
            about complexity and more about paying attention to timing, texture,
            and small adjustments. In a similar way, math became easier once I
            could see how it works in practice. When things feel real, they
            become easier to understand.
          </p>
          <p>
            I am currently based in New York, and I have become increasingly
            interested in how people learn and apply complex ideas, not just in
            work but in everyday life.
          </p>
          <p>
            This site is where I write about what I am learning through math,
            work, and food.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <article
          className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-sm sm:p-8"
          id="math-applied"
        >
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
            Math, Applied
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Mathematical concepts in real life
          </h2>
          <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
            This section is where I write about mathematical concepts and how
            they show up in practical decisions, outcomes, and everyday
            patterns.
          </p>
          <ul className="mt-6 space-y-3 text-[color:var(--muted)]">
            <li>How concepts appear in work and data-driven decisions</li>
            <li>Simple explanations tied to practical examples</li>
            <li>What matters most when applying ideas to real problems</li>
          </ul>
        </article>

        <article
          className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-sm sm:p-8"
          id="learning-through-food"
        >
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[color:var(--accent)]">
            Learning Through Food
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            What each dish teaches me
          </h2>
          <p className="mt-4 leading-relaxed text-[color:var(--muted)]">
            Here I focus on dishes I am learning, and the lessons each one
            teaches me about process, patience, timing, and adaptation.
          </p>
          <ul className="mt-6 space-y-3 text-[color:var(--muted)]">
            <li>New dishes and what I learned from trying them</li>
            <li>What worked, what failed, and what changed the result</li>
            <li>How cooking mirrors learning in work and life</li>
          </ul>
        </article>
      </section>

      <footer className="mt-10 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 text-sm text-[color:var(--muted)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>© 2024 Sandhya Indurkar · Math, Applied · Learning Through Food</p>
          <a
            aria-label="LinkedIn profile"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium transition hover:bg-[color:var(--surface-strong)]"
            href="https://www.linkedin.com/in/sandhya-indurkar/"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8h4V24h-4V8zM8 8h3.8v2.2h.1c.5-.95 1.72-2.2 3.55-2.2C20.03 8 24 10.44 24 16.22V24h-4v-6.9c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.64V24h-4V8z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
