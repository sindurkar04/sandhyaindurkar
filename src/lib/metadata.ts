import type { Metadata } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = image ? `${SITE_URL}${image}` : `${SITE_URL}/math_applied_home.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildSectionMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  const meta = buildPageMetadata({ title, description, path, image });
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "website",
    },
  };
}

export const homeMetadata: Metadata = {
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: `${SITE_URL}/math_applied_home.svg`, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [`${SITE_URL}/math_applied_home.svg`],
  },
};
