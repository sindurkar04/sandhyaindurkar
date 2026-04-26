import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col px-6 pb-20 pt-10 sm:px-10 lg:px-14">
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-sm sm:p-10">
        <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)]">
          <Image
            alt="Sandhya Indurkar headshot"
            className="h-auto w-full object-cover"
            height={1024}
            priority
            src="/sandhya_headshot.png"
            width={1024}
          />
        </div>

        <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
          My Story
        </h1>

        <div className="mt-6 space-y-5 leading-relaxed text-[color:var(--muted)]">
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
    </main>
  );
}
