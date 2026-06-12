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
            alt="Homemade rasmalai cake with saffron frosting and rose petals"
            description="My first bake: a rasmalai-inspired cake for my son's second birthday."
            href="/learning-through-food/rasmalai-cake"
            image="/rasmalai_cake.jpg"
            imageCover
            title="Rasmalai Cake"
          />
          <PostIndexCard
            alt="Homemade rasmalai in cardamom milk"
            description="Soft cheese dumplings in milk: what the process taught me about timing and texture."
            href="/learning-through-food/rasmalai"
            image="/rasmalai.jpg"
            imageCover
            title="Rasmalai"
          />
          <PostIndexCard
            alt="Akki rotti with onion and herbs, charred from the tawa"
            description="Rice flour flatbread: heat, hydration, and when to stop handling the dough."
            href="/learning-through-food/akki-rotti"
            image="/akki_rotti.jpg"
            imageCover
            title="Akki Rotti"
          />
          <PostIndexCard
            alt="Malai kofta in creamy tomato gravy"
            description="Paneer koftas in cream sauce: building flavor in stages."
            href="/learning-through-food/malai-kofta"
            image="/malai_kofta.jpg"
            imageCover
            title="Malai Kofta"
          />
          <PostIndexCard
            alt="Milk burfi squares topped with almond slivers"
            description="Simple milk fudge: stirring, timing, and knowing when to stop."
            href="/learning-through-food/milk-burfi"
            image="/milk_burfi.jpg"
            imageCover
            title="Milk Burfi"
          />
        </div>
      </section>
    </main>
  );
}
