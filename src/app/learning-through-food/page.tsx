import RecipeFinder from "@/components/RecipeFinder";
import PostIndexCard from "@/components/PostIndexCard";
import { buildSectionMetadata } from "@/lib/metadata";

export const metadata = buildSectionMetadata({
  title: "Learning Through Food",
  description:
    "Stories of cooking as applied learning: precision, patience, and decisions in practice.",
  path: "/learning-through-food",
  image: "/learning_through_food_home.svg",
});

export default function LearningThroughFoodPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-10 px-4 py-7 sm:px-6 lg:px-8">
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

      <section
        className="space-y-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5"
        id="recipe-finder"
      >
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Tool
          </p>
          <h2 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            Recipe finder
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted)]">
            Enter ingredients you have and get ranked recipe ideas based on what is already in your
            pantry.
          </p>
        </div>

        <RecipeFinder />

        <p className="border-t border-[color:var(--border)] pt-5 text-sm text-[color:var(--muted)]">
          Recipe data provided by{" "}
          <a
            className="font-bold text-[color:var(--foreground)] underline"
            href="https://spoonacular.com"
            rel="noreferrer"
            target="_blank"
          >
            Spoonacular
          </a>
          .
        </p>
      </section>

      <section className="space-y-6 border-t border-[color:var(--border)] pt-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
            My recipes
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted)]">
            What I learned making each dish: timing, texture, and the small decisions that matter.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <PostIndexCard
            alt="Homemade rasmalai in cardamom milk"
            description="Soft cheese dumplings in milk: what the process taught me about timing and texture."
            href="/learning-through-food/rasmalai"
            image="/rasmalai.jpg"
            imageCover
            title="Rasmalai"
          />
        </div>
      </section>
    </main>
  );
}
