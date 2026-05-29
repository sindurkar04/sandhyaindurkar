import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { MATH_POSTS } from "@/lib/math-applied-posts";

export function mathPostMetadata(slug: string): Metadata {
  const post = MATH_POSTS.find((entry) => entry.slug === slug);
  if (!post) {
    throw new Error(`Unknown math post slug: ${slug}`);
  }

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: post.href,
    image: post.image,
  });
}
