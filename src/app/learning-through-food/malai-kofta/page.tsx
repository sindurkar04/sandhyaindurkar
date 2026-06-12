import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Malai Kofta",
  description:
    "Soft paneer koftas in a creamy tomato gravy: what this dish taught me about building flavor in stages.",
  path: "/learning-through-food/malai-kofta",
  image: "/malai_kofta.jpg",
});

export default function MalaiKoftaPostPage() {
  return (
    <main className="mx-auto w-full max-w-[880px] space-y-5 px-3 py-7 sm:px-4">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Learning Through Food
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Malai Kofta
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
          <Image
            alt="Malai kofta in creamy tomato gravy with cream swirls and cilantro"
            className="h-auto w-full object-cover"
            height={900}
            src="/malai_kofta.jpg"
            width={1600}
          />
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The moment</h2>
          <p>
            Malai kofta is restaurant food in my head. Soft paneer balls in a rich, slightly sweet
            tomato cream sauce. It is the kind of dish you order when someone else is cooking. Making
            it at home felt ambitious: two components, both needing attention, served together at the
            end.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Why I learned this</h2>
          <p>
            I wanted a weekend meal that felt special without going out. I also wanted to practice
            working in stages: prep the koftas, make the gravy, fry, then combine. That structure
            shows up in a lot of cooking. Doing it deliberately helped me see the pattern.
          </p>
          <p>
            After making rasmalai, I was more comfortable with paneer texture. Malai kofta uses paneer
            differently, mixed with potato and spices, but the same idea applies. Handle it gently.
            Overwork it and the koftas turn dense.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The experience</h2>
          <p>
            The gravy comes together from a base of onion, tomato, and cashews blended smooth. Cream
            goes in at the end. The sauce should be silky, not thin. If it is too thick, it coats the
            koftas instead of pooling around them.
          </p>
          <p>
            Frying the koftas is quick. The risk is breaking them in the oil. I kept the heat
            medium, turned carefully, and added them to the gravy just before serving so they stayed
            soft inside.
          </p>
          <p>
            The finished bowl looked closer to a restaurant version than I expected. The gap was not
            technique on any one step. It was doing the steps in the right order and not rushing the
            gravy.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The recipe I follow</h2>
          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Ingredients</h3>
          <p className="font-semibold text-[color:var(--foreground)]">For the koftas</p>
          <ul className="list-inside list-disc space-y-1">
            <li>1 cup grated paneer</li>
            <li>1 small boiled potato, mashed</li>
            <li>2 tablespoons cornflour</li>
            <li>½ teaspoon garam masala</li>
            <li>Salt to taste</li>
            <li>Oil for shallow frying</li>
          </ul>

          <p className="font-semibold text-[color:var(--foreground)]">For the gravy</p>
          <ul className="list-inside list-disc space-y-1">
            <li>1 large onion, chopped</li>
            <li>2 tomatoes, chopped</li>
            <li>¼ cup cashews, soaked</li>
            <li>1 teaspoon ginger-garlic paste</li>
            <li>1 teaspoon coriander powder</li>
            <li>½ teaspoon cumin powder</li>
            <li>¼ cup cream</li>
            <li>1 tablespoon butter or oil</li>
            <li>Salt, sugar, and garam masala to taste</li>
            <li>Fresh cilantro for garnish</li>
          </ul>

          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Steps</h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>Mix kofta ingredients gently. Shape into small balls. Refrigerate 15 minutes if the mixture is soft.</li>
            <li>Sauté onion until golden. Add tomatoes and ginger-garlic. Cook until tomatoes break down. Cool slightly.</li>
            <li>Blend with cashews until smooth. Return to the pan, add spices, salt, and a pinch of sugar. Simmer until thick.</li>
            <li>Stir in cream. Adjust seasoning. Keep warm on low heat.</li>
            <li>Shallow fry koftas until golden on all sides. Drain on a paper towel. Add to the gravy just before serving. Garnish with cream and cilantro.</li>
          </ol>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">What I learned</h2>
          <p>
            Malai kofta is two recipes that meet at the end. Treating it that way made the process
            calmer. I was not juggling everything at once. Prep, sauce, fry, combine.
          </p>
          <p>
            The gravy rewards patience. Rushing the tomato base leaves a sharp, thin sauce. Giving it
            time to cook down and blending cashews in changes the whole dish. That is true for a lot
            of curries, but this was the first time I noticed it clearly.
          </p>
        </div>
      </article>
    </main>
  );
}
