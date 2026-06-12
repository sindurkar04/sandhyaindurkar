import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Rasmalai Cake",
  description:
    "My first attempt at baking: a rasmalai-inspired cake for my son's second birthday and what it taught me about starting before you feel ready.",
  path: "/learning-through-food/rasmalai-cake",
  image: "/rasmalai_cake.jpg",
});

export default function RasmalaiCakePostPage() {
  return (
    <main className="mx-auto w-full max-w-[880px] space-y-5 px-3 py-7 sm:px-4">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Learning Through Food
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Rasmalai Cake
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
          <Image
            alt="Homemade rasmalai cake with saffron frosting and dried rose petals on a white cake stand"
            className="h-auto w-full object-cover"
            height={900}
            src="/rasmalai_cake.jpg"
            width={1600}
          />
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The moment</h2>
          <p>
            My son was turning two. I wanted to make the cake myself. Not because I had any baking
            experience, but because it felt like the right kind of effort for a small birthday at
            home. I had never baked a cake before. I had only recently learned to make rasmalai on
            the stove, and that already felt like a stretch.
          </p>
          <p>
            A rasmalai cake seemed like a way to connect something I was starting to understand with
            something I had never tried. Familiar flavor, unfamiliar format.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Why I learned this</h2>
          <p>
            Baking and stovetop cooking ask different things of you. With rasmalai, I learned to
            watch texture and know when to stop. With a cake, you commit earlier. You mix, you bake,
            and you find out later whether the structure held. There is less room to adjust in the
            middle.
          </p>
          <p>
            I wanted to see if the patience from making rasmalai would transfer. It did, but not in
            the way I expected. Baking rewards reading the recipe carefully and trusting the timer
            more than your instincts at first.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The experience</h2>
          <p>
            The cake itself was a simple sponge. The part I cared about was the milk soak and the
            frosting: cardamom, saffron, rose. I wanted it to taste like rasmalai without trying to
            put actual paneer discs inside a layer cake. The frosting went on thicker than I planned.
            The rose petals around the base were partly decoration, partly a way to hide an uneven
            edge.
          </p>
          <p>
            What surprised me was how much the small finishing steps mattered. A little saffron in the
            soak. Letting the cake cool completely before frosting. Those details made more
            difference than any one heroic step during mixing.
          </p>
          <p>
            My son did not care about the uneven swirl on top. He cared that there was cake. That
            helped me see the gap between how I judge my own work and how the people I made it for
            experience it.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The recipe I follow</h2>
          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Ingredients</h3>
          <p className="font-semibold text-[color:var(--foreground)]">For the sponge</p>
          <ul className="list-inside list-disc space-y-1">
            <li>1½ cups all-purpose flour</li>
            <li>1 cup sugar</li>
            <li>½ cup oil or melted butter</li>
            <li>1 cup milk</li>
            <li>2 teaspoons baking powder</li>
            <li>½ teaspoon cardamom powder</li>
            <li>Pinch of salt</li>
          </ul>

          <p className="font-semibold text-[color:var(--foreground)]">For the milk soak</p>
          <ul className="list-inside list-disc space-y-1">
            <li>1 cup warm milk</li>
            <li>2 to 3 tablespoons sugar</li>
            <li>Pinch of saffron</li>
            <li>¼ teaspoon cardamom powder</li>
          </ul>

          <p className="font-semibold text-[color:var(--foreground)]">For the frosting</p>
          <ul className="list-inside list-disc space-y-1">
            <li>8 oz cream cheese, softened</li>
            <li>1 cup heavy cream</li>
            <li>½ cup powdered sugar, or to taste</li>
            <li>¼ teaspoon cardamom powder</li>
            <li>Pinch of saffron soaked in warm milk</li>
            <li>Dried rose petals and chopped pistachios for garnish</li>
          </ul>

          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Steps</h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>Mix dry ingredients. Whisk wet ingredients separately, then combine until just smooth. Pour into a greased round pan.</li>
            <li>Bake at 350°F (175°C) for about 30 to 35 minutes until a toothpick comes out clean. Cool completely on a rack.</li>
            <li>Warm the soak ingredients until sugar dissolves. Poke holes in the cooled cake and spoon the milk over slowly, letting it absorb.</li>
            <li>Beat cream cheese and powdered sugar until smooth. Whip cream to soft peaks and fold in with cardamom and saffron milk.</li>
            <li>Frost the cake. Chill at least one hour before serving. Garnish with rose petals and pistachios.</li>
          </ol>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">What I learned</h2>
          <p>
            This was my first cake. It was not perfect. The frosting was heavy, the top was not
            smooth, and I spent more time on it than I expected. But it held together, it tasted like
            what I intended, and my son was happy.
          </p>
          <p>
            Starting before you feel ready is its own skill. I had made rasmalai, so I understood the
            flavors. I had not baked, so I did not understand the structure. Learning one does not
            automatically teach the other. You still have to try.
          </p>
          <p>
            For his second birthday, that was enough. A cake that connected something familiar to
            something new. That is what I want to keep doing in the kitchen: not waiting until I feel
            like an expert, but building on what I already know one dish at a time.
          </p>
        </div>
      </article>
    </main>
  );
}
