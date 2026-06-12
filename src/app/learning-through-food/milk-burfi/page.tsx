import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Milk Burfi",
  description:
    "A simple milk fudge with nuts: what burfi taught me about stirring, timing, and knowing when the mixture is ready.",
  path: "/learning-through-food/milk-burfi",
  image: "/milk_burfi.jpg",
});

export default function MilkBurfiPostPage() {
  return (
    <main className="mx-auto w-full max-w-[880px] space-y-5 px-3 py-7 sm:px-4">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Learning Through Food
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Milk Burfi
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
          <Image
            alt="Square pieces of milk burfi topped with almond slivers on a glass plate"
            className="h-auto w-full object-cover"
            height={900}
            src="/milk_burfi.jpg"
            width={1600}
          />
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The moment</h2>
          <p>
            Burfi is the sweet I associate with festivals and visits. Small squares, dense and milky,
            often topped with nuts. It looks precise, like it requires skill I do not have. The
            version I make is simpler than shop burfi, but it taught me something similar: you have
            to watch the pan and stop at the right moment.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Why I learned this</h2>
          <p>
            I wanted a sweet I could make at home without deep frying or multiple steps. Milk burfi
            uses pantry staples: milk powder, a little ghee, sugar, and cardamom. It sets in a tray
            and cuts into pieces. That structure appealed to me after the more fluid process of
            making rasmalai.
          </p>
          <p>
            It also felt like good practice in timing. Burfi does not warn you loudly when it is
            ready. The mixture thickens gradually. Leave it too long and it turns dry. Stop too
            early and it will not hold a clean square.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The experience</h2>
          <p>
            The stirring is steady, not fast. Ghee, milk powder, and sugar come together into a thick
            paste that pulls away from the sides of the pan. That is the signal. Before that point it
            is too soft. After it, the texture gets grainy.
          </p>
          <p>
            I press almond slivers on top while it is still warm. Cutting happens after it cools
            completely. Rushing that step cracks the squares. Waiting is part of the recipe.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The recipe I follow</h2>
          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Ingredients</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>2 cups milk powder</li>
            <li>½ cup sugar</li>
            <li>¼ cup ghee</li>
            <li>½ cup warm milk</li>
            <li>½ teaspoon cardamom powder</li>
            <li>2 tablespoons slivered almonds or pistachios</li>
          </ul>

          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Steps</h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>Heat ghee in a heavy pan on low. Add milk powder and stir for one to two minutes until it smells nutty.</li>
            <li>Add sugar and warm milk. Stir continuously. The mixture will thicken and start to leave the sides of the pan.</li>
            <li>Add cardamom. Cook one to two minutes more until the mixture holds together in a mass.</li>
            <li>Spread evenly in a greased tray. Press almond slivers on top while warm.</li>
            <li>Cool completely, at least one hour. Cut into squares with a sharp knife.</li>
          </ol>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">What I learned</h2>
          <p>
            Burfi looks like a recipe about ingredients. It is really a recipe about when to stop.
            The same mixture at two different times produces different results. Learning to read the
            pan matters more than getting the measurements exact.
          </p>
          <p>
            That idea shows up elsewhere too: in rasmalai, in akki rotti, in the cake soak. Different
            dishes, same lesson. Pay attention to the point where the process shifts, and do not push
            past it.
          </p>
        </div>
      </article>
    </main>
  );
}
