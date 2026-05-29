type PostIndexCardProps = {
  alt: string;
  description: string;
  href: string;
  image: string;
  imageCover?: boolean;
  title: string;
};

export default function PostIndexCard({
  alt,
  description,
  href,
  image,
  imageCover = false,
  title,
}: PostIndexCardProps) {
  return (
    <a
      className="group block overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:border-[color:var(--border-strong)] hover:shadow-md"
      href={href}
    >
      <div
        className={`border-b border-[color:var(--border)] bg-[#f5f1eb] transition group-hover:bg-[#efe9e0] ${
          imageCover ? "h-48 overflow-hidden" : "flex h-48 items-center justify-center p-5"
        }`}
      >
        <img
          alt={alt}
          className={
            imageCover ? "h-full w-full object-cover" : "max-h-full max-w-full object-contain"
          }
          src={image}
        />
      </div>
      <div className="space-y-4 p-5">
        <h2 className="text-xl font-bold leading-snug tracking-tight text-[color:var(--foreground)] transition group-hover:underline sm:text-2xl">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-[color:var(--muted)]">{description}</p>
        <span className="inline-flex rounded-lg bg-black px-5 py-2.5 text-sm font-bold text-white transition group-hover:bg-[#222222]">
          Read more
        </span>
      </div>
    </a>
  );
}
