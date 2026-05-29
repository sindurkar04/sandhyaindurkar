import PostIndexCard from "@/components/PostIndexCard";
import { getPostsGroupedByCategory } from "@/lib/math-applied-posts";

export default function MathAppliedPage() {
  const groups = getPostsGroupedByCategory();

  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-10 px-4 py-10 sm:px-6 lg:px-8">
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
      </header>

      <div className="space-y-14">
        {groups.map(({ category, posts }) => (
          <section className="space-y-6" key={category.id}>
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
