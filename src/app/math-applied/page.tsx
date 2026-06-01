import GanitaGuide from "@/components/GanitaGuide";
import PostIndexCard from "@/components/PostIndexCard";
import { buildSectionMetadata } from "@/lib/metadata";
import { getPostsGroupedByCategory, MATH_CATEGORIES } from "@/lib/math-applied-posts";

export const metadata = buildSectionMetadata({
  title: "Math, Applied",
  description:
    "Exploring how math and data shape real-world decisions: summarizing data, running experiments, and avoiding common traps.",
  path: "/math-applied",
  image: "/math_applied_home.svg",
});

export default function MathAppliedPage() {
  const groups = getPostsGroupedByCategory();

  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-10 px-4 py-7 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--foreground)] sm:text-5xl">
          Exploring how math and data shape real-world decisions.
        </h1>
        <p className="text-base leading-relaxed text-[color:var(--muted)]">
          Breaking down complex systems into ideas we can actually use.
        </p>
        <nav
          aria-label="Jump to section"
          className="flex flex-wrap gap-x-1 gap-y-2 pt-2 text-sm font-bold"
        >
          {MATH_CATEGORIES.map((category, index) => (
            <span className="inline-flex items-center" key={category.id}>
              {index > 0 ? (
                <span aria-hidden="true" className="mx-2 text-[color:var(--muted)]">
                  ·
                </span>
              ) : null}
              <a
                className="text-[color:var(--foreground)] underline-offset-4 transition hover:underline"
                href={`#${category.id}`}
              >
                {category.label}
              </a>
            </span>
          ))}
        </nav>
      </header>

      <section
        className="space-y-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5"
        id="ganita"
      >
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Ganita
        </h2>

        <GanitaGuide />
      </section>

      <div className="space-y-10">
        {groups.map(({ category, posts }) => (
          <section className="scroll-mt-24 space-y-6" id={category.id} key={category.id}>
            <div className="space-y-2 border-b border-[color:var(--border)] pb-4">
              <h2 className="text-2xl font-black tracking-tight text-[color:var(--foreground)]">
                {category.label}
              </h2>
              <p className="text-sm leading-relaxed text-[color:var(--muted)]">
                {category.description}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <PostIndexCard
                  alt={post.title}
                  description={post.description}
                  href={post.href}
                  image={post.image}
                  key={post.slug}
                  title={post.title}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
