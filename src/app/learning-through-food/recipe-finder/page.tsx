import RecipeFinder from "@/components/RecipeFinder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recipe Finder | Sandhya Indurkar",
  description:
    "Enter ingredients you have and get recipe recommendations ranked by what you already have on hand.",
};

export default function RecipeFinderPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Learning Through Food
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--foreground)] sm:text-5xl">
          Recipe finder
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted)]">
          Tell us what you have in your kitchen. We will suggest recipes you can make, ranked by
          how many ingredients you already have.
        </p>
      </header>

      <RecipeFinder />

      <p className="text-sm text-[color:var(--muted)]">
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
    </main>
  );
}
