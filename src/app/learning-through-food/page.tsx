export default function LearningThroughFoodPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Learning Through Food
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--foreground)] sm:text-5xl">
          Learning a new dish and what it teaches me through the process.
        </h1>
        <p className="text-base leading-relaxed text-[color:var(--muted)]">
          Stories of cooking as applied learning: precision, patience, and decisions in practice.
        </p>
      </header>

      <section className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
          Recipe finder
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-[color:var(--muted)]">
          Enter ingredients you have and get ranked recipe ideas based on what is already in your
          pantry.
        </p>
        <a
          className="mt-4 inline-flex text-sm font-bold text-[color:var(--foreground)] underline"
          href="/learning-through-food/recipe-finder"
        >
          Find a recipe
        </a>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:shadow-sm">
          <img
            alt="Rasmalai dessert in milk"
            className="h-52 w-full object-cover"
            src="/rasmalai.jpg"
          />
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
              Rasmalai
            </h2>
            <a
              className="text-sm font-bold text-[color:var(--foreground)] underline"
              href="/learning-through-food/rasmalai"
            >
              Read post
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
