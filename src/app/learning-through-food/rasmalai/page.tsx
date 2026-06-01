import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Rasmalai",
  description:
    "Making rasmalai at home: what the process teaches about patience, timing, and small adjustments.",
  path: "/learning-through-food/rasmalai",
  image: "/rasmalai.jpg",
});

export default function RasmalaiPostPage() {
  return (
    <main className="mx-auto w-full max-w-[880px] space-y-5 px-3 py-7 sm:px-4">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Learning Through Food
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Rasmalai
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
          <Image
            alt="Homemade rasmalai in cardamom milk"
            className="h-auto w-full object-cover"
            height={900}
            src="/rasmalai.jpg"
            width={1600}
          />
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The moment</h2>
          <p>
            I always thought rasmalai was something you buy, not something you make. It belonged in sweet boxes from Indian stores, brought home for celebrations. It did not feel like something that could come out of your own kitchen without going wrong somewhere.
          </p>
          <p>That assumption is probably why I wanted to try it.</p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Why I learned this</h2>
          <p>
            Lately, I have been thinking more about what it means to recreate things instead of relying on them being available. Not in a big way, just in small everyday decisions. Cooking has been one of the places where that shift shows up clearly.
          </p>
          <p>
            Rasmalai felt like a good place to start. It is familiar, but not something I have seen made often around me. It sits somewhere between simple ingredients and a process that seems easy to get wrong.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The experience</h2>
          <p>
            The part I was most unsure about was the paneer. Getting the texture right is not obvious. There is no exact point where you can say it is done. You have to judge it based on how it feels while kneading.
          </p>
          <p>
            That uncertainty carries through the whole process. Shaping the discs, cooking them in syrup, making sure they hold together without becoming dense. Nothing is complicated on its own, but everything depends on getting those details right.
          </p>
          <p>
            What stood out was how easy it is to overdo things. Knead a little too much, press a little too hard, leave it in the syrup longer than needed, and the result changes. The process rewards restraint more than effort.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The recipe I follow</h2>
          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Ingredients</h3>
          <p className="font-semibold text-[color:var(--foreground)]">For the discs</p>
          <ul className="list-inside list-disc space-y-1">
            <li>1 liter whole milk</li>
            <li>2 to 3 tablespoons lemon juice or vinegar</li>
            <li>1 teaspoon cornflour</li>
          </ul>

          <p className="font-semibold text-[color:var(--foreground)]">For the syrup</p>
          <ul className="list-inside list-disc space-y-1">
            <li>1 cup sugar</li>
            <li>4 cups water</li>
          </ul>

          <p className="font-semibold text-[color:var(--foreground)]">For the milk</p>
          <ul className="list-inside list-disc space-y-1">
            <li>2 cups milk</li>
            <li>3 to 4 tablespoons sugar</li>
            <li>Cardamom powder</li>
            <li>Saffron strands</li>
            <li>Chopped pistachios or almonds</li>
          </ul>

          <h3 className="text-lg font-bold text-[color:var(--foreground)]">Steps</h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>Boil the milk and add lemon juice until it curdles. Strain using a cloth, rinse with cold water, and remove excess moisture.</li>
            <li>Knead the paneer until smooth. Add a small amount of cornflour and knead again. Shape into small flat discs.</li>
            <li>Boil sugar and water, add the discs, and cook covered for about 10 to 12 minutes until they expand and soften.</li>
            <li>In a separate pan, heat milk with sugar, cardamom, and saffron until slightly thickened.</li>
            <li>Gently squeeze the cooked discs and place them in the milk. Chill before serving.</li>
          </ol>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">What I learned</h2>
          <p>
            Making rasmalai changed how I think about learning something that initially feels out of reach. It is not about whether the steps are complicated. It is about how much attention you pay while doing them.
          </p>
          <p>
            The process depends on understanding when to stop as much as when to act. Adding more effort does not necessarily improve the outcome. In some cases, it makes it worse.
          </p>
          <p>
            That was the part I did not expect. Not the recipe itself, but the way it forces you to notice where precision matters and where restraint matters more.
          </p>

          <p>
            Rasmalai went from something I would buy to something I can make and understand. The process is straightforward on paper, but sensitive in practice, and that difference is where most of the learning happens. It is a reminder that getting something right often comes down to paying attention to the details that actually matter.
          </p>
        </div>
      </article>
    </main>
  );
}
