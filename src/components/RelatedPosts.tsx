import { getRelatedPosts } from "@/lib/math-applied-posts";

type RelatedPostsProps = {
  slug: string;
};

export default function RelatedPosts({ slug }: RelatedPostsProps) {
  const posts = getRelatedPosts(slug);

  if (posts.length === 0) {
    return null;
  }

  return (
    <aside className="mt-12 border-t border-[color:var(--border)] pt-10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
        Related
      </p>
      <ul className="mt-5 space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <a
              className="group block rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 transition hover:border-[color:var(--border-strong)] hover:shadow-sm sm:px-6 sm:py-5"
              href={post.href}
            >
              <p className="text-[17px] font-bold leading-snug text-[color:var(--foreground)] group-hover:underline sm:text-lg">
                {post.title}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--muted)] sm:text-base">
                {post.description}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
