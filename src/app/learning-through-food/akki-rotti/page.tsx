import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Akki Rotti",
  description:
    "Rice flour flatbread from Karnataka: what pressing rotti on a hot tawa taught me about heat, hydration, and when to stop handling the dough.",
  path: "/learning-through-food/akki-rotti",
  image: "/akki_rotti.jpg",
});

export default function AkkiRottiPostPage() {
  return (
    <main className="mx-auto w-full max-w-[880px] space-y-5 px-3 py-7 sm:px-4">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Learning Through Food
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Akki Rotti
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
          <Image
            alt="Akki rotti with onion and herbs on a glass plate, charred spots from the tawa"
            className="h-auto w-full object-cover"
            height={900}
            src="/akki_rotti.jpg"
            width={1600}
          />
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The moment</h2>
          <p>
            Akki rotti is the kind of food I grew up seeing at home but never felt confident making
            myself. Rice flour, water, salt, vegetables mixed in, pressed flat and cooked on a tawa
            until the edges crisp. It sounds simple. The first time you try it, the dough sticks to
            your hands, tears when you spread it, or cooks unevenly. Simple on paper is not always
            simple in practice.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Why I learned this</h2>
          <p>
            I wanted something quick for breakfast that was not toast or cereal. Something that
            connected to home without needing a long prep window. Akki rotti fit: few ingredients,
            one pan, eaten with yogurt or chutney on the side.
          </p>
          <p>
            It also felt like a good lesson in ratios. Too much water and the dough will not hold.
            Too little and it cracks when you press it. There is a narrow range where it works, and
            you learn that range by feel more than by measuring once you have made it a few times.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The experience</h2>
          <p>
            The spreading is the hard part. I press the dough on a greased banana leaf or parchment,
            pat it thin with wet fingers, then flip it onto a hot tawa. The first few attempts tore
            or came out too thick in the middle. The ones that worked had even pressure and a tawa
            that was hot enough to set the surface quickly.
          </p>
          <p>
            The charred spots are not a mistake. They are how you know the heat reached the rotti.
            Pale and soft means it needs more time. Dark and crisp at the edges with a cooked center
            is what you are aiming for.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The recipe I follow</h2>
          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Ingredients</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>2 cups rice flour</li>
            <li>1 to 1¼ cups warm water</li>
            <li>1 teaspoon salt</li>
            <li>½ cup finely chopped onion</li>
            <li>2 tablespoons chopped coriander or dill</li>
            <li>1 to 2 green chilies, finely chopped</li>
            <li>Oil for greasing the tawa and your hands</li>
          </ul>

          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Steps</h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>Mix rice flour, salt, onion, herbs, and chilies. Add warm water gradually until a soft, pliable dough forms.</li>
            <li>Divide into balls. Grease a banana leaf or parchment. Flatten each ball with wet oiled fingers into a thin round, about 6 inches across.</li>
            <li>Heat a tawa on medium-high. Flip the rotti onto the pan, leaf side up. Peel off the leaf after a minute.</li>
            <li>Cook until golden spots appear, then flip. Press gently with a spatula. Cook the second side until crisp at the edges.</li>
            <li>Serve hot with yogurt, chutney, or a small pat of butter.</li>
          </ol>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">What I learned</h2>
          <p>
            Akki rotti taught me that dough hydration is a decision you make with your hands, not
            only with a measuring cup. The same recipe can work or fail depending on how much water
            the flour absorbs that day and how long you handle it.
          </p>
          <p>
            It also taught me to respect heat. A tawa that is not hot enough makes everything harder.
            Get the pan right first, then worry about the shape. That order matters more than I
            expected.
          </p>
        </div>
      </article>
    </main>
  );
}
