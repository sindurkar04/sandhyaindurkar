export default function LearningThroughFoodPage() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-10 sm:px-10">
      <header className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)]">
          Learning Through Food
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[color:var(--muted)]">
          This section is where each dish becomes a lesson in timing, process, and adaptation.
        </p>
      </header>

      <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-[color:var(--foreground)]">
          Stories coming soon
        </h2>
        <p className="mt-3 text-[color:var(--muted)]">
          You can add each new dish as its own post page and list it here.
        </p>
      </section>
    </main>
  );
}
