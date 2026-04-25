export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">
        Welcome to your Next.js site
      </h1>
      <p className="text-lg text-neutral-600">
        This project is ready to deploy on Vercel. Replace this page with your
        migrated content from Squarespace, then connect your custom domain in
        the Vercel dashboard and point DNS at Vercel from Squarespace.
      </p>
    </main>
  );
}
